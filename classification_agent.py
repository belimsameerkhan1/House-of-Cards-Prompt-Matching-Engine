"""
classification_agent.py
Component 2 of IP-SAKTI Sahayak: Ayurveda Product Classification Agent.

Given a description of a user's product, this classifies it into one
of the 6 regulatory categories that determine which IP/regulatory path
applies. This classification becomes context that the Joker/orchestrator
passes to the downstream IP-SAKTI agents (Patent, Regulatory Compliance,
Prior-Art, etc.), since each category triggers a different regulator,
licensing pathway, and evidentiary burden (see knowledge_base.json for
the underlying legal basis of this split).

Uses a hybrid approach:
  1. Keyword/rule signals for each category (fast, transparent, free)
  2. Falls back to an LLM classification call when signals are weak or
     conflicting (uses the same Gemini-fallback pattern as the rest of
     House of Cards - plug your API key handling in call_llm_classifier)

This keeps classification cheap and explainable for the common cases,
and only spends an LLM call on genuinely ambiguous ones.
"""

import json
import re
from typing import Optional
from dataclasses import dataclass, field

CATEGORIES = [
    "classical_ayurvedic_medicine",
    "proprietary_ayurvedic_medicine",
    "new_non_classical_drug",
    "phytopharmaceutical",
    "ayurveda_aahar_nutraceutical",
    "cosmetic",
]

CATEGORY_DESCRIPTIONS = {
    "classical_ayurvedic_medicine": (
        "Follows a formula described exactly in a recognized classical "
        "Ayurvedic text (e.g. Charaka Samhita, Sushruta Samhita, "
        "Ashtanga Hridaya). Regulated by AYUSH under classical ASU rules."
    ),
    "proprietary_ayurvedic_medicine": (
        "An Ayurvedic medicine based on Ayurvedic principles but not an "
        "exact classical formula - a proprietary variation. Regulated by "
        "AYUSH; requires proof of effectiveness under Rule 158(B)."
    ),
    "new_non_classical_drug": (
        "A genuinely new formulation or use not grounded in classical "
        "Ayurvedic texts or known traditional use, making standard "
        "traditional-knowledge exclusions less likely to apply, but "
        "requiring full novelty/inventive-step scrutiny for any IP claim."
    ),
    "phytopharmaceutical": (
        "A purified, standardized fraction or extract of a plant, "
        "positioned with specific therapeutic claims and scientific "
        "(not just traditional-use) evidence. Regulated by CDSCO as a "
        "new drug under Rule 122E, not by AYUSH."
    ),
    "ayurveda_aahar_nutraceutical": (
        "A food, dietary supplement, or nutraceutical product drawing on "
        "Ayurvedic ingredients/principles but making no drug-level "
        "therapeutic claim. Falls under FSSAI food regulation rather "
        "than AYUSH or CDSCO drug pathways."
    ),
    "cosmetic": (
        "A topical or personal-care product (skin, hair, oral care) with "
        "no internal/therapeutic claim beyond cosmetic effect. Regulated "
        "as a cosmetic under the Drugs and Cosmetics Act, a lighter "
        "regulatory burden than any drug category above."
    ),
}

# Keyword signals - not exhaustive, meant to catch clear-cut cases cheaply.
# Each signal is a (pattern, category, weight) tuple.
SIGNALS = [
    (r"\b(charaka|sushruta|ashtanga hridaya|classical text|as per shastra|shastriya)\b", "classical_ayurvedic_medicine", 3),
    (r"\b(exact formula|traditional formula|ancient formula)\b", "classical_ayurvedic_medicine", 2),

    (r"\b(proprietary ayurvedic|our own formulation|based on ayurvedic principles)\b", "proprietary_ayurvedic_medicine", 3),
    (r"\b(modified traditional|inspired by ayurveda|ayurvedic principles)\b", "proprietary_ayurvedic_medicine", 2),

    (r"\b(novel compound|new molecule|synthesized|never used before|first[- ]of[- ]its[- ]kind)\b", "new_non_classical_drug", 3),

    (r"\b(standardized extract|purified fraction|phytopharmaceutical|bioactive fraction|isolated compound|clinical trial data)\b", "phytopharmaceutical", 3),
    (r"\b(extraction process|solvent extraction|hplc|fingerprint(ing)?)\b", "phytopharmaceutical", 2),

    (r"\b(supplement|nutraceutical|dietary|health drink|functional food|immunity booster|fssai)\b", "ayurveda_aahar_nutraceutical", 3),
    (r"\b(aahar|food product|daily nutrition)\b", "ayurveda_aahar_nutraceutical", 2),

    (r"\b(cream|lotion|shampoo|face wash|skin care|hair oil for cosmetic|soap|cosmetic)\b", "cosmetic", 3),
    (r"\b(topical|external use only|beauty product|personal care)\b", "cosmetic", 2),
]

# Signals that indicate a therapeutic/drug claim is being made - if these
# fire alongside a cosmetic/food description, it's a strong contradiction
# flag worth surfacing (e.g. "face cream that cures eczema" is a red flag:
# claiming a cosmetic cures a disease pushes it toward drug regulation).
DRUG_CLAIM_SIGNALS = re.compile(
    r"\b(cures?|treats?|heals?|therapeutic|reduces symptoms of|prevents disease|clinically proven to treat)\b",
    re.IGNORECASE,
)


@dataclass
class ClassificationResult:
    category: str
    confidence: str  # "high" | "medium" | "low"
    matched_signals: list = field(default_factory=list)
    contradiction_flag: Optional[str] = None
    used_llm_fallback: bool = False
    rationale: str = ""


