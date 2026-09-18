import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CreditCard, CheckCircle2, TrendingUp, AlertTriangle, 
  MessageSquare, RefreshCw, Key, ShieldCheck, Zap, Settings, BarChart2, Layers, Sun, Moon,
  Copy, Check, ExternalLink, ChevronRight, Monitor, ArrowRight, HelpCircle, Info,
  Store, Globe
} from 'lucide-react';
import { PotvrdioLogo } from './components/PotvrdioLogo';

type Theme = 'dark' | 'light';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'settings'>('overview');
  const [credits, setCredits] = useState(1875);
  const [balance, setBalance] = useState(45.00);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'plugin_settings' | 'wc_rest_api'>('plugin_settings');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [selectedLang, setSelectedLang] = useState<'sr' | 'mk' | 'en'>('sr');

  const currentLangCode = selectedLang === 'sr' ? 'sr-RS' : selectedLang === 'mk' ? 'mk-MK' : 'en-US';

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
      alert(`[PADDLE / LEMON SQUEEZY] Uspešno ste dopunili ${count} kredita za €${cost}!`);
    }, 1000);
  };

  const logs = [
    { id: '#7482', customer: 'Nikola Petrović', phone: '+381 64 123 ****', status: 'APPROVED', channel: 'Viber', city: 'Beograd', amount: '4.850 RSD', time: 'Pre 4 min' },
    { id: '#7481', customer: 'Milica Jovanović', phone: '+381 63 987 ****', status: 'EDITED_ADDRESS', channel: 'potvrdio.online', city: 'Novi Sad', amount: '8.200 RSD', time: 'Pre 18 min' },
    { id: '#7480', customer: 'Stefan Ilić', phone: '+381 61 456 ****', status: 'APPROVED', channel: 'Viber', city: 'Niš', amount: '3.100 RSD', time: 'Pre 42 min' },
    { id: '#7479', customer: 'Jelena Stojanović', phone: '+387 65 321 ****', status: 'SMS_FALLBACK', channel: 'SMS Fallback', city: 'Banja Luka', amount: '6.400 RSD', time: 'Pre 1h 12m' },
    { id: '#7478', customer: 'Marko Đorđević', phone: '+381 62 888 ****', status: 'APPROVED', channel: 'Viber', city: 'Kragujevac', amount: '5.900 RSD', time: 'Pre 2h 05m' },
  ];

  return (
    <div className="min-h-screen bg-canvas text-theme-secondary font-sans transition-colors duration-200 flex">
      {/* Sidebar Navigation - w-72 for generous breathability and strict left alignment */}
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
              <span className="truncate text-left">Pregled & Analitika</span>
            </button>

            <button
              onClick={() => setActiveTab('credits')}
              className={`w-full flex items-center justify-start text-left gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'credits' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 shadow-xs' : 'text-theme-muted hover:bg-surface-subtle hover:text-theme-primary'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0 text-left" />
              <span className="truncate text-left">Krediti & Dopuna</span>
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
              <span className="truncate text-left">WooCommerce API Key</span>
            </button>
          </nav>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-theme space-y-3 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="text-theme-muted">MoR Model Plaćanja</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Paddle Active
            </span>
          </div>
          <div className="text-xs text-theme-secondary font-medium text-left">
            100% legalna MoR infrastruktura bez poreza i administrativnih tereta.
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* STORE BANNER HEADER (Positioned as full-width top dashboard header with language code) */}
        <header className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md border-b border-theme px-6 md:px-8 py-4 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Store Information Banner */}
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold shrink-0 shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg md:text-xl font-bold text-theme-primary tracking-tight">
                    Balkan Style Shop
                  </h1>
                  {/* Language Code Badge */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-surface-subtle text-theme-primary border border-theme px-2 py-0.5 rounded-md shadow-xs" title="Jezik i tržište prodavnice">
                    <Globe className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                    {currentLangCode}
                  </span>
                  {/* WooCommerce Connected Status */}
                  <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    WooCommerce Connected
                  </span>
                </div>
                <p className="text-xs text-theme-muted mt-0.5 flex flex-wrap items-center gap-2 text-left">
                  <span className="font-mono text-teal-600 dark:text-teal-400 font-medium">balkanshop.rs</span>
                  <span>·</span>
                  <span>Sprečite COD troškove i povećajte dostavu paketa na 98%+</span>
                </p>
              </div>
            </div>

            {/* Action Controls: Language Switcher, Theme Switcher, Credit Pool, Main CTA */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Language Code Switcher */}
              <div className="flex items-center bg-surface-subtle border border-theme rounded-xl p-1 text-xs font-semibold shadow-xs">
                <button
                  onClick={() => setSelectedLang('sr')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedLang === 'sr'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-theme-muted hover:text-theme-primary'
                  }`}
                  title="Srbija (sr-RS)"
                >
                  SR
                </button>
                <button
                  onClick={() => setSelectedLang('mk')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedLang === 'mk'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-theme-muted hover:text-theme-primary'
                  }`}
                  title="Severna Makedonija (mk-MK)"
                >
                  MK
                </button>
                <button
                  onClick={() => setSelectedLang('en')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedLang === 'en'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-theme-muted hover:text-theme-primary'
                  }`}
                  title="International (en-US)"
                >
                  EN
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-surface-subtle border border-theme text-theme-secondary hover:text-theme-primary hover:border-theme-emphasis transition-all cursor-pointer flex items-center justify-center shadow-xs"
                title={theme === 'dark' ? 'Prebaci na Svetlu Temu' : 'Prebaci na Tamnu Temu'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              {/* Credit Pool Display */}
              <div className="bg-surface-subtle border border-theme px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xs">
                <Zap className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] text-theme-muted uppercase tracking-wider font-semibold leading-none">Bazen Kredita</div>
                  <div className="text-sm font-bold text-theme-primary leading-tight">{credits} <span className="text-theme-muted text-xs font-normal">Preostalo</span></div>
                </div>
              </div>

              {/* Primary Top-up CTA */}
              <button 
                onClick={() => setActiveTab('credits')}
                className="btn-brand-cta text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <CreditCard className="w-4 h-4" />
                <span>Dopuni Kredite</span>
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
                    <span>Potvrđene COD Porudžbine</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary">412 <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+18% ovog meseca</span></div>
                  <div className="text-[11px] text-theme-muted">Uspešno verifikovano putem Viber-a</div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>Stopa Uspešne Dostave</span>
                    <TrendingUp className="w-4 h-4 text-teal-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary">96.4%</div>
                  <div className="text-[11px] text-theme-muted">Pre Potvrdio: 74% (Kargo povrati spali na 3.6%)</div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>Ušteđeni Kargo Troškovi</span>
                    <Layers className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary">€1,240</div>
                  <div className="text-[11px] text-theme-muted">Sprečene povratne poštarine (Post Express)</div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-colors">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>Viber Otvaranje (Open Rate)</span>
                    <MessageSquare className="w-4 h-4 text-pink-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary">93.8%</div>
                  <div className="text-[11px] text-theme-muted">Prosečno vreme potvrde: 2.4 minuta</div>
                </div>
              </div>

              {/* Logs Table Section */}
              <div className="glass-panel rounded-2xl p-6 border border-theme space-y-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-theme-primary">Poslednje Verifikacije Pošiljki</h3>
                    <p className="text-xs text-theme-muted">Real-time praćenje Viber poruka i potvrdio.online izmena</p>
                  </div>
                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full">
                    Aktivno Praćenje
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-theme-secondary">
                    <thead className="bg-surface-subtle text-theme-muted uppercase tracking-wider text-[10px] border-b border-theme">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">Porudžbina</th>
                        <th className="py-3 px-4">Kupac & Telefon</th>
                        <th className="py-3 px-4">Grad / Mesto</th>
                        <th className="py-3 px-4">Iznos</th>
                        <th className="py-3 px-4">Status & Kanal</th>
                        <th className="py-3 px-4 rounded-r-xl">Vreme</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme">
                      {logs.map((log, index) => (
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
                                <CheckCircle2 className="w-3 h-3" /> Potvrđeno ({log.channel})
                              </span>
                            )}
                            {log.status === 'EDITED_ADDRESS' && (
                              <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-semibold">
                                <Sparkles className="w-3 h-3" /> Izmenjena Adresa
                              </span>
                            )}
                            {log.status === 'SMS_FALLBACK' && (
                              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-semibold">
                                <AlertTriangle className="w-3 h-3" /> SMS Fallback
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
                <h2 className="text-xl font-bold text-theme-primary">Zajednički Bazen Viber Kredita</h2>
                <p className="text-xs text-theme-muted mt-1">Bez mesečne provizije, dopunite samo onoliko kredita koliko vam je potrebno za COD verifikaciju.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Starter Package */}
                <div className="glass-panel rounded-2xl p-6 border border-theme flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-card">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Starter Paket</div>
                    <div className="text-3xl font-black text-theme-primary">€15</div>
                    <div className="text-sm font-bold text-teal-600 dark:text-teal-400">600 Viber Kredita</div>
                    <p className="text-xs text-theme-muted leading-relaxed">€0.025 / poruci. Idealno za manje prodavnice (do 50 porudžbina/mesec).</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('starter', 15, 600)}
                    disabled={purchasing === 'starter'}
                    className="btn-select-wave w-full mt-6 bg-surface hover:bg-surface-subtle border border-theme text-theme-primary font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                  >
                    {purchasing === 'starter' ? 'Učitavanje...' : 'Kupi sa Paddle MoR'}
                  </button>
                </div>

                {/* Growth Package */}
                <div className="glass-panel rounded-2xl p-6 border-2 border-teal-500/60 bg-teal-500/5 flex flex-col justify-between relative shadow-xl shadow-teal-500/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm">
                    NAJPOPULARNIJE
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold text-teal-600 dark:text-teal-300 uppercase tracking-wider">Growth Paket</div>
                    <div className="text-3xl font-black text-theme-primary">€45</div>
                    <div className="text-sm font-bold text-teal-600 dark:text-teal-400">1,875 Viber Kredita</div>
                    <p className="text-xs text-theme-muted leading-relaxed">€0.024 / poruci. Za srednje e-trgovce u Srbiji i regionu.</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('growth', 45, 1875)}
                    disabled={purchasing === 'growth'}
                    className="btn-brand-cta w-full mt-6 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg cursor-pointer"
                  >
                    {purchasing === 'growth' ? 'Učitavanje...' : 'Kupi sa Lemon Squeezy'}
                  </button>
                </div>

                {/* Pro Package */}
                <div className="glass-panel rounded-2xl p-6 border border-theme flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-card">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Pro Paket</div>
                    <div className="text-3xl font-black text-theme-primary">€120</div>
                    <div className="text-sm font-bold text-teal-600 dark:text-teal-400">6,000 Viber Kredita</div>
                    <p className="text-xs text-theme-muted leading-relaxed">€0.020 / poruci. Najniža cena poruke za visoki obim pošiljki.</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('pro', 120, 6000)}
                    disabled={purchasing === 'pro'}
                    className="btn-select-wave w-full mt-6 bg-surface hover:bg-surface-subtle border border-theme text-theme-primary font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                  >
                    {purchasing === 'pro' ? 'Učitavanje...' : 'Kupi sa Paddle MoR'}
                  </button>
                </div>

                {/* Pro Reserve Subscription */}
                <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between relative shadow-card">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Pro Reserve (MRR)</div>
                    <div className="text-3xl font-black text-theme-primary">€29 <span className="text-xs text-theme-muted font-normal">/mesec</span></div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">1,800 Kredita / Mesec</div>
                    <p className="text-xs text-theme-muted leading-relaxed">Automatska mesečna rezervacija garancije sa popustom na poruke.</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('reserve', 29, 1800)}
                    disabled={purchasing === 'reserve'}
                    className="btn-brand-cta w-full mt-6 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg cursor-pointer"
                  >
                    {purchasing === 'reserve' ? 'Učitavanje...' : 'Aktiviraj Pretplatu'}
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
                  WooCommerce API Ključevi & Povezivanje Prodavnice
                </h2>
                <p className="text-xs text-theme-muted mt-1">
                  Uputstvo korak-po-korak: Pogledajte tačno na kojoj stranici u WordPress admin panelu se unose ovi ključevi.
                </p>
              </div>

              {/* Grid: Left Column = API Keys with Copy Buttons | Right Column = Live Connection Test */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* API Keys Card (2 cols) */}
                <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-theme space-y-5 shadow-card">
                  <div className="flex items-center justify-between pb-3 border-b border-theme">
                    <div>
                      <h3 className="text-sm font-bold text-theme-primary">Vaši Kredencijali za Povezivanje</h3>
                      <p className="text-[11px] text-theme-muted">Kliknite na dugme za brzo kopiranje svakog parametra</p>
                    </div>
                    <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 px-2.5 py-1 rounded-full font-bold">
                      SHA-256 Sigurno
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Endpoint */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-theme-secondary flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-surface-subtle text-teal-600 dark:text-teal-400 text-[10px] font-bold flex items-center justify-center border border-theme">1</span>
                          Central Backend API Endpoint
                        </label>
                        {copiedField === 'endpoint' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> Kopirano!
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
                          <span>Kopiraj</span>
                        </button>
                      </div>
                    </div>

                    {/* API Key */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-theme-secondary flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-surface-subtle text-teal-600 dark:text-teal-400 text-[10px] font-bold flex items-center justify-center border border-theme">2</span>
                          API Key (ID Prodavnice / Store ID)
                        </label>
                        {copiedField === 'key' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> Kopirano!
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
                          <span>Kopiraj</span>
                        </button>
                      </div>
                    </div>

                    {/* API Secret */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-theme-secondary flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-surface-subtle text-teal-600 dark:text-teal-400 text-[10px] font-bold flex items-center justify-center border border-theme">3</span>
                          API Secret (HMAC Tajni Ključ)
                        </label>
                        {copiedField === 'secret' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> Kopirano!
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
                          <span>Kopiraj</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Status & Live Test (1 col) */}
                <div className="glass-panel rounded-2xl p-6 border border-theme flex flex-col justify-between space-y-4 shadow-card">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-theme-muted font-semibold uppercase tracking-wider">Status Veze</span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Aktivno
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-subtle border border-theme space-y-2 text-xs">
                      <div className="flex items-center justify-between text-theme-muted">
                        <span>Prodavnica:</span>
                        <span className="text-theme-primary font-semibold">balkanshop.rs</span>
                      </div>
                      <div className="flex items-center justify-between text-theme-muted">
                        <span>WooCommerce:</span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold font-mono">v9.2.1 (HPOS)</span>
                      </div>
                      <div className="flex items-center justify-between text-theme-muted">
                        <span>Webhook Ping:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">24ms (OK)</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-theme-muted leading-relaxed">
                      Nakon unosa ključeva u WordPress, kliknite ispod da testirate dvosmernu komunikaciju.
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
                          <span>Provera veze...</span>
                        </>
                      ) : testStatus === 'success' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400">200 OK · Veza je Ispravna!</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>Testiraj WooCommerce Povezivanje</span>
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
                      <h3 className="text-sm font-bold text-theme-primary">Vizuelni Prikaz: Gde se unosi u WordPress-u?</h3>
                      <p className="text-[11px] text-theme-muted">Pratite označeni meni sa leve strane vaše administratorske table</p>
                    </div>
                  </div>

                  {/* Method Switcher Tabs */}
                  <div className="flex items-center bg-surface p-1 rounded-xl border border-theme text-xs font-semibold">
                    <button
                      onClick={() => setActiveGuideTab('plugin_settings')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeGuideTab === 'plugin_settings'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-theme-muted hover:text-theme-primary'
                      }`}
                    >
                      Metod 1: Potvrdio Eklentija (Preporučeno)
                    </button>
                    <button
                      onClick={() => setActiveGuideTab('wc_rest_api')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeGuideTab === 'wc_rest_api'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-theme-muted hover:text-theme-primary'
                      }`}
                    >
                      Metod 2: WooCommerce REST API
                    </button>
                  </div>
                </div>

                {/* METHOD 1 CONTENT: Potvrdio Plugin Settings Page */}
                {activeGuideTab === 'plugin_settings' && (
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Breadcrumbs Banner */}
                    <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300 flex flex-wrap items-center gap-2">
                      <span className="font-bold uppercase text-[10px] tracking-wider bg-teal-500/20 px-2 py-0.5 rounded">Putanja u meniju:</span>
                      <span className="font-semibold text-theme-primary">WordPress Admin</span>
                      <ChevronRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span className="font-semibold text-theme-primary">Podešavanja (Settings)</span>
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
                            Balkan Style Shop
                          </span>
                          <span className="text-slate-500 hidden sm:inline">|</span>
                          <span className="text-slate-400 hidden sm:inline">Komentari (0)</span>
                          <span className="text-slate-400 hidden sm:inline">+ Novo</span>
                        </div>
                        <span className="text-slate-400 text-[10px]">Pozdrav, admin</span>
                      </div>

                      {/* WP Split Layout: Sidebar + Main Content */}
                      <div className="flex flex-col md:flex-row min-h-[380px]">
                        {/* WP Sidebar Mockup */}
                        <div className="w-full md:w-56 bg-[#1D2327] text-slate-300 p-2 text-xs border-r border-slate-800 shrink-0 space-y-0.5">
                          <div className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-2">
                            <BarChart2 className="w-3.5 h-3.5" /> Kontrolna tabla (Dashboard)
                          </div>
                          <div className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5" /> Objave (Posts)
                          </div>
                          <div className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5" /> WooCommerce
                          </div>
                          <div className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5" /> Proizvodi (Products)
                          </div>
                          <div className="px-3 py-2 text-slate-400 hover:text-white flex items-center gap-2">
                            <Key className="w-3.5 h-3.5" /> Dodaci (Plugins)
                          </div>
                          
                          {/* HIGHLIGHTED SETTINGS MENU */}
                          <div className="bg-[#2271B1] text-white rounded-t font-semibold px-3 py-2 flex items-center gap-2 shadow-sm">
                            <Settings className="w-3.5 h-3.5" /> Podešavanja (Settings)
                          </div>
                          <div className="bg-[#2C3338] rounded-b py-1 pl-6 pr-2 space-y-1 text-[11px]">
                            <div className="py-1 text-slate-400">Opšta (General)</div>
                            <div className="py-1 text-slate-400">Pisanje (Writing)</div>
                            <div className="py-1 text-slate-400">Čitanje (Reading)</div>
                            
                            {/* ACTIVE HIGHLIGHTED PLUGIN SUBMENU */}
                            <div className="py-1.5 px-2 rounded bg-teal-500 text-black font-extrabold flex items-center justify-between shadow-md animate-pulse">
                              <span className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" /> Potvrdio Viber COD
                              </span>
                              <span className="text-[9px] bg-black text-white px-1.5 py-0.2 rounded font-bold">KLIKNI</span>
                            </div>
                          </div>
                        </div>

                        {/* WP Main Settings Content Form Mockup */}
                        <div className="flex-1 bg-[#F0F0F1] text-slate-800 p-5 sm:p-7 space-y-4">
                          <div className="border-b border-slate-300 pb-3">
                            <h4 className="text-base font-bold text-[#1D2327]">Potvrdio - Viber COD & Cart Recovery Settings</h4>
                            <p className="text-[11px] text-slate-600 mt-0.5">WooCommerce motor za sprečavanje povrata paketa i verifikaciju adrese.</p>
                          </div>

                          <div className="space-y-4 bg-white p-5 rounded-lg border border-slate-300 shadow-sm max-w-xl">
                            <div>
                              <label className="block text-xs font-bold text-[#1D2327] mb-1">
                                Central Backend API Endpoint
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  readOnly
                                  value="https://api.potvrdio.online/api/v1"
                                  className="w-full bg-[#F6F7F7] border border-[#8C8F94] rounded px-3 py-1.5 text-xs text-slate-700 font-mono"
                                />
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1 rounded font-bold whitespace-nowrap">
                                  ✓ Nalepiti ovde
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[#1D2327] mb-1">
                                API Key
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  readOnly
                                  value="demo_api_key_123"
                                  className="w-full bg-[#F6F7F7] border border-[#8C8F94] rounded px-3 py-1.5 text-xs text-slate-700 font-mono"
                                />
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1 rounded font-bold whitespace-nowrap">
                                  ✓ Nalepiti ovde
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[#1D2327] mb-1">
                                API Secret
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="password"
                                  readOnly
                                  value="••••••••••••••••••••••••"
                                  className="w-full bg-[#F6F7F7] border border-[#8C8F94] rounded px-3 py-1.5 text-xs text-slate-700 font-mono"
                                />
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1 rounded font-bold whitespace-nowrap">
                                  ✓ Nalepiti ovde
                                </span>
                              </div>
                            </div>

                            <div className="pt-2">
                              <div className="inline-flex items-center gap-2 bg-[#2271B1] text-white px-4 py-2 rounded font-bold text-xs shadow hover:bg-[#135E96] transition cursor-pointer">
                                <span>Sačuvaj izmene (Save Changes)</span>
                                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-normal">Poslednji korak</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step 3-Column Instruction Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-surface-subtle border border-theme space-y-2">
                        <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center justify-center">1</div>
                        <h5 className="font-bold text-xs text-theme-primary">Otvorite Podešavanja</h5>
                        <p className="text-[11px] text-theme-secondary leading-relaxed">
                          Ulogujte se u WordPress admin panel (<code className="text-teal-600 dark:text-teal-300 font-mono">/wp-admin</code>) i kliknite na <strong>Podešavanja</strong> ➔ <strong>Potvrdio Viber COD</strong>.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-surface-subtle border border-theme space-y-2">
                        <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center justify-center">2</div>
                        <h5 className="font-bold text-xs text-theme-primary">Nalepite Ključeve</h5>
                        <p className="text-[11px] text-theme-secondary leading-relaxed">
                          Kopirajte 3 polja sa vrha ovog ekrana i nalepite ih u odgovarajuća polja unutar WordPress forme.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-surface-subtle border border-theme space-y-2">
                        <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center justify-center">3</div>
                        <h5 className="font-bold text-xs text-theme-primary">Sačuvajte i Gotovo!</h5>
                        <p className="text-[11px] text-theme-secondary leading-relaxed">
                          Kliknite na plavo dugme <strong>Sačuvaj izmene</strong>. Vaša prodavnica je odmah zaštićena od lažnih COD porudžbina.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* METHOD 2 CONTENT: WooCommerce REST API Key Generation */}
                {activeGuideTab === 'wc_rest_api' && (
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Breadcrumbs Banner */}
                    <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300 flex flex-wrap items-center gap-2">
                      <span className="font-bold uppercase text-[10px] tracking-wider bg-indigo-500/20 px-2 py-0.5 rounded">Putanja u meniju:</span>
                      <span className="font-semibold text-theme-primary">WooCommerce</span>
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-semibold text-theme-primary">Podešavanja (Settings)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-semibold text-theme-primary">Napredno (Advanced)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded">REST API</span>
                    </div>

                    {/* Visual WooCommerce Tabs Mockup */}
                    <div className="rounded-xl border border-slate-700/80 light:border-slate-300 overflow-hidden bg-[#F0F0F1] text-slate-800 p-5 space-y-4 shadow-lg font-sans">
                      <div className="flex flex-wrap items-center gap-1 border-b border-slate-300 pb-2 text-xs font-semibold text-slate-600">
                        <span className="px-3 py-1.5 text-slate-500">Opšta</span>
                        <span className="px-3 py-1.5 text-slate-500">Proizvodi</span>
                        <span className="px-3 py-1.5 text-slate-500">Dostava</span>
                        <span className="px-3 py-1.5 text-slate-500">Plaćanja</span>
                        <span className="px-3 py-1.5 text-slate-500">Nalozi i privatnost</span>
                        <span className="px-3 py-1.5 bg-[#2271B1] text-white rounded font-bold shadow-sm">Napredno (Advanced)</span>
                      </div>

                      {/* Subtabs Mockup */}
                      <div className="flex items-center gap-3 text-xs text-slate-600 pl-1">
                        <span className="font-bold text-[#1D2327] border-b-2 border-[#2271B1] pb-1">REST API</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500">Webhooks</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500">Nasleđeni API</span>
                      </div>

                      {/* Key Generation Form Mockup */}
                      <div className="bg-white p-5 rounded-lg border border-slate-300 space-y-3 max-w-xl shadow-sm text-xs">
                        <h5 className="font-bold text-sm text-[#1D2327]">Detalji o ključu (Key Details)</h5>
                        
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Opis (Description):</label>
                          <input
                            type="text"
                            readOnly
                            value="Potvrdio Viber COD Gateway"
                            className="w-full bg-[#F6F7F7] border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Dozvole (Permissions):</label>
                          <div className="w-full bg-[#F6F7F7] border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-bold text-emerald-700 flex items-center justify-between">
                            <span>Čitanje / Pisanje (Read / Write)</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Obavezno</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="inline-block bg-[#2271B1] text-white px-4 py-1.5 rounded font-bold text-xs">
                            Generiši API ključ (Generate API Key)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
