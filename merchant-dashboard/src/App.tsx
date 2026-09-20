import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CreditCard, CheckCircle2, TrendingUp, AlertTriangle, 
  MessageSquare, RefreshCw, Key, ShieldCheck, Zap, Settings, BarChart2, Layers, Sun, Moon,
  Copy, Check, ChevronRight, Monitor, Store, LifeBuoy, Mail
} from 'lucide-react';
import { PotvrdioLogo } from './components/PotvrdioLogo';
import { translations, Language } from './i18n';

type Theme = 'dark' | 'light';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'settings'>('overview');
  const [credits, setCredits] = useState(1875);
  const [, setBalance] = useState(45.00);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [activeStepHighlight, setActiveStepHighlight] = useState<number | null>(null);

  const toggleStepHighlight = (stepNum: number) => {
    setActiveStepHighlight(prev => (prev === stepNum ? null : stepNum));
  };

  const [selectedLang, setSelectedLang] = useState<Language>(() => {
    const saved = localStorage.getItem('potvrdio_lang') as Language | null;
    return saved && ['sr', 'mk', 'en'].includes(saved) ? saved : 'sr';
  });

  useEffect(() => {
    localStorage.setItem('potvrdio_lang', selectedLang);
  }, [selectedLang]);

  const t = translations[selectedLang];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
    }, 1200);
  };

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('potvrdio_theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('potvrdio_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleBuyCredit = (planId: string, cost: number, count: number) => {
    setPurchasing(planId);
    setTimeout(() => {
      setCredits(prev => prev + count);
      setBalance(prev => prev + cost);
      setPurchasing(null);
      alert(t.successTopupAlert(count, cost));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-canvas text-theme-secondary font-sans transition-colors duration-200 flex">
      {/* Sidebar Navigation: w-72 with strict left-alignment and zero wrapping */}
      <aside className="w-72 bg-surface border-r border-theme min-h-screen p-5 flex flex-col justify-between hidden md:flex transition-colors shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="px-2 text-left">
            <PotvrdioLogo variant="horizontal" mode={theme} />
            <span className="block text-[10px] text-theme-muted font-medium tracking-wide mt-1 pl-10.5 text-left">MERCHANT DASHBOARD</span>
          </div>

          <nav className="space-y-1.5 pt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-start text-left gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 shadow-xs' : 'text-theme-muted hover:bg-surface-subtle hover:text-theme-primary'
              }`}
            >
              <BarChart2 className="w-4 h-4 shrink-0 text-left" />
              <span className="truncate text-left">{t.navOverview}</span>
            </button>

            <button
              onClick={() => setActiveTab('credits')}
              className={`w-full flex items-center justify-start text-left gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'credits' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 shadow-xs' : 'text-theme-muted hover:bg-surface-subtle hover:text-theme-primary'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0 text-left" />
              <span className="truncate text-left">{t.navCredits}</span>
              <span className="ml-auto bg-teal-500/15 text-teal-600 dark:text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30 shrink-0">
                {credits}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-start text-left gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 shadow-xs' : 'text-theme-muted hover:bg-surface-subtle hover:text-theme-primary'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0 text-left" />
              <span className="truncate text-left">{t.navSettings}</span>
            </button>
          </nav>
        </div>

        {/* Support & Helpdesk Card */}
        <div className="glass-panel rounded-2xl p-3.5 border border-theme space-y-2 text-left">
          <div className="flex items-center gap-1.5 text-xs text-theme-muted font-medium">
            <LifeBuoy className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t.supportTitle}</span>
          </div>

          <a 
            href="mailto:support@potvrdio.online" 
            className="flex items-center gap-2 text-xs font-bold text-theme-primary hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
          >
            <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="truncate">support@potvrdio.online</span>
          </a>

          <div className="text-[10px] text-theme-muted leading-relaxed">
            {t.supportDesc}
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Streamlined Store Banner Header */}
        <header className="sticky top-0 z-20 bg-surface/98 backdrop-blur-lg shadow-xs border-b border-theme px-6 md:px-8 h-16 flex items-center transition-colors">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Store Information & Language Code */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold shrink-0 shadow-xs">
                <Store className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm md:text-base font-bold text-theme-primary tracking-tight truncate">
                    {t.storeName}
                  </h1>
                  {/* Language Code Badge */}
                  <span className="text-[11px] font-mono font-bold bg-surface-subtle text-teal-600 dark:text-teal-400 border border-theme px-2 py-0.5 rounded-md shrink-0 shadow-xs">
                    {t.langCode}
                  </span>
                  {/* WooCommerce Connected Status */}
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    {t.connected}
                  </span>
                </div>
                <div className="text-[11px] text-theme-muted font-mono truncate">
                  {t.storeDomain}
                </div>
              </div>
            </div>

            {/* Streamlined Action Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Language Switcher */}
              <div className="flex items-center bg-surface-subtle border border-theme rounded-xl p-1 text-xs font-semibold shadow-xs">
                {(['sr', 'mk', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                      selectedLang === lang
                        ? 'bg-teal-600 text-white font-bold shadow-xs'
                        : 'text-theme-muted hover:text-theme-primary'
                    }`}
                    title={lang === 'sr' ? 'Srbija (sr-RS)' : lang === 'mk' ? 'Северна Македонија (mk-MK)' : 'International (en-US)'}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Quick Credit Top-up Pill */}
              <button 
                onClick={() => setActiveTab('credits')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-subtle hover:bg-surface border border-theme hover:border-teal-500/40 text-theme-primary font-bold text-xs transition-all cursor-pointer shadow-xs"
                title={t.topUpCredits}
              >
                <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse shrink-0" />
                <span>{credits}</span>
                <span className="text-theme-muted text-[11px] font-normal hidden md:inline">{t.remaining}</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-surface-subtle hover:bg-surface border border-theme text-theme-secondary hover:text-theme-primary transition-all cursor-pointer flex items-center justify-center shadow-xs"
                title={theme === 'dark' ? t.themeLightTitle : t.themeDarkTitle}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>{t.statConfirmedTitle}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary">412 <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{t.statConfirmedBadge}</span></div>
                  <div className="text-[11px] text-theme-muted">{t.statConfirmedSub}</div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>{t.statDeliveryTitle}</span>
                    <TrendingUp className="w-4 h-4 text-teal-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary">96.4%</div>
                  <div className="text-[11px] text-theme-muted">{t.statDeliverySub}</div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>{t.statSavedTitle}</span>
                    <Layers className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary">€1,240</div>
                  <div className="text-[11px] text-theme-muted">{t.statSavedSub}</div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>{t.statViberTitle}</span>
                    <MessageSquare className="w-4 h-4 text-pink-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary">93.8%</div>
                  <div className="text-[11px] text-theme-muted">{t.statViberSub}</div>
                </div>
              </div>

              {/* Logs Table Section */}
              <div className="glass-panel rounded-2xl p-6 border border-theme space-y-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-theme-primary">{t.tableTitle}</h3>
                    <p className="text-xs text-theme-muted">{t.tableSubtitle}</p>
                  </div>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full">
                    {t.tableBadge}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-theme-secondary">
                    <thead className="bg-surface-subtle text-theme-muted uppercase tracking-wider text-[10px] border-b border-theme">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">{t.colOrder}</th>
                        <th className="py-3 px-4">{t.colCustomer}</th>
                        <th className="py-3 px-4">{t.colCity}</th>
                        <th className="py-3 px-4">{t.colAmount}</th>
                        <th className="py-3 px-4">{t.colStatus}</th>
                        <th className="py-3 px-4 rounded-r-xl">{t.colTime}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme">
                      {t.logs.map((log, index) => (
                        <tr key={index} className="hover:bg-surface-subtle/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-theme-primary font-mono">{log.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-theme-primary">{log.customer}</div>
                            <div className="text-[10px] text-theme-muted font-mono">{log.phone}</div>
                          </td>
                          <td className="py-3.5 px-4 text-theme-secondary">{log.city}</td>
                          <td className="py-3.5 px-4 font-bold text-teal-600 dark:text-teal-400 font-mono">{log.amount}</td>
                          <td className="py-3.5 px-4">
                            {log.status === 'APPROVED' && (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                                <CheckCircle2 className="w-3 h-3" /> {t.statusApproved} ({log.channel})
                              </span>
                            )}
                            {log.status === 'EDITED_ADDRESS' && (
                              <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-semibold">
                                <Sparkles className="w-3 h-3" /> {t.statusAddressEdited}
                              </span>
                            )}
                            {log.status === 'SMS_FALLBACK' && (
                              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-semibold">
                                <AlertTriangle className="w-3 h-3" /> {t.statusSmsFallback}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-theme-muted">{log.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREDIT PACKAGES & MOR BILLING */}
          {activeTab === 'credits' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-theme-primary">{t.creditsHeading}</h2>
                <p className="text-xs text-theme-muted mt-1">{t.creditsSubheading}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Starter Package */}
                <div className="glass-panel rounded-2xl p-6 border border-theme flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-card">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-theme-muted uppercase tracking-wider">{t.starterTitle}</div>
                    <div className="text-3xl font-black text-theme-primary">€15</div>
                    <div className="text-sm font-bold text-teal-600 dark:text-teal-400">{t.starterCredits}</div>
                    <p className="text-xs text-theme-muted leading-relaxed">{t.starterDesc}</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('starter', 15, 600)}
                    disabled={purchasing === 'starter'}
                    className="btn-select-wave w-full mt-6 bg-surface hover:bg-surface-subtle border border-theme text-theme-primary font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                  >
                    {purchasing === 'starter' ? t.loadingText : t.starterBtn}
                  </button>
                </div>

                {/* Growth Package */}
                <div className="glass-panel rounded-2xl p-6 border-2 border-teal-500/60 bg-teal-500/5 flex flex-col justify-between relative shadow-xl shadow-teal-500/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm">
                    {t.growthBadge}
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold text-teal-600 dark:text-teal-300 uppercase tracking-wider">{t.growthTitle}</div>
                    <div className="text-3xl font-black text-theme-primary">€45</div>
                    <div className="text-sm font-bold text-teal-600 dark:text-teal-400">{t.growthCredits}</div>
                    <p className="text-xs text-theme-muted leading-relaxed">{t.growthDesc}</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('growth', 45, 1875)}
                    disabled={purchasing === 'growth'}
                    className="btn-brand-cta w-full mt-6 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg cursor-pointer"
                  >
                    {purchasing === 'growth' ? t.loadingText : t.growthBtn}
                  </button>
                </div>

                {/* Pro Package */}
                <div className="glass-panel rounded-2xl p-6 border border-theme flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-card">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-theme-muted uppercase tracking-wider">{t.proTitle}</div>
                    <div className="text-3xl font-black text-theme-primary">€120</div>
                    <div className="text-sm font-bold text-teal-600 dark:text-teal-400">{t.proCredits}</div>
                    <p className="text-xs text-theme-muted leading-relaxed">{t.proDesc}</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('pro', 120, 6000)}
                    disabled={purchasing === 'pro'}
                    className="btn-select-wave w-full mt-6 bg-surface hover:bg-surface-subtle border border-theme text-theme-primary font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                  >
                    {purchasing === 'pro' ? t.loadingText : t.proBtn}
                  </button>
                </div>

                {/* Pro Reserve Subscription */}
                <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between relative shadow-card">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t.reserveTitle}</div>
                    <div className="text-3xl font-black text-theme-primary">€29 <span className="text-xs text-theme-muted font-normal">{t.reservePerMonth}</span></div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t.reserveCredits}</div>
                    <p className="text-xs text-theme-muted leading-relaxed">{t.reserveDesc}</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('reserve', 29, 1800)}
                    disabled={purchasing === 'reserve'}
                    className="btn-brand-cta w-full mt-6 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg cursor-pointer"
                  >
                    {purchasing === 'reserve' ? t.loadingText : t.reserveBtn}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & VISUAL WORDPRESS API KEY GUIDE */}
          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-5xl">
              {/* Header */}
              <div>
                <h2 className="text-xl font-bold text-theme-primary flex items-center gap-2">
                  <Key className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  {t.settingsHeading}
                </h2>
                <p className="text-xs text-theme-muted mt-1">
                  {t.settingsSubheading}
                </p>
              </div>

              {/* Grid: Left Column = API Keys with Copy Buttons | Right Column = Live Connection Test */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* API Keys Card (2 cols) */}
                <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-theme space-y-5 shadow-card">
                  <div className="flex items-center justify-between pb-3 border-b border-theme">
                    <div>
                      <h3 className="text-sm font-bold text-theme-primary">{t.credentialsTitle}</h3>
                      <p className="text-[11px] text-theme-muted">{t.credentialsSub}</p>
                    </div>
                    <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 px-2.5 py-1 rounded-full font-bold">
                      {t.shaSecurity}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Endpoint */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-theme-secondary flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-surface-subtle text-teal-600 dark:text-teal-400 text-[10px] font-bold flex items-center justify-center border border-theme">1</span>
                          {t.labelEndpoint}
                        </label>
                        {copiedField === 'endpoint' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> {t.copiedBtn}
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          readOnly
                          value="https://api.potvrdio.online/api/v1"
                          className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 pr-24 text-xs text-teal-600 dark:text-teal-400 font-mono select-all focus:outline-none focus:border-teal-500"
                        />
                        <button
                          onClick={() => handleCopy('https://api.potvrdio.online/api/v1', 'endpoint')}
                          className="absolute right-2 px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-600 dark:text-teal-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-teal-500/20"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{t.copyBtn}</span>
                        </button>
                      </div>
                    </div>

                    {/* API Key */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-theme-secondary flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-surface-subtle text-teal-600 dark:text-teal-400 text-[10px] font-bold flex items-center justify-center border border-theme">2</span>
                          {t.labelApiKey}
                        </label>
                        {copiedField === 'key' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> {t.copiedBtn}
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          readOnly
                          value="demo_api_key_123"
                          className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 pr-24 text-xs text-theme-primary font-mono select-all font-bold focus:outline-none focus:border-teal-500"
                        />
                        <button
                          onClick={() => handleCopy('demo_api_key_123', 'key')}
                          className="absolute right-2 px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-600 dark:text-teal-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-teal-500/20"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{t.copyBtn}</span>
                        </button>
                      </div>
                    </div>

                    {/* API Secret */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-theme-secondary flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-surface-subtle text-teal-600 dark:text-teal-400 text-[10px] font-bold flex items-center justify-center border border-theme">3</span>
                          {t.labelApiSecret}
                        </label>
                        {copiedField === 'secret' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> {t.copiedBtn}
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          readOnly
                          value="sec_potvrdio_89237498237482347"
                          className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 pr-24 text-xs text-theme-secondary font-mono select-all focus:outline-none focus:border-teal-500"
                        />
                        <button
                          onClick={() => handleCopy('sec_potvrdio_89237498237482347', 'secret')}
                          className="absolute right-2 px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-600 dark:text-teal-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-teal-500/20"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{t.copyBtn}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Status & Live Test (1 col) */}
                <div className="glass-panel rounded-2xl p-6 border border-theme flex flex-col justify-between space-y-4 shadow-card">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-theme-muted font-semibold uppercase tracking-wider">{t.connStatusTitle}</span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {t.connStatusActive}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-subtle border border-theme space-y-2 text-xs">
                      <div className="flex items-center justify-between text-theme-muted">
                        <span>{t.connStoreLabel}</span>
                        <span className="text-theme-primary font-semibold">{t.storeDomain}</span>
                      </div>
                      <div className="flex items-center justify-between text-theme-muted">
                        <span>{t.connWooLabel}</span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold font-mono">v9.2.1 (HPOS)</span>
                      </div>
                      <div className="flex items-center justify-between text-theme-muted">
                        <span>{t.connPingLabel}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">24ms (OK)</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-theme-muted leading-relaxed">
                      {t.connTestPrompt}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={handleTestConnection}
                      disabled={testStatus === 'testing'}
                      className="w-full py-2.5 px-4 rounded-xl bg-surface-subtle hover:bg-surface border border-theme text-theme-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      {testStatus === 'testing' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
                          <span>{t.connTestingBtn}</span>
                        </>
                      ) : testStatus === 'success' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400">{t.connSuccessBtn}</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>{t.connDefaultBtn}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* VISUAL WORDPRESS ADMIN SIMULATOR & WALKTHROUGH */}
              <div className="glass-panel rounded-2xl border border-theme overflow-hidden shadow-card">
                {/* Visual Guide Header & Method Switcher */}
                <div className="bg-surface-subtle p-4 sm:p-5 border-b border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <div>
                      <h3 className="text-sm font-bold text-theme-primary">{t.guideTitle}</h3>
                      <p className="text-[11px] text-theme-muted">{t.guideSubtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Potvrdio Plugin Settings Page Walkthrough */}
                <div className="p-5 sm:p-6 space-y-6">
                  {/* Step-by-Step 3-Column Instruction Cards (Clickable) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Step 1 Card */}
                    <button
                      type="button"
                      onClick={() => toggleStepHighlight(1)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative group ${
                        activeStepHighlight === 1
                          ? 'bg-teal-500/15 border-teal-500 ring-2 ring-teal-500/40 shadow-lg scale-[1.02]'
                          : 'bg-surface-subtle border-theme hover:border-teal-500/50 hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                          activeStepHighlight === 1
                            ? 'bg-teal-500 text-white ring-4 ring-teal-300 animate-pulse shadow'
                            : 'bg-teal-500/20 text-teal-600 dark:text-teal-400 group-hover:scale-110'
                        }`}>
                          1
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                          activeStepHighlight === 1
                            ? 'bg-teal-500 text-white animate-pulse'
                            : 'bg-surface border border-theme text-theme-muted group-hover:text-theme-primary'
                        }`}>
                          {activeStepHighlight === 1 ? t.stepActiveBadge : t.clickToLocate}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-theme-primary">{t.step1Title}</h5>
                      <p className="text-[11px] text-theme-secondary leading-relaxed">
                        {t.step1Desc}
                      </p>
                    </button>

                    {/* Step 2 Card */}
                    <button
                      type="button"
                      onClick={() => toggleStepHighlight(2)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative group ${
                        activeStepHighlight === 2
                          ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg scale-[1.02]'
                          : 'bg-surface-subtle border-theme hover:border-emerald-500/50 hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                          activeStepHighlight === 2
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 animate-pulse shadow'
                            : 'bg-teal-500/20 text-teal-600 dark:text-teal-400 group-hover:scale-110'
                        }`}>
                          2
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                          activeStepHighlight === 2
                            ? 'bg-emerald-500 text-white animate-pulse'
                            : 'bg-surface border border-theme text-theme-muted group-hover:text-theme-primary'
                        }`}>
                          {activeStepHighlight === 2 ? t.stepActiveBadge : t.clickToLocate}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-theme-primary">{t.step2Title}</h5>
                      <p className="text-[11px] text-theme-secondary leading-relaxed">
                        {t.step2Desc}
                      </p>
                    </button>

                    {/* Step 3 Card */}
                    <button
                      type="button"
                      onClick={() => toggleStepHighlight(3)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative group ${
                        activeStepHighlight === 3
                          ? 'bg-blue-500/15 border-blue-500 ring-2 ring-blue-500/40 shadow-lg scale-[1.02]'
                          : 'bg-surface-subtle border-theme hover:border-blue-500/50 hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                          activeStepHighlight === 3
                            ? 'bg-blue-600 text-white ring-4 ring-blue-300 animate-pulse shadow'
                            : 'bg-teal-500/20 text-teal-600 dark:text-teal-400 group-hover:scale-110'
                        }`}>
                          3
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                          activeStepHighlight === 3
                            ? 'bg-blue-600 text-white animate-pulse'
                            : 'bg-surface border border-theme text-theme-muted group-hover:text-theme-primary'
                        }`}>
                          {activeStepHighlight === 3 ? t.stepActiveBadge : t.clickToLocate}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-theme-primary">{t.step3Title}</h5>
                      <p className="text-[11px] text-theme-secondary leading-relaxed">
                        {t.step3Desc}
                      </p>
                    </button>
                  </div>

                  {/* Breadcrumbs Banner */}
                  <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300 flex flex-wrap items-center gap-2">
                    <span className="font-bold uppercase text-[10px] tracking-wider bg-teal-500/20 px-2 py-0.5 rounded">Putanja / Мену / Path:</span>
                    <span className="font-semibold text-theme-primary">WordPress Admin</span>
                    <ChevronRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="font-semibold text-theme-primary">Settings</span>
                    <ChevronRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="font-bold text-teal-700 dark:text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded">Potvrdio Viber COD</span>
                  </div>

                  {/* Realistic WordPress UI Mockup */}
                  <div className="rounded-xl border border-slate-700/80 light:border-slate-300 overflow-hidden bg-[#1E1E1E] text-slate-200 text-xs shadow-2xl font-sans">
                    {/* WP Top Bar Mockup */}
                    <div className="bg-[#1D2327] text-slate-300 px-4 py-2 border-b border-black flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">W</span>
                          {t.storeName}
                        </span>
                        <span className="text-slate-500 hidden sm:inline">|</span>
                        <span className="text-slate-400 hidden sm:inline">Comments (0)</span>
                        <span className="text-slate-400 hidden sm:inline">+ New</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">admin</span>
                    </div>

                    {/* WP Split Layout: Sidebar + Main Content */}
                    <div className="flex flex-col md:flex-row min-h-[380px]">
                      {/* WP Sidebar Mockup */}
                      <div className="w-full md:w-56 bg-[#1D2327] text-slate-300 p-2 text-xs border-r border-slate-800 shrink-0 space-y-0.5">
                        <div className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-2">
                          <BarChart2 className="w-3.5 h-3.5" /> Dashboard
                        </div>
                        <div className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5" /> Posts
                        </div>
                        <div className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5" /> WooCommerce
                        </div>
                        <div className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5" /> Products
                        </div>
                        <div className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-2">
                          <Key className="w-3.5 h-3.5" /> Plugins
                        </div>
                        
                        {/* HIGHLIGHTED SETTINGS MENU */}
                        <div className="bg-[#2271B1] text-white rounded-t font-semibold px-3 py-2 flex items-center gap-2 shadow-sm">
                          <Settings className="w-3.5 h-3.5" /> Settings
                        </div>
                        <div className="bg-[#2C3338] rounded-b py-1 pl-6 pr-2 space-y-1 text-[11px]">
                          <div className="py-1 text-slate-400">General</div>
                          <div className="py-1 text-slate-400">Writing</div>
                          <div className="py-1 text-slate-400">Reading</div>
                          
                          {/* ACTIVE HIGHLIGHTED PLUGIN SUBMENU (STEP 1 TARGET) */}
                          <div className={`py-1.5 px-2 rounded font-extrabold flex items-center justify-between shadow-md transition-all duration-300 ${
                            activeStepHighlight === 1
                              ? 'bg-teal-400 text-black ring-4 ring-teal-300 ring-offset-2 ring-offset-[#1D2327] scale-105 shadow-xl shadow-teal-500/50 animate-pulse'
                              : 'bg-teal-500 text-black animate-pulse'
                          }`}>
                            <span className="flex items-center gap-1.5">
                              {activeStepHighlight === 1 ? (
                                <span className="w-5 h-5 rounded-full bg-black text-teal-300 flex items-center justify-center font-black text-xs shadow-lg animate-bounce shrink-0">
                                  1
                                </span>
                              ) : (
                                <ShieldCheck className="w-3.5 h-3.5" />
                              )}
                              Potvrdio Viber COD
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                              activeStepHighlight === 1 ? 'bg-black text-white animate-pulse' : 'bg-black text-white'
                            }`}>
                              {activeStepHighlight === 1 ? '① CLICK' : 'CLICK'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* WP Main Settings Content Form Mockup */}
                      <div className="flex-1 bg-[#F0F0F1] text-slate-800 p-5 sm:p-7 space-y-4">
                        <div className="border-b border-slate-300 pb-3">
                          <h4 className="text-base font-bold text-[#1D2327]">Potvrdio - Viber COD & Cart Recovery Settings</h4>
                          <p className="text-[11px] text-slate-600 mt-0.5">{t.storeSubtitle}</p>
                        </div>

                        {/* STEP 2 TARGET: Form Inputs Container */}
                        <div className={`space-y-4 bg-white p-5 rounded-lg border shadow-sm max-w-xl transition-all duration-300 relative ${
                          activeStepHighlight === 2
                            ? 'border-2 border-emerald-500 ring-4 ring-emerald-400 ring-offset-4 ring-offset-[#F0F0F1] shadow-2xl shadow-emerald-500/30'
                            : 'border-slate-300'
                        }`}>
                          {activeStepHighlight === 2 && (
                            <div className="absolute -top-3.5 right-4 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-xl flex items-center gap-1.5 animate-bounce z-10 border-2 border-white">
                              <span className="w-4 h-4 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[10px] font-black">2</span>
                              <span>{t.step2Title}</span>
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-bold text-[#1D2327] mb-1">
                              {t.labelEndpoint}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                value="https://api.potvrdio.online/api/v1"
                                className={`w-full rounded px-3 py-1.5 text-xs font-mono transition-all ${
                                  activeStepHighlight === 2
                                    ? 'border-2 border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300/60 text-slate-900 font-bold'
                                    : 'bg-[#F6F7F7] border border-[#8C8F94] text-slate-700'
                                }`}
                              />
                              <span className={`text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                                activeStepHighlight === 2
                                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-lg animate-pulse font-black scale-105'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {activeStepHighlight === 2 && (
                                  <span className="w-3.5 h-3.5 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[9px] font-black animate-bounce">2</span>
                                )}
                                {t.pasteHereBadge}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1D2327] mb-1">
                              {t.labelApiKey}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                value="demo_api_key_123"
                                className={`w-full rounded px-3 py-1.5 text-xs font-mono transition-all ${
                                  activeStepHighlight === 2
                                    ? 'border-2 border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300/60 text-slate-900 font-bold'
                                    : 'bg-[#F6F7F7] border border-[#8C8F94] text-slate-700'
                                }`}
                              />
                              <span className={`text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                                activeStepHighlight === 2
                                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-lg animate-pulse font-black scale-105'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {activeStepHighlight === 2 && (
                                  <span className="w-3.5 h-3.5 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[9px] font-black animate-bounce">2</span>
                                )}
                                {t.pasteHereBadge}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1D2327] mb-1">
                              {t.labelApiSecret}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="password"
                                readOnly
                                value="••••••••••••••••••••••••"
                                className={`w-full rounded px-3 py-1.5 text-xs font-mono transition-all ${
                                  activeStepHighlight === 2
                                    ? 'border-2 border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300/60 text-slate-900 font-bold'
                                    : 'bg-[#F6F7F7] border border-[#8C8F94] text-slate-700'
                                }`}
                              />
                              <span className={`text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                                activeStepHighlight === 2
                                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-lg animate-pulse font-black scale-105'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {activeStepHighlight === 2 && (
                                  <span className="w-3.5 h-3.5 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[9px] font-black animate-bounce">2</span>
                                )}
                                {t.pasteHereBadge}
                              </span>
                            </div>
                          </div>

                          {/* STEP 3 TARGET: Save Changes Button */}
                          <div className="pt-2 flex items-center gap-3">
                            <div className={`inline-flex items-center gap-2 bg-[#2271B1] text-white px-4 py-2 rounded font-bold text-xs shadow hover:bg-[#135E96] transition-all cursor-pointer relative ${
                              activeStepHighlight === 3
                                ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-white scale-110 shadow-2xl shadow-amber-500/40 animate-pulse bg-blue-700'
                                : ''
                            }`}>
                              {activeStepHighlight === 3 && (
                                <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-black animate-bounce shadow">
                                  3
                                </span>
                              )}
                              <span>{t.saveChangesBtn}</span>
                              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-normal">{t.finalStepBadge}</span>
                            </div>
                            {activeStepHighlight === 3 && (
                              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-200 border border-amber-400 px-3 py-1.5 rounded-full animate-bounce shadow-md">
                                <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">3</span>
                                <span>{t.step3Title}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
