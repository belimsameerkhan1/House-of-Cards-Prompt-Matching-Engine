import React from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';

export default function ClarifyingQuestions({ questions = [], onAnswerClarification }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="p-4 bg-sage-50/70 rounded-xl border border-sage-200/80 mb-6">
      <div className="flex items-center gap-2 mb-2 text-forest-900 font-semibold text-xs">
        <HelpCircle className="w-4 h-4 text-forest-700 shrink-0" />
        <span>Refine Analysis Context</span>
      </div>
      <p className="text-[11px] text-charcoal-600 mb-3">
        Clarifying these parameters sharpens the applicable regulatory pathway and patent eligibility thresholds:
      </p>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id} className="bg-white p-3 rounded-lg border border-borderLight shadow-2xs">
            <p className="text-xs font-medium text-charcoal-900 mb-2">
              {q.question}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onAnswerClarification(q.id, opt)}
                  className="px-2.5 py-1 text-[11px] text-charcoal-700 bg-cream-50 hover:bg-forest-800 hover:text-cream-50 rounded-md border border-borderLight transition-colors duration-150 flex items-center gap-1"
                >
                  <span>{opt}</span>
                  <ChevronRight className="w-3 h-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
