import React from 'react';
import ResearchComposer from '../components/ResearchComposer';
import SuggestedActions from '../components/SuggestedActions';
import TrustStatement from '../components/TrustStatement';
import { translations } from '../utils/translations';

export default function Home({ 
  onSubmitQuery, 
  currentLang = 'en',
  prefilledQuery = '',
  onSelectSuggestion
}) {
  const t = translations[currentLang] || translations.en;

  return (
    <main 
      className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 pb-10 sm:pb-14 lg:pb-18 max-w-5xl mx-auto w-full select-text"
      role="main"
    >
      {/* 
        Hero section:
        Compact typography strictly complying with guidelines:
        Eyebrow: 11-12px
        Main heading: 44-48px max
        Secondary heading: 30-32px max
        Supporting text: 15-16px
        Desktop fits naturally within 1366x768 and 1440x900 without vertical scrolling.
      */}
      <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-5">
        {/* Eyebrow: 11-12px */}
        <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.14em] text-forest-800/90 mb-1.5">
          {t.eyebrow}
        </p>

        {/* Main Heading: 44-48px */}
        <h1 className="text-[34px] sm:text-[46px] font-bold text-charcoal-900 tracking-tight leading-[1.08] mb-1">
          {t.heroHeading}
        </h1>

        {/* Secondary Heading: 30-32px */}
        <h2 className="text-[22px] sm:text-[31px] font-medium text-charcoal-700 tracking-tight leading-[1.14] mb-2 sm:mb-2.5">
          {t.heroSubheading}
        </h2>

        {/* Supporting text: 15-16px */}
        <p className="text-[14.5px] sm:text-[15.5px] text-charcoal-600 font-normal leading-relaxed max-w-lg mx-auto">
          {t.heroDescription}
        </p>
      </div>

      {/* Fixed Research Composer */}
      <ResearchComposer
        onSubmit={onSubmitQuery}
        currentLang={currentLang}
        initialQuery={prefilledQuery}
      />

      {/* Suggested Actions Row */}
      <SuggestedActions
        onSelectSuggestion={onSelectSuggestion}
        currentLang={currentLang}
      />

      {/* Subtle Trust Statement */}
      <TrustStatement currentLang={currentLang} />
    </main>
  );
}
