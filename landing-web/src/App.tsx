import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Zap,
  ArrowRight, Calculator, Check, Info
} from 'lucide-react';

export default function App() {
  const [codOrders, setCodOrders] = useState(300);
  const [demoStep, setDemoStep] = useState<'initial' | 'approved' | 'editing'>('initial');

  // ROI calculations based on Balkan market averages
  const returnRateWithoutPotvrdio = 0.14; // 14% return rate standard
  const returnRateWithPotvrdio = 0.025; // 2.5% return rate
  const savedPackages = Math.round(codOrders * (returnRateWithoutPotvrdio - returnRateWithPotvrdio));
  const savedShippingCostEur = savedPackages * 5.50; // ~5.50 EUR average 2-way shipping fee (Post Express / D Express)
  const recoveredRevenueEur = savedPackages * 42.00; // ~42 EUR average cart value

  return (
    <div class="min-h-screen bg-[#070a13] text-slate-100 selection:bg-teal-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Bar */}
      <header class="sticky top-0 z-50 backdrop-blur-xl bg-[#070a13]/80 border-b border-slate-800/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-indigo-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Sparkles class="w-5 h-5 text-white" />
            </div>
            <div>
              <span class="font-extrabold text-xl tracking-tight text-white">Potvrdio<span class="text-teal-400">.online</span></span>
              <span class="block text-[10px] text-teal-300 font-semibold tracking-wider">VIBER COD AUTOMATION</span>
            </div>
          </div>

          <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" class="hover:text-teal-400 transition-colors">Karakteristike</a>
            <a href="#calculator" class="hover:text-teal-400 transition-colors">ROI Kalkulator</a>
            <a href="#pricing" class="hover:text-teal-400 transition-colors">Cene Kredita</a>
            <a href="#compliance" class="hover:text-teal-400 transition-colors">Balkan ZZPL Usklađenost</a>
          </nav>

          <div class="flex items-center gap-4">
            <a
              href="#pricing"
              class="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Započnite sa 25 Besplatnih Kredita</span>
              <ArrowRight class="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section class="relative pt-16 pb-24 overflow-hidden">
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div class="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-300">
                <ShieldCheck class="w-4 h-4 text-teal-400" />
                <span>Za WooCommerce Prodavnice u Srbiji, BiH i Regionu</span>
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Nula Troškova Povratne Poštarine za <span class="gradient-brand-text">Kapıda Ödeme (COD)</span>
              </h1>

              <p class="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Sprečite nepreuzete pakete pre nego što ih pošaljete kurirskoj službi. Potvrdio automatski šalje Viber poruku sa 2 dugmeta i omogućava kupcu da u 1-klik izmeni adresu na <span class="text-teal-400 font-semibold">potvrdio.online</span>.
              </p>

              <div class="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#pricing"
                  class="w-full sm:w-auto bg-gradient-to-r from-teal-500 via-indigo-600 to-teal-500 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Zap class="w-5 h-5 text-amber-300" />
                  <span>Instaliraj WooCommerce Eklentiju</span>
                </a>

                <div class="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 class="w-4 h-4 text-emerald-400" />
                  <span>$0 Mesečna Pretplata • 25 Kredita Gratis</span>
                </div>
              </div>

              {/* Trust Stats Badges */}
              <div class="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div class="text-2xl font-black text-white">%94+</div>
                  <div class="text-xs text-slate-400">Viber Otvaranje u 3 min</div>
                </div>
                <div>
                  <div class="text-2xl font-black text-teal-400">€0.024</div>
                  <div class="text-xs text-slate-400">Prosečna Cena Poruke</div>
                </div>
                <div>
                  <div class="text-2xl font-black text-emerald-400">-80%</div>
                  <div class="text-xs text-slate-400">Manje Vraćenih Paketa</div>
                </div>
              </div>
            </div>

            {/* Hero Right: Interactive Viber Demo Widget */}
            <div class="lg:col-span-5">
              <div class="glass-card rounded-[32px] p-6 border border-teal-500/20 shadow-2xl relative">
                <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div class="flex items-center gap-3">
                    {/* Official Viber Brand Purple ONLY for Viber Header */}
                    <div class="w-10 h-10 rounded-full bg-[#7360f2] flex items-center justify-center text-white font-bold text-sm">
                      VB
                    </div>
                    <div>
                      <div class="text-sm font-bold text-white flex items-center gap-1">
                        Balkan Style Shop
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                      </div>
                      <div class="text-[10px] text-slate-400">Viber Official Message Bot</div>
                    </div>
                  </div>
                  <span class="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-semibold">LIVE DEMO</span>
                </div>

                {/* Simulated Viber Chat Bubble */}
                <div class="py-6 space-y-4">
                  <div class="bg-[#1c1f2e] rounded-2xl p-4 border border-slate-700/60 space-y-3 shadow-lg">
                    <p class="text-xs text-slate-200 leading-relaxed">
                      Zdravo <span class="font-bold text-white">Nikola</span>! Vaša narudžbina <span class="font-bold text-teal-300">#7482</span> (Iznos: 4.850 RSD) je primljena.
                    </p>
                    <div class="bg-slate-900/90 rounded-xl p-3 text-[11px] text-slate-300 space-y-1">
                      <div class="text-slate-400 uppercase tracking-wider font-semibold text-[9px]">Adresa Dostave:</div>
                      <div class="font-medium text-white">Knez Mihailova 42, Stan 12</div>
                      <div class="text-slate-400">Beograd (11000)</div>
                    </div>
                    <p class="text-xs text-slate-300 font-medium">Molimo vas da potvrdite slanje paketa:</p>
                  </div>

                  {/* Interactive Buttons */}
                  {demoStep === 'initial' && (
                    <div class="space-y-2 pt-1">
                      <button
                        onClick={() => setDemoStep('approved')}
                        class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 class="w-4 h-4" />
                        <span>✅ DA, ADRESA JE TAČNA I POTVRĐUJEM</span>
                      </button>

                      <button
                        onClick={() => setDemoStep('editing')}
                        class="w-full bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs py-3 px-4 rounded-xl border border-teal-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>✏️ IZMENI ADRESU (potvrdio.online)</span>
                      </button>
                    </div>
                  )}

                  {demoStep === 'approved' && (
                    <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center space-y-2">
                      <div class="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
                        <CheckCircle2 class="w-4 h-4" />
                        <span>Sipariş WooCommerce'de "Processing" Yapıldı!</span>
                      </div>
                      <p class="text-[11px] text-slate-300">Kargo etiketi otomatik kesildi.</p>
                      <button onClick={() => setDemoStep('initial')} class="text-[10px] text-teal-400 underline pt-1 cursor-pointer">Tekrar Deneyin</button>
                    </div>
                  )}

                  {demoStep === 'editing' && (
                    <div class="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4 text-center space-y-2">
                      <div class="text-teal-300 font-bold text-xs">Müşteri potvrdio.online/edit Adresine Yönlendirildi</div>
                      <p class="text-[11px] text-slate-300">Açık renkli şifresiz 1-tık mobil form açıldı.</p>
                      <button onClick={() => setDemoStep('initial')} class="text-[10px] text-teal-400 underline pt-1 cursor-pointer">Tekrar Deneyin</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="calculator" class="py-20 bg-[#0b0f1b] border-y border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div class="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3.5 py-1 rounded-full text-xs font-semibold">
              <Calculator class="w-3.5 h-3.5" />
              <span>Kalkulator Uštede i Dobiti</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Koliko Novca Potvrdio Štedi Vašoj Prodavnici?</h2>
            <p class="text-slate-400 text-sm">Izračunajte sprečene troškove vraćenih poštarina i spašen obrt kapitala na mesečnom nivou.</p>
          </div>

          <div class="glass-card rounded-3xl p-8 max-w-4xl mx-auto border border-teal-500/20 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div class="md:col-span-7 space-y-6">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label class="text-sm font-bold text-white">Aylık COD (Kapıda Ödeme) Sipariş Sayısı:</label>
                  <span class="text-xl font-black text-teal-400 bg-teal-500/10 px-4 py-1 rounded-xl border border-teal-500/20">{codOrders} sipariş/ay</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={codOrders}
                  onChange={(e) => setCodOrders(Number(e.target.value))}
                  class="w-full accent-teal-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div class="grid grid-cols-2 gap-4 pt-2">
                <div class="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
                  <div class="text-xs text-slate-400">Sprečen Broj Povrata Paketa</div>
                  <div class="text-2xl font-black text-white mt-1">~{savedPackages} paket/ay</div>
                </div>

                <div class="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
                  <div class="text-xs text-slate-400">Ušteđen Kargo Trošak</div>
                  <div class="text-2xl font-black text-emerald-400 mt-1">€{savedShippingCostEur.toLocaleString()} /ay</div>
                </div>
              </div>
            </div>

            <div class="md:col-span-5 bg-gradient-to-br from-teal-950/40 to-indigo-950/40 rounded-2xl p-6 border border-teal-500/30 text-center space-y-4">
              <div class="text-xs text-teal-300 font-semibold uppercase tracking-wider">Ukupan Dobitak za Prodavnicu</div>
              <div class="text-4xl font-black text-white">€{(savedShippingCostEur + recoveredRevenueEur).toLocaleString()} <span class="text-xs text-slate-400 font-normal">/mesečno</span></div>
              <p class="text-xs text-slate-300 leading-relaxed">
                Uložite samo <span class="text-teal-300 font-bold">€{(codOrders * 0.024).toFixed(1)}</span> u Viber kredite i sačuvajte preko <span class="text-emerald-400 font-bold">€{savedShippingCostEur.toFixed(0)}</span> u kargo troškovima!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" class="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div class="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Zap class="w-3.5 h-3.5" />
            <span>Nema Mesečnih Provizija ($0 Giriş)</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Jednostavni Pay-As-You-Go Paket Kredita</h2>
          <p class="text-slate-400 text-sm">Dopunite kredite kad god želite. Svi paketi uključuju Viber Business API i SMS Fallback altyapısını.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Starter */}
          <div class="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div class="space-y-4">
              <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Starter Paket</div>
              <div class="text-4xl font-black text-white">€15</div>
              <div class="text-sm font-bold text-teal-400">600 Viber Kredita</div>
              <ul class="text-xs text-slate-300 space-y-2 pt-2">
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> €0.025 / poruci</li>
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> 1-Click potvrdio.online form</li>
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> WooCommerce Eklentisi</li>
              </ul>
            </div>
            <button class="w-full mt-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer">
              Kupi sa Paddle MoR
            </button>
          </div>

          {/* Growth */}
          <div class="glass-card rounded-3xl p-6 border-2 border-teal-500 bg-teal-950/20 flex flex-col justify-between relative shadow-2xl shadow-teal-600/10">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full tracking-wider">
              NAJPOPULARNIJE
            </div>
            <div class="space-y-4 pt-2">
              <div class="text-xs font-semibold text-teal-300 uppercase tracking-wider">Growth Paket</div>
              <div class="text-4xl font-black text-white">€45</div>
              <div class="text-sm font-bold text-teal-400">1,875 Viber Kredita</div>
              <ul class="text-xs text-slate-200 space-y-2 pt-2">
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> €0.024 / poruci</li>
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> SMS Fallback Entegrasyonu</li>
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Korpu Napuštanje (Cart Recovery)</li>
              </ul>
            </div>
            <button class="w-full mt-8 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-teal-600/30 transition-all cursor-pointer">
              Kupi sa Lemon Squeezy
            </button>
          </div>

          {/* Pro */}
          <div class="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div class="space-y-4">
              <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pro Paket</div>
              <div class="text-4xl font-black text-white">€120</div>
              <div class="text-sm font-bold text-teal-400">6,000 Viber Kredita</div>
              <ul class="text-xs text-slate-300 space-y-2 pt-2">
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> €0.020 / poruci</li>
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Prioritetna Podrška</li>
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Neograničeni WooCommerce nalozi</li>
              </ul>
            </div>
            <button class="w-full mt-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer">
              Kupi sa Paddle MoR
            </button>
          </div>

          {/* Pro Reserve Subscription */}
          <div class="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-emerald-950/10 flex flex-col justify-between">
            <div class="space-y-4">
              <div class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Pro Reserve (MRR)</div>
              <div class="text-4xl font-black text-white">€29 <span class="text-xs text-slate-400 font-normal">/mesec</span></div>
              <div class="text-sm font-bold text-emerald-400">1,800 Kredita / Mesec</div>
              <ul class="text-xs text-slate-300 space-y-2 pt-2">
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Garancija Rezervisanih Kredita</li>
                <li class="flex items-center gap-2"><Check class="w-4 h-4 text-emerald-400" /> Automatsko Obnavljanje</li>
              </ul>
            </div>
            <button class="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/20 cursor-pointer">
              Aktiviraj Pretplatu
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="border-t border-slate-800 py-12 bg-[#05070e] text-slate-500 text-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-teal-400" />
            <span class="font-bold text-slate-300">Potvrdio.online</span>
            <span>— Micro-SaaS za Balkan WooCommerce Trgovce</span>
          </div>

          <div class="flex items-center gap-6">
            <span>ZZPL Usklađeno (Srbija)</span>
            <span>GDPR Compliant</span>
            <span>Merchant of Record (Paddle)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
