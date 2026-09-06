import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { translations } from '../utils/translations';

export default function TrustStatement({ currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;

  return (
    <div className="flex items-center justify-center gap-1.5 text-center mt-2 text-[10.5px] text-charcoal-500 font-normal tracking-wide">
      <ShieldCheck className="w-3.5 h-3.5 text-forest-700/80 shrink-0 stroke-[1.8]" />
      <span>{t.trustStatement}</span>
    </div>
  );
}
