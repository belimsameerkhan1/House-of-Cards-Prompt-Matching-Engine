# IP-SAKTI Sahayak — House of Cards Extension

This extension adds **Component 1 (Domain Knowledge Base)** and **Component 2 (Ayurveda Product Classification Agent)** to the existing **House of Cards Prompt-Matching Engine** for **SIH Problem Statement #29 — IP-SAKTI Sahayak**.

The extension is integrated directly into the existing FastAPI application and provides cited legal/regulatory retrieval and Ayurveda product classification capabilities.

---

## Components

### Component 1 — IP-SAKTI Domain Knowledge Base

The knowledge base provides semantic retrieval over curated Indian IP, Ayurveda, biodiversity, food, advertising, and international regulatory information.

Current knowledge base:

- **25 curated entries**
- **10 legal/regulatory domains**
- Source name and source URL attached to each entry
- Semantic retrieval using the same FastEmbed approach as the existing prompt engine

### Component 2 — Ayurveda Product Classification Agent

The classification agent classifies an Ayurveda-related product description into one of six regulatory categories using rule-based keyword signals.

Supported categories:

1. `classical_ayurvedic_medicine`
2. `proprietary_ayurvedic_medicine`
3. `new_non_classical_drug`
4. `phytopharmaceutical`
5. `ayurveda_aahar_nutraceutical`
6. `cosmetic`

The classifier also detects potential contradictions between the assigned category and therapeutic claims.

For example, a product described as a cosmetic that claims to **cure eczema** can be flagged as a regulatory risk.

---

# Files

| File | Purpose |
|---|---|
| `knowledge_base.json` | 25 curated and cited IP-SAKTI knowledge entries |
| `build_kb_index.py` | Builds the semantic index for the knowledge base |
| `classification_agent.py` | Component 2 — Ayurveda product classification |
| `ip_sakti_router.py` | FastAPI router exposing the two IP-SAKTI components |
| `README_ip_sakti.md` | Documentation for this extension |
| `kb_index.npz` | Generated knowledge-base embedding index; ignored by Git |

The extension is integrated with the existing:

- `main.py`
- `build_index.py`
- `prompt_library.json`
- `requirements.txt`
- FastAPI application

---

# Knowledge Base Coverage

The current knowledge base contains 25 curated entries covering 10 domains:

1. **Patent Law**
   - Section 3(p) and traditional-knowledge exclusions
   - 2024 Patent Rules
   - Section 10(4) biological-material disclosure
   - Source and geographical-origin disclosure

2. **Product Classification**
   - CDSCO / AYUSH classification
   - Classical and proprietary Ayurvedic medicines
   - New/non-classical drugs
   - Phytopharmaceuticals
   - Ayurveda-Aahara / nutraceuticals
   - Cosmetics

3. **Biological Diversity / ABS**
   - Biological Diversity Act
   - National Biodiversity Authority approval
   - Access and Benefit Sharing
   - 2023/2024 regulatory updates

4. **Traditional Knowledge**
   - Traditional Knowledge Digital Library (TKDL)
   - Traditional-knowledge prior art
   - IP protection considerations

5. **Trademark & Geographical Indications**
   - Indian trademark protection
   - Geographical Indications

6. **Copyright & Designs**
   - Copyright principles
   - Idea-expression distinction
   - Designs Act considerations

7. **Plant Variety Rights**
   - Protection of Plant Varieties and Farmers' Rights Act
   - Farmers' varieties
   - Traditional medicinal plants

8. **Food Regulatory**
   - FSSAI Ayurveda-Aahara regulations
   - Ayurveda-Aahara classification and requirements

9. **Advertising Regulatory**
   - Drugs and Magic Remedies (Objectionable Advertisements) Act
   - Restrictions on disease-treatment claims

10. **International Regulatory / IP**
    - WIPO Traditional Knowledge / GRATK Treaty
    - International filing considerations
    - Biological-material disclosure and international IP considerations

> **Note:** The knowledge base is an MVP corpus intended to demonstrate the architecture and retrieval workflow. It is not a complete legal database. Deeper case law, pharmacopoeial standards, and additional international treaty/procedural material should be added as the project evolves.

---

# Integration

The IP-SAKTI extension is already integrated into the existing House of Cards FastAPI application.

The router is registered in `main.py` using:

```python
from ip_sakti_router import router as ip_sakti_router
app.include_router(ip_sakti_router)
