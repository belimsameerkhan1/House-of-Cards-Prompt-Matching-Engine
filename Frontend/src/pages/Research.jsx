import React from 'react';
import ResearchStatus from '../components/ResearchStatus';
import AnswerView from '../components/AnswerView';
import { translations } from '../utils/translations';

export default function Research({ 
  isLoading, 
  currentStep, 
  result, 
  onNewSearch, 
  onSaveGuidance, 
  isSaved, 
  onEscalateFacilitator,
  onRefineQuery,
  currentLang = 'en' 
}) {
  const t = translations[currentLang] || translations.en;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <ResearchStatus currentStep={currentStep} currentLang={currentLang} />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-8 text-center">
        <div className="max-w-md p-6 bg-white rounded-2xl border border-borderLight shadow-soft">
          <p className="text-xs text-charcoal-600 mb-3">
            No active research dossier loaded.
          </p>
          <button
            onClick={onNewSearch}
            className="px-3.5 py-1.5 bg-forest-800 text-cream-50 text-xs font-medium rounded-lg shadow-sm"
          >
            Start New Research
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full py-4">
      <AnswerView
        result={result}
        onNewSearch={onNewSearch}
        onSaveGuidance={onSaveGuidance}
        isSaved={isSaved}
        onEscalateFacilitator={onEscalateFacilitator}
        onRefineQuery={onRefineQuery}
        currentLang={currentLang}
      />
    </div>
  );
}
