"""
build_index.py
Run this once (and again whenever prompt_library.json changes) to
precompute embeddings for every prompt in the library and save them
to disk. The FastAPI service loads this cached index at startup so
it never re-embeds the library at request time.
 
Uses fastembed (ONNX runtime) instead of sentence-transformers/torch
to keep memory usage low enough for free-tier hosting (e.g. Render's
512MB free instance) — torch + transformers alone can exceed that.
"""
 
import json
import numpy as np
from fastembed import TextEmbedding
 
MODEL_NAME = "BAAI/bge-small-en-v1.5"
LIBRARY_PATH = "prompt_library.json"
INDEX_PATH = "prompt_index.npz"
 
 
def build():
    print(f"Loading model: {MODEL_NAME} ...")
    model = TextEmbedding(model_name=MODEL_NAME)
 
    with open(LIBRARY_PATH, "r") as f:
        library = json.load(f)
 
    texts = [p["text"] for p in library]
    ids = [p["id"] for p in library]
 
    print(f"Embedding {len(texts)} prompts ...")
    embeddings = np.array(list(model.embed(texts)), dtype=np.float32)
 
    # fastembed's bge models already return normalized vectors, but
    # normalize explicitly to be safe so cosine similarity == dot product.
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    embeddings = embeddings / norms
 
    np.savez(
        INDEX_PATH,
        ids=np.array(ids),
        embeddings=embeddings,
    )
    print(f"Saved index to {INDEX_PATH} ({embeddings.shape[0]} vectors, dim={embeddings.shape[1]})")
 
 
if __name__ == "__main__":
    build()