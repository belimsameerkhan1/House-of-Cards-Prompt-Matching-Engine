"""
main.py
Prompt-matching engine for AI Orchestron (House of Cards).
 
Given a user-typed prompt, finds the closest pre-engineered prompt(s)
from the curated library using sentence embeddings + cosine similarity.
 
Uses fastembed (ONNX runtime) instead of sentence-transformers/torch
to keep memory usage low enough for free-tier hosting.
 
Run:
    python build_index.py      # once, to build the vector index
    uvicorn main:app --reload  # start the API
"""
 
import json
from typing import Optional
 
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastembed import TextEmbedding
 
MODEL_NAME = "BAAI/bge-small-en-v1.5"
LIBRARY_PATH = "prompt_library.json"
INDEX_PATH = "prompt_index.npz"
CONFIDENCE_THRESHOLD = 0.55  # below this, we say "no strong match"
 
app = FastAPI(title="House of Cards - Prompt Matching Engine")

from ip_sakti_router import router as ip_sakti_router
app.include_router(ip_sakti_router)
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
print("Loading embedding model...")
model = TextEmbedding(model_name=MODEL_NAME)
 
print("Loading prompt library + index...")
with open(LIBRARY_PATH, "r") as f:
    library = {p["id"]: p for p in json.load(f)}
 
index_data = np.load(INDEX_PATH, allow_pickle=True)
prompt_ids = index_data["ids"]
prompt_embeddings = index_data["embeddings"]  # already normalized
print(f"Loaded {len(prompt_ids)} prompts into memory.")
 
 
class MatchRequest(BaseModel):
    user_prompt: str
    top_k: Optional[int] = 3
 
 
class MatchedPrompt(BaseModel):
    id: str
    text: str
    category: str
    subcategory: str
    best_models: list[str]
    confidence: float
 
 
class MatchResponse(BaseModel):
    matched: bool
    confidence: float
    matched_prompt: Optional[MatchedPrompt]
    alternatives: list[MatchedPrompt]
    raw_prompt: str
 
 
def embed_query(text: str) -> np.ndarray:
    vec = np.array(list(model.embed([text]))[0], dtype=np.float32)
    return vec / np.linalg.norm(vec)
 
 
def cosine_search(query_vec: np.ndarray, top_k: int):
    scores = prompt_embeddings @ query_vec
    top_idx = np.argsort(-scores)[:top_k]
    return [(int(i), float(scores[i])) for i in top_idx]
 
 
@app.post("/api/match-prompt", response_model=MatchResponse)
def match_prompt(req: MatchRequest):
    query_vec = embed_query(req.user_prompt)
    results = cosine_search(query_vec, req.top_k)
 
    matches = []
    for idx, score in results:
        pid = str(prompt_ids[idx])
        p = library[pid]
        matches.append(
            MatchedPrompt(
                id=p["id"],
                text=p["text"],
                category=p["category"],
                subcategory=p["subcategory"],
                best_models=p["best_models"],
                confidence=round(score, 4),
            )
        )
 
    top = matches[0] if matches else None
    matched = bool(top and top.confidence >= CONFIDENCE_THRESHOLD)
 
    return MatchResponse(
        matched=matched,
        confidence=top.confidence if top else 0.0,
        matched_prompt=top if matched else None,
        alternatives=matches[1:] if matched else matches,
        raw_prompt=req.user_prompt,
    )
 
 
@app.get("/health")
def health():
    return {"status": "ok", "prompts_loaded": len(prompt_ids)}