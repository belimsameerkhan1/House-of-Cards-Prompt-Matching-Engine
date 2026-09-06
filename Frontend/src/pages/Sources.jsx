import React, { useState } from 'react';
import { BookOpen, Search, ExternalLink, Scale, Filter } from 'lucide-react';
import { KNOWLEDGE_ENTRIES, DOMAIN_LABELS } from '../services/knowledgeBaseData';
import { translations } from '../utils/translations';

export default function Sources({ currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  const domains = ['all', ...Object.keys(DOMAIN_LABELS)];

  const filteredSources = KNOWLEDGE_ENTRIES.filter((entry) => {
    const matchesDomain = selectedDomain === 'all' || entry.domain === selectedDomain;
    const matchesSearch =
      !searchTerm ||
      entry.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.source_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="pb-4 mb-6 border-b border-borderLight">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-cream-50">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-charcoal-900">
              {t.sources}
            </h1>
            <p className="text-[11px] text-charcoal-500">
              Curated statutory repository of Indian and international IP acts, rules, and gazettes
            </p>
          </div>
        </div>
      </div>

      {/* Search and Domain Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-borderLight shadow-2xs mb-6 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search statutory topics, acts, sections (e.g., Section 3(p), NBA, TKDL, FSSAI)..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-cream-50/70 border border-borderLight rounded-xl focus:outline-none focus:ring-1.5 focus:ring-forest-700/30 text-charcoal-900 placeholder:text-charcoal-400"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="text-charcoal-400 font-medium shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Domain:</span>
          </span>
          {domains.map((dom) => {
            const isSelected = selectedDomain === dom;
            const label = dom === 'all' ? 'All Domains (25)' : DOMAIN_LABELS[dom] || dom;
            return (
              <button
                key={dom}
                type="button"
                onClick={() => setSelectedDomain(dom)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 font-medium ${
                  isSelected
                    ? 'bg-forest-800 text-cream-50 font-semibold shadow-2xs'
                    : 'bg-cream-100/80 text-charcoal-700 hover:bg-cream-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSources.map((entry) => {
          const domainLabel = DOMAIN_LABELS[entry.domain] || entry.domain;

          return (
            <div
              key={entry.id}
              className="p-4 bg-white rounded-xl border border-borderLight hover:border-sage-300 transition-all duration-150 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sage-50 text-forest-800 text-[10px] font-semibold">
                    <Scale className="w-3 h-3 text-forest-700" />
                    <span>{domainLabel}</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-cream-100 text-charcoal-600 text-[10px] font-medium">
                    {entry.jurisdiction}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-charcoal-900 mb-1.5 leading-snug">
                  {entry.topic}
                </h3>

                <p className="text-[12px] text-charcoal-700 leading-relaxed line-clamp-4">
                  {entry.text}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-cream-100 flex items-center justify-between text-[11px]">
                <span className="text-charcoal-500 truncate max-w-[70%]" title={entry.source_name}>
                  {entry.source_name}
                </span>

                {entry.source_url && (
                  <a
                    href={entry.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-forest-800 hover:text-forest-900 font-medium hover:underline shrink-0"
                  >
                    <span>View Gazette / Act</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSources.length === 0 && (
        <div className="p-8 text-center bg-white rounded-2xl border border-borderLight mt-4">
          <p className="text-xs text-charcoal-500">No statutory entries matched your filter criteria.</p>
        </div>
      )}
    </div>
  );
}
