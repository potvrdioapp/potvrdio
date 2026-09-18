import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CreditCard, CheckCircle2, TrendingUp, AlertTriangle, 
  MessageSquare, RefreshCw, Key, ShieldCheck, Zap, Settings, BarChart2, Layers, Sun, Moon
} from 'lucide-react';
import { PotvrdioLogo } from './components/PotvrdioLogo';

type Theme = 'dark' | 'light';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'settings'>('overview');
  const [credits, setCredits] = useState(1875);
  const [balance, setBalance] = useState(45.00);
  const [purchasing, setPurchasing] = useState<string | null>(null);

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
    <div className="min-h-screen bg-[#0B0F19] light:bg-[#F8FAFC] text-slate-100 light:text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      {/* Sidebar Navigation */}
      <div className="flex">
        <aside className="w-64 bg-[#111827] light:bg-white border-r border-slate-800/80 light:border-slate-200 min-h-screen p-5 flex flex-col justify-between hidden md:flex transition-colors">
          <div className="space-y-6">
            <div className="px-2">
              <PotvrdioLogo variant="horizontal" mode={theme} />
              <span className="block text-[10px] text-slate-400 light:text-slate-500 font-medium tracking-wide mt-1 pl-10.5">MERCHANT DASHBOARD</span>
            </div>

            <nav className="space-y-1.5 pt-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'overview' ? 'bg-teal-500/10 text-teal-300 light:text-teal-700 border border-teal-500/30' : 'text-slate-400 light:text-slate-600 hover:bg-slate-800/50 light:hover:bg-slate-100 hover:text-slate-200 light:hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Pregled & Analitika</span>
              </button>

              <button
                onClick={() => setActiveTab('credits')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'credits' ? 'bg-teal-500/10 text-teal-300 light:text-teal-700 border border-teal-500/30' : 'text-slate-400 light:text-slate-600 hover:bg-slate-800/50 light:hover:bg-slate-100 hover:text-slate-200 light:hover:text-slate-900'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Krediti & Dopuna</span>
                <span className="ml-auto bg-teal-500/20 text-teal-300 light:text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                  {credits}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'settings' ? 'bg-teal-500/10 text-teal-300 light:text-teal-700 border border-teal-500/30' : 'text-slate-400 light:text-slate-600 hover:bg-slate-800/50 light:hover:bg-slate-100 hover:text-slate-200 light:hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>WooCommerce API Key</span>
              </button>
            </nav>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-teal-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 light:text-slate-500">MoR Model Plaćanja</span>
              <span className="text-emerald-400 light:text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Paddle Active
              </span>
            </div>
            <div className="text-xs text-slate-300 light:text-slate-600 font-medium">
              100% legalna MoR infrastruktura bez poreza i administrativnih tereta.
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl">
          {/* Top Bar Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d121f] light:bg-white p-5 rounded-2xl border border-slate-800 light:border-slate-200 shadow-sm transition-colors">
            <div>
              <h1 className="text-2xl font-bold text-white light:text-slate-900 flex items-center gap-2">
                Balkan Style Shop (Srbija)
                <span className="text-xs bg-emerald-500/10 text-emerald-400 light:text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">WooCommerce Connected</span>
              </h1>
              <p className="text-xs text-slate-400 light:text-slate-500 mt-1">Sprečite COD ištetu i povećajte dostavu paketa na 98%+</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-700/80 light:border-slate-200 text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 transition-all cursor-pointer flex items-center justify-center"
                title={theme === 'dark' ? 'Prebaci na Svetlu Temu' : 'Prebaci na Tamnu Temu'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              <div className="bg-slate-900 light:bg-slate-50 border border-slate-700/80 light:border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3">
                <Zap className="w-4 h-4 text-teal-400 light:text-teal-600 animate-pulse" />
                <div>
                  <div className="text-[10px] text-slate-400 light:text-slate-500 uppercase tracking-wider font-semibold">Bazen Kredita</div>
                  <div className="text-sm font-bold text-white light:text-slate-900">{credits} <span className="text-slate-400 light:text-slate-500 text-xs">Preostalo</span></div>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('credits')}
                className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Dopuni Kredite</span>
              </button>
            </div>
          </header>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Potvrđene COD Porudžbine</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">412 <span className="text-xs text-emerald-400 font-semibold">+18% ovog meseca</span></div>
                  <div className="text-[11px] text-slate-400">Uspešno verifikovano putem Viber-a</div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Stopa Uspešne Dostave</span>
                    <TrendingUp className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">96.4%</div>
                  <div className="text-[11px] text-slate-400">Pre Potvrdio: 74% (Kargo povrati spali na 3.6%)</div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Ušteđeni Kargo Troškovi</span>
                    <Layers className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">€1,240</div>
                  <div className="text-[11px] text-slate-400">Sprečene povratne poštarine (Post Express)</div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Viber Otvaranje (Open Rate)</span>
                    <MessageSquare className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white">93.8%</div>
                  <div className="text-[11px] text-slate-400">Prosečno vreme potvrde: 2.4 minuta</div>
                </div>
              </div>

              {/* Logs Table Section */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Poslednje Verifikacije Pošiljki</h3>
                    <p className="text-xs text-slate-400">Real-time praćenje Viber poruka i potvrdio.online izmena</p>
                  </div>
                  <button className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" /> Osveži Logove
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">Porudžbina</th>
                        <th className="py-3 px-4">Kupac & Telefon</th>
                        <th className="py-3 px-4">Grad / Mesto</th>
                        <th className="py-3 px-4">Iznos</th>
                        <th className="py-3 px-4">Status & Kanal</th>
                        <th className="py-3 px-4 rounded-r-xl">Vreme</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {logs.map((log, index) => (
                        <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">{log.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-200">{log.customer}</div>
                            <div className="text-[10px] text-slate-400">{log.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">{log.city}</td>
                          <td className="py-3.5 px-4 font-semibold text-teal-300">{log.amount}</td>
                          <td className="py-3.5 px-4">
                            {log.status === 'APPROVED' && (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                                <CheckCircle2 className="w-3 h-3" /> Potvrđeno ({log.channel})
                              </span>
                            )}
                            {log.status === 'EDITED_ADDRESS' && (
                              <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-semibold">
                                <Sparkles className="w-3 h-3" /> Izmenjena Adresa
                              </span>
                            )}
                            {log.status === 'SMS_FALLBACK' && (
                              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-full font-semibold">
                                <AlertTriangle className="w-3 h-3" /> SMS Fallback
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{log.time}</td>
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
                <h2 className="text-xl font-bold text-white">Zajednički Bazen Viber Kredita</h2>
                <p className="text-xs text-slate-400 mt-1">Bez mesečne provizije, dopunite samo onoliko kredita koliko vam je potrebno za COD verifikaciju.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Starter Package */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Starter Paket</div>
                    <div className="text-3xl font-black text-white">€15</div>
                    <div className="text-sm font-bold text-teal-400">600 Viber Kredita</div>
                    <p className="text-xs text-slate-400 leading-relaxed">€0.025 / poruci. Idealno za manje prodavnice (do 50 porudžbina/mesec).</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('starter', 15, 600)}
                    disabled={purchasing === 'starter'}
                    className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    {purchasing === 'starter' ? 'Učitavanje...' : 'Kupi sa Paddle MoR'}
                  </button>
                </div>

                {/* Growth Package */}
                <div className="glass-card rounded-2xl p-6 border-2 border-teal-500/60 bg-teal-950/20 flex flex-col justify-between relative shadow-xl shadow-teal-500/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full">
                    NAJPOPULARNIJE
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider">Growth Paket</div>
                    <div className="text-3xl font-black text-white">€45</div>
                    <div className="text-sm font-bold text-teal-400">1,875 Viber Kredita</div>
                    <p className="text-xs text-slate-300 leading-relaxed">€0.024 / poruci. Za srednje e-trgovce u Srbij i regionu.</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('growth', 45, 1875)}
                    disabled={purchasing === 'growth'}
                    className="w-full mt-6 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-teal-600/30 cursor-pointer"
                  >
                    {purchasing === 'growth' ? 'Učitavanje...' : 'Kupi sa Lemon Squeezy'}
                  </button>
                </div>

                {/* Pro Package */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pro Paket</div>
                    <div className="text-3xl font-black text-white">€120</div>
                    <div className="text-sm font-bold text-teal-400">6,000 Viber Kredita</div>
                    <p className="text-xs text-slate-400 leading-relaxed">€0.020 / poruci. Najniža cena poruke za visoki obim pošiljki.</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('pro', 120, 6000)}
                    disabled={purchasing === 'pro'}
                    className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    {purchasing === 'pro' ? 'Učitavanje...' : 'Kupi sa Paddle MoR'}
                  </button>
                </div>

                {/* Pro Reserve Subscription */}
                <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-emerald-950/10 flex flex-col justify-between relative">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Pro Reserve (MRR)</div>
                    <div className="text-3xl font-black text-white">€29 <span className="text-xs text-slate-400 font-normal">/mesec</span></div>
                    <div className="text-sm font-bold text-emerald-400">1,800 Kredita / Mesec</div>
                    <p className="text-xs text-slate-400 leading-relaxed">Automatska mesečna rezervacija garancije sa popustom na poruke.</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('reserve', 29, 1800)}
                    disabled={purchasing === 'reserve'}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    {purchasing === 'reserve' ? 'Učitavanje...' : 'Aktiviraj Pretplatu'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & API KEY */}
          {activeTab === 'settings' && (
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-teal-400" />
                  WooCommerce Plugin API Ključevi
                </h2>
                <p className="text-xs text-slate-400 mt-1">Unesite ove ključeve u WordPress admin panelu dodatka (Potvrdio Viber COD Settings).</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Central Backend API Endpoint</label>
                  <input
                    type="text"
                    readOnly
                    value="https://api.potvrdio.online/api/v1"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-teal-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">API Key (ID Prodavnice)</label>
                  <input
                    type="text"
                    readOnly
                    value="demo_api_key_123"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">API Secret (HMAC Potpis Key)</label>
                  <input
                    type="password"
                    readOnly
                    value="sec_potvrdio_89237498237482347"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
