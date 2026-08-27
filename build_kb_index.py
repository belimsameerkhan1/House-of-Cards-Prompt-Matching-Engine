"""
build_kb_index.py
Precomputes embeddings for the IP-SAKTI knowledge base, same pattern
as House of Cards' build_index.py for the prompt library. Run once,
and again whenever knowledge_base.json is edited.

Uses fastembed (not sentence-transformers/torch) to stay consistent
with the memory-optimized approach already proven on Render's free tier.
"""

import json
import numpy as np
from fastembed import TextEmbedding

MODEL_NAME = "BAAI/bge-small-en-v1.5"
KB_PATH = "knowledge_base.json"
INDEX_PATH = "kb_index.npz"


def build():
    print(f"Loading model: {MODEL_NAME} ...")
    model = TextEmbedding(model_name=MODEL_NAME)

    with open(KB_PATH, "r") as f:
        kb = json.load(f)

    # Embed topic + text together so retrieval catches both phrasing styles.
    texts = [f"{e['topic']}. {e['text']}" for e in kb]
    ids = [e["id"] for e in kb]

    print(f"Embedding {len(texts)} knowledge base entries ...")
    embeddings = np.array(list(model.embed(texts)), dtype=np.float32)

    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    embeddings = embeddings / norms

    np.savez(INDEX_PATH, ids=np.array(ids), embeddings=embeddings)
    print(f"Saved index to {INDEX_PATH} ({embeddings.shape[0]} vectors, dim={embeddings.shape[1]})")


if __name__ == "__main__":
    build()
