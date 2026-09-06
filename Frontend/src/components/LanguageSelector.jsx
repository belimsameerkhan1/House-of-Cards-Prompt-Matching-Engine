import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'हिंदी', native: 'हिंदी' },
  { code: 'mr', label: 'मराठी', native: 'मराठी' }
];

export default function LanguageSelector({ currentLang, onSelectLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const activeLang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        id="language-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-charcoal-700 bg-white/70 hover:bg-white border border-borderLight rounded-full shadow-sm hover:shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-forest-700/30"
      >
        <Globe className="w-3.5 h-3.5 text-forest-700 stroke-[1.75]" />
        <span>{activeLang.native}</span>
        <ChevronDown className={`w-3 h-3 text-charcoal-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-card border border-borderLight py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onSelectLang(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-sage-50 text-forest-800 font-semibold'
                    : 'text-charcoal-800 hover:bg-cream-100/60 font-normal'
                }`}
              >
                <span>{lang.native}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-forest-700" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
