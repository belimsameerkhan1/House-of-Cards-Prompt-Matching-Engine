IP-SAKTI Sahayak — Extension for House of Cards

Adds Component 1 (domain knowledge base) and Component 2 (Ayurveda product classification agent) on top of the existing House of Cards prompt-matching engine, for PS #29 IP-SAKTI Sahayak.

Files in this extension
File	What it is
knowledge_base.json	25 curated, cited entries across 10 legal domains: patent law (Section 3(p)/TK exclusions, 2024 Patent Rules, Section 10(4) biological-material disclosure), CDSCO/AYUSH product classification, Biological Diversity Act & 2023/2024 ABS updates, TKDL, trademark/GI, copyright & designs, plant-variety rights (PPVFR Act), FSSAI Ayurveda Aahara regulations, the Drugs and Magic Remedies Act, and the WIPO GRATK Treaty (2024)
build_kb_index.py	Embeds the knowledge base (same fastembed approach as the prompt engine) — run once, and again after editing the KB
classification_agent.py	Component 2 — classifies a product description into one of 6 regulatory categories, using fast keyword rules with an LLM-fallback hook for ambiguous cases
ip_sakti_router.py	FastAPI router exposing both components as new endpoints, designed to plug straight into the existing main.py
How to integrate into House of Cards
Copy all 4 files above into your existing prompt_engine project folder (same level as main.py).
In main.py, add these two lines near the top (after your existing imports) and after the app = FastAPI(...) line:
python
   from ip_sakti_router import router as ip_sakti_router
   app.include_router(ip_sakti_router)
Build the new index (only needed once, and again if you edit knowledge_base.json):
bash
   python build_kb_index.py
Run as usual:
bash
   uvicorn main:app --reload
Check /docs — you should now see 4 endpoints total: the original /api/match-prompt and /health, plus the two new ones below.
New endpoints
POST /api/query-knowledge — Component 1
json
{ "query": "do I need approval before patenting a plant-based product", "top_k": 3 }

Returns the most relevant knowledge base entries, each with a real source citation (source_name, source_url) — never an unsupported claim. Optional domain_filter narrows to one domain: patent_law, product_classification, biodiversity_abs, traditional_knowledge, trademark_gi, copyright_designs, plant_variety, food_regulatory, advertising_regulatory, or international_regulatory.

POST /api/classify-product — Component 2
json
{ "product_description": "A face cream that cures eczema and treats skin infections" }

Returns the classified category (one of 6: classical_ayurvedic_medicine, proprietary_ayurvedic_medicine, new_non_classical_drug, phytopharmaceutical, ayurveda_aahar_nutraceutical, cosmetic), a confidence level, and — importantly — a contradiction_flag when the description makes a therapeutic claim inconsistent with its assigned category (e.g. a "cosmetic" that claims to cure disease). This flag exists because that exact mismatch is a real regulatory risk under Indian law, not just a classification quirk.

How this fits the bigger IP-SAKTI architecture

Per the full architecture, these two components sit right after prompt matching and feed the Joker's downstream agent selection:

User Problem → Best Prompt Match → Joker
                                      ↓
                    ┌─────────────────┼─────────────────┐
                    ↓                 ↓                 ↓
            Classification      Knowledge Base      Prior-Art
               Agent (#2)          (RAG) (#1)          Agent

classify-product's output (the category) is exactly the context the Joker needs to decide which specialized agent(s) — Patent, Regulatory Compliance, ABS, International — to route to next. query-knowledge's cited results are what those downstream agents ground their answers in, feeding the Verification and Citation layers described in the full architecture.

What's not built yet (by design — out of this scope)
The LLM fallback in classification_agent.py has a ready-made hook (llm_call_fn) but isn't wired to an actual API call — that depends on Feature #3's API key/Gemini fallback resolution, which is a teammate's responsibility.
The Joker/orchestrator, the other specialized agents (Patent, Prior-Art, Regulatory Compliance, ABS, International), the Verification Agent, jurisdiction detection, and the multilingual layer are all separate components per the architecture doc and are not part of this handoff.
Knowledge base currently has 25 entries across 10 domains — solid coverage of the core legal ground named in the official PS #29 brief (patents, TK, ABS/biodiversity, TKDL, trademark/GI, copyright, designs, plant-variety, FSSAI Ayurveda Aahara, Magic Remedies Act, and the 2024 WIPO GRATK Treaty), but still a fraction of a real production corpus. Case law, pharmacopoeial standards, and deeper international coverage (TRIPS, CBD/Nagoya Protocol text itself, PCT/Madrid/Hague procedural detail) are still thin and should grow substantially. Same pattern as the prompt library: add entries to the JSON, re-run the build script.
A note on this build environment

Like the original prompt engine, build_kb_index.py couldn't be run live in this sandbox (no network access to huggingface.co here), but the code was verified to compile with no syntax errors, and classification_agent.py was tested directly with real example products — all 6 categories classified correctly, including the eczema-cream contradiction case. It will run normally wherever the original prompt engine already runs (your machine, and Render).