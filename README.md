# House of Cards — Prompt Matching Engine

**Part of:** AI Orchestron
**This module owns:** Feature #1 — Prompt Matching Engine
**Owner:** Belim Sameer Khan
**Frontend:** Vishal
**Other backend features (#2 model selection, #3 API keys, #4 output structure):** built by teammates, not covered in this repo

---

## What this does

When a user types a prompt, this service matches it against a curated
library of pre-engineered "best" prompts and returns the closest one,
along with which AI models are known to perform best on that type of
task. Other team members' features plug into this output — most
importantly Feature #2 (model selection), which uses the `best_models`
field returned here to narrow down which of the 50 supported AI models
to choose from.

No cost, no external API calls to run the matching itself — the
embedding model runs locally on CPU.

## How it works

1. `prompt_library.json` — curated prompts, tagged by category and
   the AI models they perform best on. Currently 100 prompts across
   34 categories (coding, writing, analysis, research, marketing,
   legal, healthcare, finance, social media, and more).
2. `build_index.py` — run once (offline) to embed every prompt in the
   library with `BAAI/bge-small-en-v1.5` and cache the vectors to
   `prompt_index.npz`. Re-run this only when the library is edited.
3. `main.py` — FastAPI service. Loads the cached index at startup,
   embeds the user's live prompt on each request, and returns the
   closest match(es) by cosine similarity.

## Setup

```bash
pip install -r requirements.txt
python build_index.py       # builds prompt_index.npz — do this first
uvicorn main:app --reload   # starts the API on http://localhost:8000
```

Interactive test UI: `http://localhost:8000/docs`

## API

**POST** `/api/match-prompt`

Request:
```json
{ "user_prompt": "help me fix a bug in my python code", "top_k": 3 }
```

Response:
```json
{
  "matched": true,
  "confidence": 0.83,
  "matched_prompt": {
    "id": "code_debug_001",
    "text": "You are an expert software engineer...",
    "category": "coding",
    "subcategory": "debugging",
    "best_models": ["gpt-5", "claude-sonnet-5", "deepseek-coder-v3"],
    "confidence": 0.83
  },
  "alternatives": [ ... ],
  "raw_prompt": "help me fix a bug in my python code"
}
```

If confidence is below `CONFIDENCE_THRESHOLD` (0.55, set in `main.py`),
`matched` returns `false` and `matched_prompt` is `null` — meaning
"no strong match found, use the raw prompt as-is." Whoever builds the
frontend handling for this response should handle both cases.

**GET** `/health` — sanity check, returns how many prompts are loaded.

## Handoff notes for teammates

- **Feature #2 (model selection)** should treat `matched_prompt.best_models`
  as its candidate shortlist rather than re-scoring all 50 models from
  scratch on every request.
- **This service currently only runs locally** (`127.0.0.1:8000`) —
  it is not yet deployed anywhere reachable by teammates or the
  frontend. Needs to be deployed (e.g. Render, Railway) before other
  team members can integrate against it over the network.
- Confidence threshold (`0.55`) is tunable in `main.py` if match
  quality needs adjusting as real usage comes in.

## Growing the library

Add entries to `prompt_library.json` following the existing schema,
then re-run `build_index.py`. 100 prompts currently seeded — expand
as needed toward better coverage of real user queries.