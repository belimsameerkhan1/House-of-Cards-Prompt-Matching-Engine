import React from 'react';
import { 
  Compass, 
  History, 
  Bookmark, 
  BookOpen, 
  Users, 
  Settings, 
  X, 
  ShieldCheck,
  Scale
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function Sidebar({ 
  currentPage, 
  onNavigate, 
  currentLang = 'en', 
  isMobileOpen = false, 
  onCloseMobile 
}) {
  const t = translations[currentLang] || translations.en;

  const navItems = [
    { id: 'research', label: 'Research', icon: Compass },
    { id: 'history', label: t.history, icon: History },
    { id: 'saved', label: t.saved, icon: Bookmark },
    { id: 'sources', label: t.sources, icon: BookOpen },
    { id: 'facilitator', label: t.facilitator, icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-charcoal-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-60 xl:w-64 bg-[#F7F4EE] border-r border-[#E5DFD3]
          flex flex-col justify-between
          transition-transform duration-200 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          select-none shrink-0
        `}
      >
        {/* Top: Circular S Logo + Wordmark */}
        <div>
          <div className="h-14 px-4 flex items-center justify-between border-b border-[#E5DFD3]/80">
            <button 
              type="button"
              onClick={() => {
                onNavigate('research');
                if (onCloseMobile) onCloseMobile();
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 rounded-full bg-forest-800 group-hover:bg-forest-900 text-cream-50 flex items-center justify-center font-semibold text-sm shadow-xs transition-transform group-hover:scale-105 shrink-0">
                S
              </div>
              <div className="min-w-0">
                <h1 className="text-[13.5px] font-bold text-charcoal-900 tracking-tight leading-tight truncate">
                  IP-SAKTI Sahayak
                </h1>
                <p className="text-[10px] text-forest-800 font-medium tracking-wide truncate">
                  Ayurveda IP & Regulatory Guidance
                </p>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-charcoal-500 hover:text-charcoal-900 lg:hidden"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || (item.id === 'research' && currentPage === 'home');

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left
                    ${isActive
                      ? 'bg-[#E5ECE4] text-forest-900 border border-forest-800/15 shadow-2xs font-semibold'
                      : 'text-charcoal-700 hover:bg-[#EFE9DD] hover:text-charcoal-900 font-medium'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-forest-800' : 'text-forest-700/80'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Stat badge + Settings */}
        <div className="p-3 border-t border-[#E5DFD3]/80 space-y-2">
          {/* Statutory badge */}
          <div className="p-3 rounded-xl bg-white/80 border border-[#E5DFD3] text-[11px] text-charcoal-600 leading-relaxed shadow-2xs">
            <div className="flex items-center gap-1.5 font-semibold text-forest-900 mb-0.5">
              <Scale className="w-3.5 h-3.5 text-forest-700 shrink-0" />
              <span>Statutory Repository</span>
            </div>
            <p className="text-[10.5px] text-charcoal-500">
              Indian Patents Act, BDA & TKDL prior art rules.
            </p>
          </div>

          {/* Settings */}
          <button
            type="button"
            onClick={() => {
              onNavigate('settings');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`
              w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left
              ${currentPage === 'settings'
                ? 'bg-[#E5ECE4] text-forest-900 border border-forest-800/15 shadow-2xs font-semibold'
                : 'text-charcoal-700 hover:bg-[#EFE9DD] hover:text-charcoal-900 font-medium'
              }
            `}
          >
            <Settings className={`w-4 h-4 ${currentPage === 'settings' ? 'text-forest-800' : 'text-forest-700/80'}`} />
            <span>{t.settings}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