def score_by_keywords(product_description: str) -> dict:
    text = product_description.lower()
    scores = {c: 0 for c in CATEGORIES}
    matched = {c: [] for c in CATEGORIES}

    for pattern, category, weight in SIGNALS:
        if re.search(pattern, text, re.IGNORECASE):
            scores[category] += weight
            matched[category].append(pattern)

    return scores, matched


def check_contradiction(product_description: str, top_category: str) -> Optional[str]:
    """
    Flags a common real-world problem: a product described as a cosmetic
    or food/nutraceutical but using therapeutic/drug language. This is
    exactly the kind of gap the Verification Agent downstream should
    catch, but flagging it here means the Joker/agents get the signal
    immediately rather than discovering it later.
    """
    if top_category in ("cosmetic", "ayurveda_aahar_nutraceutical"):
        if DRUG_CLAIM_SIGNALS.search(product_description):
            return (
                f"Product was classified as '{top_category}' but the description "
                f"contains therapeutic/drug-claim language (e.g. 'cures', 'treats'). "
                f"Making disease-treatment claims for a cosmetic or food product is "
                f"itself a regulatory risk under Indian law and may require "
                f"reclassification toward a drug pathway, or removal of the claim."
            )
    return None


def classify_by_keywords(product_description: str) -> ClassificationResult:
    scores, matched = score_by_keywords(product_description)
    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    top_category, top_score = ranked[0]
    second_score = ranked[1][1] if len(ranked) > 1 else 0

    if top_score == 0:
        return ClassificationResult(
            category="unclassified",
            confidence="low",
            rationale="No clear keyword signals matched any category. Needs LLM fallback or human input.",
        )

    # Confidence heuristic: how much the top category "wins" by.
    if top_score >= 3 and (top_score - second_score) >= 2:
        confidence = "high"
    elif top_score >= 2:
        confidence = "medium"
    else:
        confidence = "low"

    contradiction = check_contradiction(product_description, top_category)

    return ClassificationResult(
        category=top_category,
        confidence=confidence,
        matched_signals=matched[top_category],
        contradiction_flag=contradiction,
        rationale=(
            f"Matched {len(matched[top_category])} keyword signal(s) for "
            f"'{top_category}' with a score of {top_score} "
            f"(next-best category scored {second_score})."
        ),
    )


LLM_CLASSIFICATION_PROMPT = """You are an Ayurveda product regulatory classifier for the Indian market.

Classify the following product description into EXACTLY ONE of these categories:
{categories}

Category definitions:
{definitions}

Product description:
\"\"\"{product_description}\"\"\"

Respond with ONLY valid JSON in this exact format, nothing else:
{{
  "category": "<one of the category keys above>",
  "confidence": "high" | "medium" | "low",
  "rationale": "<one or two sentences explaining the classification>",
  "contradiction_flag": "<null, or a short note if the description makes claims inconsistent with the assigned category>"
}}
"""


def build_llm_prompt(product_description: str) -> str:
    """
    Builds the fallback prompt for when keyword matching is inconclusive.
    Call this text with whichever model House of Cards' API-key/fallback
    layer (Feature #3) resolves to - Gemini by default per the project's
    fallback design. This function only builds the prompt; wiring it to
    an actual API call is left to the teammate owning Feature #3, since
    that's where API key resolution and the Gemini fallback live.
    """
    return LLM_CLASSIFICATION_PROMPT.format(
        categories=", ".join(CATEGORIES),
        definitions="\n".join(f"- {k}: {v}" for k, v in CATEGORY_DESCRIPTIONS.items()),
        product_description=product_description,
    )


def classify_product(product_description: str, llm_call_fn=None) -> ClassificationResult:
    """
    Main entry point. Tries cheap keyword classification first.
    If confidence is low/unclassified and an llm_call_fn is provided,
    falls back to an LLM call (llm_call_fn should accept a prompt string
    and return a JSON string matching LLM_CLASSIFICATION_PROMPT's format).
    """
    result = classify_by_keywords(product_description)

    if result.confidence in ("low",) and llm_call_fn is not None:
        prompt = build_llm_prompt(product_description)
        raw = llm_call_fn(prompt)
        try:
            parsed = json.loads(raw)
            return ClassificationResult(
                category=parsed.get("category", "unclassified"),
                confidence=parsed.get("confidence", "low"),
                matched_signals=[],
                contradiction_flag=parsed.get("contradiction_flag"),
                used_llm_fallback=True,
                rationale=parsed.get("rationale", ""),
            )
        except (json.JSONDecodeError, AttributeError):
            # LLM call failed or returned malformed JSON - surface the
            # low-confidence keyword result rather than crashing.
            result.rationale += " (LLM fallback also failed to parse; returning keyword-based best guess.)"
            return result

    return result


if __name__ == "__main__":
    # Quick manual smoke test
    examples = [
        "A churna prepared exactly as described in Charaka Samhita for digestion.",
        "Our proprietary Ayurvedic tablet inspired by classical principles for joint pain relief.",
        "A standardized curcumin extract with 95% purity, backed by clinical trial data, for anti-inflammatory use.",
        "A daily immunity booster health drink with ashwagandha and tulsi, FSSAI registered.",
        "An herbal face wash for glowing skin.",
        "A face cream that cures eczema and treats skin infections.",
    ]
    for ex in examples:
        r = classify_by_keywords(ex)
        print(f"\nInput: {ex}")
        print(f"  -> category={r.category}, confidence={r.confidence}")
        if r.contradiction_flag:
            print(f"  -> CONTRADICTION FLAG: {r.contradiction_flag}")
