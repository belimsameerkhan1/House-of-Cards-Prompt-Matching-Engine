import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { translations } from '../utils/translations';

export default function ResearchStatus({ currentStep = 0, currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;
  const steps = t.researchStatusSteps || [
    "Analyzing formulation query & intent",
    "Retrieving statutory knowledge & acts",
    "Cross-referencing TKDL & patent exclusions",
    "Synthesizing source-grounded guidance"
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-5 bg-white rounded-2xl border border-borderLight shadow-soft">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cream-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-forest-700 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
            {t.researchWorkspace}
          </h3>
        </div>
        <span className="text-[11px] text-charcoal-500 font-medium">
          Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
        </span>
      </div>

      <div className="space-y-3">
        {steps.map((stepText, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={idx} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold transition-all duration-300 ${
                  isDone
                    ? 'bg-forest-800 text-cream-50'
                    : isCurrent
                    ? 'bg-sage-100 text-forest-800 ring-2 ring-forest-700/20'
                    : 'bg-cream-100 text-charcoal-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-3 h-3 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Loader2 className="w-3 h-3 animate-spin text-forest-800" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              <span
                className={`text-xs transition-colors duration-200 ${
                  isDone
                    ? 'text-charcoal-600 font-normal line-through opacity-70'
                    : isCurrent
                    ? 'text-charcoal-900 font-medium'
                    : 'text-charcoal-400 font-normal'
                }`}
              >
                {stepText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
