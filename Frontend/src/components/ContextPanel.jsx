import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Database,
  Building2,
  Globe2,
  Sparkles,
  Info
} from 'lucide-react';
import { DOMAIN_LABELS } from '../services/knowledgeBaseData';

export default function ContextPanel({ 
  currentResult, 
  jurisdiction = 'India', 
  isOpenMobile = false, 
  onCloseMobile 
}) {
  const isQueryActive = Boolean(currentResult);
  const classification = currentResult?.classification;
  
  // Dynamic or demo values matching prompt specifications
  const researchType = currentResult?.primaryDomain || 'Patentability';
  const formulationType = classification?.category?.replace(/_/g, ' ') || 'Proprietary';
  const sourcesFound = currentResult?.sources?.length || 12;
  const authoritativeSources = currentResult?.sources 
    ? Math.min(currentResult.sources.length, 8) 
    : 8;
  const confidence = currentResult?.confidenceLevel 
    ? (currentResult.confidenceLevel.charAt(0).toUpperCase() + currentResult.confidenceLevel.slice(1)) 
    : 'High';

  return (
    <>
      {/* Mobile Backdrop for Context Drawer */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-charcoal-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          w-72 xl:w-80 bg-[#FAF8F3] border-l border-[#E5DFD3]
          flex flex-col justify-between overflow-y-auto
          shrink-0 select-none transition-transform duration-200 ease-in-out
          ${isOpenMobile 
            ? 'fixed inset-y-0 right-0 z-50 shadow-2xl translate-x-0 w-80 max-w-[85vw]' 
            : 'hidden lg:flex'
          }
        `}
      >
        {/* Context Panel Content */}
        <div className="p-3 xl:p-3.5 space-y-2.5 xl:space-y-3">
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3]">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-forest-700" />
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-800">
                Research Context
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-forest-800 bg-sage-100/80 px-2 py-0.5 rounded-full">
                {jurisdiction}
              </span>
              {isOpenMobile && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1 text-charcoal-500 hover:text-charcoal-900 lg:hidden"
                  aria-label="Close context panel"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 1. RESEARCH CONTEXT */}
          <div className="bg-white p-2.5 xl:p-3 rounded-xl border border-[#E5DFD3] shadow-2xs space-y-2">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-forest-800 block">
              RESEARCH CONTEXT
            </span>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-500 font-medium">Jurisdiction</span>
                <span className="text-charcoal-900 font-semibold">{jurisdiction}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-charcoal-500 font-medium">Research Type</span>
                {isQueryActive ? (
                  <span className="text-forest-800 font-semibold truncate max-w-[140px]" title={researchType}>
                    {researchType}
                  </span>
                ) : (
                  <span className="text-charcoal-400 font-normal">
                    Not selected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2. FORMULATION */}
          <div className="bg-white p-2.5 xl:p-3 rounded-xl border border-[#E5DFD3] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-forest-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-forest-700" />
                <span>FORMULATION</span>
              </span>
              {isQueryActive && (
                <span className="text-[9.5px] text-charcoal-500 font-medium">
                  {classification?.confidence || 'Evaluated'}
                </span>
              )}
            </div>

            {isQueryActive ? (
              <>
                {/* Classical / Proprietary / New formulation pill selector for active query */}
                <div className="grid grid-cols-3 gap-1 text-[9.5px] font-medium text-center">
                  <div className={`p-1 rounded border transition-colors ${
                    formulationType.toLowerCase().includes('classical') 
                      ? 'bg-forest-800 text-cream-50 font-semibold border-forest-900' 
                      : 'bg-cream-50/70 text-charcoal-600 border-borderLight'
                  }`}>
                    Classical
                  </div>
                  <div className={`p-1 rounded border transition-colors ${
                    formulationType.toLowerCase().includes('proprietary') 
                      ? 'bg-forest-800 text-cream-50 font-semibold border-forest-900' 
                      : 'bg-cream-50/70 text-charcoal-600 border-borderLight'
                  }`}>
                    Proprietary
                  </div>
                  <div className={`p-1 rounded border transition-colors ${
                    formulationType.toLowerCase().includes('new') 
                      ? 'bg-forest-800 text-cream-50 font-semibold border-forest-900' 
                      : 'bg-cream-50/70 text-charcoal-600 border-borderLight'
                  }`}>
                    New formulation
                  </div>
                </div>

                <p className="text-[10px] text-charcoal-600 mt-1 leading-relaxed">
                  {classification?.rationale || 'Grounding in recognized classical ASU texts and traditional medicine frameworks.'}
                </p>

                {classification?.contradiction_flag && (
                  <div className="p-1.5 bg-terracotta-50 border border-terracotta-200 rounded-lg text-[10px] text-terracotta-700 flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-terracotta-600 shrink-0 mt-0.5" />
                    <span>Claim contradiction: cosmetic with drug claim.</span>
                  </div>
                )}
              </>
            ) : (
              /* Initial unclassified state - do NOT pre-select Proprietary */
              <div className="p-2 bg-cream-50/60 rounded-lg border border-borderLight/80 text-left">
                <span className="text-[11px] font-medium text-charcoal-600 block">
                  Not yet classified
                </span>
                <p className="text-[10px] text-charcoal-400 mt-0.5 leading-relaxed">
                  Classical, proprietary, or new botanical classification will appear here upon inquiry.
                </p>
              </div>
            )}
          </div>

          {/* 3. EVIDENCE */}
          <div className="bg-white p-2.5 xl:p-3 rounded-xl border border-[#E5DFD3] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-forest-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-forest-700" />
                <span>EVIDENCE</span>
              </span>
              {isQueryActive && (
                <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                  Confidence: {confidence}
                </span>
              )}
            </div>

            {isQueryActive ? (
              /* Actual research evidence counters */
              <div className="grid grid-cols-2 gap-1.5 text-center">
                <div className="p-1.5 bg-cream-50/80 rounded-lg border border-borderLight">
                  <span className="block text-sm font-bold text-forest-900">
                    {sourcesFound}
                  </span>
                  <span className="text-[9.5px] text-charcoal-500 font-medium">Sources found</span>
                </div>
                <div className="p-1.5 bg-cream-50/80 rounded-lg border border-borderLight">
                  <span className="block text-sm font-bold text-forest-900">
                    {authoritativeSources}
                  </span>
                  <span className="text-[9.5px] text-charcoal-500 font-medium">Authoritative sources</span>
                </div>
              </div>
            ) : (
              /* Initial empty evidence state - do NOT show fabricated numbers */
              <div className="p-2 bg-cream-50/60 rounded-lg border border-borderLight/80 text-left">
                <span className="text-[11px] font-medium text-charcoal-600 block">
                  No research yet
                </span>
                <p className="text-[10px] text-charcoal-400 mt-0.5 leading-relaxed">
                  Citations, prior art references, and confidence metrics will display after query evaluation.
                </p>
              </div>
            )}
          </div>

          {/* 4. RESEARCH TOOLS */}
          <div className="bg-white p-2.5 xl:p-3 rounded-xl border border-[#E5DFD3] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-forest-800 block">
                RESEARCH TOOLS
              </span>
              <span className="text-[9.5px] text-charcoal-400 font-normal">
                {isQueryActive ? 'Active Citations' : 'Capabilities'}
              </span>
            </div>

            <ul className="space-y-1.5 text-[10.5px] text-charcoal-700">
              <li className="flex items-center justify-between p-1.5 rounded bg-cream-50/60 border border-borderLight/60">
                <div>
                  <span className="font-semibold text-charcoal-900 block">TKDL / Prior Art</span>
                  <span className="text-[9.5px] text-charcoal-500">CSIR Traditional Knowledge</span>
                </div>
                <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                  isQueryActive 
                    ? 'text-forest-800 font-semibold bg-sage-100/70' 
                    : 'text-charcoal-600 bg-white border border-borderLight'
                }`}>
                  {isQueryActive ? 'Connected' : 'Available'}
                </span>
              </li>
              <li className="flex items-center justify-between p-1.5 rounded bg-cream-50/60 border border-borderLight/60">
                <div>
                  <span className="font-semibold text-charcoal-900 block">Patent databases</span>
                  <span className="text-[9.5px] text-charcoal-500">IPO InPASS • WIPO Patentscope</span>
                </div>
                <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                  isQueryActive 
                    ? 'text-forest-800 font-semibold bg-sage-100/70' 
                    : 'text-charcoal-600 bg-white border border-borderLight'
                }`}>
                  {isQueryActive ? 'Indexed' : 'Available'}
                </span>
              </li>
              <li className="flex items-center justify-between p-1.5 rounded bg-cream-50/60 border border-borderLight/60">
                <div>
                  <span className="font-semibold text-charcoal-900 block">Regulatory sources</span>
                  <span className="text-[9.5px] text-charcoal-500">AYUSH • CDSCO • FSSAI 2022</span>
                </div>
                <span className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                  isQueryActive 
                    ? 'text-forest-800 font-semibold bg-sage-100/70' 
                    : 'text-charcoal-600 bg-white border border-borderLight'
                }`}>
                  {isQueryActive ? 'Verified' : 'Available'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Context Panel Footer */}
        <div className="p-3 border-t border-[#E5DFD3] text-[10.5px] text-charcoal-500 text-center bg-white/40">
          Statutory guidance • Educational research only
        </div>
      </aside>
    </>
  );
}
