import React from 'react';
import { Bookmark, Printer, ArrowRight, Trash2, Scale } from 'lucide-react';
import { translations } from '../utils/translations';

export default function SavedGuidance({ 
  savedItems = [], 
  onSelectSavedItem, 
  onRemoveSavedItem,
  currentLang = 'en' 
}) {
  const t = translations[currentLang] || translations.en;

  const handlePrint = (item) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>IP-SAKTI Sahayak Guidance — ${item.query}</title>
          <style>
            body { font-family: sans-serif; line-height: 1.5; padding: 24px; color: #1C1E1B; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 18px; color: #244B38; }
            h2 { font-size: 14px; text-transform: uppercase; color: #363A35; border-bottom: 1px solid #E6E2D8; padding-bottom: 4px; margin-top: 20px; }
            p { font-size: 13px; }
            ul { font-size: 13px; }
            .disclaimer { font-size: 11px; color: #666; margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 12px; }
          </style>
        </head>
        <body>
          <h1>IP-SAKTI Sahayak — Statutory Research Dossier</h1>
          <p><strong>Query:</strong> ${item.query}</p>
          <p><strong>Evaluated Domain:</strong> ${item.primaryDomain}</p>
          <h2>Short Answer</h2>
          <p>${item.shortAnswer}</p>
          <h2>Key Findings</h2>
          <ul>${item.keyFindings.map(f => `<li>${f}</li>`).join('')}</ul>
          <h2>Recommended Next Steps</h2>
          <ul>${item.nextSteps.map(s => `<li><strong>${s.step}:</strong> ${s.desc}</li>`).join('')}</ul>
          <div class="disclaimer">Information, not legal advice. Generated for research planning purposes under IP-SAKTI framework.</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-borderLight">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-cream-50">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-charcoal-900">
              {t.saved}
            </h1>
            <p className="text-[11px] text-charcoal-500">
              Bookmarked regulatory dossiers and statutory interpretations
            </p>
          </div>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-borderLight p-6">
          <Bookmark className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
          <p className="text-xs text-charcoal-600 font-medium">No saved guidance dossiers</p>
          <p className="text-[11px] text-charcoal-400 mt-1 max-w-xs mx-auto">
            Click 'Save Guidance' in the research workspace to store important statutory determinations here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-xl border border-borderLight shadow-2xs hover:shadow-soft transition-all duration-150 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sage-50 text-forest-800 text-[10px] font-semibold">
                    <Scale className="w-3 h-3 text-forest-700" />
                    <span>{item.primaryDomain || 'IP-SAKTI Dossier'}</span>
                  </span>
                  <span className="text-[10px] text-charcoal-400">
                    Saved on {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <h3 
                  onClick={() => onSelectSavedItem(item)}
                  className="text-xs font-semibold text-charcoal-900 hover:text-forest-900 cursor-pointer transition-colors mb-1"
                >
                  {item.query}
                </h3>
                <p className="text-[12px] text-charcoal-600 line-clamp-2 leading-relaxed">
                  {item.shortAnswer}
                </p>

                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-cream-100">
                  <button
                    type="button"
                    onClick={() => onSelectSavedItem(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-forest-800 hover:underline"
                  >
                    <span>View Complete Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePrint(item)}
                    className="inline-flex items-center gap-1 text-[11px] text-charcoal-500 hover:text-charcoal-900 ml-auto"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveSavedItem(item.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-charcoal-400 hover:text-terracotta-600"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
