import React, { useState, useEffect } from 'react';
import { 
  Check, Download, AlertTriangle, ArrowDown, ChevronRight, 
  RotateCcw, ShieldCheck, Terminal, MapPin, CheckCircle2, XCircle, FileText
} from 'lucide-react';

/* Web Audio API Micro Sound Effects */
let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Ignore audio context errors
  }
}

function playScannerBeep() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1850, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Ignore audio context errors
  }
}

type Lang = 'sr' | 'en';

export default function App() {
  const [lang, setLang] = useState<Lang>('sr');
  const [currentScenario, setCurrentScenario] = useState<number>(1);
  const [simState, setSimState] = useState<'initial' | 'confirmed' | 'edited'>('initial');
  
  // ROI Calculator States
  const [ordersCount, setOrdersCount] = useState<number>(450);
  const [failureRate, setFailureRate] = useState<number>(13);

  const t = (key: string): string => {
    const translations: Record<Lang, Record<string, string>> = {
      sr: {
        top_networks: "Post Express, D Express, Bex, City Express",
        nav_sub: "Lojistička COD Zaštita · WP v2.1",
        nav_lab: "Saha Simülatörü",
        nav_manifest: "Adresnica İncelemesi",
        nav_calc: "Kargo Zarar Matrisi",
        nav_pricing: "Havuz Maliyeti",
        nav_dev: "API & HPOS",
        btn_dl: "Preuzmi ZIP",
        hero_tag: "WooCommerce Plaćanje Pouzećem (COD)",
        hero_title: "Kupac poruči pouzećem, ne preuzme paket. Vi plaćate i slanje i povratak.",
        hero_p: "U Srbiji i regionu preko 65% e-commerce narudžbina ide pouzećem. Svaka peta vraćena pošiljka (Post Express, D Express, Bex) košta vas između 720 i 890 RSD čistog gubitka. Potvrdio automatski zadržava porudžbinu na statusu On-Hold, šalje dvosmernu Viber verifikaciju i dozvoljava štampanje adresnice isključivo nakon potvrde kupca.",
        hero_cta_primary: "Testiraj Interaktivnu Verifikaciju",
        hero_free_credits: "besplatnih verifikacija uključeno uz plugin",
        stat_open_rate: "Odziv poruke",
        stat_open_sub: "Viber unutar 4 min.",
        stat_hold_cost: "Gubitak po paketu",
        stat_hold_sub: "Dupla poštarina kurira",
        stat_recovery: "Pad povrata",
        stat_recovery_sub: "Sa 14.8% na 2.5%",
        hero_box_note: "Paket se fizički ne preuzima iz skladišta dok kupac ne klikne potvrdu na Viberu. Time se rizik praznog hoda kurira svodi na nulu.",
        lab_tag: "01 / Interaktivni laboratorijum",
        lab_title: "Isprobajte 3 realna scenarija iz balkanske prakse",
        lab_subtitle: "Kliknite na scenario da vidite ponašanje Viber bota i WooCommerce baze:",
        scen1_title: "Nepotpuna adresa (Novi Sad)",
        scen1_desc: "Kupac je zaboravio broj stana i sprat. Koriguje podatke jednim klikom preko token linka.",
        scen2_title: "Kupac se predomislio (Niš)",
        scen2_desc: "Kupac ignoriše Viber poruku i SMS. Paket ostaje u skladištu, a prodavac štedi 820 RSD.",
        scen3_title: "Instant 1-Click Potvrda",
        scen3_desc: "Verifikacija u jednom dodiru. Webhook automatski generiše Post Express adresnicu.",
        term_title: "Real-Time WP Event Terminal",
        term_risk_status: "Status Magacina",
        btn_restart_sim: "Restartuj test",
        man_tag: "02 / Fizička Adresnica",
        man_title: "Zašto kuriri vraćaju pakete? Anatomija neispravne adresnice",
        man_p: "Kurir ima prosečno 45 sekundi po adresi. Ako nema sprat, stan ili ako je unet stari broj telefona, kurir stavlja oznaku 'Izvešten - Nije preuzet'. Kada se to desi, trošak povratnog prevoza pada na teret internet prodavnice.",
        man_bad_title: "Standardni WooCommerce Unos (Visok rizik povrata)",
        man_bad_footer: "Rezultat: Kurir ne može da nađe ulaz. Pošiljka stoji u pošti 5 dana, vraća se prodavcu. Gubitak: 780 RSD.",
        man_good_title: "Čista Adresnica nakon Viber Potvrde",
        man_good_footer: "Rezultat: Kurir pronalazi interfon u prvom pokušaju. Kupac očekuje paket i priprema tačan iznos otkupnine.",
        calc_tag: "03 / Matematika gubitka",
        calc_title: "Izračunajte godišnje curenje profita na kurirskim službama",
        calc_desc: "Kalkulacija uračunava zvanične cene kurirskih službi u regionu za pakete do 2kg sa otkupninom.",
        calc_label_orders: "Broj narudžbina pouzećem mesečno:",
        calc_label_rate: "Procenat neuručenih paketa:",
        calc_loss_head: "Godišnji direktan gubitak na poštarinama",
        calc_saved_head: "Neto sačuvano uz Potvrdio:",
        calc_roi_note: "Nakon odbitka cene utrošenih Viber kredita (ROI > 14x)",
        price_tag: "04 / Bazen Kredita (PAYG)",
        price_title: "Bez ugovora sa agregatorima. Plaćate samo poslate poruke.",
        price_desc: "Direktan Viber Business API zahteva fiksne mesečne zakupe od 150€+ i složene ugovore. Potvrdio objedinjuje stotine trgovaca u jedinstveni bazen sa najnižom jediničnom cenom.",
        th_tier: "Paket",
        th_deposit: "Iznos uplate",
        th_viber_rate: "Viber cena",
        th_sms_rate: "SMS Fallback",
        price_note: "Obračun se vrši u dinarima po srednjem kursu NBS na dan izdavanja e-fakture. Bez automatskih skidanja sa kartice bez vašeg odobrenja.",
        pro_tag: "Za radnje sa > 300 porudžbina",
        btn_act_pro: "Aktiviraj Pro Reserve",
        leg_tag: "05 / Pravni okvir",
        leg_title: "Usklađenost sa Zakonom o zaštiti podataka o ličnosti (ZZPL)",
        leg_p: "Slanje komercijalnih poruka bez osnova podleže prekršajnim sankcijama. Potvrdio funkcioniše isključivo na osnovu Člana 12 ZZPL (izvršenje ugovora o kupoprodaji).",
        dev_tag: "Tehnička integracija",
        dev_title: "Kako izgleda kod u WooCommerce eklentiji?",
        dl_title: "Zaustavite troškove povrata već u sledećoj turi slanja",
        dl_desc: "Preuzmite besplatan ZIP, aktivirajte ga u WordPress adminu i odmah dobijate 25 besplatnih verifikacionih sesija.",
        btn_dl_full: "Preuzmi Potvrdio WordPress Plugin (.zip)",
        btn_view_demo: "Pogledaj demo uživo"
      },
      en: {
        top_networks: "Post Express, D Express, Bex, City Express (Balkans)",
        nav_sub: "COD Protection Engine · WP v2.1",
        nav_lab: "Field Simulator",
        nav_manifest: "Label Inspector",
        nav_calc: "Courier Loss Matrix",
        nav_pricing: "Credit Pool",
        nav_dev: "API & HPOS",
        btn_dl: "Download ZIP",
        hero_tag: "WooCommerce Cash on Delivery (COD) Shield",
        hero_title: "Buyers order COD, reject at door. You pay shipping both ways.",
        hero_p: "In the Balkans, over 65% of e-commerce orders are Cash on Delivery. Every uncollected parcel (Post Express, D Express) costs between 720 and 890 RSD (~€7) in deadweight shipping penalties. Potvrdio intercepts orders on On-Hold status, executes 2-way Viber verification, and blocks shipping manifests until confirmed.",
        hero_cta_primary: "Test Interactive Simulator",
        hero_free_credits: "free verification credits included with plugin",
        stat_open_rate: "Open Rate",
        stat_open_sub: "Viber within 4 min.",
        stat_hold_cost: "Loss Per Return",
        stat_hold_sub: "Double courier fee",
        stat_recovery: "Return Reduction",
        stat_recovery_sub: "From 14.8% down to 2.5%",
        hero_box_note: "Parcels never leave warehouse shelves until the buyer confirms on Viber. Courier return exposure drops to near zero.",
        lab_tag: "01 / Interactive Lab",
        lab_title: "Test 3 real operational scenarios from the field",
        lab_subtitle: "Click a scenario to observe Viber bot and WooCommerce database hooks:",
        scen1_title: "Incomplete Address (Novi Sad)",
        scen1_desc: "Customer missed apartment & floor numbers. Fixes details with a single tap passwordless link.",
        scen2_title: "Customer Changed Mind (Niš)",
        scen2_desc: "Customer ignores Viber and SMS. Parcel stays safely in storage; store saves 820 RSD.",
        scen3_title: "Instant 1-Click Approval",
        scen3_desc: "Immediate 1-tap verification. Webhook releases Post Express shipping manifest in seconds.",
        term_title: "Real-Time WP Event Terminal",
        term_risk_status: "Warehouse Decision",
        btn_restart_sim: "Reset test",
        man_tag: "02 / Physical Manifest",
        man_title: "Why couriers fail deliveries: Anatomy of a faulty label",
        man_p: "Couriers spend an average of 45 seconds per drop. If the intercom or floor is missing, they tag the parcel as 'Customer Not Found'. That return fee lands directly on your P&L.",
        man_bad_title: "Standard Blind WooCommerce Entry (High Risk)",
        man_bad_footer: "Outcome: Courier cannot locate apartment. Stored in depot 5 days, returned. Loss: 780 RSD.",
        man_good_title: "Clean Verified Label via Potvrdio",
        man_good_footer: "Outcome: Courier rings intercom on first attempt. Customer expects delivery with exact cash.",
        calc_tag: "03 / Loss Mathematics",
        calc_title: "Calculate annual profit hemorrhage on courier returns",
        calc_desc: "Calculations based on standard regional courier tariffs with return penalties for parcels under 2kg.",
        calc_label_orders: "Monthly Cash on Delivery Orders:",
        calc_label_rate: "Uncollected parcel failure rate:",
        calc_loss_head: "Annual Direct Shipping Loss",
        calc_saved_head: "Net Saved with Potvrdio:",
        calc_roi_note: "After deducting Viber verification credit costs (ROI > 14x)",
        price_tag: "04 / Credit Pool (PAYG)",
        price_title: "No aggregator contract. Pay strictly per verified message.",
        price_desc: "Direct Viber Business accounts demand €150+/mo minimum retainers and bureaucratic contracts. Potvrdio aggregates regional volume for wholesale unit pricing.",
        th_tier: "Tier",
        th_deposit: "Deposit Amount",
        th_viber_rate: "Viber Rate",
        th_sms_rate: "SMS Fallback",
        price_note: "Invoiced in local RSD or EUR via official central bank rate. Zero automated credit card charges without consent.",
        pro_tag: "For stores with > 300 monthly orders",
        btn_act_pro: "Activate Pro Reserve",
        leg_tag: "05 / Legal Framework",
        leg_title: "Compliant with Serbian ZZPL Art. 12 & EU GDPR",
        leg_p: "Sending arbitrary marketing messages carries severe penalties. Potvrdio processes data strictly under Article 12 (sales contract execution).",
        dev_tag: "Technical Integration",
        dev_title: "How clean is the WooCommerce code?",
        dl_title: "Halt return courier costs before tomorrow's dispatch",
        dl_desc: "Download the free ZIP plugin, activate inside WordPress admin, and get 25 free credits instantly.",
        btn_dl_full: "Download Potvrdio WordPress Plugin (.zip)",
        btn_view_demo: "View live demo"
      }
    };

    return translations[lang]?.[key] || key;
  };

  // Scenario configurations
  const scenarios = {
    1: {
      customer: "Marko Petrović",
      address: "Bulevar Oslobođenja 42, Novi Sad",
      orderId: "#RS-8492",
      orderAmount: "4.890 RSD",
    },
    2: {
      customer: "Nemanja Ilić",
      address: "Bulevar Nemanjića 14, Niš",
      orderId: "#RS-8501",
      orderAmount: "3.450 RSD",
    },
    3: {
      customer: "Ana Jovanović",
      address: "Kneza Miloša 22, Kragujevac",
      orderId: "#RS-8519",
      orderAmount: "6.120 RSD",
    }
  };

  const handleScenarioChange = (scenNum: number) => {
    playClickSound();
    setCurrentScenario(scenNum);
    setSimState('initial');
  };

  const handleSimAction = (action: 'confirm' | 'edit') => {
    playScannerBeep();
    setSimState(action === 'confirm' ? 'confirmed' : 'edited');
  };

  const handleResetSim = () => {
    playClickSound();
    setSimState('initial');
  };

  // ROI Math
  const failedOrdersPerMonth = Math.round(ordersCount * (failureRate / 100));
  const monthlyLossRsd = failedOrdersPerMonth * 780;
  const annualLossRsd = monthlyLossRsd * 12;
  const annualLossEur = Math.round(annualLossRsd / 117.2);
  const annualSavedRsd = Math.round(annualLossRsd * 0.85);

  const currentScenConfig = scenarios[currentScenario as keyof typeof scenarios];

  return (
    <div class="min-h-[100dvh] flex flex-col blueprint-grid bg-[#070A13] text-[#CBD5E1] font-['Inter',sans-serif] selection:bg-[#14B8A6] selection:text-white">
      
      {/* Top Network & Legal Bar */}
      <aside class="border-b border-white/10 bg-[#070A13]/90 px-4 py-1.5 text-xs">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5 text-emerald-400">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span class="font-medium text-white">Viber Gateway RS: AKTIVAN</span>
            </span>
            <span class="text-white/10">|</span>
            <span class="hidden sm:inline text-slate-400">{t('top_networks')}</span>
          </div>

          <div class="flex items-center gap-4">
            <span class="text-slate-400 hidden md:inline">Protokol: <span class="text-slate-200">ZZPL (RS) Član 12 &amp; GDPR</span></span>
            <span class="text-white/10">|</span>
            <span class="text-amber-400 font-medium">Avg. Dupla Poštarina: 780 RSD</span>
          </div>
        </div>
      </aside>

      {/* Header Navigation */}
      <header class="sticky top-0 z-40 border-b border-white/10 bg-[#070A13]/90 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-[#0D121F] border border-[#14B8A6]/40 flex items-center justify-center text-[#14B8A6] shadow-inner">
              <CheckCircle2 class="w-4 h-4" />
            </div>
            <div>
              <a href="#" class="font-mono font-bold text-sm text-white tracking-tight flex items-center gap-1">
                potvrdio<span class="text-[#14B8A6]">.online</span>
              </a>
              <div class="text-[10px] font-mono text-slate-400 -mt-0.5">{t('nav_sub')}</div>
            </div>
          </div>

          {/* Nav Links */}
          <nav class="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#lab" class="hover:text-white transition-colors">{t('nav_lab')}</a>
            <a href="#manifest" class="hover:text-white transition-colors">{t('nav_manifest')}</a>
            <a href="#kalkulator" class="hover:text-white transition-colors">{t('nav_calc')}</a>
            <a href="#cenovnik" class="hover:text-white transition-colors">{t('nav_pricing')}</a>
            <a href="#integracija" class="hover:text-white transition-colors">{t('nav_dev')}</a>
          </nav>

          {/* Controls */}
          <div class="flex items-center gap-3">
            <div class="flex items-center bg-[#0D121F] border border-white/10 rounded p-0.5 text-xs font-mono">
              <button 
                onClick={() => { playClickSound(); setLang('sr'); }} 
                class={`px-2 py-0.5 rounded font-bold transition-all ${lang === 'sr' ? 'bg-[#14B8A6] text-black' : 'text-slate-400 hover:text-white'}`}
              >
                SR
              </button>
              <button 
                onClick={() => { playClickSound(); setLang('en'); }} 
                class={`px-2 py-0.5 rounded font-bold transition-all ${lang === 'en' ? 'bg-[#14B8A6] text-black' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            <a 
              href="#preuzmi" 
              onClick={playClickSound}
              class="btn-brand-cta text-white font-semibold text-xs px-3.5 py-2 rounded transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download class="w-3.5 h-3.5" />
              <span>{t('btn_dl')}</span>
            </a>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section class="border-b border-white/10 bg-gradient-to-b from-[#0D121F] to-[#070A13] pt-14 pb-16">
        <div class="max-w-7xl mx-auto px-5">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column */}
            <div class="lg:col-span-7 flex flex-col gap-5">
              <div class="inline-flex items-center gap-2 border border-white/10 bg-[#0D121F] px-3 py-1 rounded text-xs font-mono text-slate-400 w-fit">
                <span class="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse"></span>
                <span class="text-white font-medium">{t('hero_tag')}</span>
                <span class="text-white/10">/</span>
                <span class="text-emerald-400 font-mono">0€ Pretplata</span>
              </div>

              <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-[1.18]">
                {t('hero_title')}
              </h1>

              <p class="text-sm leading-relaxed text-slate-400 max-w-2xl">
                {t('hero_p')}
              </p>

              <div class="flex flex-wrap items-center gap-4 pt-2">
                <a 
                  href="#lab" 
                  onClick={playClickSound}
                  class="btn-brand-cta text-white font-bold text-xs px-5 py-3 rounded transition-all inline-flex items-center gap-2"
                >
                  <span>{t('hero_cta_primary')}</span>
                  <ArrowDown class="w-3.5 h-3.5" />
                </a>
                <div class="text-xs font-mono text-slate-400 flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">25</span>
                  <span>{t('hero_free_credits')}</span>
                </div>
              </div>

              {/* Stats */}
              <div class="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 mt-3 font-mono">
                <div class="glass-panel p-3 rounded">
                  <div class="text-xs text-slate-400 mb-1">{t('stat_open_rate')}</div>
                  <div class="text-xl sm:text-2xl font-bold text-white tracking-tight">89.6%</div>
                  <div class="text-[10px] text-emerald-400 mt-1">{t('stat_open_sub')}</div>
                </div>
                <div class="glass-panel p-3 rounded">
                  <div class="text-xs text-slate-400 mb-1">{t('stat_hold_cost')}</div>
                  <div class="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight">~780 RSD</div>
                  <div class="text-[10px] text-slate-400 mt-1">{t('stat_hold_sub')}</div>
                </div>
                <div class="glass-panel p-3 rounded">
                  <div class="text-xs text-slate-400 mb-1">{t('stat_recovery')}</div>
                  <div class="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">-83%</div>
                  <div class="text-[10px] text-slate-400 mt-1">{t('stat_recovery_sub')}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Status Dashboard */}
            <div class="lg:col-span-5 glass-panel rounded-lg p-5 shadow-2xl relative">
              <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded bg-[#14B8A6]"></span>
                  <span class="text-xs font-mono font-bold text-white uppercase">WP-Admin · WooCommerce Hook</span>
                </div>
                <div class="text-[10px] font-mono text-slate-400">HPOS Compatible</div>
              </div>

              {/* Order Card */}
              <div class="bg-[#070A13] p-3.5 rounded border border-white/10 mb-4 font-mono text-xs space-y-2">
                <div class="flex justify-between items-center text-[11px] text-slate-400 border-b border-white/10 pb-2">
                  <span>Porudžbina #RS-8492</span>
                  <span>17. Sep 2026, 09:14</span>
                </div>
                <div class="flex justify-between items-center text-white pt-1">
                  <span class="font-bold font-sans text-sm">Jelena Kovačević</span>
                  <span class="text-[#14B8A6] font-bold">5.420 RSD</span>
                </div>
                <div class="text-[11px] text-slate-400 flex items-start gap-1.5">
                  <MapPin class="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                  <span>Bulevar cara Lazara 78, sprat 4, stan 19, Novi Sad</span>
                </div>
                <div class="flex items-center justify-between pt-2 text-[11px]">
                  <span class="text-slate-400">Kurirska služba:</span>
                  <span class="text-white font-medium">Post Express (Danas za sutra)</span>
                </div>
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-slate-400">Rizik neuručenja:</span>
                  <span class="text-red-400">790 RSD (Trošak magacina)</span>
                </div>
              </div>

              {/* Logistics State */}
              <div class="p-3 bg-[#0D121F] rounded border border-white/10 font-mono text-[11px] space-y-2 mb-4">
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Stanje narudžbine:</span>
                  <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    HOLD_WAITING_VIBER
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Štampanje adresnice:</span>
                  <span class="text-red-400 font-semibold">BLOKIRANO (Zaštita od troška)</span>
                </div>
              </div>

              {/* Note */}
              <div class="text-[11px] text-slate-400 font-mono leading-relaxed border-t border-white/10 pt-3 flex items-start gap-1.5">
                <ShieldCheck class="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <span>{t('hero_box_note')}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 01: Interactive Lab Simulator */}
      <section id="lab" class="max-w-7xl mx-auto px-5 py-20 border-b border-white/10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div class="text-xs font-mono text-[#14B8A6] uppercase tracking-wider mb-1">{t('lab_tag')}</div>
            <h2 class="text-2xl font-bold text-white tracking-tight">{t('lab_title')}</h2>
          </div>
          <div class="text-xs text-slate-400 font-mono">
            {t('lab_subtitle')}
          </div>
        </div>

        {/* Scenario Selectors */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <button 
            onClick={() => handleScenarioChange(1)} 
            class={`text-left p-4 rounded glass-panel text-xs transition-all shadow-sm ${currentScenario === 1 ? 'border border-[#14B8A6]' : 'border border-white/10 hover:border-white/20'}`}
          >
            <div class="flex items-center justify-between mb-1 font-mono">
              <span class={`font-bold ${currentScenario === 1 ? 'text-[#14B8A6]' : 'text-white'}`}>Scenario A</span>
              <span class="text-[10px] text-emerald-400">Uobičajeno (62%)</span>
            </div>
            <div class="font-bold text-white text-sm mb-1">{t('scen1_title')}</div>
            <div class="text-slate-400 text-[11px] leading-relaxed">{t('scen1_desc')}</div>
          </button>

          <button 
            onClick={() => handleScenarioChange(2)} 
            class={`text-left p-4 rounded glass-panel text-xs transition-all ${currentScenario === 2 ? 'border border-[#14B8A6]' : 'border border-white/10 hover:border-white/20'}`}
          >
            <div class="flex items-center justify-between mb-1 font-mono">
              <span class={`font-bold ${currentScenario === 2 ? 'text-[#14B8A6]' : 'text-white'}`}>Scenario B</span>
              <span class="text-[10px] text-red-400">Izbegnut trošak</span>
            </div>
            <div class="font-bold text-white text-sm mb-1">{t('scen2_title')}</div>
            <div class="text-slate-400 text-[11px] leading-relaxed">{t('scen2_desc')}</div>
          </button>

          <button 
            onClick={() => handleScenarioChange(3)} 
            class={`text-left p-4 rounded glass-panel text-xs transition-all ${currentScenario === 3 ? 'border border-[#14B8A6]' : 'border border-white/10 hover:border-white/20'}`}
          >
            <div class="flex items-center justify-between mb-1 font-mono">
              <span class={`font-bold ${currentScenario === 3 ? 'text-[#14B8A6]' : 'text-white'}`}>Scenario C</span>
              <span class="text-[10px] text-emerald-400">&lt; 30 sekundi</span>
            </div>
            <div class="font-bold text-white text-sm mb-1">{t('scen3_title')}</div>
            <div class="text-slate-400 text-[11px] leading-relaxed">{t('scen3_desc')}</div>
          </button>
        </div>

        {/* Simulator Workspace */}
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start glass-panel p-6 rounded-lg">
          
          {/* Viber Phone Mockup Left */}
          <div class="lg:col-span-5 bg-[#1E1838] border border-[#46377B] rounded-xl p-4 shadow-xl">
            <div class="flex items-center justify-between border-b border-[#46377B] pb-3 mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-[#7360F2] flex items-center justify-center text-white font-bold text-xs">
                  VB
                </div>
                <div>
                  <div class="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Potvrdio · Verifikacija</span>
                    <span class="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded font-mono">VERIFIKOVANO</span>
                  </div>
                  <div class="text-[10px] font-mono text-[#A798CE]">Viber Business Gateway #782</div>
                </div>
              </div>
              <span class="text-[10px] font-mono text-[#8B79B2]">13:42</span>
            </div>

            <div class="space-y-3 text-xs leading-relaxed text-[#E6DDFA]">
              <div class="bg-[#29204A] p-3.5 rounded-lg border border-[#46377B]">
                <p class="mb-2">
                  Zdravo <strong>{currentScenConfig.customer.split(' ')[0]}</strong>! Primili smo tvoju porudžbinu <strong>{currentScenConfig.orderId}</strong> ({currentScenConfig.orderAmount}).
                </p>
                <div class="p-2.5 rounded bg-[#1E1838] border border-[#46377B] font-mono text-[11px] text-[#C4B5FD] mb-3">
                  <span class="text-slate-400 block text-[10px]">ADRESA ZA DOSTAVU:</span>
                  <span class="text-white font-medium">
                    {simState === 'edited' ? 'Bulevar Oslobođenja 42, Sprat 3, Stan 14' : currentScenConfig.address}
                  </span>
                </div>
                <p class="text-[11px] text-[#DDD6FE]">
                  Molimo te da potvrdiš tačnost pre nego što paket predamo kuriru:
                </p>
              </div>

              {simState === 'initial' ? (
                <div class="space-y-2 pt-1">
                  <button 
                    onClick={() => handleSimAction('confirm')} 
                    class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded text-xs transition active:scale-[0.99] flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Check class="w-4 h-4" />
                    <span>DA, ADRESA JE TAČNA</span>
                  </button>
                  <button 
                    onClick={() => handleSimAction('edit')} 
                    class="w-full bg-[#191A2B] hover:bg-[#252840] text-slate-200 py-2 rounded text-xs transition border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>IZMENI ADRESU</span>
                  </button>
                </div>
              ) : (
                <div class="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono text-center flex items-center justify-center gap-1.5">
                  <Check class="w-4 h-4 text-emerald-400" />
                  <span>Zabeleženo u sistemu. Podaci su prosleđeni u WooCommerce.</span>
                </div>
              )}
            </div>
          </div>

          {/* WP Event Terminal Right */}
          <div class="lg:col-span-7 flex flex-col justify-between h-full space-y-4 font-mono text-xs">
            <div>
              <div class="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400">
                <span class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span class="text-white font-bold">{t('term_title')}</span>
                </span>
                <span class="text-[11px] text-slate-400">HMAC-SHA256 SIGNED</span>
              </div>

              <div class="mt-3 bg-[#070A13] p-3.5 rounded border border-white/10 space-y-1.5 h-64 overflow-y-auto text-[11px]">
                <div class="text-neutral-400">[13:42:01] WC Order Created: {currentScenConfig.orderId} (COD Plaćanje pouzećem).</div>
                <div class="text-amber-400">[13:42:01] Potvrdio Hook: Order status switched to ON-HOLD. Label printing suspended.</div>
                
                {currentScenario === 1 && (
                  <>
                    <div class="text-neutral-300">[13:42:02] Viber Gateway: Transaction #VB-9201 dispatched (+381642918472). Status: DELIVERED.</div>
                    {simState === 'edited' && (
                      <>
                        <div class="text-blue-400 font-bold">[13:42:15] Token Form: Customer updated street, apartment & notes.</div>
                        <div class="text-slate-200">[13:42:16] WooCommerce shipping metadata overwritten safely.</div>
                        <div class="text-emerald-300 font-semibold">[13:42:16] Order unblocked -&gt; PROCESSING. Dispatch label ready.</div>
                      </>
                    )}
                  </>
                )}

                {currentScenario === 2 && (
                  <>
                    <div class="text-amber-400">[13:42:02] Viber sent. No read receipt within 20 minutes.</div>
                    <div class="text-amber-500">[13:42:22] SMS Fallback dispatched: "Potvrdite porudžbinu na potvrdio.online..."</div>
                    <div class="text-red-400">[14:02:00] 24h Expired: No customer action. Order safely CANCELLED.</div>
                    <div class="text-emerald-400">[14:02:01] RESULT: 820 RSD courier double freight cost saved!</div>
                  </>
                )}

                {currentScenario === 3 && (
                  <>
                    <div class="text-neutral-300">[13:42:02] Viber sent. Customer active.</div>
                    {simState === 'confirmed' && (
                      <>
                        <div class="text-emerald-400 font-bold">[13:42:08] Viber Action: [CONFIRM_TAP_EVENT] received.</div>
                        <div class="text-slate-200">[13:42:09] Webhook: POST /wc-api/potvrdio_verify (200 OK).</div>
                        <div class="text-emerald-300 font-semibold">[13:42:09] WooCommerce order status changed to PROCESSING.</div>
                        <div class="text-white">[13:42:10] Barcode generated: PE-7892014-RS.</div>
                      </>
                    )}
                  </>
                )}

                {simState === 'initial' && currentScenario !== 2 && (
                  <div class="text-slate-400">&gt; Waiting for customer response on Viber...</div>
                )}
              </div>
            </div>

            {/* Warehouse Decision Footer */}
            <div class="p-3.5 bg-[#0D121F] rounded border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <div class="text-slate-400 text-[10px] uppercase font-bold">{t('term_risk_status')}</div>
                <div class="font-bold text-xs mt-0.5">
                  {currentScenario === 2 ? (
                    <span class="text-emerald-400">SAČUVANO: Paket nije poslat, 820 RSD u džepu</span>
                  ) : simState !== 'initial' ? (
                    <span class="text-emerald-400">ODOBRENO: Štampaj Post Express adresnicu</span>
                  ) : (
                    <span class="text-amber-400">ČEKANJE: Ne pakovati paket iz magacina</span>
                  )}
                </div>
              </div>
              <button 
                onClick={handleResetSim} 
                class="px-3 py-1.5 rounded bg-[#070A13] hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-[11px] transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw class="w-3 h-3" />
                <span>{t('btn_restart_sim')}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 02: Physical Manifest Label Inspector */}
      <section id="manifest" class="max-w-7xl mx-auto px-5 py-20 border-b border-white/10">
        <div class="max-w-3xl mb-12">
          <div class="text-xs font-mono text-[#14B8A6] uppercase tracking-wider mb-1">{t('man_tag')}</div>
          <h2 class="text-2xl font-bold text-white tracking-tight">{t('man_title')}</h2>
          <p class="text-sm text-slate-400 mt-2 leading-relaxed">{t('man_p')}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Unverified Bad Label */}
          <div class="glass-panel border-red-500/30 p-6 rounded-lg relative overflow-hidden">
            <div class="absolute top-3 right-3 text-[10px] font-mono font-bold bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
              BEZ POTVRDIO ALATA
            </div>
            <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <XCircle class="w-4 h-4 text-red-400 shrink-0" />
              <span>{t('man_bad_title')}</span>
            </h3>

            <div class="thermal-label p-4 rounded text-xs space-y-3 select-none">
              <div class="flex justify-between border-b border-slate-300 pb-2">
                <span class="font-bold">STANDARDNA ADRESNICA</span>
                <span class="text-[11px]">PE-9948201-RS</span>
              </div>
              <div>
                <div class="text-[10px] text-slate-500">PRIMALAC:</div>
                <div class="font-bold text-slate-900">Goran Ninković</div>
                <div>Bulevar Despota Stefana (kod crkve)</div>
                <div class="text-red-600 font-bold text-[11px] flex items-center gap-1 mt-0.5">
                  <AlertTriangle class="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>NEMA BROJ ZGRADE, NEMA STAN</span>
                </div>
                <div>11000 BEOGRAD</div>
                <div>Tel: 063/123-xxx (Isključen telefon)</div>
              </div>
              <div class="border-t border-slate-300 pt-2 flex justify-between items-center text-[11px]">
                <span>OTKUPNINA: 3.200 RSD</span>
                <span class="text-red-700 font-bold">POVRAT: +410 RSD</span>
              </div>
            </div>

            <div class="mt-4 text-xs text-red-400 font-mono leading-relaxed">
              {t('man_bad_footer')}
            </div>
          </div>

          {/* Verified Good Label */}
          <div class="glass-panel border-emerald-500/30 p-6 rounded-lg relative overflow-hidden">
            <div class="absolute top-3 right-3 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              POTVRDIO VALIDIRANO
            </div>
            <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('man_good_title')}</span>
            </h3>

            <div class="thermal-label p-4 rounded text-xs space-y-3 select-none">
              <div class="flex justify-between border-b border-slate-300 pb-2">
                <span class="font-bold">VERIFIKOVANA ADRESNICA</span>
                <span class="text-[11px] font-bold text-emerald-800">POTVRDIO #7489</span>
              </div>
              <div>
                <div class="text-[10px] text-slate-500">PRIMALAC (KUPAC POTVRDIO NA VIBERU):</div>
                <div class="font-bold text-slate-900">Goran Ninković</div>
                <div>Bulevar Despota Stefana br. 114</div>
                <div class="text-emerald-700 font-bold text-[11px] flex items-center gap-1 mt-0.5">
                  <Check class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ulaz 2, Sprat 4, Stan 18 (Interfon radi)</span>
                </div>
                <div>11000 BEOGRAD</div>
                <div>Tel: +381 63 948 2190 (Proveren prijem)</div>
              </div>
              <div class="border-t border-slate-300 pt-2 flex justify-between items-center text-[11px]">
                <span>OTKUPNINA: 3.200 RSD</span>
                <span class="text-emerald-800 font-bold">ISPORUKA: 98.4%</span>
              </div>
            </div>

            <div class="mt-4 text-xs text-emerald-400 font-mono leading-relaxed">
              {t('man_good_footer')}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: Return Freight Loss ROI Calculator */}
      <section id="kalkulator" class="max-w-7xl mx-auto px-5 py-20 border-b border-white/10">
        <div class="max-w-3xl mb-12">
          <div class="text-xs font-mono text-[#14B8A6] uppercase tracking-wider mb-1">{t('calc_tag')}</div>
          <h2 class="text-2xl font-bold text-white tracking-tight">{t('calc_title')}</h2>
          <p class="text-sm text-slate-400 mt-2">{t('calc_desc')}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel p-6 sm:p-8 rounded-lg">
          <div class="lg:col-span-7 space-y-7">
            <div>
              <div class="flex justify-between items-center text-xs font-mono mb-2">
                <span class="text-white font-medium">{t('calc_label_orders')}</span>
                <span class="text-[#14B8A6] font-bold text-sm bg-[#070A13] px-2.5 py-1 rounded border border-white/10">
                  {ordersCount} {lang === 'sr' ? 'narudžbina' : 'orders'}
                </span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="2500" 
                step="50" 
                value={ordersCount} 
                onChange={(e) => setOrdersCount(Number(e.target.value))}
                class="w-full h-2 bg-[#070A13] rounded appearance-none cursor-pointer border border-white/10"
              />
              <div class="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                <span>50 (Mala radnja)</span>
                <span>750 (Rastući brend)</span>
                <span>2.500+ (Veliki shop)</span>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center text-xs font-mono mb-2">
                <span class="text-white font-medium">{t('calc_label_rate')}</span>
                <span class="text-red-400 font-bold text-sm bg-[#070A13] px-2.5 py-1 rounded border border-white/10">
                  {failureRate}%
                </span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="25" 
                step="1" 
                value={failureRate} 
                onChange={(e) => setFailureRate(Number(e.target.value))}
                class="w-full h-2 bg-[#070A13] rounded appearance-none cursor-pointer border border-white/10"
              />
              <div class="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                <span>4% (Idealno)</span>
                <span>13% (Prosek Srbije)</span>
                <span>25% (Kritičan gubitak)</span>
              </div>
            </div>

            <div class="p-3 bg-[#070A13] rounded border border-white/10 text-xs font-mono flex flex-wrap justify-between items-center gap-2 text-slate-400">
              <span>Trošak duple poštarine (slanje + povrat):</span>
              <span class="text-white font-bold">780 RSD (~6.65 €)</span>
            </div>
          </div>

          <div class="lg:col-span-5 bg-[#0D121F] border border-white/10 p-6 rounded-lg text-center space-y-5">
            <div>
              <div class="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {t('calc_loss_head')}
              </div>
              <div class="text-3xl font-mono font-bold text-red-400 mt-1 tracking-tight">
                {annualLossRsd.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} RSD
              </div>
              <div class="text-xs text-slate-400 font-mono mt-0.5">
                (~{annualLossEur.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} € {lang === 'sr' ? '/ godišnje' : '/ year'})
              </div>
            </div>

            <div class="pt-5 border-t border-white/10">
              <div class="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                {t('calc_saved_head')}
              </div>
              <div class="text-2xl font-mono font-bold text-emerald-400 mt-1">
                {annualSavedRsd.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} RSD
              </div>
              <div class="text-[11px] text-slate-400 font-mono mt-1">
                {t('calc_roi_note')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: Credit Pool PAYG Pricing */}
      <section id="cenovnik" class="max-w-7xl mx-auto px-5 py-20 border-b border-white/10">
        <div class="mb-12">
          <div class="text-xs font-mono text-[#14B8A6] uppercase tracking-wider mb-1">{t('price_tag')}</div>
          <h2 class="text-2xl font-bold text-white tracking-tight">{t('price_title')}</h2>
          <p class="text-sm text-slate-400 mt-2 max-w-2xl">{t('price_desc')}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div class="lg:col-span-8 glass-panel rounded-lg overflow-hidden">
            <div class="px-5 py-3 border-b border-white/10 bg-[#0D121F] flex justify-between items-center text-xs font-mono">
              <span class="font-bold text-white">Prepaid Dopuna (Krediti nikada ne ističu)</span>
              <span class="text-slate-400">Faktura za pravna lica (RSD / EUR)</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs font-mono">
                <thead class="bg-[#070A13] text-slate-400 border-b border-white/10 text-[11px]">
                  <tr>
                    <th class="p-4 font-normal">{t('th_tier')}</th>
                    <th class="p-4 font-normal">{t('th_deposit')}</th>
                    <th class="p-4 font-normal">{t('th_viber_rate')}</th>
                    <th class="p-4 font-normal">{t('th_sms_rate')}</th>
                    <th class="p-4 font-normal text-right">Izbor</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10 text-slate-300">
                  <tr class="hover:bg-[#0D121F]/50 transition">
                    <td class="p-4 font-bold text-white">Starter Pool</td>
                    <td class="p-4 font-bold text-white">15 €</td>
                    <td class="p-4 text-emerald-400 font-bold">0.026 €</td>
                    <td class="p-4 text-slate-400">0.048 €</td>
                    <td class="p-4 text-right">
                      <button onClick={playClickSound} class="px-3 py-1 rounded bg-[#0D121F] hover:bg-white/10 border border-white/10 text-white text-[11px] transition cursor-pointer">
                        Izaberi
                      </button>
                    </td>
                  </tr>
                  <tr class="bg-[#14B8A6]/5 hover:bg-[#14B8A6]/10 transition">
                    <td class="p-4 font-bold text-white flex items-center gap-2">
                      Growth Pool
                      <span class="text-[9px] bg-[#14B8A6]/20 text-[#14B8A6] px-1.5 py-0.5 rounded border border-[#14B8A6]/30">NAJČEŠĆE</span>
                    </td>
                    <td class="p-4 font-bold text-white">45 €</td>
                    <td class="p-4 text-emerald-400 font-bold">0.024 €</td>
                    <td class="p-4 text-slate-400">0.042 €</td>
                    <td class="p-4 text-right">
                      <button onClick={playClickSound} class="px-3 py-1 rounded bg-[#14B8A6] hover:bg-[#0F766E] text-black font-bold text-[11px] transition cursor-pointer">
                        Izaberi
                      </button>
                    </td>
                  </tr>
                  <tr class="hover:bg-[#0D121F]/50 transition">
                    <td class="p-4 font-bold text-white">Scale Volume</td>
                    <td class="p-4 font-bold text-white">120 €</td>
                    <td class="p-4 text-emerald-400 font-bold">0.020 €</td>
                    <td class="p-4 text-slate-400">0.038 €</td>
                    <td class="p-4 text-right">
                      <button onClick={playClickSound} class="px-3 py-1 rounded bg-[#0D121F] hover:bg-white/10 border border-white/10 text-white text-[11px] transition cursor-pointer">
                        Izaberi
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="p-4 bg-[#070A13] border-t border-white/10 text-[11px] text-slate-400 font-mono flex items-start gap-1.5">
              <ShieldCheck class="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
              <span>{t('price_note')}</span>
            </div>
          </div>

          {/* Pro Reserve */}
          <div class="lg:col-span-4 glass-panel rounded-lg p-6 font-mono text-xs">
            <div class="text-[10px] text-[#14B8A6] uppercase tracking-wider mb-2 font-bold">{t('pro_tag')}</div>
            <h3 class="text-base font-bold text-white font-sans">Pro Reserve Pretplata</h3>
            <div class="mt-3 flex items-baseline gap-1">
              <span class="text-3xl font-bold text-white font-mono">29 €</span>
              <span class="text-slate-400 text-xs">/ mesečno</span>
            </div>
            <p class="text-slate-400 text-[11px] mt-2 leading-relaxed">
              Uključuje <strong class="text-white">1.800 verifikacija</strong> (~0.016 € po poruci). Prioritetna Viber linija sa direktnim prolazom bez čekanja.
            </p>

            <ul class="space-y-2.5 my-5 text-slate-300 text-[11px]">
              <li class="flex items-center gap-2">
                <Check class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>1.800 uključenih kredita / mesec</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Automatski oporavak napuštenih korpi</span>
              </li>
              <li class="flex items-center gap-2">
                <Check class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>HPOS i WP-CLI tehnička podrška</span>
              </li>
            </ul>

            <button 
              onClick={playClickSound}
              class="w-full btn-brand-cta text-white font-bold py-2.5 rounded text-xs transition shadow-sm cursor-pointer"
            >
              {t('btn_act_pro')}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 05: Legal Framework & Code Integration */}
      <section id="integracija" class="max-w-7xl mx-auto px-5 py-20 border-b border-white/10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div class="lg:col-span-6 space-y-4">
            <div class="text-xs font-mono text-[#14B8A6] uppercase tracking-wider mb-1">{t('leg_tag')}</div>
            <h2 class="text-2xl font-bold text-white tracking-tight">{t('leg_title')}</h2>
            <p class="text-xs text-slate-400 leading-relaxed">{t('leg_p')}</p>

            <div class="space-y-3 font-mono text-xs pt-2">
              <div class="p-3.5 rounded glass-panel">
                <div class="text-white font-bold mb-1">1. Izvršenje ugovora (Član 12 ZZPL)</div>
                <div class="text-slate-400 text-[11px] leading-relaxed">
                  Kupac je sam uneo broj na checkout stranici. Verifikacija adrese je neophodan korak za isporuku robe.
                </div>
              </div>
              <div class="p-3.5 rounded glass-panel">
                <div class="text-white font-bold mb-1">2. Automatsko brisanje (Retention 30 dana)</div>
                <div class="text-slate-400 text-[11px] leading-relaxed">
                  Brojevi telefona i tokeni se automatski brišu i anonimizuju iz sistema 30 dana nakon isporuke pošiljke.
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-6 space-y-4">
            <div class="text-xs font-mono text-[#14B8A6] uppercase tracking-wider mb-1">{t('dev_tag')}</div>
            <h2 class="text-2xl font-bold text-white tracking-tight">{t('dev_title')}</h2>
            
            <div class="bg-[#070A13] border border-white/10 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
              <div class="text-slate-400 text-[11px] mb-2">// 1. Interception filter u functions.php ili pluginu</div>
              <div class="text-[#14B8A6]">add_action('woocommerce_checkout_order_processed', function($order_id) &#123;</div>
              <div class="pl-4 text-slate-400">$order = wc_get_order($order_id);</div>
              <div class="pl-4 text-slate-400">if ($order-&gt;get_payment_method() === 'cod') &#123;</div>
              <div class="pl-8 text-emerald-400">$order-&gt;update_status('on-hold', 'Potvrdio: Čeka Viber potvrdu kupca');</div>
              <div class="pl-8 text-slate-300">Potvrdio_Client::dispatch_viber_session($order);</div>
              <div class="pl-4 text-slate-400">&#125;</div>
              <div class="text-[#14B8A6]">&#125;);</div>
            </div>

            <div class="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Testirano na WooCommerce 7.0 do 9.x sa High-Performance Order Storage (HPOS) uključenim.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06: Download & Installation CTA */}
      <section id="preuzmi" class="max-w-7xl mx-auto px-5 py-20 text-center">
        <div class="max-w-2xl mx-auto glass-panel p-8 sm:p-12 rounded-xl">
          <div class="w-12 h-12 rounded bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] flex items-center justify-center mx-auto mb-4">
            <Download class="w-6 h-6" />
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t('dl_title')}</h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-3 max-w-md mx-auto">{t('dl_desc')}</p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button 
              onClick={playScannerBeep}
              class="w-full sm:w-auto px-6 py-3 btn-brand-cta text-white font-bold text-xs rounded transition shadow-lg cursor-pointer"
            >
              {t('btn_dl_full')}
            </button>
            <a 
              href="#lab" 
              class="w-full sm:w-auto px-5 py-3 bg-[#0D121F] hover:bg-white/10 text-white border border-white/10 text-xs rounded font-mono transition"
            >
              {t('btn_view_demo')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="border-t border-white/10 bg-[#070A13] py-8 text-xs text-slate-400 font-mono mt-auto">
        <div class="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <div class="flex items-center gap-2">
            <span class="text-white font-bold">potvrdio.online</span>
            <span>— Regionalna infrastruktura za WooCommerce pouzeće</span>
          </div>
          <div class="flex items-center gap-4">
            <span>Novi Sad / Beograd</span>
            <span>·</span>
            <a href="mailto:kontakt@potvrdio.online" class="hover:text-white transition">kontakt@potvrdio.online</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
