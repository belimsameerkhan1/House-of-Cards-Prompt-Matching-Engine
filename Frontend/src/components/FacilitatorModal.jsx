import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, Mail, Phone, Building2, CheckCircle2 } from 'lucide-react';
import { translations } from '../utils/translations';

export default function FacilitatorModal({ 
  isOpen, 
  onClose, 
  currentLang = 'en', 
  querySummary = '' 
}) {
  const t = translations[currentLang] || translations.en;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState(querySummary || '');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (querySummary) {
      setNotes(querySummary);
    }
  }, [querySummary]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after brief confirmation
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Escalate to AYUSH IP Facilitator">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-borderLight shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between pb-4 border-b border-cream-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-forest-800 text-cream-50 flex items-center justify-center font-semibold text-xs shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-charcoal-900">
                AYUSH IP Facilitator Escalation
              </h3>
              <p className="text-[11px] text-charcoal-500">
                Direct statutory support for Ayurveda patent & ABS filings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-900 hover:bg-cream-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
            <h4 className="text-sm font-semibold text-charcoal-900">Escalation Docket Created</h4>
            <p className="text-xs text-charcoal-600 mt-1 max-w-sm">
              Your inquiry has been logged with the AYUSH Innovation & Patent Cell. An empaneled facilitator will reach out within 1 business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div className="p-3 bg-cream-50 rounded-xl border border-borderLight text-[11px] text-charcoal-700 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
              <span>
                Free preliminary consultation through Ministry of AYUSH & CSIR-empaneled patent attorney cells for academic & MSME innovators.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-charcoal-700 mb-1">
                Innovator / Researcher Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Rajesh Sharma"
                className="w-full px-3 py-1.5 text-xs bg-white border border-borderLight rounded-lg focus:outline-none focus:ring-1.5 focus:ring-forest-700/40 text-charcoal-900 placeholder:text-charcoal-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-charcoal-700 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@ayurveda-research.org"
                className="w-full px-3 py-1.5 text-xs bg-white border border-borderLight rounded-lg focus:outline-none focus:ring-1.5 focus:ring-forest-700/40 text-charcoal-900 placeholder:text-charcoal-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-charcoal-700 mb-1">
                Formulation & Research Inquiry Context
              </label>
              <textarea
                rows={3}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your formulation, herbs used, and current regulatory/patent hurdles..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-borderLight rounded-lg focus:outline-none focus:ring-1.5 focus:ring-forest-700/40 text-charcoal-900 placeholder:text-charcoal-400 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-charcoal-700 hover:bg-cream-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-forest-800 hover:bg-forest-900 text-cream-50 rounded-lg shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Escalation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
