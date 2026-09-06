import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, ArrowRight, X, AlertCircle } from 'lucide-react';
import { translations } from '../utils/translations';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg'];

export default function ResearchComposer({ 
  onSubmit, 
  currentLang = 'en',
  initialQuery = '',
  disabled = false
}) {
  const t = translations[currentLang] || translations.en;
  
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [inlineError, setInlineError] = useState(null);

  // Character-by-character typing animation state
  const [animatedText, setAnimatedText] = useState(t.composerPlaceholder || 'Start typing...');
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState((t.composerPlaceholder || 'Start typing...').length);
  const [isDeleting, setIsDeleting] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync initial query if passed from suggested actions
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialQuery]);

  // Typing animation effect when idle
  useEffect(() => {
    // Stop animation if focused, if user has typed something, or if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isFocused || query.trim().length > 0 || prefersReducedMotion) {
      return;
    }

    const initialPlaceholder = t.composerPlaceholder || "Start typing...";
    const prompts = [
      initialPlaceholder,
      ...(t.typingPrompts || [
        "Can I patent a standardized extract of Ashwagandha for anxiety?",
        "How is a polyherbal syrup classified under AYUSH vs CDSCO?",
        "Does our classical formulation need NBA approval before export?"
      ])
    ];

    const currentPrompt = prompts[promptIndex % prompts.length];
    let timer;

    if (!isDeleting && charIndex < currentPrompt.length) {
      timer = setTimeout(() => {
        setAnimatedText(currentPrompt.slice(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 42);
    } else if (!isDeleting && charIndex === currentPrompt.length) {
      // Pause at full string (longer pause on 'Start typing...')
      const pauseDuration = promptIndex % prompts.length === 0 ? 3000 : 2200;
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && charIndex > 0) {
      timer = setTimeout(() => {
        setAnimatedText(currentPrompt.slice(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, 20);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPromptIndex(prev => (prev + 1) % prompts.length);
    }

    return () => clearTimeout(timer);
  }, [isFocused, query, charIndex, isDeleting, promptIndex, t.composerPlaceholder, t.typingPrompts]);

  const handleKeyDown = (e) => {
    // Enter = newline; Ctrl+Enter or Cmd+Enter = submit
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInlineError(null);

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setInlineError(t.fileSizeError);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      setInlineError(t.fileTypeError);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setAttachedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setInlineError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!query.trim() || disabled) return;
    onSubmit({
      query: query.trim(),
      file: attachedFile
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 
        CRITICAL: Exact dimensions & fixed size.
        Width: max-w-[672px], Height: exactly 98px.
        No expansion, no height animation, no width animation.
      */}
      <div 
        className={`w-full max-w-[672px] h-[98px] bg-white rounded-2xl border transition-colors duration-150 relative flex flex-col justify-between p-2.5 px-3.5 shadow-composer ${
          isFocused 
            ? 'border-forest-700/60 ring-1 ring-forest-700/20' 
            : 'border-borderLight hover:border-charcoal-400/40'
        }`}
      >
        {/* Upper area: Textarea with absolute typing placeholder when idle */}
        <div className="relative w-full flex-1 overflow-hidden">
          {/* Animated typing placeholder when idle */}
          {!query && !isFocused && (
            <div 
              onClick={() => textareaRef.current?.focus()}
              className="absolute top-0 left-0 text-charcoal-400 text-[13px] leading-relaxed select-none pointer-events-none flex items-center pr-2"
            >
              <span>{animatedText || t.composerPlaceholder}</span>
              <span className="typing-cursor" />
            </div>
          )}

          <textarea
            ref={textareaRef}
            id="research-query-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (inlineError) setInlineError(null);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-label="Ayurveda IP and regulatory research query"
            className="w-full h-full bg-transparent resize-none border-none outline-none text-charcoal-900 text-[13px] leading-relaxed placeholder-transparent"
          />
        </div>

        {/* Bottom row: + Attach at bottom-left, Submit arrow at bottom-right */}
        <div className="flex items-center justify-between pt-1 border-t border-cream-100/80">
          {/* Bottom-left: Attach file button or compact file pill */}
          <div className="flex items-center gap-2 overflow-hidden max-w-[480px]">
            {/* Native hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/png,image/jpeg"
              className="hidden"
              id="composer-file-input"
            />

            {!attachedFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex items-center gap-1 text-[11px] font-medium text-charcoal-600 hover:text-forest-800 transition-colors py-0.5 px-1.5 rounded hover:bg-cream-100/60 focus:outline-none focus:ring-1 focus:ring-forest-700/30"
              >
                <Paperclip className="w-3.5 h-3.5 text-forest-700" />
                <span>+ {t.attachButton}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-sage-100/80 text-forest-900 px-2 py-0.5 rounded-full text-[11px] max-w-[280px]">
                <Paperclip className="w-3 h-3 text-forest-700 shrink-0" />
                <span className="truncate max-w-[180px] font-medium" title={attachedFile.name}>
                  {attachedFile.name}
                </span>
                <span className="text-[10px] text-charcoal-500 shrink-0">
                  ({(attachedFile.size / 1024).toFixed(0)} KB)
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  aria-label={t.removeFile}
                  className="p-0.5 hover:bg-sage-200 rounded-full transition-colors text-charcoal-600 hover:text-charcoal-900 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Inline validation error (NO alert) */}
            {inlineError && (
              <div className="flex items-center gap-1 text-[11px] text-terracotta-600 truncate animate-in fade-in duration-150">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span className="truncate">{inlineError}</span>
              </div>
            )}
          </div>

          {/* Bottom-right: Submit button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden sm:inline text-[10px] text-charcoal-400 font-normal select-none">
              {t.submitHint.split('•')[0]}
            </span>
            <button
              type="button"
              id="submit-research-button"
              onClick={handleSubmit}
              disabled={!query.trim() || disabled}
              aria-label={t.submitButtonAria}
              title={`${t.submitButtonAria} (Ctrl+Enter)`}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-forest-700/40 ${
                query.trim() && !disabled
                  ? 'bg-forest-800 hover:bg-forest-900 text-cream-50 shadow-sm hover:scale-105 active:scale-95'
                  : 'bg-cream-100 text-charcoal-400 cursor-not-allowed'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
