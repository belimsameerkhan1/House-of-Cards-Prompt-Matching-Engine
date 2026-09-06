import React from 'react';
import { ExternalLink, ShieldCheck, Scale } from 'lucide-react';
import { DOMAIN_LABELS } from '../services/knowledgeBaseData';

export default function EvidencePanel({ sources = [] }) {
  if (!sources || sources.length === 0) {
    return (
      <div className="p-4 bg-white rounded-xl border border-borderLight text-xs text-charcoal-500 text-center">
        No primary statutory citations attached to this query.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {sources.map((item, idx) => {
        const domainLabel = DOMAIN_LABELS[item.domain] || item.domain?.replace(/_/g, ' ');

        return (
          <div
            key={item.id || idx}
            className="p-3.5 bg-white rounded-xl border border-borderLight/90 hover:border-sage-300 transition-all duration-150 shadow-2xs group"
          >
            {/* Top row: Domain pill, Jurisdiction tag, and Confidence */}
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sage-50 text-forest-800 text-[10px] font-semibold tracking-wide">
                  <Scale className="w-3 h-3 text-forest-700" />
                  <span>{domainLabel}</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cream-100 text-charcoal-700 text-[10px] font-medium">
                  {item.jurisdiction || 'India'}
                </span>
              </div>

              {item.confidence && (
                <span className="text-[10px] font-mono text-charcoal-500 font-medium">
                  Relevance: {Math.round(item.confidence * 100)}%
                </span>
              )}
            </div>

            {/* Topic heading */}
            <h4 className="text-xs font-semibold text-charcoal-900 mb-1 leading-snug group-hover:text-forest-800 transition-colors">
              {item.topic}
            </h4>

            {/* Statutory text snippet */}
            <p className="text-[12px] text-charcoal-700 leading-relaxed mb-2 line-clamp-3">
              {item.text}
            </p>

            {/* Citation footer */}
            <div className="pt-2 border-t border-cream-100 flex items-center justify-between text-[11px]">
              <span className="text-charcoal-500 font-normal truncate max-w-[80%]" title={item.source_name}>
                Source: <span className="text-charcoal-700 font-medium">{item.source_name}</span>
              </span>
              {item.source_url && (
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open statutory source: ${item.source_name}`}
                  className="inline-flex items-center gap-1 text-forest-700 hover:text-forest-900 font-medium text-[11px] shrink-0 hover:underline"
                >
                  <span>View Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
