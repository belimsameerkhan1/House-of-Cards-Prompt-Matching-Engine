import React from 'react';
import { translations } from '../utils/translations';

export default function SuggestedActions({ onSelectSuggestion, currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;
  const suggestions = t.suggestions || [];

  return (
    <div className="w-full max-w-[672px] flex flex-wrap sm:flex-nowrap items-center justify-center gap-1 sm:gap-1.5 mb-2">
      {suggestions.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectSuggestion(item.query)}
          className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10.5px] sm:text-[11px] font-medium text-charcoal-700 bg-white/80 hover:bg-white hover:text-forest-900 border border-borderLight hover:border-sage-300 rounded-full shadow-2xs hover:shadow-xs transition-all duration-150 focus:outline-none focus:ring-1.5 focus:ring-forest-700/30 whitespace-nowrap shrink-0"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
