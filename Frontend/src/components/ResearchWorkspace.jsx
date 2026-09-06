import React from 'react';
import { Sparkles, User, FileText, ArrowRight } from 'lucide-react';
import ResearchComposer from './ResearchComposer';
import SuggestedActions from './SuggestedActions';
import TrustStatement from './TrustStatement';
import ResearchStatus from './ResearchStatus';
import AnswerView from './AnswerView';
import { translations } from '../utils/translations';

export default function ResearchWorkspace({
  isLoading,
  currentStep,
  currentResult,
  activeQuery,
  attachedFile,
  onSubmitQuery,
  onNewSearch,
  onSaveGuidance,
  isSaved,
  onEscalateFacilitator,
  onRefineQuery,
  currentLang = 'en',
  prefilledQuery,
  onSelectSuggestion
}) {
  const t = translations[currentLang] || translations.en;
  const hasActiveConversation = Boolean(isLoading || currentResult);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FBF9F5] overflow-hidden relative">
      {/* 
        Scrollable Upper Center Area:
        Holds either the calm empty state or the full research dialogue.
      */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        {!hasActiveConversation ? (
          /* CALM EMPTY STATE */
          <div className="h-full min-h-[320px] flex flex-col justify-center items-center text-center max-w-xl mx-auto py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-800 mb-2">
              {t.eyebrow}
            </p>

            <h1 className="text-[28px] sm:text-[32px] font-bold text-charcoal-900 tracking-tight leading-[1.12] mb-1.5">
              {t.heroHeading}
            </h1>

            <h2 className="text-[20px] sm:text-[22px] font-medium text-charcoal-700 tracking-tight leading-snug mb-3">
              {t.heroSubheading}
            </h2>

            <p className="text-[14px] sm:text-[14.5px] text-charcoal-600 font-normal leading-relaxed max-w-lg mx-auto">
              {t.heroDescription}
            </p>
          </div>
        ) : (
          /* ACTIVE RESEARCH CONVERSATION */
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {/* User Question Bubble */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-white p-4 rounded-2xl rounded-tr-sm border border-[#E5DFD3] shadow-soft max-w-[85%] text-left">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-forest-800 block mb-1">
                  Your Research Inquiry
                </span>
                <p className="text-sm font-semibold text-charcoal-900 leading-snug">
                  {currentResult?.query || activeQuery}
                </p>
                {(currentResult?.attachedFile || attachedFile) && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-charcoal-600 bg-cream-50 px-2 py-1 rounded border border-borderLight inline-flex">
                    <FileText className="w-3.5 h-3.5 text-forest-700" />
                    <span>Attached: {(currentResult?.attachedFile || attachedFile)?.name}</span>
                  </div>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-sage-100 text-forest-900 flex items-center justify-center text-xs font-semibold shrink-0 border border-sage-200">
                <User className="w-4 h-4" />
              </div>
            </div>

            {/* Loading Stepper */}
            {isLoading && (
              <div className="py-4">
                <ResearchStatus currentStep={currentStep} currentLang={currentLang} />
              </div>
            )}

            {/* Answer View in Central Area */}
            {!isLoading && currentResult && (
              <AnswerView
                result={currentResult}
                onNewSearch={onNewSearch}
                onSaveGuidance={onSaveGuidance}
                isSaved={isSaved}
                onEscalateFacilitator={onEscalateFacilitator}
                onRefineQuery={onRefineQuery}
                currentLang={currentLang}
              />
            )}
          </div>
        )}
      </div>

      {/* 
        BOTTOM-ANCHORED RESEARCH COMPOSER:
        Permanently anchored at the bottom-center of the central workspace.
      */}
      <div className="p-3 sm:p-4 bg-white/90 border-t border-[#E5DFD3] shrink-0 flex flex-col items-center shadow-xs">
        {/* Suggested research action pills */}
        <SuggestedActions
          onSelectSuggestion={onSelectSuggestion}
          currentLang={currentLang}
        />

        {/* Thin fixed research composer */}
        <div className="w-full mt-2 flex justify-center">
          <ResearchComposer
            onSubmit={onSubmitQuery}
            currentLang={currentLang}
            initialQuery={prefilledQuery}
            disabled={isLoading}
          />
        </div>

        {/* Subtle trust statement */}
        <TrustStatement currentLang={currentLang} />
      </div>
    </div>
  );
}
