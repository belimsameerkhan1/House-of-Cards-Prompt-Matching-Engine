"""
ip_sakti_router.py
IP-SAKTI Sahayak extension for House of Cards.

Adds two new endpoints on top of the existing prompt-matching engine:
  POST /api/query-knowledge   - Component 1: domain knowledge base (RAG)
  POST /api/classify-product  - Component 2: Ayurveda product classifier

To wire this into the main House of Cards service, add these two lines
to main.py:

    from ip_sakti_router import router as ip_sakti_router
    app.include_router(ip_sakti_router)

Files this expects to find alongside it:
    knowledge_base.json   - the curated knowledge entries
    kb_index.npz          - built by running: python build_kb_index.py
"""

import json
from typing import Optional, List

import numpy as np
from fastapi import APIRouter
from pydantic import BaseModel
from fastembed import TextEmbedding

from classification_agent import classify_product, CATEGORIES

MODEL_NAME = "BAAI/bge-small-en-v1.5"
KB_PATH = "knowledge_base.json"
KB_INDEX_PATH = "kb_index.npz"
KB_CONFIDENCE_THRESHOLD = 0.45  # knowledge retrieval can be a bit looser than prompt matching

router = APIRouter()

# Reuse one embedding model instance for both KB retrieval and (if wired)
# any future query embedding needs - avoids loading the model twice.
_kb_model = TextEmbedding(model_name=MODEL_NAME)

print("[ip-sakti] Loading knowledge base + index...")
with open(KB_PATH, "r") as f:
    _kb_entries = {e["id"]: e for e in json.load(f)}

_kb_index_data = np.load(KB_INDEX_PATH, allow_pickle=True)
_kb_ids = _kb_index_data["ids"]
_kb_embeddings = _kb_index_data["embeddings"]
print(f"[ip-sakti] Loaded {len(_kb_ids)} knowledge base entries.")


class KnowledgeQueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3
    domain_filter: Optional[str] = None  # e.g. "patent_law", "biodiversity_abs"


class KnowledgeResult(BaseModel):
    id: str
    domain: str
    topic: str
    text: str
    source_name: str
    source_url: str
    jurisdiction: str
    confidence: float


class KnowledgeQueryResponse(BaseModel):
    matched: bool
    results: List[KnowledgeResult]
    query: str
    note: Optional[str] = None


def _embed_query(text: str) -> np.ndarray:
    vec = np.array(list(_kb_model.embed([text]))[0], dtype=np.float32)
    return vec / np.linalg.norm(vec)


@router.post("/api/query-knowledge", response_model=KnowledgeQueryResponse)
def query_knowledge(req: KnowledgeQueryRequest):
    """
    Component 1: IP-SAKTI Domain Knowledge Base.
    Retrieves the most relevant regulatory/legal knowledge entries for
    a query, each with its source citation - so downstream agents never
    make an unsupported legal claim (see Citation & Evidence Layer in
    the architecture doc).
    """
    query_vec = _embed_query(req.query)
    scores = _kb_embeddings @ query_vec

    # Apply domain filter if requested, by masking out non-matching entries.
    if req.domain_filter:
        mask = np.array([
            _kb_entries[str(kid)]["domain"] == req.domain_filter
            for kid in _kb_ids
        ])
        scores = np.where(mask, scores, -1.0)

    top_idx = np.argsort(-scores)[: req.top_k]
    results = []
    for idx in top_idx:
        score = float(scores[idx])
        if score < 0:
            continue  # filtered out by domain_filter
        entry = _kb_entries[str(_kb_ids[idx])]
        results.append(
            KnowledgeResult(
                id=entry["id"],
                domain=entry["domain"],
                topic=entry["topic"],
                text=entry["text"],
                source_name=entry["source_name"],
                source_url=entry["source_url"],
                jurisdiction=entry["jurisdiction"],
                confidence=round(score, 4),
            )
        )

    matched = bool(results and results[0].confidence >= KB_CONFIDENCE_THRESHOLD)
    note = None
    if not matched:
        note = (
            "No knowledge base entry met the confidence threshold. "
            "Treat results as low-relevance context only, or escalate "
            "to human review rather than asserting a legal claim."
        )

    return KnowledgeQueryResponse(
        matched=matched,
        results=results,
        query=req.query,
        note=note,
    )


class ClassifyProductRequest(BaseModel):
    product_description: str


class ClassifyProductResponse(BaseModel):
    category: str
    confidence: str
    matched_signals: List[str]
    contradiction_flag: Optional[str]
    used_llm_fallback: bool
    rationale: str
    available_categories: List[str]


@router.post("/api/classify-product", response_model=ClassifyProductResponse)
def classify_product_endpoint(req: ClassifyProductRequest):
    """
    Component 2: Ayurveda Product Classification Agent.
    Classifies a product description into one of 6 regulatory categories.
    This result becomes context the Joker passes to downstream IP-SAKTI
    agents (Patent, Regulatory Compliance, Prior-Art, etc.) - see
    architecture doc. LLM fallback is not wired here since it depends on
    Feature #3's API key / Gemini fallback resolution; low-confidence
    cases currently return the best keyword-based guess with a note.
    """
    result = classify_product(req.product_description, llm_call_fn=None)
    return ClassifyProductResponse(
        category=result.category,
        confidence=result.confidence,
        matched_signals=result.matched_signals,
        contradiction_flag=result.contradiction_flag,
        used_llm_fallback=result.used_llm_fallback,
        rationale=result.rationale,
        available_categories=CATEGORIES,
    )
