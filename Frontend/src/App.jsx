import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ContextPanel from './components/ContextPanel';
import ResearchWorkspace from './components/ResearchWorkspace';
import FacilitatorModal from './components/FacilitatorModal';
import History from './pages/History';
import SavedGuidance from './pages/SavedGuidance';
import Sources from './pages/Sources';
import Facilitator from './pages/Facilitator';
import Settings from './pages/Settings';
import { generateGuidance } from './services/guidanceEngine';
import { checkBackendHealth } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('research');
  const [currentLang, setCurrentLang] = useState('en');
  const [jurisdiction, setJurisdiction] = useState('India');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileContextOpen, setIsMobileContextOpen] = useState(false);
  const [isFacilitatorModalOpen, setIsFacilitatorModalOpen] = useState(false);

  // Active Research State
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  const [activeQuery, setActiveQuery] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [prefilledQuery, setPrefilledQuery] = useState('');

  // Persistent History and Saved Guidance
  const [historyItems, setHistoryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ipsakti_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedItems, setSavedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ipsakti_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ipsakti_history', JSON.stringify(historyItems));
    } catch (e) {
      console.warn('Storage sync issue:', e);
    }
  }, [historyItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ipsakti_saved', JSON.stringify(savedItems));
    } catch (e) {
      console.warn('Storage sync issue:', e);
    }
  }, [savedItems]);

  // Initial health check
  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Handle Research Submission
  const handleSubmitQuery = async ({ query, file }) => {
    if (!query.trim()) return;

    setActiveQuery(query);
    setAttachedFile(file);
    setIsLoading(true);
    setCurrentStep(0);
    setCurrentPage('research');

    // Step progress simulation while processing
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 400);

    try {
      const result = await generateGuidance({
        query,
        jurisdiction,
        attachedFile: file,
        lang: currentLang,
      });

      clearInterval(stepInterval);
      setCurrentStep(3);

      setTimeout(() => {
        setCurrentResult(result);
        setIsLoading(false);

        // Prepend to history
        setHistoryItems((prev) => [result, ...prev.filter((h) => h.query !== result.query)].slice(0, 50));
      }, 300);
    } catch (err) {
      clearInterval(stepInterval);
      setIsLoading(false);
      console.error('Guidance generation error:', err);
    }
  };

  // Handle Suggestion Click
  const handleSelectSuggestion = (queryText) => {
    setPrefilledQuery(queryText);
  };

  // Save / Bookmark Guidance
  const handleToggleSaveGuidance = (result) => {
    if (!result) return;
    const exists = savedItems.some((s) => s.id === result.id || s.query === result.query);
    if (exists) {
      setSavedItems((prev) => prev.filter((s) => s.id !== result.id && s.query !== result.query));
    } else {
      setSavedItems((prev) => [result, ...prev]);
    }
  };

  const isCurrentResultSaved = Boolean(
    currentResult && savedItems.some((s) => s.id === currentResult.id || s.query === currentResult.query)
  );

  const getWorkspaceTitle = () => {
    switch (currentPage) {
      case 'history': return 'Research History';
      case 'saved': return 'Saved Statutory Guidance';
      case 'sources': return 'Sources & Registries Library';
      case 'facilitator': return 'Find an AYUSH IP Facilitator';
      case 'settings': return 'Workspace Settings';
      default: return 'IP Research Workspace';
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[#FBF9F5] text-charcoal-900 font-sans overflow-hidden">
      {/* 
        COLUMN 1: LEFT NAVIGATION SIDEBAR
        Permanent on desktop (~240-260px), slide-out drawer on mobile/tablet.
      */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        currentLang={currentLang}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* 
        MAIN WORKSPACE AREA (CENTER + RIGHT)
      */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOP HEADER */}
        <Header
          workspaceTitle={getWorkspaceTitle()}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onOpenMobileContext={() => setIsMobileContextOpen(true)}
          jurisdiction={jurisdiction}
          onToggleJurisdiction={setJurisdiction}
          currentLang={currentLang}
          onSelectLang={setCurrentLang}
        />

        {/* 
          COLUMN 2 & 3: CENTER WORKSPACE + RIGHT CONTEXT PANEL
        */}
        <div className="flex-1 flex flex-row h-full overflow-hidden">
          {/* 
            COLUMN 2: CENTER WORKSPACE (~60-65% width)
            Main research conversation or active tool view.
          */}
          <main className="flex-1 flex flex-col h-full overflow-hidden relative" role="main">
            {(currentPage === 'research' || currentPage === 'home') && (
              <ResearchWorkspace
                isLoading={isLoading}
                currentStep={currentStep}
                currentResult={currentResult}
                activeQuery={activeQuery}
                attachedFile={attachedFile}
                onSubmitQuery={handleSubmitQuery}
                onNewSearch={() => {
                  setCurrentResult(null);
                  setActiveQuery('');
                  setPrefilledQuery('');
                }}
                onSaveGuidance={handleToggleSaveGuidance}
                isSaved={isCurrentResultSaved}
                onEscalateFacilitator={() => setIsFacilitatorModalOpen(true)}
                onRefineQuery={(refinedQuery) => {
                  handleSubmitQuery({ query: refinedQuery, file: currentResult?.attachedFile });
                }}
                currentLang={currentLang}
                prefilledQuery={prefilledQuery}
                onSelectSuggestion={handleSelectSuggestion}
              />
            )}

            {currentPage === 'history' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <History
                  historyItems={historyItems}
                  onSelectHistoryItem={(item) => {
                    setCurrentResult(item);
                    setCurrentPage('research');
                  }}
                  onClearHistory={() => setHistoryItems([])}
                  currentLang={currentLang}
                />
              </div>
            )}

            {currentPage === 'saved' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <SavedGuidance
                  savedItems={savedItems}
                  onSelectSavedItem={(item) => {
                    setCurrentResult(item);
                    setCurrentPage('research');
                  }}
                  onRemoveSavedItem={(id) => setSavedItems((prev) => prev.filter((s) => s.id !== id))}
                  currentLang={currentLang}
                />
              </div>
            )}

            {currentPage === 'sources' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Sources currentLang={currentLang} />
              </div>
            )}

            {currentPage === 'facilitator' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Facilitator currentLang={currentLang} />
              </div>
            )}

            {currentPage === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Settings
                  jurisdiction={jurisdiction}
                  onToggleJurisdiction={setJurisdiction}
                  currentLang={currentLang}
                  onSelectLang={setCurrentLang}
                />
              </div>
            )}
          </main>

          {/* 
            COLUMN 3: RIGHT CONTEXT PANEL (~280-320px)
            Context / evidence / research information.
          */}
          <ContextPanel
            currentResult={currentResult}
            jurisdiction={jurisdiction}
            isOpenMobile={isMobileContextOpen}
            onCloseMobile={() => setIsMobileContextOpen(false)}
          />
        </div>
      </div>

      {/* Global Facilitator Escalation Modal */}
      <FacilitatorModal
        isOpen={isFacilitatorModalOpen}
        onClose={() => setIsFacilitatorModalOpen(false)}
        currentLang={currentLang}
        querySummary={currentResult ? `Inquiry regarding: ${currentResult.query}` : ''}
      />
    </div>
  );
}
