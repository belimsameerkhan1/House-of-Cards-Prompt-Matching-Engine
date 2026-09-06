import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function ConfidenceBadge({ level = 'high', score = 0.88, domain = '' }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const config = {
    high: {
      label: 'High Confidence',
      bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      desc: 'Formulation context directly corroborated by explicit statutory provisions and TKDL examination guidelines.'
    },
    moderate: {
      label: 'Moderate Confidence',
      bgColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertTriangle,
      desc: 'Guidance synthesizes multiple regulatory pathways. Discrepancy between therapeutic claim and product category may require adjustment.'
    },
    review: {
      label: 'Needs Human Review',
      bgColor: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: AlertCircle,
      desc: 'Novel formulation signals detected without direct classical text match. Professional patent agent review recommended.'
    }
  }[level] || {
    label: 'Evaluated',
    bgColor: 'bg-cream-100 text-charcoal-700 border-borderLight',
    icon: Info,
    desc: 'Assessed against statutory repositories.'
  };

  const Icon = config.icon;

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border shadow-2xs transition-all ${config.bgColor}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{config.label}</span>
        <span className="opacity-75 font-mono text-[10px]">({Math.round(score * 100)}%)</span>
      </button>

      {showTooltip && (
        <div className="absolute left-0 top-full mt-1.5 w-64 p-2.5 bg-charcoal-900 text-cream-50 text-[11px] rounded-xl shadow-xl z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
          <p className="font-semibold text-[11px] text-cream-100 mb-0.5">
            Confidence Evaluation
          </p>
          <p className="text-charcoal-300 leading-snug">
            {config.desc}
          </p>
          {domain && (
            <p className="mt-1.5 pt-1 border-t border-charcoal-700 text-[10px] text-sage-300">
              Evaluated against: {domain}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
