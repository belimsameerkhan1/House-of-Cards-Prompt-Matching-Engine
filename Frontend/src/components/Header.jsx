import React from 'react';
import { Menu, Compass, Database } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { translations } from '../utils/translations';

export default function Header({ 
  workspaceTitle = 'Research Workspace',
  onOpenMobileMenu, 
  onOpenMobileContext,
  jurisdiction = 'India', 
  onToggleJurisdiction, 
  currentLang = 'en', 
  onSelectLang 
}) {
  const t = translations[currentLang] || translations.en;

  return (
    <header className="h-14 px-4 sm:px-6 bg-white border-b border-[#E5DFD3] flex items-center justify-between shrink-0 select-none">
      {/* Left side: Mobile menu toggle + Current Workspace Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu button (hidden on desktop) */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="p-1.5 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100 lg:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-forest-800 shrink-0 hidden sm:inline" />
          <h2 className="text-xs sm:text-sm font-semibold text-charcoal-900 tracking-tight">
            {workspaceTitle}
          </h2>
        </div>
      </div>

      {/* Right side: [India] [International] [English ▼] [AS] */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Jurisdiction Selector */}
        <div className="flex items-center bg-[#F4EFE6] p-0.5 rounded-full border border-[#E0D8CA] text-[11px] font-medium">
          <button
            type="button"
            onClick={() => onToggleJurisdiction('India')}
            className={`px-2.5 py-0.5 rounded-full transition-all duration-150 ${
              jurisdiction === 'India'
                ? 'bg-forest-800 text-cream-50 font-semibold shadow-xs'
                : 'text-charcoal-700 hover:text-charcoal-900'
            }`}
          >
            {t.jurisdictionIndia}
          </button>
          <button
            type="button"
            onClick={() => onToggleJurisdiction('International')}
            className={`px-2.5 py-0.5 rounded-full transition-all duration-150 ${
              jurisdiction === 'International'
                ? 'bg-forest-800 text-cream-50 font-semibold shadow-xs'
                : 'text-charcoal-700 hover:text-charcoal-900'
            }`}
          >
            {t.jurisdictionIntl}
          </button>
        </div>

        {/* Language Dropdown: English, हिंदी, मराठी */}
        <LanguageSelector currentLang={currentLang} onSelectLang={onSelectLang} />

        {/* Context panel toggle for mobile/tablet */}
        {onOpenMobileContext && (
          <button
            type="button"
            onClick={onOpenMobileContext}
            aria-label="Open context panel"
            className="p-1.5 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100 lg:hidden focus:outline-none"
            title="Open Context & Evidence"
          >
            <Database className="w-4 h-4 text-forest-800" />
          </button>
        )}

        {/* Profile Circle with AS */}
        <div
          title="Ayurveda Scholar Profile (AS)"
          className="w-7 h-7 rounded-full bg-forest-800 text-cream-50 flex items-center justify-center text-[11px] font-semibold tracking-tight shadow-2xs select-none"
        >
          AS
        </div>
      </div>
    </header>
  );
}
