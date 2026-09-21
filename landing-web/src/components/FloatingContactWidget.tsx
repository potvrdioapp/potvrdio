import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ArrowUpRight } from 'lucide-react';

interface FloatingContactWidgetProps {
  lang?: 'sr' | 'mk' | 'en';
}

export function FloatingContactWidget({ lang = 'sr' }: FloatingContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const phoneNumber = "+381 61 6036556";
  const rawNumber = "381616036556";

  const texts = {
    sr: {
      title: "Brzi kontakt",
      status: "Dostupni smo na WhatsApp-u i Viber-u.",
    },
    mk: {
      title: "Брз контакт",
      status: "Достапни сме на WhatsApp и Viber.",
    },
    en: {
      title: "Quick Contact",
      status: "We are available on WhatsApp & Viber.",
    },
  }[lang] || {
    title: "Quick Contact",
    status: "We are available on WhatsApp & Viber.",
  };

  // Close on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleViberClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Attempt standard deep link protocol
    window.location.href = `viber://chat?number=%2B${rawNumber}`;
    setIsOpen(false);
  };

  return (
    <div ref={widgetRef} className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-45 flex flex-col items-end pointer-events-auto">
      {/* Expanded Popup Card */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-4 transition-all duration-200">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 inline-block" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
              {texts.title}
            </h4>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5 leading-relaxed">
            {texts.status}
          </p>

          {/* Contact Action Buttons */}
          <div className="space-y-2">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${rawNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 hover:border-emerald-200/80 dark:hover:border-emerald-800/60 transition-all duration-150 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.586 1.761.859 2.796.859 3.179 0 5.766-2.587 5.768-5.766.002-3.181-2.585-5.766-5.768-5.766zm3.364 8.243c-.14.394-.712.723-1.002.766-.279.041-.632.062-1.921-.472-1.649-.684-2.698-2.383-2.78-2.493-.082-.11-.663-.883-.663-1.682 0-.799.418-1.192.567-1.353.149-.161.326-.201.435-.201.109 0 .218.001.314.006.101.005.236-.038.369.281.137.329.467 1.139.508 1.222.041.083.069.179.014.288-.055.11-.082.179-.164.275-.082.096-.173.215-.247.288-.082.082-.168.172-.072.337.096.165.426.703.914 1.138.629.56 1.159.734 1.324.816.165.082.262.069.359-.042.096-.11.413-.481.523-.646.11-.165.22-.138.371-.083.151.055.956.451 1.121.533.165.082.275.124.316.193.041.069.041.401-.099.795z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-white">WhatsApp</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{phoneNumber}</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
            </a>

            {/* Viber */}
            <a
              href={`viber://chat?number=%2B${rawNumber}`}
              onClick={handleViberClick}
              className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-purple-50/70 dark:hover:bg-purple-950/30 hover:border-purple-200/80 dark:hover:border-purple-800/60 transition-all duration-150 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#7360F2] flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19.39 15.68c-.68-.39-1.5-.2-1.89.47l-.54.91c-.24.4-.76.54-1.18.31-1.89-1.04-3.41-2.56-4.45-4.45-.23-.42-.09-.94.31-1.18l.91-.54c.67-.39.86-1.21.47-1.89l-1.64-2.85c-.39-.68-1.21-.86-1.89-.47l-.92.53C7.54 7.07 7.02 8.35 7.27 9.68c.67 3.53 3.52 6.38 7.05 7.05 1.33.25 2.61-.27 3.17-1.24l.53-.92c.39-.68.2-1.5-.47-1.89l-2.16-1zM14 6.5c1.93 0 3.5 1.57 3.5 3.5h1.5c0-2.76-2.24-5-5-5v1.5zm0 3c.83 0 1.5.67 1.5 1.5h1.5c0-1.66-1.34-3-3-3v1.5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 dark:text-white">Viber</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{phoneNumber}</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors shrink-0" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
        className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none ${
          isOpen
            ? "bg-[#1E293B] hover:bg-[#0F172A] text-white shadow-slate-900/30"
            : "bg-[#1A5EB8] hover:bg-[#154E9B] text-white shadow-blue-600/30"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </>
        )}
      </button>
    </div>
  );
}
