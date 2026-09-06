import React from 'react';
import { History as HistoryIcon, Clock, ArrowRight, Trash2, Scale } from 'lucide-react';
import { DOMAIN_LABELS } from '../services/knowledgeBaseData';
import { translations } from '../utils/translations';

export default function History({ historyItems = [], onSelectHistoryItem, onClearHistory, currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-borderLight">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-forest-800">
            <HistoryIcon className="w-4 h-4 text-forest-700" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-charcoal-900">
              {t.history}
            </h1>
            <p className="text-[11px] text-charcoal-500">
              Previous inquiries and statutory analyses
            </p>
          </div>
        </div>

        {historyItems.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="flex items-center gap-1 text-xs text-charcoal-500 hover:text-terracotta-600 transition-colors py-1 px-2.5 rounded-md hover:bg-white"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-borderLight p-6">
          <Clock className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
          <p className="text-xs text-charcoal-600 font-medium">No research history yet</p>
          <p className="text-[11px] text-charcoal-400 mt-1 max-w-xs mx-auto">
            Queries submitted in the research composer will automatically be cataloged here for subsequent reference.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {historyItems.map((item) => {
            const dateStr = new Date(item.timestamp).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className="p-4 bg-white hover:bg-cream-50/70 rounded-xl border border-borderLight shadow-2xs hover:shadow-soft transition-all duration-150 cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sage-50 text-forest-800 text-[10px] font-semibold">
                      <Scale className="w-3 h-3 text-forest-700" />
                      <span>{item.primaryDomain || 'Regulatory Research'}</span>
                    </span>
                    <span className="text-[10px] text-charcoal-400 font-normal">
                      {dateStr}
                    </span>
                  </div>
                  <h3 className="text-xs font-medium text-charcoal-900 group-hover:text-forest-900 transition-colors truncate">
                    {item.query}
                  </h3>
                  <p className="text-[11px] text-charcoal-600 line-clamp-1 mt-0.5">
                    {item.shortAnswer}
                  </p>
                </div>

                <div className="w-6 h-6 rounded-full bg-cream-100 group-hover:bg-forest-800 text-charcoal-500 group-hover:text-cream-50 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
