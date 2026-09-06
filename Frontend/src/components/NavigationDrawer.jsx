import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  History, 
  Bookmark, 
  BookOpen, 
  Users, 
  Settings as SettingsIcon, 
  X, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function NavigationDrawer({ 
  isOpen, 
  onClose, 
  currentPage, 
  onNavigate, 
  currentLang 
}) {
  const t = translations[currentLang] || translations.en;

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'history', label: t.history, icon: History },
    { id: 'saved', label: t.saved, icon: Bookmark },
    { id: 'sources', label: t.sources, icon: BookOpen },
    { id: 'facilitator', label: t.facilitator, icon: Users },
    { id: 'settings', label: t.settings, icon: SettingsIcon },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Navigation drawer">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal-900/30 backdrop-blur-sm"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-72 max-w-[85vw] bg-[#FAF8F5] border-r border-borderLight shadow-2xl flex flex-col h-full z-10"
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-borderLight flex items-center justify-between bg-white/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-cream-50 font-semibold text-sm shadow-sm">
                  S
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-charcoal-900 tracking-tight leading-none">
                    IP-SAKTI Sahayak
                  </h2>
                  <p className="text-[11px] text-forest-700 font-medium mt-0.5">
                    Ayurveda IP Workspace
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close navigation"
                className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-forest-800 text-cream-50 shadow-sm'
                        : 'text-charcoal-700 hover:bg-white/80 hover:text-charcoal-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cream-50' : 'text-forest-700'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Curated Stat/Reference Box */}
            <div className="p-4 mx-3 mb-3 rounded-xl bg-white border border-borderLight/80 shadow-soft">
              <div className="flex items-center gap-2 text-forest-800 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-forest-700" />
                <span>Statutory Grounding</span>
              </div>
              <p className="text-[11px] text-charcoal-600 mt-1 leading-relaxed">
                25 verified provisions across Indian Patents Act, Biological Diversity Act & TKDL repositories.
              </p>
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-3 border-t border-borderLight bg-white/40 text-[11px] text-charcoal-500 flex items-center justify-between">
              <span>{t.drawerVersion}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
