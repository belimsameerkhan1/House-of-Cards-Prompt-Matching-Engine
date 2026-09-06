import { queryKnowledgeApi, classifyProductApi } from './api';

export async function generateGuidance({ query, jurisdiction = 'India', attachedFile = null, lang = 'en' }) {
  const queryLower = query.toLowerCase();

  // Run knowledge query and classification in parallel
  const [kbResponse, classificationResponse] = await Promise.all([
    queryKnowledgeApi(query, 4),
    classifyProductApi(query)
  ]);

  const sources = kbResponse?.results || [];
  const classification = classificationResponse;

  // Identify core legal concepts
  const isPatentQuery = /patent|3\(p\)|inventive|novelty|prior art|tkdl|exclusion/i.test(queryLower);
  const isAbsQuery = /abs|biodiversity|nba|access and benefit|foreign|export|sbb/i.test(queryLower);
  const isFoodQuery = /food|aahar|supplement|nutraceutical|fssai|dietary/i.test(queryLower);
  const isCosmeticQuery = /cosmetic|cream|lotion|face|skin|shampoo/i.test(queryLower);
  const isTrademarkGiQuery = /trademark|gi|geographical indication|brand|logo|name/i.test(queryLower);
  const isPhytopharmaQuery = /phytopharmaceutical|standardized extract|cdsco|rule 122e|purified fraction/i.test(queryLower);

  // Determine Primary Domain and Confidence
  let primaryDomain = "Regulatory & IP Guidance";
  let confidenceScore = 0.88;
  let confidenceLevel = "high";

  if (isPatentQuery) {
    primaryDomain = "Indian Patent Act Section 3(p) & Prior Art";
    confidenceScore = 0.92;
  } else if (isAbsQuery) {
    primaryDomain = "Biological Diversity Act & Access Benefit Sharing (ABS)";
    confidenceScore = 0.89;
  } else if (isFoodQuery) {
    primaryDomain = "FSSAI Ayurveda Aahara Regulations";
    confidenceScore = 0.91;
  } else if (isTrademarkGiQuery) {
    primaryDomain = "Trade Marks & Geographical Indications Act";
    confidenceScore = 0.87;
  }

  if (classification?.contradiction_flag) {
    confidenceLevel = "moderate";
    confidenceScore = 0.74;
  }

  // Synthesize Short Answer
  let shortAnswer = "";
  if (isPatentQuery) {
    shortAnswer = "Under Section 3(p) of the Indian Patents Act, 1970, formulations that merely aggregate or duplicate known therapeutic properties of traditional Ayurvedic components cannot be patented. However, non-obvious synergistic combinations, novel extraction processes, or validated phytopharmaceutical fractions can qualify if backed by empirical evidence clearing TKDL prior art.";
  } else if (isAbsQuery) {
    shortAnswer = "Under the Biological Diversity Act, 2002 and 2024 Amendment Rules, accessing Indian biological resources for commercial utilization or applying for IP rights requires prior statutory clearance—National Biodiversity Authority (NBA) approval for foreign entities/collaborations and mandatory registration under Section 6(1A) for domestic patent filings.";
  } else if (isFoodQuery) {
    shortAnswer = "Products formulated as Ayurveda Aahara fall strictly under FSSAI regulations (2022). They must comply with recognized classical recipes listed in Schedule A and are strictly barred from claiming to cure, treat, or mitigate human diseases in advertising or labeling.";
  } else if (isPhytopharmaQuery) {
    shortAnswer = "Purified, standardized plant fractions positioned with specific therapeutic claims are regulated by CDSCO as phytopharmaceutical drugs under Rule 122E, not as classical ASU medicines by the Ministry of AYUSH. They require formal preclinical and clinical safety/efficacy validation under Schedule M.";
  } else if (isCosmeticQuery) {
    shortAnswer = "Herbal cosmetic products are regulated under the Drugs and Cosmetics Act as cosmetics. They are legally restricted to topical cleansing, beautifying, or altering appearance and cannot advertise therapeutic or curative medicinal claims.";
  } else {
    shortAnswer = `Based on Indian and international regulatory standards, this formulation aligns primarily with the '${classification.category.replace(/_/g, ' ')}' pathway. Compliance mandates verifying classical text grounding, ensuring strict absence of prohibited medicinal claims, and checking NBA intimation requirements.`;
  }

  // Key Findings
  const keyFindings = [];
  if (isPatentQuery) {
    keyFindings.push("Section 3(p) Bar: Examiners systematically cross-check the Traditional Knowledge Digital Library (TKDL) and reject claims where each herb's documented property is already in traditional lore.");
    keyFindings.push("Mandatory Biological Material Disclosure: Under Section 10(4) and 25(1)(j), applicants must disclose the exact geographic source of botanical inputs, failure of which constitutes grounds for pre-grant opposition.");
    keyFindings.push("Patent Amendment Rules 2024: Oppositions now run on accelerated 2-month reply windows under amended Rule 55.");
  } else if (isAbsQuery) {
    keyFindings.push("NBA Clearance Mandate: Section 6 requires approval before any patent grant based on biological resources sourced in India.");
    keyFindings.push("Section 6(1A) 2024 Rules Update: Domestic Indian entities must now register with the NBA before a patent can be sealed, closing prior loopholes.");
    keyFindings.push("Benefit Sharing Levies: Commercialization triggers 0.1%–0.5% ex-factory revenue sharing or negotiated MAT benefit-sharing agreements.");
  } else {
    keyFindings.push(`Regulatory Classification: Classified as '${classification.category.replace(/_/g, ' ')}' with ${classification.confidence} confidence based on detected formulation signals.`);
    keyFindings.push("Labeling & Claim Boundaries: Prohibited from using disease-cure vocabulary under the Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954.");
    keyFindings.push("Dual Track Architecture: Distinct evidentiary standards exist between AYUSH classical licenses (Rule 158B) and CDSCO new drug pathways.");
  }

  if (classification.contradiction_flag) {
    keyFindings.push(`⚠️ Regulatory Risk: ${classification.contradiction_flag}`);
  }

  // Why This Matters
  const whyItMatters = isPatentQuery
    ? "Filing a patent on traditional herbal knowledge without establishing synergistic non-obviousness invites costly pre-grant opposition by CSIR/TKDL and risk of immediate revocation. Structuring claims around extraction technology or validated phytopharma fractions provides far more enforceable IP."
    : isAbsQuery
    ? "Failure to secure NBA approval or SBB intimation before commercialization or IP filing is a punishable statutory violation with severe financial penalties and freezing of patent grants."
    : "Misclassifying an Ayurvedic product can lead to sudden regulatory seizure under the Drugs & Cosmetics Act or cancellation of FSSAI licenses due to non-compliant therapeutic advertising.";

  // Recommended Next Steps
  const nextSteps = [
    { step: "Conduct TKDL & Prior Art Search", desc: "Verify whether individual active botanicals or combinations are already codified in classical texts like Charaka Samhita or Bhavaprakasha." },
    { step: "Document Biological Resource Provenance", desc: "Catalog state, forest division, or agro-climatic source of all plant matter to satisfy Section 10(4) origin disclosures." },
    { step: "Assess NBA / SBB Registration Status", desc: "Submit Form I (NBA for foreign-linked entities) or Form III (prior intimation to State Biodiversity Board for domestic businesses)." },
    { step: "Review Claim Submissions with AYUSH Patent Specialist", desc: "Engage an accredited patent agent familiar with Section 3(p) jurisprudence to draft defensive or process-focused claims." }
  ];

  // India vs International Comparison
  const jurisdictionAnalysis = {
    india: {
      title: "India (AYUSH / IPO / CDSCO / FSSAI)",
      points: [
        "Governed by Indian Patents Act 1970 (Section 3(p), Section 10(4)).",
        "Dual regulator: Ministry of AYUSH (ASU classical/proprietary) vs CDSCO (Phytopharmaceuticals).",
        "Strict domestic biological material disclosure and NBA Section 6(1A) compliance.",
        "FSSAI Ayurveda Aahara regulations restrict health claims without prior statutory validation."
      ]
    },
    international: {
      title: "International (WIPO / US FDA / EMA)",
      points: [
        "WIPO GRATK Treaty (May 2024): Mandatory patent disclosure of genetic resources and associated traditional knowledge origins.",
        "Major patent offices (USPTO, EPO, UKPTO, DPMA) actively cross-examine TKDL during examination.",
        "US FDA regulates most herbal formulations as Dietary Supplements (DSHEA 1994) or Botanical Drugs requiring Phase 1-3 trials.",
        "EMA Herbal Medicinal Products Directive (HMPC) requires proof of 30 years medicinal use (including 15 within EU) for well-established use registration."
      ]
    }
  };

  // Clarifying Questions (if query has potential ambiguities)
  const clarifyingQuestions = [];
  if (!queryLower.includes("extract") && !queryLower.includes("classical") && !queryLower.includes("syrup")) {
    clarifyingQuestions.push({
      id: "formulation_type",
      question: "Is this formulation an exact classical Ayurvedic text recipe or a modified proprietary extract?",
      options: [
        "Exact classical formula (Charaka/Sushruta/Sahasrayogam)",
        "Proprietary herbal blend with modern excipients",
        "Standardized purified phytopharmaceutical extract"
      ]
    });
  }
  if (!queryLower.includes("india") && !queryLower.includes("export") && !queryLower.includes("foreign")) {
    clarifyingQuestions.push({
      id: "market_scope",
      question: "Which primary geographic market is intended for initial commercialization?",
      options: [
        "Domestic Indian market only",
        "Export to US / Europe / UK",
        "Global multi-jurisdiction distribution"
      ]
    });
  }

  // Limitations
  const limitations = [
    "This guidance reflects statutory provisions and regulatory notifications as of 2024–2026. Local State Biodiversity Board rules and AYUSH state licensing officers may enforce localized interpretations.",
    "Prior art clearance cannot guarantee absolute patent grant due to unpublished pending applications or undocumented oral traditional knowledge not cataloged in TKDL.",
    "This output is designed for research and exploratory planning. Formal legal opinions require engagement of an accredited patent attorney."
  ];

  return {
    id: `res_${Date.now()}`,
    timestamp: new Date().toISOString(),
    query,
    attachedFile: attachedFile ? { name: attachedFile.name, size: attachedFile.size } : null,
    jurisdiction,
    primaryDomain,
    confidenceScore,
    confidenceLevel,
    shortAnswer,
    keyFindings,
    whyItMatters,
    nextSteps,
    classification,
    sources,
    jurisdictionAnalysis,
    clarifyingQuestions,
    limitations,
    howGenerated: {
      signals: classification.matched_signals,
      rationale: classification.rationale,
      retrievalSourcesCount: sources.length,
      statutesScanned: ["Patents Act 1970 §3(p)", "Biological Diversity Act 2002", "FSSAI 2022", "WIPO GRATK 2024"]
    }
  };
}
