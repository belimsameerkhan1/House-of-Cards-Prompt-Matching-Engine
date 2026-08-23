"""
build_index.py
Run this once (and again whenever prompt_library.json changes) to
precompute embeddings for every prompt in the library and save them
to disk. The FastAPI service loads this cached index at startup so
it never re-embeds the library at request time.
"""

import json
import numpy as np
from sentence_transformers import SentenceTransformer

MODEL_NAME = "BAAI/bge-small-en-v1.5"
LIBRARY_PATH = "prompt_library.json"
INDEX_PATH = "prompt_index.npz"


def build():
    print(f"Loading model: {MODEL_NAME} ...")
    model = SentenceTransformer(MODEL_NAME)

    with open(LIBRARY_PATH, "r") as f:
        library = json.load(f)

    texts = [p["text"] for p in library]
    ids = [p["id"] for p in library]

    print(f"Embedding {len(texts)} prompts ...")
    embeddings = model.encode(texts, normalize_embeddings=True, show_progress_bar=True)

    np.savez(
        INDEX_PATH,
        ids=np.array(ids),
        embeddings=embeddings.astype(np.float32),
    )
    print(f"Saved index to {INDEX_PATH} ({embeddings.shape[0]} vectors, dim={embeddings.shape[1]})")


if __name__ == "__main__":
    build()