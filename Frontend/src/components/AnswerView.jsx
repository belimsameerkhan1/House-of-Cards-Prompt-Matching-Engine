import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  Share2, 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle, 
  Building2, 
  Scale, 
  Globe2, 
  FileText,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';
import EvidencePanel from './EvidencePanel';
import ClarifyingQuestions from './ClarifyingQuestions';
import { translations } from '../utils/translations';

export default function AnswerView({ 
  result, 
  onNewSearch, 
  onSaveGuidance, 
  isSaved = false, 
  onEscalateFacilitator,
  onRefineQuery,
  currentLang = 'en'
}) {
  const t = translations[currentLang] || translations.en;
  const [showHowGenerated, setShowHowGenerated] = useState(false);
  const [activeJurisdictionTab, setActiveJurisdictionTab] = useState('both'); // 'india', 'intl', 'both'
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    const textToCopy = `IP-SAKTI Sahayak Guidance:
Query: ${result.query}

SHORT ANSWER:
${result.shortAnswer}

KEY FINDINGS:
${result.keyFindings.map(k => `• ${k}`).join('\n')}

WHY THIS MATTERS:
${result.whyItMatters}

RECOMMENDED NEXT STEPS:
${result.nextSteps.map(s => `• ${s.step}: ${s.desc}`).join('\n')}

Information, not legal advice.`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-borderLight">
        <button
          type="button"
          onClick={onNewSearch}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-700 hover:text-forest-900 transition-colors py-1 px-2 rounded-lg hover:bg-white focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.newSearch}</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <ConfidenceBadge 
            level={result.confidenceLevel} 
            score={result.confidenceScore} 
            domain={result.primaryDomain} 
          />

          {/* Copy summary button */}
          <button
            type="button"
            onClick={handleCopy}
            title={t.copySummary}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-charcoal-700 bg-white border border-borderLight hover:bg-cream-50 rounded-lg shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-charcoal-500" />}
            <span>{copied ? t.copied : t.copySummary}</span>
          </button>

          {/* Save Guidance button */}
          <button
            type="button"
            onClick={() => onSaveGuidance(result)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
              isSaved
                ? 'bg-forest-800 text-cream-50 border-forest-900 shadow-2xs'
                : 'bg-white text-charcoal-700 border-borderLight hover:bg-cream-50'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>{t.guidanceSaved}</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-charcoal-500" />
                <span>{t.saveGuidance}</span>
              </>
            )}
          </button>

          {/* Escalate to Facilitator */}
          <button
            type="button"
            onClick={onEscalateFacilitator}
            title={t.escalateTooltip}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-forest-800 hover:bg-forest-900 text-cream-50 rounded-lg shadow-sm transition-all"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.escalateFacilitator}</span>
            <span className="sm:hidden">Facilitator</span>
          </button>
        </div>
      </div>

      {/* Clarifying Questions if applicable */}
      {result.clarifyingQuestions && result.clarifyingQuestions.length > 0 && (
        <ClarifyingQuestions 
          questions={result.clarifyingQuestions} 
          onAnswerClarification={(qId, opt) => onRefineQuery(`${result.query} (${opt})`)} 
        />
      )}

      {/* 1. Short Answer */}
      <section className="bg-white p-5 rounded-2xl border border-borderLight shadow-soft mb-6">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-1.5 h-4 bg-forest-800 rounded-full" />
          <h2 className="text-xs uppercase tracking-wider font-semibold text-charcoal-900">
            {t.shortAnswer}
          </h2>
        </div>
        <p className="text-[14px] text-charcoal-800 leading-relaxed font-normal">
          {result.shortAnswer}
        </p>
      </section>

      {/* 2. Key Findings & Why this matters (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Key Findings */}
        <section className="bg-white p-5 rounded-2xl border border-borderLight shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-forest-700" />
              <h2 className="text-xs uppercase tracking-wider font-semibold text-charcoal-900">
                {t.keyFindings}
              </h2>
            </div>
            <ul className="space-y-2.5 text-[12px] text-charcoal-800 leading-relaxed">
              {result.keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-700 mt-1.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why this matters */}
        <section className="bg-white p-5 rounded-2xl border border-borderLight shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-forest-700" />
              <h2 className="text-xs uppercase tracking-wider font-semibold text-charcoal-900">
                {t.whyItMatters}
              </h2>
            </div>
            <p className="text-[12.5px] text-charcoal-700 leading-relaxed font-normal">
              {result.whyItMatters}
            </p>
          </div>

          {result.classification?.contradiction_flag && (
            <div className="mt-4 p-3 bg-terracotta-50 border border-terracotta-200 rounded-xl text-terracotta-700 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{t.contradictionAlert}</p>
                <p className="text-[11px] mt-0.5">{result.classification.contradiction_flag}</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* 3. Jurisdiction Comparison (India vs International) */}
      <section className="bg-white p-5 rounded-2xl border border-borderLight shadow-soft mb-6">
        <div className="flex items-center justify-between mb-4 border-b border-cream-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-forest-700" />
            <h2 className="text-xs uppercase tracking-wider font-semibold text-charcoal-900">
              Jurisdiction Comparison: India vs International
            </h2>
          </div>

          <div className="flex items-center bg-cream-50 p-0.5 rounded-lg border border-borderLight text-[11px]">
            <button
              type="button"
              onClick={() => setActiveJurisdictionTab('both')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${
                activeJurisdictionTab === 'both' ? 'bg-white shadow-2xs font-semibold text-charcoal-900' : 'text-charcoal-600'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setActiveJurisdictionTab('india')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${
                activeJurisdictionTab === 'india' ? 'bg-white shadow-2xs font-semibold text-charcoal-900' : 'text-charcoal-600'
              }`}
            >
              India Only
            </button>
            <button
              type="button"
              onClick={() => setActiveJurisdictionTab('intl')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${
                activeJurisdictionTab === 'intl' ? 'bg-white shadow-2xs font-semibold text-charcoal-900' : 'text-charcoal-600'
              }`}
            >
              International Only
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeJurisdictionTab === 'both' || activeJurisdictionTab === 'india') && (
            <div className="p-4 bg-cream-50/70 rounded-xl border border-borderLight/80">
              <h3 className="text-xs font-semibold text-forest-900 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-forest-700" />
                <span>{result.jurisdictionAnalysis.india.title}</span>
              </h3>
              <ul className="space-y-2 text-[11.5px] text-charcoal-700 leading-relaxed">
                {result.jurisdictionAnalysis.india.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-forest-700 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(activeJurisdictionTab === 'both' || activeJurisdictionTab === 'intl') && (
            <div className="p-4 bg-sage-50/50 rounded-xl border border-sage-200/80">
              <h3 className="text-xs font-semibold text-forest-900 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sage-500" />
                <span>{result.jurisdictionAnalysis.international.title}</span>
              </h3>
              <ul className="space-y-2 text-[11.5px] text-charcoal-700 leading-relaxed">
                {result.jurisdictionAnalysis.international.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-forest-700 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 4. Recommended Next Steps */}
      <section className="bg-white p-5 rounded-2xl border border-borderLight shadow-soft mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileCheck2 className="w-4 h-4 text-forest-700" />
          <h2 className="text-xs uppercase tracking-wider font-semibold text-charcoal-900">
            {t.recommendedSteps}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.nextSteps.map((stepItem, idx) => (
            <div key={idx} className="p-3 bg-cream-50/60 rounded-xl border border-borderLight/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900 mb-1">
                <span className="w-4 h-4 rounded-full bg-forest-800 text-cream-50 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span>{stepItem.step}</span>
              </div>
              <p className="text-[11px] text-charcoal-600 leading-relaxed pl-6">
                {stepItem.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Sources & Evidence (Visually distinct from AI generation) */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-forest-700" />
            <h2 className="text-xs uppercase tracking-wider font-semibold text-charcoal-900">
              {t.sourcesEvidence} ({result.sources.length} Cited Statutory Entries)
            </h2>
          </div>
          <span className="text-[11px] text-charcoal-500">
            Primary Legal Authority
          </span>
        </div>
        <EvidencePanel sources={result.sources} />
      </section>

      {/* 6. Collapsible: How this answer was generated */}
      <div className="bg-white rounded-xl border border-borderLight shadow-2xs mb-6 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowHowGenerated(!showHowGenerated)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-medium text-charcoal-700 hover:bg-cream-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-forest-700" />
            <span>{t.howGenerated}</span>
          </div>
          {showHowGenerated ? <ChevronUp className="w-4 h-4 text-charcoal-500" /> : <ChevronDown className="w-4 h-4 text-charcoal-500" />}
        </button>

        {showHowGenerated && (
          <div className="p-4 pt-2 border-t border-cream-100 text-[11px] text-charcoal-600 bg-cream-50/40 space-y-2">
            <p>{t.howGeneratedBody}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2 py-0.5 bg-white border border-borderLight rounded text-charcoal-700">
                Classification: <strong>{result.classification.category}</strong>
              </span>
              <span className="px-2 py-0.5 bg-white border border-borderLight rounded text-charcoal-700">
                Signals: {result.howGenerated.signals?.join(', ') || 'Rule matching'}
              </span>
              <span className="px-2 py-0.5 bg-white border border-borderLight rounded text-charcoal-700">
                Statutes: {result.howGenerated.statutesScanned?.join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 7. Limitations & Legal Disclaimer Notice */}
      <div className="p-4 bg-cream-100/60 rounded-xl border border-borderMuted text-charcoal-600 text-[11px] leading-relaxed">
        <p className="font-semibold text-charcoal-800 text-xs mb-1">
          {t.legalDisclaimer}
        </p>
        <p>{t.disclaimerBody}</p>
        <div className="mt-2 pt-2 border-t border-borderLight/80 text-[10px] text-charcoal-500">
          Limitations: {result.limitations.join(' • ')}
        </div>
      </div>
    </div>
  );
}
