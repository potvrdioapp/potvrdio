import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, Download, AlertTriangle, ArrowDown, ChevronRight, 
  RotateCcw, ShieldCheck, Terminal, MapPin, CheckCircle2, XCircle,
  X, Lock, Menu, HelpCircle, ChevronDown, Rocket, Sun, Moon,
  Package, Key, Send, Clock, Sparkles, Info
} from 'lucide-react';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsConditionsModal } from './components/TermsConditionsModal';
import { RefundPolicyModal } from './components/RefundPolicyModal';
import { DeliveryPolicyModal } from './components/DeliveryPolicyModal';
import { CookiePolicyModal } from './components/CookiePolicyModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PotvrdioLogo } from './components/PotvrdioLogo';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { Footer } from './components/Footer';

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
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Ignore audio context errors
  }
}

type Lang = 'sr' | 'mk' | 'en';
type Theme = 'dark' | 'light';

export default function App() {
  const [lang, setLang] = useState<Lang>('sr');
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
    playClickSound();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [currentScenario, setCurrentScenario] = useState<number>(1);
  const [simState, setSimState] = useState<'initial' | 'confirmed' | 'edited'>('initial');
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState<boolean>(false);
  const [showCookieModal, setShowCookieModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Deep-link / pathname checking for bank audits (e.g. /uslovi-koriscenja, /reklamacije-i-povracaj)
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('uslovi-koriscenja')) {
      setShowTermsModal(true);
    } else if (path.includes('politika-privatnosti')) {
      setShowPrivacyModal(true);
    } else if (path.includes('reklamacije-i-povracaj')) {
      setShowRefundModal(true);
    } else if (path.includes('isporuka-usluga')) {
      setShowDeliveryModal(true);
    } else if (path.includes('politika-kolacica')) {
      setShowCookieModal(true);
    }
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [floorInput, setFloorInput] = useState<string>('3');
  const [aptInput, setAptInput] = useState<string>('14');
  
  // Dynamic Simulator Arrow Tracking
  const phoneContainerRef = useRef<HTMLDivElement | null>(null);
  const [arrowTop, setArrowTop] = useState<number>(380);

  useEffect(() => {
    const updatePosition = () => {
      if (!phoneContainerRef.current) return;
      const targetSelector = showAddressModal 
        ? '[data-sim-target="save"]'
        : currentScenario === 1 
          ? '[data-sim-target="edit"]'
          : '[data-sim-target="confirm"]';

      const targetBtn = phoneContainerRef.current.querySelector<HTMLButtonElement>(targetSelector);
      if (targetBtn && phoneContainerRef.current) {
        const phoneRect = phoneContainerRef.current.getBoundingClientRect();
        const btnRect = targetBtn.getBoundingClientRect();
        if (btnRect.height > 0 && phoneRect.height > 0) {
          const relativeTop = (btnRect.top - phoneRect.top) + (btnRect.height / 2);
          setArrowTop(Math.round(relativeTop));
        }
      }
    };

    updatePosition();
    const t1 = setTimeout(updatePosition, 60);
    const t2 = setTimeout(updatePosition, 320);

    window.addEventListener('resize', updatePosition);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', updatePosition);
    };
  }, [currentScenario, showAddressModal, simState, lang]);

  // ROI Calculator States
  const [ordersCount, setOrdersCount] = useState<number>(450);
  const [failureRate, setFailureRate] = useState<number>(13);

  const t = (key: string): string => {
    const translations: Record<Lang, Record<string, string>> = {
      sr: {
        top_networks: "Post Express, D Express, Bex, City Express",
        nav_sub: "Lojistička COD Zaštita · WP v2.1",
        nav_how: "Kako radi",
        nav_calc: "Kalkulator",
        nav_pricing: "Cenovnik",
        nav_integration: "Integracija",
        nav_lab: "Kako radi",
        nav_manifest: "Tačnost adresnice",
        nav_dev: "Integracija",
        btn_dl: "Preuzmi ZIP",
        hero_tag: "WooCommerce Plaćanje Pouzećem (COD)",
        hero_title: "Kupac ne preuzme paket, vi plaćate duplu poštarinu. Zaustavite to pre slanja.",
        hero_p: "Potvrdio automatski verifikuje kupca i adresu preko Vibera pre pakovanja. Lažne i nepotpune porudžbine se zaustavljaju na vreme - bez ručnih poziva i sa 80% manje povrata.",
        hero_cta_primary: "Pogledaj kako radi",
        hero_free_credits: "besplatnih verifikacija uključeno uz plugin",
        stat_open_rate: "Odziv poruke",
        stat_open_sub: "Viber unutar 4 min.",
        stat_hold_cost: "Gubitak po paketu",
        stat_hold_sub: "Dupla poštarina kurira",
        stat_recovery: "Pad povrata",
        stat_recovery_sub: "Sa 14.8% na 2.5%",
        hero_box_note: "Paket se fizički ne preuzima iz skladišta dok kupac ne klikne potvrdu na Viberu. Time se rizik praznog hoda kurira svodi na nulu.",
        lab_tag: "01 / KAKO RADI",
        lab_title: "Automatska Viber verifikacija u realnom vremenu",
        lab_subtitle: "Isprobajte 3 realna scenarija iz balkanske prakse:",
        scen1_title: "Nepotpuna adresa (Novi Sad)",
        scen1_desc: "Kupac je zaboravio broj stana i sprat. Koriguje podatke jednim klikom preko token linka.",
        scen2_title: "Kupac se predomislio (Niš)",
        scen2_desc: "Kupac ignoriše Viber poruku i SMS. Paket ostaje u skladištu, a prodavac štedi 820 RSD.",
        scen3_title: "Potvrda jednim klikom (Kragujevac)",
        scen3_desc: "Verifikacija u jednom dodiru. Webhook automatski generiše Post Express adresnicu.",
        scen_common_tag: "Uobičajeno (62%)",
        scen_saved_tag: "Izbegnut trošak",
        scen_fast_tag: "< 30 sekundi",
        viber_verified_title: "Verifikacija",
        viber_verified_badge: "VERIFIKOVANO",
        viber_greeting: "Zdravo",
        viber_order_received: "Primili smo tvoju porudžbinu",
        viber_shipping_address: "ADRESA ZA DOSTAVU:",
        viber_confirm_prompt: "Molimo te da potvrdiš tačnost pre nego što paket predamo kuriru:",
        scen1_warning: "⚠️ Upozorenje: Nedostaje broj stana i sprat (Rizik neuručenja)",
        scen2_warning: "⏱️ Poruka ignorisana. Nema odgovora 24h. Paket zadržan u skladištu!",
        viber_btn_yes: "DA, ADRESA JE TAČNA",
        viber_btn_edit: "IZMENI ADRESU",
        scen1_btn_badge: "👉 Kliknite ovde: Dopunite sprat i stan",
        scen3_btn_badge: "⚡ Kliknite ovde: Potvrdite u 1 klik",
        scen1_wrong_click_hint: "Adresa je nepotpuna (nedostaje stan). Kliknite na „IZMENI ADRESU” ispod da vidite automatsku dopunu!",
        scen_btn_not_recommended: "Nije preporučeno (fali stan)",
        scen_btn_force_confirm: "Ipak potvrdi bez stana",
        viber_success_confirmed: "Potvrđeno bez izmena! Paket je spreman za štampu adresnice.",
        viber_success_edited: "Adresa dopunjena! Dodat sprat i stan. WooCommerce ažuriran.",
        status_saved: "SAČUVANO: Paket nije poslat, 820 RSD u džepu",
        status_approved: "ODOBRENO: Štampaj Post Express adresnicu",
        status_waiting: "ČEKANJE: Ne pakovati paket iz magacina",
        term_title: "Real-Time WP Event Terminal",
        term_risk_status: "Status Magacina",
        btn_restart_sim: "Restartuj test",
        man_tag: "01.1 / TAČNOST ADRESNICE",
        man_title: "Zašto kuriri vraćaju pakete? Anatomija neispravne adresnice",
        man_p: "Kurir ima prosečno 45 sekundi po adresi. Ako nema sprat, stan ili ako je unet stari broj telefona, kurir stavlja oznaku 'Izvešten - Nije preuzet'. Kada se to desi, trošak povratnog prevoza pada na teret internet prodavnice.",
        man_bad_title: "Standardni WooCommerce Unos (Visok rizik povrata)",
        man_bad_footer: "Rezultat: Kurir ne može da nađe ulaz. Pošiljka stoji u pošti 5 dana, vraća se prodavcu. Gubitak: 780 RSD.",
        man_good_title: "Čista Adresnica nakon Viber Potvrde",
        man_good_footer: "Rezultat: Kurir pronalazi interfon u prvom pokušaju. Kupac očekuje paket i priprema tačan iznos otkupnine.",
        calc_tag: "02 / KALKULATOR UŠTEDE",
        calc_title: "Izračunajte godišnje curenje profita na kurirskim službama",
        calc_desc: "Kalkulacija uračunava zvanične cene kurirskih službi u regionu za pakete do 2kg sa otkupninom.",
        calc_label_orders: "Broj narudžbina pouzećem mesečno:",
        calc_label_rate: "Procenat neuručenih paketa:",
        calc_loss_head: "Godišnji direktan gubitak na poštarinama",
        calc_saved_head: "Neto sačuvano uz Potvrdio:",
        calc_roi_note: "Nakon odbitka cene utrošenih Viber kredita (ROI > 14x)",
        price_tag: "03 / CENOVNIK KREDITA (BEZ PRETPLATE)",
        price_title: "Plaćate samo poslate poruke. Bez ikakve obavezne pretplate.",
        price_desc: "Zaboravite skupe fiksne zakupe od 150€+ kod agregatora. Dopunjavate kredite po potrebi, plaćate samo uspešno isporučene verifikacije, a kupljeni krediti nikada ne ističu.",
        th_tier: "Paket",
        th_deposit: "Iznos uplate",
        th_viber_rate: "Viber cena",
        th_sms_rate: "SMS Fallback",
        price_note: "Obračun se vrši u dinarima po srednjem kursu NBS na dan izdavanja e-fakture. Bez automatskih skidanja sa kartice bez vašeg odobrenja. SMS je zbog troškova operatera u Srbiji znatno skuplji kanal od Vibera, zato preporučujemo da kad god je moguće koristite Viber.",
        pro_tag: "Opciono: Za veće radnje (> 500 porudžbina)",
        btn_act_pro: "Izaberi Pro Opciju",
        leg_tag: "04.1 / PRAVNA USKLAĐENOST & PRIVATNOST",
        leg_title: "Pravno Bezbedno i Usklađeno sa Zakonom",
        leg_p: "Slanje verifikacionih poruka funkcioniše isključivo na osnovu Člana 12 Zakona o zaštiti podataka o ličnosti RS (Službeni glasnik 87/2018), Člana 10 ZZLP Severne Makedonije i Člana 6(1)(b) EU GDPR. Obrada je zakonski neophodna za izvršenje ugovora o kupoprodaji na daljinu.",
        leg_bottom_note: "100% u skladu sa zvaničnim smernicama Poverenika za informacije od javnog značaja i ZZPL RS.",
        dev_tag: "04.2 / BRZA INSTALACIJA",
        dev_title: "Instalacija za 2 minuta - bez pisanja koda",
        dev_p: "Zvanični WordPress dodatak se instalira u nekoliko klikova, bez menjanja tema ili uređivanja functions.php koda. Potpuno kompatibilan sa WooCommerce HPOS sistemom i svim checkout funnel-ima.",
        dev_step1_title: "1. Preuzmite WordPress dodatak",
        dev_step1_desc: "Instalirajte besplatni Potvrdio plugin u vašem WordPress adminu (Plugins → Add New → Upload .zip).",
        dev_step2_title: "2. Povežite vaš API ključ",
        dev_step2_desc: "Nakon besplatne registracije, unesite licencni ključ sa kontrolne table u podešavanja eklentije.",
        dev_step3_title: "3. Automatizovana zaštita je aktivna",
        dev_step3_desc: "Potvrdio automatski zaustavlja rizične COD porudžbine na On-Hold statusu i traži potvrdu kupca pre slanja.",
        dl_title: "Zaustavite troškove povrata već u sledećoj turi slanja",
        dl_desc: "Preuzmite besplatan ZIP, aktivirajte ga u WordPress adminu i odmah dobijate 25 besplatnih verifikacionih sesija.",
        btn_dl_full: "Preuzmi Potvrdio WordPress Plugin (.zip)",
        btn_view_demo: "Pogledaj demo uživo",
        modal_title: "Ažuriranje adrese za dostavu",
        modal_subtitle: "Dopunite podatke da kurir brže pronađe Vaš ulaz",
        modal_street: "Ulica i broj",
        modal_floor: "Sprat",
        modal_apt: "Broj stana",
        modal_intercom: "Interfon / Napomena za kurira",
        modal_btn_save: "Sačuvaj i Potvrdi Adresu",
        man_badge_bad: "BEZ POTVRDIO ALATA",
        man_badge_good: "POTVRDIO VERIFIKACIJA",
        man_label_header_bad: "POST EXPRESS - STANDARD",
        man_label_header_good: "POST EXPRESS - VERIFIED",
        man_recipient_bad: "PRIMALAC:",
        man_recipient_good: "PRIMALAC (KUPAC POTVRDIO NA VIBERU):",
        man_bad_warning: "NEMA BROJ ZGRADE, NEMA STAN",
        man_bad_phone: "Tel: 063/123-xxx (Isključen telefon)",
        man_good_apt: "Ulaz 2, Sprat 4, Stan 18 (Interfon radi)",
        man_good_phone: "Tel: +381 63 948 2190 (Proveren prijem)",
        man_cod: "OTKUPNINA: 3.200 RSD",
        man_bad_return: "POVRAT: +410 RSD",
        man_good_delivery: "ISPORUKA: 98.4%",
        price_prepaid_header: "Prepaid Dopuna Kredita (Krediti nikada ne ističu)",
        price_invoice_sub: "Faktura za pravna lica (RSD / EUR)",
        price_badge_popular: "NAJČEŠĆE",
        price_btn_select: "Izaberi",
        price_pro_title: "Pro Reserve Paket",
        price_per_month: "/ mesečno",
        price_pro_desc: "Za radnje sa preko 500 porudžbina mesečno kojima je potreban namenski prioritetni prolaz i tehnička podrška. (Standardni sistem je 0€ pretplata).",
        price_pro_feat1: "1.800 uključenih kredita / mesec",
        price_pro_credit_ratio: "1 Viber poruka = 1 kredit. 1 SMS poruka = 11 kredita.",
        price_pro_tooltip: "SMS poruke zbog troškova operatera troše više kredita. Vaši krediti traju znatno duže kada se koristi Viber.",
        price_pro_feat2: "Automatski oporavak napuštenih korpi",
        price_pro_feat3: "HPOS i WP-CLI tehnička podrška",
        calc_rate_ideal: "4% (Idealno)",
        calc_rate_avg: "13% (Prosek Srbije)",
        calc_rate_high: "25% (Kritičan gubitak)",
        calc_freight_note: "Trošak duple poštarine (slanje + povrat):",
        leg_item1_title: "1. Izvršenje Ugovora o Kupoprodaji (ZZPL Član 12.1.2)",
        leg_item1_desc: "Kupac samostalno unosi broj telefona na checkout stranici. Verifikacija adrese pre predaje kuriru predstavlja ugovornu obavezu dostave robe. Dodatna saglasnost za marketing nije potrebna jer poruke nisu reklamne.",
        leg_item2_title: "2. Automatska Anonimizacija & Data Retention (30 Dana)",
        leg_item2_desc: "Brojevi telefona i jednokratni verifikacioni tokeni se automatski anonimizuju i trajno brišu sa procesnih servera 30 dana nakon uručenja. Nema profilisanja niti deljenja trećim licima.",
        leg_item3_title: "3. Enkripcija & Jednokratni Passwordless Tokeni",
        leg_item3_desc: "Korekcija adrese se vrši preko jedinstvenog HMAC-SHA256 tokena preko TLS 1.3 enkripcije. Potvrdio nema pristup privatnim Viber porukama kupca niti platnim karticama.",
        modal_legal_notice: "🔒 Kriptografski HMAC Token · Usklađeno sa Čl. 12 ZZPL RS & GDPR Art. 6",
        footer_privacy: "Politika Privatnosti",
        footer_terms: "Uslovi Korišćenja",
        dev_code_comment: "// 1. Presretanje porudžbine u functions.php ili pluginu",
        dev_status_note: "Potvrdio: Čeka Viber potvrdu kupca",
        dev_hpos_note: "100% kompatibilno sa WooCommerce 7.0 do 9.x sa uključenim HPOS-om.",
        footer_sub: "Regionalna infrastruktura za WooCommerce pouzeće",
        footer_location: "Novi Sad / Beograd",
        top_gateway: "Zvanični Viber & SMS poslovni kanal",
        top_protocol: "Protokol: ZZPL (RS) Član 12 & GDPR",
        top_avg_penalty: "Avg. Dupla Poštarina: 780 RSD",
        hero_no_sub: "0€ Pretplata",
        stat_hold_val: "~780 RSD",
        order_word: "Porudžbina",
        dash_customer_name: "Jelena Kovačević",
        dash_order_amount: "5.420 RSD",
        dash_address: "Bulevar cara Lazara 78, sprat 4, stan 19, Novi Sad",
        dash_courier: "Kurirska služba:",
        dash_courier_val: "Post Express (Danas za sutra)",
        dash_risk_label: "Rizik neuručenja:",
        dash_risk_val: "790 RSD (Trošak magacina)",
        dash_order_status_label: "Stanje narudžbine:",
        dash_label_print_label: "Štampanje adresnice:",
        dash_label_blocked: "BLOKIRANO (Zaštita od troška)",
        term_log_cod: "(COD Plaćanje pouzećem)",
        term_sms_log: 'SMS Fallback poslat: "Potvrdite porudžbinu na potvrdio.online..."',
        term_saved_log: "[14:02:01] REZULTAT: Sačuvano 820 RSD duple poštarine!",
        term_waiting_log: "> Čeka se odgovor kupca na Viberu...",
        man_bad_name: "Goran Ninković",
        man_bad_addr1: "Bulevar Despota Stefana (kod crkve)",
        man_bad_city: "11000 BEOGRAD",
        man_good_name: "Goran Ninković",
        man_good_addr1: "Bulevar Despota Stefana br. 114",
        man_good_city: "11000 BEOGRAD",
        calc_freight_val: "780 RSD (~6.65 €)",
        modal_badge: "Passwordless Token Verifikacija",
        nav_btn_register: "Registracija (25 Kredita)",
        hero_btn_activate: "Aktiviraj 25 besplatnih verifikacija",
        scen2_ignored_notice: "Kupac nije odgovorio 24h. Porudžbina stornirana pre pakovanja.",
        calc_orders_unit: "narudžbina",
        modal_alert_tip: "⚡ Popunite sprat i stan kako bi kurir bez zastoja pronašao vaš ulaz.",
        faq_tag: "05 / Često Postavljana Pitanja",
        faq_title: "Sve što treba da znate o Potvrdio COD verifikaciji",
        faq_sub: "Odgovori na ključna tehnička, pravna i operativna pitanja trgovaca.",
        floor_word: "Sprat",
        apt_word: "Stan"
      },
      mk: {
        top_networks: "Post Express, D Express, Cargo Express, Via Courier",
        nav_sub: "Логистичка COD Заштита · WP v2.1",
        nav_how: "Како работи",
        nav_calc: "Калкулатор",
        nav_pricing: "Ценовник",
        nav_integration: "Интеграција",
        nav_lab: "Како работи",
        nav_manifest: "Точност на адреса",
        nav_dev: "Интеграција",
        btn_dl: "Преземи ZIP",
        hero_tag: "WooCommerce Заштита на плаќање при преземање (COD)",
        hero_title: "Купувачот не го подигнува пакетот, вие плаќате двојна поштарина. Спречете го тоа пред испраќање.",
        hero_p: "Potvrdio автоматски го верификува купувачот и адресата преку Viber пред пакување. Лажните и некомплетни нарачки се запираат навреме - без телефонски повици и со 80% помалку вратени пратки.",
        hero_cta_primary: "Погледни како работи",
        hero_free_credits: "бесплатни верификации вклучени со приклучокот",
        stat_open_rate: "Одзив на порака",
        stat_open_sub: "Viber во рок од 4 мин.",
        stat_hold_cost: "Загуба по пакет",
        stat_hold_sub: "Двојна курирска пошта",
        stat_recovery: "Пад на вратени пратки",
        stat_recovery_sub: "Од 14.8% на 2.5%",
        hero_box_note: "Пакетот физички не се подигнува од магацин додека купувачот не кликне потврда на Viber. Со тоа ризикот се сведува на нула.",
        lab_tag: "01 / КАКО РАБОТИ",
        lab_title: "Автоматска Viber верификација во реално време",
        lab_subtitle: "Кликнете на сценарио за да го видите однесувањето на Viber ботот и WooCommerce базата:",
        scen1_title: "Нецелосна адреса (Скопје)",
        scen1_desc: "Купувачот заборавил број на стан и кат. Ги корегира податоците со еден клик преку токен линк.",
        scen2_title: "Купувачот се премисли (Битола)",
        scen2_desc: "Купувачот ја игнорира Viber пораката и SMS. Пакетот останува во магацин, а продавачот заштедува 820 RSD.",
        scen3_title: "Потврда со еден клик (Охрид)",
        scen3_desc: "Верификација со еден допир. Webhook автоматски генерира адресар.",
        scen_common_tag: "Вообичаено (62%)",
        scen_saved_tag: "Избегнат трошок",
        scen_fast_tag: "< 30 секунди",
        viber_verified_title: "Верификација",
        viber_verified_badge: "ВЕРИФИКУВАНО",
        viber_greeting: "Здраво",
        viber_order_received: "Ја примивме твојата нарачка",
        viber_shipping_address: "АДРЕСА ЗА ДОСТАВА:",
        viber_confirm_prompt: "Те молиме потврди ја точноста пред да го предадеме пакетот на курир:",
        scen1_warning: "⚠️ Предупредување: Недостасува број на стан и кат (Ризик од неиспорака)",
        scen2_warning: "⏱️ Пораката е игнорирана. Нема одговор 24ч. Пакетот е задржан!",
        viber_btn_yes: "ДА, АДРЕСАТА Е ТОЧНА",
        viber_btn_edit: "ИЗМЕНИ ЈА АДРЕСАТА",
        scen1_btn_badge: "👉 Кликнете тука: Дополнете кат и стан",
        scen3_btn_badge: "⚡ Кликнете тука: Потврдете со 1 клик",
        scen1_wrong_click_hint: "Адресата е нецелосна (недостасува стан). Кликнете на „ИЗМЕНИ ЈА АДРЕСАТА“ подолу за автоматска исправка!",
        scen_btn_not_recommended: "Не се препорачува (недостасува стан)",
        scen_btn_force_confirm: "Сепак потврди без стан",
        viber_success_confirmed: "Потврдено без измени! Пакетот е подготвен за достава.",
        viber_success_edited: "Адресата е дополнета! Додаден кат и стан. WooCommerce е ажуриран.",
        status_saved: "ЗАШТЕДЕНО: Пакетот не е испратен, 820 RSD во џеб",
        status_approved: "ОДОБРЕНО: Печати адресар за достава",
        status_waiting: "ЧЕКАЊЕ: Не пакувај го пакетот од магацин",
        term_title: "Real-Time WP Event Terminal",
        term_risk_status: "Статус на магацин",
        btn_restart_sim: "Рестартирај тест",
        man_tag: "01.1 / ТОЧНОСТ НА АДРЕСАТА",
        man_title: "Зошто куририте враќаат пакети? Анатомија на неисправна адреса",
        man_p: "Курирот има просечно 45 секунди по адреса. Ако нема кат или стан, го означува како 'Неиспорачано'. Трошокот паѓа на продавачот.",
        man_bad_title: "Стандарден WooCommerce Внос (Висок ризик)",
        man_bad_footer: "Резултат: Курирот не може да ја најде зградата. Пакетот се враќа на продавачот. Загуба: 780 RSD.",
        man_good_title: "Чист адресар по Viber потврда",
        man_good_footer: "Резултат: Курирот го наоѓа интерфонот од прв обид. Купувачот го очекува пакетот.",
        calc_tag: "02 / КАЛКУЛАТОР ЗА ЗАШТЕДА",
        calc_title: "Преметајте ги годишните загуби на курирски услуги",
        calc_desc: "Калкулацијата ги зема предвид официјалните ценовници на курирските служби во регионот.",
        calc_label_orders: "Месечен број на COD нарачки:",
        calc_label_rate: "Процент на неиспорачани пакети:",
        calc_loss_head: "Годишна директна загуба од поштарина",
        calc_saved_head: "Нето заштедено со Potvrdio:",
        calc_roi_note: "По одземање на трошокот за Viber кредити (ROI > 14x)",
        price_tag: "03 / ЦЕНОВНИК ЗА КРЕДИТИ (БЕЗ ПРЕТПЛАТА)",
        price_title: "Плаќате само за испратени пораки. Без задолжителна претплата.",
        price_desc: "Заборавете ги скапите фиксни закупнини од 150€+. Дополнувате кредити по потреба, плаќате само испратени пораки, а купените кредити никогаш не истекуваат.",
        th_tier: "Пакет",
        th_deposit: "Износ за уплата",
        th_viber_rate: "Viber цена",
        th_sms_rate: "SMS Fallback",
        price_note: "Фактурирање во денари/евра. Без автоматско одземање од картичка. SMS пораките поради трошоците на операторите во регионот се значително поскап канал од Viber, затоа препорачуваме секогаш кога е можно да користите Viber.",
        pro_tag: "Опционо: За поголеми продавници (> 500 нарачки)",
        btn_act_pro: "Избери Pro Опција",
        leg_tag: "04.1 / ПРАВНА СООДВЕТНОСТ И ПРИВАТНОСТ",
        leg_title: "Правно Безбедно и Усогласено со Законот",
        leg_p: "Испраќањето верификациски пораки функционира исклучиво врз основа на Член 10 од Законот за заштита на личните податоци на С. Македонија (АЗЛП), Член 12 од ZZPL RS и Член 6(1)(b) од EU GDPR. Обработката е законски неопходна за исполнување на купопродажниот договор.",
        leg_bottom_note: "100% во согласност со насоките на Агенцијата за заштита на личните податоци (АЗЛП).",
        dev_tag: "04.2 / БРЗА ИНСТАЛАЦИЈА",
        dev_title: "Инсталација за 2 минути - без програмирање",
        dev_p: "Официјалниот WordPress додаток се инсталира со неколку клика, без менување на кодот на темата или уредување на functions.php. Целосно компатибилен со WooCommerce HPOS и прилагодени checkout текови.",
        dev_step1_title: "1. Преземете го бесплатниот WordPress додаток",
        dev_step1_desc: "Инсталирајте го Potvrdio со еден клик преку вашиот WordPress админ панел (Plugins → Add New → Upload .zip).",
        dev_step2_title: "2. Поврзете го вашиот API клуч",
        dev_step2_desc: "По бесплатната регистрација, внесете го лиценчниот клуч од контролниот панел во поставките.",
        dev_step3_title: "3. Автоматизираната заштита е активна",
        dev_step3_desc: "Potvrdio автоматски ги задржува ризичните COD нарачки и бара потврда од купувачот пред испраќање.",
        dl_title: "Запрете ги трошоците за враќање уште при следната достава",
        dl_desc: "Преземете го бесплатниот ZIP, активирајте го во WordPress и добијте 25 бесплатни кредити.",
        btn_dl_full: "Преземи Potvrdio WordPress Plugin (.zip)",
        btn_view_demo: "Погледај го демато во живо",
        modal_title: "Ажурирање на адреса за достава",
        modal_subtitle: "Дополнете ги податоците за курирот побрзо да го најде вашиот влез",
        modal_street: "Улица и број",
        modal_floor: "Кат",
        modal_apt: "Број на стан",
        modal_intercom: "Интерфон / Забелешка за курирот",
        modal_btn_save: "Зачувај и Потврди Адреса",
        man_badge_bad: "БЕЗ POTVRDIO АЛАТКА",
        man_badge_good: "POTVRDIO ВАЛИДИРАНО",
        man_label_header_bad: "СТАНДАРДЕН АДРЕСАР",
        man_label_header_good: "ВЕРИФИКУВАН АДРЕСАР",
        man_recipient_bad: "ПРИМАЧ:",
        man_recipient_good: "ПРИМАЧ (КУПУВАЧОТ ПОТВРДИ НА VIBER):",
        man_bad_warning: "НЕМА БРОЈ НА ЗГРАДА, НЕМА СТАН",
        man_bad_phone: "Тел: 063/123-xxx (Исклучен телефон)",
        man_good_apt: "Влез 2, Кат 4, Стан 18 (Интерфон работи)",
        man_good_phone: "Тел: +381 63 948 2190 (Проверен прием)",
        man_cod: "ОТКУПНИНА: 3.200 RSD",
        man_bad_return: "ВРАЌАЊЕ: +410 RSD",
        man_good_delivery: "ИСПРАТИ: 98.4%",
        price_prepaid_header: "Prepaid Дополнување на Кредити (Кредитите никогаш не истекуваат)",
        price_invoice_sub: "Фактура за правни лица (RSD / EUR)",
        price_badge_popular: "НАЈЧЕСТО",
        price_btn_select: "Избери",
        price_pro_title: "Pro Reserve Пакет",
        price_per_month: "/ месечно",
        price_pro_desc: "За продавници со над 500 нарачки месечно со приоритетен деловен премин и техничка поддршка. (Стандардниот систем е 0€ претплата).",
        price_pro_feat1: "1.800 вклучени кредити / месец",
        price_pro_credit_ratio: "1 Viber порака = 1 кредит. 1 SMS порака = 11 кредити.",
        price_pro_tooltip: "SMS пораките поради трошоците на операторите трошат повеќе кредити. Вашите кредити траат значително подолго кога се користи Viber.",
        price_pro_feat2: "Автоматско враќање на напуштени кошнички",
        price_pro_feat3: "HPOS и WP-CLI техничка поддршка",
        calc_rate_ideal: "4% (Идеално)",
        calc_rate_avg: "13% (Просек во регионот)",
        calc_rate_high: "25% (Критична загуба)",
        calc_freight_note: "Трошок за двојна поштарина (достава + враќање):",
        leg_item1_title: "1. Исполнување на Купопродажен Договор (ZZLP Член 10.1.б)",
        leg_item1_desc: "Купувачот сам го внесува телефонскиот број при checkout. Верификацијата на адресата пред предажба на курир е договорна обврска за достава. Дополнителен маркетинг opt-in не е потребен.",
        leg_item2_title: "2. Автоматска Анонимизација & Retention (30 Дена)",
        leg_item2_desc: "Телефонските броеви и токени автоматски се анонимизираат и трајно се бришат од серверите 30 дена по доставата. Без профилирање или споделување со трети лица.",
        leg_item3_title: "3. Енкрипција & Еднократни Passwordless Токени",
        leg_item3_desc: "Корекцијата на адреса се врши преку единствен HMAC-SHA256 токен со TLS 1.3 енкрипција. Potvrdio нема пристап до приватни Viber пораки ниту картички.",
        modal_legal_notice: "🔒 Криптографски HMAC Токен · Усогласено со Чл. 10 ZZLP MK & GDPR Art. 6",
        footer_privacy: "Политика за Приватност",
        footer_terms: "Услови за Користење",
        dev_code_comment: "// 1. Интерцепција во functions.php или приклучок",
        dev_status_note: "Potvrdio: Се чека Viber потврда",
        dev_hpos_note: "100% компатибилно со WooCommerce 7.0 до 9.x со вклучен HPOS.",
        footer_sub: "Регионална инфраструктура за WooCommerce плаќање при преземање",
        footer_location: "Скопје / Битола / Белград",
        top_gateway: "Официјален Viber & SMS деловен канал",
        top_protocol: "Протокол: Закон за лични податоци & GDPR",
        top_avg_penalty: "Просечна двојна поштарина: 390 MKD",
        hero_no_sub: "0€ Претплата",
        stat_hold_val: "~390 MKD",
        order_word: "Нарачка",
        dash_customer_name: "Јелена Ковачевска",
        dash_order_amount: "2.750 MKD",
        dash_address: "Бул. Цар Лазар 78, кат 4, стан 19, Скопје",
        dash_courier: "Курирска служба:",
        dash_courier_val: "Post Express (Денес за утре)",
        dash_risk_label: "Ризик од неиспорака:",
        dash_risk_val: "790 RSD (Магацински трошок)",
        dash_order_status_label: "Статус на нарачка:",
        dash_label_print_label: "Печатење адресар:",
        dash_label_blocked: "БЛОКИРАНО (Заштита од трошок)",
        term_log_cod: "(COD Плаќање при преземање)",
        term_sms_log: 'SMS Fallback испратен: "Потврдете ја нарачката на potvrdio.online..."',
        term_saved_log: "[14:02:01] РЕЗУЛТАТ: Заштедени 820 RSD за двојна поштарина!",
        term_waiting_log: "> Се чека одговор од купувачот на Viber...",
        man_bad_name: "Горан Никовски",
        man_bad_addr1: "Бул. Деспот Стефан (до црквата)",
        man_bad_city: "1000 СКОПЈЕ",
        man_good_name: "Горан Никовски",
        man_good_addr1: "Бул. Деспот Стефан бр. 114",
        man_good_city: "1000 СКОПЈЕ",
        calc_freight_val: "390 MKD (~6.35 €)",
        modal_badge: "Passwordless Token Верификација",
        nav_btn_register: "Регистрација (25 Кредити)",
        hero_btn_activate: "Активирај 25 бесплатни верификации",
        scen2_ignored_notice: "Купувачот не одговори 24ч. Нарачката е откажана пред пакување.",
        calc_orders_unit: "нарачки",
        modal_alert_tip: "⚡ Пополнете кат и стан за курирот без застој да го најде вашиот влез.",
        faq_tag: "05 / Често Поставувани Прашања",
        faq_title: "Сè што треба да знаете за Potvrdio COD верификацијата",
        faq_sub: "Одговори на клучните технички и правни прашања.",
        floor_word: "Кат",
        apt_word: "Стан"
      },
      en: {
        top_networks: "Post Express, D Express, Bex, City Express (Balkans)",
        nav_sub: "COD Protection Engine · WP v2.1",
        nav_how: "How it works",
        nav_calc: "Calculator",
        nav_pricing: "Pricing",
        nav_integration: "Integration",
        nav_lab: "How it works",
        nav_manifest: "Address Accuracy",
        nav_dev: "Integration",
        btn_dl: "Download ZIP",
        hero_tag: "WooCommerce Cash on Delivery (COD) Shield",
        hero_title: "Customer abandons COD parcel, you pay double shipping. Stop it before dispatch.",
        hero_p: "Potvrdio automatically verifies buyer intent and shipping address via Viber before packing. Fake and incomplete orders are stopped in time - zero phone calls, 80% fewer returns.",
        hero_cta_primary: "See how it works",
        hero_free_credits: "free verification credits included with plugin",
        stat_open_rate: "Open Rate",
        stat_open_sub: "Viber within 4 min.",
        stat_hold_cost: "Loss Per Return",
        stat_hold_sub: "Double courier fee",
        stat_recovery: "Return Reduction",
        stat_recovery_sub: "From 14.8% down to 2.5%",
        hero_box_note: "Parcels never leave warehouse shelves until the buyer confirms on Viber. Courier return exposure drops to near zero.",
        lab_tag: "01 / HOW IT WORKS",
        lab_title: "Automated real-time Viber verification",
        lab_subtitle: "Click a scenario to observe Viber bot and WooCommerce database hooks:",
        scen1_title: "Incomplete Address (Novi Sad)",
        scen1_desc: "Customer missed apartment & floor numbers. Fixes details with a single tap passwordless link.",
        scen2_title: "Customer Changed Mind (Niš)",
        scen2_desc: "Customer ignores Viber and SMS. Parcel stays safely in storage; store saves 820 RSD.",
        scen3_title: "1-Click Confirmation (Kragujevac)",
        scen3_desc: "Immediate 1-tap verification. Webhook releases Post Express shipping manifest in seconds.",
        scen_common_tag: "Common (62%)",
        scen_saved_tag: "Cost Avoided",
        scen_fast_tag: "< 30 seconds",
        viber_verified_title: "Verification",
        viber_verified_badge: "VERIFIED",
        viber_greeting: "Hello",
        viber_order_received: "We have received your order",
        viber_shipping_address: "SHIPPING ADDRESS:",
        viber_confirm_prompt: "Please confirm details before we hand over the parcel to the courier:",
        scen1_warning: "⚠️ Warning: Missing apartment & floor number (Delivery Failure Risk)",
        scen2_warning: "⏱️ Customer ignored message. 24h expired. Parcel safely held in warehouse!",
        viber_btn_yes: "YES, ADDRESS IS ACCURATE",
        viber_btn_edit: "EDIT ADDRESS",
        scen1_btn_badge: "👉 Click here: Add missing floor & apt",
        scen3_btn_badge: "⚡ Click here: 1-tap instant confirm",
        scen1_wrong_click_hint: "Address is incomplete (missing apartment). Click \"EDIT ADDRESS\" below to test automated address completion!",
        scen_btn_not_recommended: "Not recommended (missing apt)",
        scen_btn_force_confirm: "Confirm anyway without apartment",
        viber_success_confirmed: "Confirmed without edits! Parcel ready for shipping label printing.",
        viber_success_edited: "Address updated! Floor and apartment added. WooCommerce updated.",
        status_saved: "SAVED: Parcel not dispatched, ~€7 saved in pocket",
        status_approved: "APPROVED: Print Post Express shipping label",
        status_waiting: "ON HOLD: Do not pack parcel from warehouse",
        term_title: "Real-Time WP Event Terminal",
        term_risk_status: "Warehouse Decision",
        btn_restart_sim: "Reset test",
        man_tag: "01.1 / ADDRESS ACCURACY",
        man_title: "Why couriers fail deliveries: Anatomy of a faulty label",
        man_p: "Couriers spend an average of 45 seconds per drop. If the intercom or floor is missing, they tag the parcel as 'Customer Not Found'. That return fee lands directly on your P&L.",
        man_bad_title: "Standard Blind WooCommerce Entry (High Risk)",
        man_bad_footer: "Outcome: Courier cannot locate apartment. Stored in depot 5 days, returned. Loss: 780 RSD.",
        man_good_title: "Clean Verified Label via Potvrdio",
        man_good_footer: "Outcome: Courier rings intercom on first attempt. Customer expects delivery with exact cash.",
        calc_tag: "02 / SAVINGS CALCULATOR",
        calc_title: "Calculate annual profit hemorrhage on courier returns",
        calc_desc: "Calculations based on standard regional courier tariffs with return penalties for parcels under 2kg.",
        calc_label_orders: "Monthly Cash on Delivery Orders:",
        calc_label_rate: "Uncollected parcel failure rate:",
        calc_loss_head: "Annual Direct Shipping Loss",
        calc_saved_head: "Net Saved with Potvrdio:",
        calc_roi_note: "After deducting Viber verification credit costs (ROI > 14x)",
        price_tag: "03 / CREDIT PRICING (NO SUBSCRIPTION)",
        price_title: "Pay strictly per verified message. Zero mandatory subscriptions.",
        price_desc: "Forget expensive €150+/mo telecom retainers and rigid contracts. Top up message credits as needed, pay only for delivered verifications, and credits never expire.",
        th_tier: "Tier",
        th_deposit: "Deposit Amount",
        th_viber_rate: "Viber Rate",
        th_sms_rate: "SMS Fallback",
        price_note: "Invoiced in local RSD or EUR via official central bank rate. Zero automated credit card charges without consent. SMS is significantly more expensive than Viber due to telecom operator costs in Serbia, so we recommend using Viber whenever possible.",
        pro_tag: "Optional for high-volume stores (> 500 orders)",
        btn_act_pro: "Select Pro Option",
        leg_tag: "04.1 / LEGAL COMPLIANCE & PRIVACY",
        leg_title: "Legally Grounded & Privacy-First",
        leg_p: "Customer address verification messages operate strictly under Article 12 of the Serbian Personal Data Protection Law (ZZPL), Article 10 of North Macedonia's ZZLP, and Article 6(1)(b) of the EU GDPR. Processing is legally grounded in remote sales contract execution.",
        leg_bottom_note: "100% compliant with official Serbian Commissioner guidelines, MK AZLP & EU GDPR.",
        dev_tag: "04.2 / EFFORTLESS SETUP",
        dev_title: "2-Minute Setup - Zero Code Required",
        dev_p: "Install the official WordPress plugin in clicks without editing theme files or touching functions.php code. Fully compatible with High-Performance Order Storage (HPOS) and custom checkout funnels out of the box.",
        dev_step1_title: "1. Download the WordPress Plugin",
        dev_step1_desc: "Install Potvrdio with a single click inside your WordPress admin (Plugins → Add New → Upload .zip).",
        dev_step2_title: "2. Connect Your License Key",
        dev_step2_desc: "Paste your unique API key into WooCommerce settings directly from your Potvrdio dashboard.",
        dev_step3_title: "3. Automated Protection is Live",
        dev_step3_desc: "Potvrdio automatically intercepts COD orders, holds unverified packages, and verifies buyer addresses on Viber.",
        dl_title: "Halt return courier costs before tomorrow's dispatch",
        dl_desc: "Download the free ZIP plugin, activate inside WordPress admin, and get 25 free credits instantly.",
        btn_dl_full: "Download Potvrdio WordPress Plugin (.zip)",
        btn_view_demo: "View live demo",
        modal_title: "Update Delivery Address",
        modal_subtitle: "Complete missing details for fast courier delivery",
        modal_street: "Street & Number",
        modal_floor: "Floor",
        modal_apt: "Apartment",
        modal_intercom: "Intercom / Note for Courier",
        modal_btn_save: "Save & Confirm Address",
        man_badge_bad: "WITHOUT POTVRDIO TOOL",
        man_badge_good: "POTVRDIO VERIFIED",
        man_label_header_bad: "STANDARD SHIPPING LABEL",
        man_label_header_good: "VERIFIED SHIPPING LABEL",
        man_recipient_bad: "RECIPIENT:",
        man_recipient_good: "RECIPIENT (CONFIRMED ON VIBER):",
        man_bad_warning: "NO BUILDING NO, NO APARTMENT",
        man_bad_phone: "Tel: 063/123-xxx (Unreachable phone)",
        man_good_apt: "Entrance 2, Floor 4, Apt 18 (Working Intercom)",
        man_good_phone: "Tel: +381 63 948 2190 (Delivery verified)",
        man_cod: "COD: 3,200 RSD (~€27)",
        man_bad_return: "RETURN PENALTY: +410 RSD",
        man_good_delivery: "DELIVERY SUCCESS: 98.4%",
        price_prepaid_header: "Prepaid Message Credits (Credits never expire)",
        price_invoice_sub: "Invoices for Companies (RSD / EUR)",
        price_badge_popular: "MOST POPULAR",
        price_btn_select: "Select",
        price_pro_title: "Pro Reserve Package",
        price_per_month: "/ month",
        price_pro_desc: "For stores with > 500 monthly orders requiring a dedicated priority pipeline and live support. (Standard usage is €0 subscription).",
        price_pro_feat1: "1,800 included credits / month",
        price_pro_credit_ratio: "1 Viber message = 1 credit. 1 SMS message = 11 credits.",
        price_pro_tooltip: "SMS messages consume more credits due to telecom operator fees. Your credits last significantly longer when Viber is used.",
        price_pro_feat2: "Automated abandoned cart recovery",
        price_pro_feat3: "HPOS & WP-CLI technical support",
        calc_rate_ideal: "4% (Ideal)",
        calc_rate_avg: "13% (Balkan Average)",
        calc_rate_high: "25% (Critical Loss)",
        calc_freight_note: "Double courier freight cost (shipping + return):",
        leg_item1_title: "1. Sales Contract Execution (Art. 12 / GDPR Art. 6)",
        leg_item1_desc: "The buyer submits their phone number during checkout. Verifying delivery address accuracy prior to dispatch fulfills the merchant's contractual fulfillment obligation. Additional marketing consent is not required.",
        leg_item2_title: "2. Automatic Data Anonymization & Retention (30 Days)",
        leg_item2_desc: "Phone numbers and single-use verification tokens are automatically anonymized and permanently purged from gateway servers 30 days post-delivery. Zero cross-store profiling or data sharing.",
        leg_item3_title: "3. Cryptographic Token & TLS 1.3 Security",
        leg_item3_desc: "Address edits use single-use HMAC-SHA256 tokens over TLS 1.3. Potvrdio has zero access to private Viber chat messages or financial payment cards.",
        modal_legal_notice: "🔒 Cryptographic HMAC Token · Compliant with Art. 12 ZZPL & EU GDPR Art. 6",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms & Conditions",
        dev_code_comment: "// 1. Intercept order inside functions.php or custom plugin",
        dev_status_note: "Potvrdio: Awaiting buyer Viber confirmation",
        dev_hpos_note: "100% compatible with WooCommerce 7.0 through 9.x with HPOS enabled.",
        footer_sub: "Regional Infrastructure for WooCommerce Cash on Delivery (COD)",
        footer_location: "Belgrade / Novi Sad / Skopje",
        top_gateway: "Official Viber & SMS Business Service",
        top_protocol: "Protocol: Data Protection & GDPR Compliant",
        top_avg_penalty: "Avg. Double Return Penalty: ~€7 (780 RSD)",
        hero_no_sub: "€0 Subscription",
        stat_hold_val: "~€7 (780 RSD)",
        order_word: "Order",
        dash_customer_name: "Jelena Kovacevic",
        dash_order_amount: "5,420 RSD (~€46)",
        dash_address: "78 Tsar Lazar Blvd, Apt 19, Novi Sad",
        dash_courier: "Courier Network:",
        dash_courier_val: "Post Express (Next-Day Delivery)",
        dash_risk_label: "Non-Delivery Exposure:",
        dash_risk_val: "790 RSD (~€7 Freight Loss)",
        dash_order_status_label: "Order Status:",
        dash_label_print_label: "Label Dispatch:",
        dash_label_blocked: "HOLD / BLOCKED (Return Freight Guard)",
        term_log_cod: "(COD Cash on Delivery)",
        term_sms_log: 'SMS Fallback sent: "Confirm your order at potvrdio.online..."',
        term_saved_log: "[14:02:01] RESULT: 820 RSD (~€7) double return freight saved!",
        term_waiting_log: "> Waiting for customer response on Viber...",
        man_bad_name: "Goran Ninkovic",
        man_bad_addr1: "Despot Stefan Blvd (near church)",
        man_bad_city: "11000 BELGRADE",
        man_good_name: "Goran Ninkovic",
        man_good_addr1: "114 Despot Stefan Blvd",
        man_good_city: "11000 BELGRADE",
        calc_freight_val: "~€6.65 (780 RSD)",
        modal_badge: "Passwordless Token Verification",
        nav_btn_register: "Register Store (25 Free)",
        hero_btn_activate: "Activate 25 free credits",
        scen2_ignored_notice: "Customer ignored for 24h. Order cancelled before packing.",
        calc_orders_unit: "orders",
        modal_alert_tip: "⚡ Fill floor and apartment so the courier can find your entrance without delay.",
        faq_tag: "05 / Frequently Asked Questions",
        faq_title: "Everything you need to know about Potvrdio COD verification",
        faq_sub: "Answers to key technical, legal, and operational questions.",
        floor_word: "Floor",
        apt_word: "Apt"
      }
    };

    return translations[lang]?.[key] || key;
  };

  // Scenario configurations
  const scenarios = {
    1: {
      customer: "Marko Petrović",
      address: {
        sr: "Bulevar Oslobođenja 42, Novi Sad",
        mk: "Бул. Партизански Одреди 42, Скопје",
        en: "42 Liberation Blvd, Novi Sad"
      },
      orderId: "#RS-8492",
      orderAmount: {
        sr: "4.890 RSD",
        mk: "2.450 MKD",
        en: "4,890 RSD (~€41)"
      }
    },
    2: {
      customer: "Nemanja Ilić",
      address: {
        sr: "Bulevar Nemanjića 14, Niš",
        mk: "Ул. Широк Сокак 14, Битола",
        en: "14 Nemanjica Blvd, Nis"
      },
      orderId: "#RS-8501",
      orderAmount: {
        sr: "3.450 RSD",
        mk: "1.750 MKD",
        en: "3,450 RSD (~€29)"
      }
    },
    3: {
      customer: "Ana Jovanović",
      address: {
        sr: "Kneza Miloša 22, Kragujevac",
        mk: "Ул. Илинденска 22, Охрид",
        en: "22 Prince Milos St, Kragujevac"
      },
      orderId: "#RS-8519",
      orderAmount: {
        sr: "6.120 RSD",
        mk: "3.100 MKD",
        en: "6,120 RSD (~€52)"
      }
    }
  };

  const handleScenarioChange = (scenNum: number) => {
    playClickSound();
    setCurrentScenario(scenNum);
    setSimState('initial');
    setShowAddressModal(false);
  };

  const handleSimAction = (action: 'confirm' | 'edit') => {
    playScannerBeep();
    if (action === 'edit') {
      setShowAddressModal(true);
    } else {
      setSimState('confirmed');
    }
  };

  const handleResetSim = () => {
    playClickSound();
    setSimState('initial');
    setShowAddressModal(false);
  };

  const handleSaveModalAddress = () => {
    playScannerBeep();
    setSimState('edited');
    setShowAddressModal(false);
  };

  // ROI Math
  const failedOrdersPerMonth = Math.round(ordersCount * (failureRate / 100));
  const monthlyLossRsd = failedOrdersPerMonth * 780;
  const annualLossRsd = monthlyLossRsd * 12;
  const annualLossEur = Math.round(annualLossRsd / 117.2);
  const annualSavedRsd = Math.round(annualLossRsd * 0.85);

  const currentScenConfig = scenarios[currentScenario as keyof typeof scenarios];

  return (
    <div className="min-h-[100dvh] flex flex-col saas-bg text-theme-secondary font-['Inter',sans-serif] selection:bg-[#14B8A6] selection:text-white transition-colors duration-200">
      
      {/* Top Network & Legal Bar */}
      <aside className="border-b border-theme bg-surface/95 px-3 sm:px-4 py-1.5 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-sans">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-medium text-theme-primary">{t('top_gateway')}</span>
            </span>
            <span className="text-theme-muted/30">|</span>
            <span className="hidden sm:inline text-theme-muted">{t('top_networks')}</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <a href="#integracija" className="text-theme-muted hover:text-[#14B8A6] transition-colors hidden md:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{t('top_protocol')}</span>
            </a>
            <span className="text-theme-muted/30 hidden md:inline">|</span>
            <span className="text-amber-500 font-medium">{t('top_avg_penalty')}</span>
          </div>
        </div>
      </aside>

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-theme bg-surface/96 backdrop-blur-lg shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <PotvrdioLogo variant="horizontal" mode={theme} />
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-theme-muted font-medium">
            <a href="#kako-radi" className="hover:text-theme-primary transition-colors">{t('nav_how')}</a>
            <a href="#kalkulator" className="hover:text-theme-primary transition-colors">{t('nav_calc')}</a>
            <a href="#cenovnik" className="hover:text-theme-primary transition-colors">{t('nav_pricing')}</a>
            <a href="#integracija" className="hover:text-theme-primary transition-colors">{t('nav_integration')}</a>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-surface-subtle border border-theme text-theme-secondary hover:text-theme-primary transition-all cursor-pointer flex items-center justify-center min-h-[34px] min-w-[34px]"
              title={theme === 'dark' ? 'Prebaci na Svetlu Temu' : 'Prebaci na Tamnu Temu'}
              aria-label="Toggle light/dark theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-surface-subtle border border-theme rounded-lg p-0.5 text-xs font-sans">
              <button 
                onClick={() => { playClickSound(); setLang('sr'); }} 
                className={`px-1.5 sm:px-2 py-0.5 rounded font-bold transition-all text-[11px] sm:text-xs ${lang === 'sr' ? 'bg-[#14B8A6] text-white' : 'text-theme-muted hover:text-theme-primary'}`}
              >
                SR
              </button>
              <button 
                onClick={() => { playClickSound(); setLang('mk'); }} 
                className={`px-1.5 sm:px-2 py-0.5 rounded font-bold transition-all text-[11px] sm:text-xs ${lang === 'mk' ? 'bg-[#14B8A6] text-white' : 'text-theme-muted hover:text-theme-primary'}`}
              >
                MK
              </button>
              <button 
                onClick={() => { playClickSound(); setLang('en'); }} 
                className={`px-1.5 sm:px-2 py-0.5 rounded font-bold transition-all text-[11px] sm:text-xs ${lang === 'en' ? 'bg-[#14B8A6] text-white' : 'text-theme-muted hover:text-theme-primary'}`}
              >
                EN
              </button>
            </div>

            <button 
              onClick={() => { playClickSound(); setShowOnboardingModal(true); }}
              className="hidden sm:inline-flex btn-brand-cta text-white font-bold text-xs px-3 sm:px-3.5 py-2 rounded transition-all items-center gap-1.5 shadow-sm min-h-[36px] cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>{t('nav_btn_register')}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => { playClickSound(); setMobileMenuOpen(!mobileMenuOpen); }}
              className="md:hidden p-2 rounded-lg bg-surface-subtle border border-theme text-theme-secondary hover:text-theme-primary transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#14B8A6]" /> : <Menu className="w-5 h-5 text-theme-primary" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-theme bg-surface/98 backdrop-blur-xl px-4 py-4 space-y-3 font-mono text-xs animate-in slide-in-from-top-2 duration-200">
            <div className="text-[10px] text-theme-muted uppercase font-bold tracking-wider mb-1">
              {lang === 'sr' ? 'Navigacija' : lang === 'mk' ? 'Навигација' : 'Navigation'}
            </div>
            <a 
              href="#kako-radi" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2.5 text-theme-secondary hover:text-[#14B8A6] transition-colors border-b border-theme-subtle flex items-center justify-between"
            >
              <span>01. {t('nav_how')}</span>
              <ChevronRight className="w-4 h-4 text-theme-muted" />
            </a>
            <a 
              href="#kalkulator" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2.5 text-theme-secondary hover:text-[#14B8A6] transition-colors border-b border-theme-subtle flex items-center justify-between"
            >
              <span>02. {t('nav_calc')}</span>
              <ChevronRight className="w-4 h-4 text-theme-muted" />
            </a>
            <a 
              href="#cenovnik" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2.5 text-theme-secondary hover:text-[#14B8A6] transition-colors border-b border-theme-subtle flex items-center justify-between"
            >
              <span>03. {t('nav_pricing')}</span>
              <ChevronRight className="w-4 h-4 text-theme-muted" />
            </a>
            <a 
              href="#integracija" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2.5 text-theme-secondary hover:text-[#14B8A6] transition-colors border-b border-theme-subtle flex items-center justify-between"
            >
              <span>04. {t('nav_integration')}</span>
              <ChevronRight className="w-4 h-4 text-theme-muted" />
            </a>

            <div className="pt-2">
              <a 
                href="#preuzmi" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full btn-brand-cta text-white font-bold py-3 rounded-lg text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t('btn_dl_full')}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="border-b border-theme bg-canvas pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 flex flex-col gap-8 sm:gap-10">

          {/* Top Row: Text + Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">

            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
              <div className="inline-flex items-center gap-2 border border-theme bg-surface-subtle px-3 py-1 rounded-full text-xs text-theme-secondary w-fit max-w-full flex-wrap shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse shrink-0"></span>
                <span className="text-theme-primary font-semibold">{t('hero_tag')}</span>
                <span className="text-theme-muted/40">•</span>
                <span className="text-emerald-400 font-medium">{t('hero_no_sub')}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-theme-primary leading-[1.2]">
                {t('hero_title')}
              </h1>

              <p className="text-xs sm:text-sm leading-relaxed text-theme-muted max-w-2xl">
                {t('hero_p')}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a 
                  href="#kako-radi" 
                  onClick={playClickSound}
                  className="btn-brand-cta text-white font-bold text-xs px-5 py-3.5 sm:py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span>{t('hero_cta_primary')}</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </a>
                <button 
                  onClick={() => { playClickSound(); setShowOnboardingModal(true); }}
                  className="px-5 py-3.5 sm:py-3 bg-surface-subtle hover:bg-surface text-theme-primary border border-[#14B8A6]/40 hover:border-[#14B8A6] text-xs rounded-lg font-bold transition inline-flex items-center justify-center gap-2 cursor-pointer min-h-[44px] shadow-sm"
                >
                  <Rocket className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>{t('hero_btn_activate')}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="lg:col-span-5 lg:mt-11 overflow-hidden lg:rounded-2xl lg:shadow-2xl">
              <img
                key={lang}
                src={lang === 'en' ? '/hero-en.jpg' : lang === 'mk' ? '/hero-mk.jpg' : '/hero-sr.jpg'}
                alt={lang === 'en' ? 'Potvrdio in action' : lang === 'mk' ? 'Potvrdio во акција' : 'Potvrdio u akciji'}
                className="w-full rounded-2xl shadow-2xl lg:rounded-none lg:shadow-none lg:max-h-[260px] lg:object-cover lg:object-top"
                style={{ animation: 'heroFadeIn 0.4s ease-in-out' }}
              />
            </div>

          </div>

          {/* Stats Row — full width below both columns */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-5 sm:pt-6 border-t border-theme font-sans">
            <div className="glass-panel p-2.5 sm:p-3 rounded-lg flex flex-col gap-1">
              <div className="text-[10px] sm:text-xs text-theme-muted font-medium">{t('stat_open_rate')}</div>
              <div className="text-base sm:text-xl font-bold text-theme-primary tracking-tight">89.6%</div>
              <div className="text-[9px] sm:text-[10px] text-emerald-400 font-medium leading-snug">{t('stat_open_sub')}</div>
            </div>
            <div className="glass-panel p-2.5 sm:p-3 rounded-lg flex flex-col gap-1">
              <div className="text-[10px] sm:text-xs text-theme-muted font-medium">{t('stat_hold_cost')}</div>
              <div className="text-sm sm:text-base font-bold text-amber-400 tracking-tight leading-tight">{t('stat_hold_val')}</div>
              <div className="text-[9px] sm:text-[10px] text-theme-muted font-medium leading-snug">{t('stat_hold_sub')}</div>
            </div>
            <div className="glass-panel p-2.5 sm:p-3 rounded-lg flex flex-col gap-1">
              <div className="text-[10px] sm:text-xs text-theme-muted font-medium">{t('stat_recovery')}</div>
              <div className="text-base sm:text-xl font-bold text-emerald-400 tracking-tight">-83%</div>
              <div className="text-[9px] sm:text-[10px] text-theme-muted font-medium leading-snug">{t('stat_recovery_sub')}</div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 01: Interactive Lab Simulator */}
      <section id="kako-radi" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-theme relative">
        <span id="lab" className="sr-only" />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('lab_tag')}</div>
            <h2 className="text-xl sm:text-2xl font-bold text-theme-primary tracking-tight">{t('lab_title')}</h2>
          </div>
          <div className="text-xs text-theme-muted font-sans">
            {t('lab_subtitle')}
          </div>
        </div>

        {/* Scenario Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5" role="tablist" aria-label="Scenario tabs">
          {/* Tab 1 - Scenario A */}
          <button 
            role="tab"
            aria-selected={currentScenario === 1}
            onClick={() => handleScenarioChange(1)} 
            className={`relative text-left p-4 rounded-xl transition-all shadow-sm cursor-pointer overflow-hidden ${
              currentScenario === 1 
                ? 'bg-surface border-2 border-[#14B8A6] ring-4 ring-[#14B8A6]/15 shadow-lg shadow-[#14B8A6]/10' 
                : 'bg-surface/30 dark:bg-surface/10 border border-theme/60 opacity-60 hover:opacity-100 hover:bg-surface/60 hover:border-[#14B8A6]/40'
            }`}
          >
            {/* Top active accent bar */}
            {currentScenario === 1 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14B8A6] to-emerald-400" />
            )}
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                  currentScenario === 1 
                    ? 'bg-[#14B8A6] text-white shadow-xs' 
                    : 'bg-surface-subtle text-theme-muted border border-theme'
                }`}>
                  A
                </span>
                <span className={`font-bold text-xs uppercase tracking-wider ${
                  currentScenario === 1 ? 'text-teal-600 dark:text-[#14B8A6]' : 'text-theme-muted'
                }`}>
                  Scenario A
                </span>
              </div>

              {currentScenario === 1 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#14B8A6] text-white shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  {lang === 'sr' ? 'IZABRANO' : lang === 'mk' ? 'ИЗБРАНО' : 'ACTIVE'}
                </span>
              ) : (
                <span className="text-[10px] font-medium text-theme-muted bg-surface-subtle px-2 py-0.5 rounded-full border border-theme">
                  {t('scen_common_tag')}
                </span>
              )}
            </div>

            <div className={`font-bold text-sm mb-1 ${currentScenario === 1 ? 'text-theme-primary' : 'text-theme-secondary'}`}>
              {t('scen1_title')}
            </div>
            <div className="text-theme-muted text-[11px] leading-relaxed">
              {t('scen1_desc')}
            </div>
          </button>

          {/* Tab 2 - Scenario B */}
          <button 
            role="tab"
            aria-selected={currentScenario === 2}
            onClick={() => handleScenarioChange(2)} 
            className={`relative text-left p-4 rounded-xl transition-all shadow-sm cursor-pointer overflow-hidden ${
              currentScenario === 2 
                ? 'bg-surface border-2 border-[#14B8A6] ring-4 ring-[#14B8A6]/15 shadow-lg shadow-[#14B8A6]/10' 
                : 'bg-surface/30 dark:bg-surface/10 border border-theme/60 opacity-60 hover:opacity-100 hover:bg-surface/60 hover:border-[#14B8A6]/40'
            }`}
          >
            {/* Top active accent bar */}
            {currentScenario === 2 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14B8A6] to-emerald-400" />
            )}
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                  currentScenario === 2 
                    ? 'bg-[#14B8A6] text-white shadow-xs' 
                    : 'bg-surface-subtle text-theme-muted border border-theme'
                }`}>
                  B
                </span>
                <span className={`font-bold text-xs uppercase tracking-wider ${
                  currentScenario === 2 ? 'text-teal-600 dark:text-[#14B8A6]' : 'text-theme-muted'
                }`}>
                  Scenario B
                </span>
              </div>

              {currentScenario === 2 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#14B8A6] text-white shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  {lang === 'sr' ? 'IZABRANO' : lang === 'mk' ? 'ИЗБРАНО' : 'ACTIVE'}
                </span>
              ) : (
                <span className="text-[10px] font-medium text-theme-muted bg-surface-subtle px-2 py-0.5 rounded-full border border-theme">
                  {t('scen_saved_tag')}
                </span>
              )}
            </div>

            <div className={`font-bold text-sm mb-1 ${currentScenario === 2 ? 'text-theme-primary' : 'text-theme-secondary'}`}>
              {t('scen2_title')}
            </div>
            <div className="text-theme-muted text-[11px] leading-relaxed">
              {t('scen2_desc')}
            </div>
          </button>

          {/* Tab 3 - Scenario C */}
          <button 
            role="tab"
            aria-selected={currentScenario === 3}
            onClick={() => handleScenarioChange(3)} 
            className={`relative text-left p-4 rounded-xl transition-all shadow-sm cursor-pointer overflow-hidden ${
              currentScenario === 3 
                ? 'bg-surface border-2 border-[#14B8A6] ring-4 ring-[#14B8A6]/15 shadow-lg shadow-[#14B8A6]/10' 
                : 'bg-surface/30 dark:bg-surface/10 border border-theme/60 opacity-60 hover:opacity-100 hover:bg-surface/60 hover:border-[#14B8A6]/40'
            }`}
          >
            {/* Top active accent bar */}
            {currentScenario === 3 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14B8A6] to-emerald-400" />
            )}
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                  currentScenario === 3 
                    ? 'bg-[#14B8A6] text-white shadow-xs' 
                    : 'bg-surface-subtle text-theme-muted border border-theme'
                }`}>
                  C
                </span>
                <span className={`font-bold text-xs uppercase tracking-wider ${
                  currentScenario === 3 ? 'text-teal-600 dark:text-[#14B8A6]' : 'text-theme-muted'
                }`}>
                  Scenario C
                </span>
              </div>

              {currentScenario === 3 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#14B8A6] text-white shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  {lang === 'sr' ? 'IZABRANO' : lang === 'mk' ? 'ИЗБРАНО' : 'ACTIVE'}
                </span>
              ) : (
                <span className="text-[10px] font-medium text-theme-muted bg-surface-subtle px-2 py-0.5 rounded-full border border-theme">
                  {t('scen_fast_tag')}
                </span>
              )}
            </div>

            <div className={`font-bold text-sm mb-1 ${currentScenario === 3 ? 'text-theme-primary' : 'text-theme-secondary'}`}>
              {t('scen3_title')}
            </div>
            <div className="text-theme-muted text-[11px] leading-relaxed">
              {t('scen3_desc')}
            </div>
          </button>
        </div>

        {/* Simulator Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start glass-panel p-4 sm:p-6 rounded-2xl">
          
          {/* Active Scenario Info Header Bar */}
          <div className="lg:col-span-12 flex flex-wrap items-center justify-between gap-3 pb-3 mb-1 border-b border-theme text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] animate-pulse shrink-0"></span>
              <span className="font-extrabold text-theme-primary uppercase tracking-wider text-[11px]">
                {lang === 'sr' ? `Aktivna simulacija: Scenario ${currentScenario === 1 ? 'A' : currentScenario === 2 ? 'B' : 'C'}` : lang === 'mk' ? `Активна симулација: Сценарио ${currentScenario === 1 ? 'А' : currentScenario === 2 ? 'Б' : 'В'}` : `Active Simulation: Scenario ${currentScenario === 1 ? 'A' : currentScenario === 2 ? 'B' : 'C'}`}
              </span>
              <span className="text-theme-muted hidden sm:inline">•</span>
              <span className="text-theme-secondary font-medium hidden sm:inline">
                {currentScenario === 1 ? t('scen1_title') : currentScenario === 2 ? t('scen2_title') : t('scen3_title')}
              </span>
            </div>
            <button
              onClick={handleResetSim}
              className="text-[11px] text-theme-muted hover:text-[#14B8A6] flex items-center gap-1.5 cursor-pointer transition-colors px-2 py-1 rounded-md hover:bg-surface-subtle"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'sr' ? 'Resetuj scenario' : lang === 'mk' ? 'Ресетирај сценарио' : 'Reset scenario'}</span>
            </button>
          </div>
          
          {/* Viber Phone Mockup Left */}
          <div className="lg:col-span-5 flex justify-center items-start">
            {/* Phone Shell */}
            <div ref={phoneContainerRef} className="relative w-full max-w-[300px] mx-auto select-none">
              
              {/* External Guidance Arrow (pointing to the expected button from outside) */}
              {simState === 'initial' && currentScenario !== 2 && (
                <>
                  {/* Floating Guidance Callout with Diagonal Arrow pointing down-left into the button */}
                  <div 
                    className="flex items-center gap-1.5 absolute z-50 transition-all duration-300 pointer-events-none left-[calc(100%-145px)] sm:left-[calc(100%-110px)]"
                    style={{
                      top: `${arrowTop - 16}px`,
                      transform: 'translateY(-50%)',
                    }}
                  >
                    {/* Animated Diagonal Arrow pointing DOWN-LEFT (↙) directly into the button */}
                    <div className="text-[#14B8A6] flex items-center shrink-0 animate-bounce-diagonal">
                      <svg className="w-8 h-8 drop-shadow-[0_2px_12px_rgba(20,184,166,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="5" x2="5" y2="19" />
                        <polyline points="15 19 5 19 5 9" />
                      </svg>
                    </div>

                    {/* Tooltip Badge overlapping the phone bezel and overflowing to the right */}
                    <div 
                      onClick={() => showAddressModal ? handleSaveModalAddress() : handleSimAction(currentScenario === 1 ? 'edit' : 'confirm')}
                      className="bg-[#14B8A6] hover:bg-[#0D9488] active:scale-95 text-white text-[10.5px] sm:text-[11px] font-black px-3 sm:px-3.5 py-1.5 rounded-xl shadow-2xl shadow-[#14B8A6]/40 flex items-center gap-1.5 whitespace-nowrap border border-white/40 tracking-tight pointer-events-auto cursor-pointer transition-all"
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
                      <span>
                        {showAddressModal ? (
                          lang === 'sr' ? '1. Sačuvajte adresu' : lang === 'mk' ? '1. Зачувајте адреса' : '1. Save address'
                        ) : currentScenario === 1 ? (
                          lang === 'sr' ? '1. Kliknite "IZMENI ADRESU"' : lang === 'mk' ? '1. Кликнете "ИЗМЕНИ"' : '1. Click "EDIT ADDRESS"'
                        ) : (
                          lang === 'sr' ? '1. Kliknite "DA, ADRESA JE TAČNA"' : lang === 'mk' ? '1. Кликнете "ДА, ТОЧНА Е"' : '1. Click "YES, ACCURATE"'
                        )}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Device Bezel */}
              <div className="relative bg-[#1A1A1A] dark:bg-[#0D0D0D] rounded-[2.8rem] p-[10px] shadow-[0_0_0_1.5px_#3a3a3a,0_20px_60px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                {/* Side buttons */}
                <div className="absolute -left-[3px] top-[88px] w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute -left-[3px] top-[130px] w-[3px] h-8 bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute -right-[3px] top-[110px] w-[3px] h-12 bg-[#2a2a2a] rounded-r-sm" />

                {/* Screen */}
                <div className="bg-[#EEEAF8] rounded-[2.2rem] overflow-hidden relative" style={{minHeight: '560px'}}>

                  {/* Dynamic Island */}
                  <div className="flex items-center justify-center pt-3 pb-1">
                    <div className="bg-black rounded-full h-6 w-[90px]" />
                  </div>

                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-5 pb-1">
                    <span className="text-[10px] font-bold text-[#1a1a1a]">9:41</span>
                    <div className="flex items-center gap-1">
                      {/* WiFi */}
                      <svg className="w-3 h-2.5" viewBox="0 0 24 18" fill="#1a1a1a"><path d="M12 3C7.95 3 4.21 4.34 1.2 6.6L3 8.4C5.5 6.52 8.62 5.5 12 5.5s6.5 1.02 9 2.9l1.8-1.8C19.79 4.34 16.05 3 12 3zm0 5c-2.76 0-5.26 1.12-7.09 2.93L6.7 12.7c1.35-1.35 3.22-2.2 5.3-2.2s3.95.85 5.3 2.2l1.79-1.77C17.26 9.12 14.76 8 12 8zm0 5c-1.38 0-2.63.56-3.54 1.46L12 18l3.54-3.54C14.63 13.56 13.38 13 12 13z"/></svg>
                      {/* Battery */}
                      <div className="flex items-center gap-0.5">
                        <div className="w-5 h-2.5 border border-[#1a1a1a] rounded-sm p-px flex items-center">
                          <div className="h-full bg-[#1a1a1a] rounded-sm" style={{width:'80%'}} />
                        </div>
                        <div className="w-0.5 h-1.5 bg-[#1a1a1a] rounded-r-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Viber App Bar */}
                  <div className="bg-[#7360F2] px-3.5 py-2.5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Back arrow */}
                      <svg className="w-4 h-4 text-white shrink-0 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                      {/* Potvrdio Avatar */}
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5 shrink-0 shadow-sm border border-white/40">
                        <img src="/logo-icon-light.svg" alt="Potvrdio" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-bold text-[12px] leading-tight truncate">
                          Potvrdio.online
                        </div>
                        <div className="text-white/80 text-[9px] flex items-center gap-1 leading-tight">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{lang === 'sr' ? 'Verifikovani biznis nalog' : lang === 'mk' ? 'Верификуван бизнис налог' : 'Verified Business Account'}</span>
                        </div>
                      </div>
                    </div>
                    {/* Dots menu */}
                    <div className="flex items-center gap-2 text-white/90">
                      <svg className="w-4 h-4 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      <svg className="w-4 h-4 cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    </div>
                  </div>

                  {/* Chat Background — Authentic Viber Default Doodle Pattern Wallpaper */}
                  <div className="viber-chat-bg px-3 pt-3 pb-3 min-h-[460px] flex flex-col justify-between">

                    <div className="space-y-2">
                      {/* Date badge */}
                      <div className="flex justify-center mb-1">
                        <span className="text-[9px] text-[#7360F2] bg-white/80 backdrop-blur-xs px-3 py-0.5 rounded-full font-medium shadow-xs">
                          {lang === 'sr' ? 'Danas' : lang === 'mk' ? 'Денес' : 'Today'}
                        </span>
                      </div>

                      {/* Business Avatar + Message Row */}
                      <div className="flex items-end gap-1.5">
                        {/* Sender Avatar */}
                        <div className="w-6 h-6 rounded-full bg-white p-1 flex items-center justify-center shrink-0 mb-0.5 shadow-sm border border-purple-200">
                          <img src="/logo-icon-light.svg" alt="Potvrdio" className="w-full h-full object-contain" />
                        </div>

                        {/* Message Bubble */}
                        <div className="flex-1 max-w-[230px]">
                          <div className="bg-white rounded-2xl rounded-bl-xs shadow-md border border-purple-100/50 overflow-hidden">
                            {/* Sender bar inside bubble */}
                            <div className="bg-purple-50/60 px-3 py-1 border-b border-purple-100/40 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-[#7360F2]">
                                Potvrdio.online
                              </span>
                              <span className="text-[8px] text-gray-400">12:00</span>
                            </div>

                            {/* Message text */}
                            <div className="px-3 pt-2 pb-2 text-[11px] leading-relaxed text-[#1a1a1a] space-y-2">
                              <p>
                                {t('viber_greeting')} <strong>{currentScenConfig.customer.split(' ')[0]}</strong>! {t('viber_order_received')} <strong className="text-[#7360F2]">{currentScenConfig.orderId}</strong> ({currentScenConfig.orderAmount[lang]}).
                              </p>

                              {/* Address block */}
                              <div className="rounded-xl border border-[#E2DEF6] bg-[#F7F5FE] p-2.5">
                                <div className="text-[9px] text-[#7360F2] font-bold uppercase tracking-wider mb-0.5">
                                  {t('viber_shipping_address')}
                                </div>
                                <div className="text-[10.5px] font-mono text-[#1a1a1a] font-medium leading-snug">
                                  {simState === 'edited' ? (
                                    <span>
                                      {currentScenConfig.address[lang]}
                                      <span className="ml-1 text-emerald-600 font-bold block">
                                        {lang === 'sr' ? `✓ Sprat ${floorInput}, Stan ${aptInput}` : lang === 'mk' ? `✓ Кат ${floorInput}, Стан ${aptInput}` : `✓ Floor ${floorInput}, Apt ${aptInput}`}
                                      </span>
                                    </span>
                                  ) : (
                                    <span>{currentScenConfig.address[lang]}</span>
                                  )}
                                </div>
                              </div>

                              <p className="text-[9.5px] text-gray-500">{t('viber_confirm_prompt')}</p>
                            </div>

                            {/* Viber Interactive Action Buttons */}
                            {currentScenario === 2 ? (
                              /* Scenario B: timed out */
                              <div className="border-t border-gray-100 bg-gray-50/80 px-3 py-2 text-center">
                                <span className="text-[10px] text-gray-400 font-medium">
                                  {lang === 'sr' ? 'Isteklo vreme za odgovor (24h)' : lang === 'mk' ? 'Истечено време за одговор (24h)' : 'Response window expired (24h)'}
                                </span>
                              </div>
                            ) : simState !== 'initial' ? (
                              /* Done / Confirmed state */
                              <div className="border-t border-emerald-100 bg-emerald-50 px-3 py-2.5 flex items-center justify-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                <span className="text-[10.5px] text-emerald-700 font-bold">
                                  {simState === 'edited' ? t('viber_success_edited') : t('viber_success_confirmed')}
                                </span>
                              </div>
                            ) : (
                              /* Real Viber Business Action Buttons */
                              <div className="border-t border-[#EAE6F8] flex flex-col divide-y divide-[#EAE6F8]">
                                <button
                                  data-sim-target="confirm"
                                  onClick={() => handleSimAction('confirm')}
                                  className="w-full py-2.5 px-3 text-center font-bold text-[11px] text-[#7360F2] hover:bg-[#F5F3FE] active:bg-[#ECE7F8] transition-colors cursor-pointer"
                                >
                                  {t('viber_btn_yes')}
                                </button>
                                <button
                                  data-sim-target="edit"
                                  onClick={() => handleSimAction('edit')}
                                  className="w-full py-2.5 px-3 text-center font-bold text-[11px] text-[#7360F2] hover:bg-[#F5F3FE] active:bg-[#ECE7F8] transition-colors cursor-pointer"
                                >
                                  {t('viber_btn_edit')}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom chat input bar placeholder (Viber UI) */}
                    <div className="pt-2 border-t border-purple-200/50 flex items-center justify-between text-[#7360F2] px-1">
                      <span className="text-[9.5px] text-gray-400 italic">
                        {lang === 'sr' ? 'Poruka za Potvrdio.online...' : lang === 'mk' ? 'Порака за Potvrdio.online...' : 'Message to Potvrdio.online...'}
                      </span>
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-[#7360F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="flex justify-center py-2" style={{background: '#E3DEF4'}}>
                    <div className="w-20 h-1 bg-[#7360F2]/30 rounded-full" />
                  </div>

                  {/* ─── In-App Browser Sheet / Pop up (slides up from bottom inside phone) ─── */}
                  <div
                    className="absolute inset-0 rounded-[2.2rem] overflow-hidden flex flex-col justify-end transition-all duration-300 ease-out z-20"
                    style={{
                      pointerEvents: showAddressModal ? 'auto' : 'none',
                      background: showAddressModal ? 'rgba(0,0,0,0.45)' : 'transparent',
                    }}
                  >
                    <div
                      className="bg-white rounded-t-2xl shadow-2xl flex flex-col h-[90%] transition-transform duration-300 ease-out"
                      style={{transform: showAddressModal ? 'translateY(0)' : 'translateY(100%)'}}
                    >
                      {/* Browser Chrome Header */}
                      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-100 bg-gray-50/80">
                        <button
                          onClick={() => setShowAddressModal(false)}
                          className="text-[#7360F2] hover:text-[#5d4ad4] text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          {lang === 'sr' ? 'Zatvori' : lang === 'mk' ? 'Затвори' : 'Close'}
                        </button>
                        <div className="flex-1 mx-2.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 flex items-center gap-1 shadow-xs min-w-0">
                          <svg className="w-2.5 h-2.5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                          <span className="text-[9.5px] text-gray-700 font-mono font-medium truncate">potvrdio.online/v/verify</span>
                        </div>
                        <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600 p-0.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>

                      {/* Page content — authentic Potvrdio mobile-address-app view */}
                      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 font-sans text-left">
                        {/* Potvrdio Brand & Security Badge */}
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-lg bg-white p-0.5 border border-purple-100 flex items-center justify-center shadow-xs">
                              <img src="/logo-icon-light.svg" alt="Potvrdio" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-extrabold text-[12px] text-gray-900 tracking-tight">Potvrdio</span>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {lang === 'sr' ? 'Sigurna Dostava' : lang === 'mk' ? 'Безбедна Достава' : 'Secure Delivery'}
                          </span>
                        </div>

                        {/* Order info badge */}
                        <div className="bg-[#F8F7FD] border border-[#E9E4F8] rounded-xl p-2.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-gray-500">{lang === 'sr' ? 'Porudžbina' : lang === 'mk' ? 'Нарачка' : 'Order'}:</span>
                            <span className="font-mono font-bold text-[#7360F2]">{currentScenConfig.orderId}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] mt-0.5">
                            <span className="text-gray-500">{lang === 'sr' ? 'Iznos (Pouzećem)' : lang === 'mk' ? 'Износ (При достава)' : 'Total (COD)'}:</span>
                            <span className="font-bold text-gray-900">{currentScenConfig.orderAmount[lang]}</span>
                          </div>
                        </div>

                        {/* Current street address */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5">
                          <div className="text-[8.5px] text-gray-400 uppercase font-bold tracking-wide mb-0.5">
                            {t('viber_shipping_address')}
                          </div>
                          <div className="text-[10.5px] text-gray-800 font-mono font-medium leading-snug">
                            {currentScenConfig.address[lang]}
                          </div>
                        </div>

                        {/* Address completion inputs */}
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-gray-800">
                            {lang === 'sr' ? 'Dopunite podatke za kurira:' : lang === 'mk' ? 'Дополнете ги податоците за курирот:' : 'Complete delivery details:'}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[8.5px] text-gray-500 font-bold uppercase block mb-1">
                                {lang === 'sr' ? 'Sprat *' : lang === 'mk' ? 'Кат *' : 'Floor *'}
                              </label>
                              <input
                                type="text"
                                value={floorInput}
                                onChange={e => setFloorInput(e.target.value)}
                                className="w-full border-2 border-[#E2DEF6] focus:border-[#7360F2] bg-white rounded-lg px-2 py-1.5 text-[11px] font-mono text-center outline-none transition-colors"
                                placeholder="3"
                              />
                            </div>
                            <div>
                              <label className="text-[8.5px] text-gray-500 font-bold uppercase block mb-1">
                                {lang === 'sr' ? 'Stan / Interfon *' : lang === 'mk' ? 'Стан / Домофон *' : 'Apt / Intercom *'}
                              </label>
                              <input
                                type="text"
                                value={aptInput}
                                onChange={e => setAptInput(e.target.value)}
                                className="w-full border-2 border-[#E2DEF6] focus:border-[#7360F2] bg-white rounded-lg px-2 py-1.5 text-[11px] font-mono text-center outline-none transition-colors"
                                placeholder="14"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[8.5px] text-gray-500 font-bold uppercase block mb-1">
                              {lang === 'sr' ? 'Napomena za kurira (opciono)' : lang === 'mk' ? 'Забелешка за курир (опционално)' : 'Courier note (optional)'}
                            </label>
                            <input
                              type="text"
                              defaultValue={lang === 'sr' ? 'Zvoniti na interfon Petrović' : lang === 'mk' ? 'Ѕвонете на домофон' : 'Ring Petrovic buzzer'}
                              className="w-full border border-gray-200 focus:border-[#7360F2] bg-white rounded-lg px-2 py-1 text-[10px] text-gray-700 outline-none"
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          data-sim-target="save"
                          onClick={handleSaveModalAddress}
                          className="w-full bg-[#7360F2] hover:bg-[#6250E0] active:scale-[0.99] text-white font-bold py-2.5 rounded-xl text-[11.5px] transition-all cursor-pointer shadow-md shadow-[#7360F2]/30 flex items-center justify-center gap-1.5 mt-1"
                        >
                          <span>✅</span>
                          <span>{lang === 'sr' ? 'Sačuvaj i Potvrdi Pošiljku' : lang === 'mk' ? 'Зачувај и Потврди Нарачка' : 'Save & Confirm Delivery'}</span>
                        </button>

                        <p className="text-[8px] text-center text-gray-400">
                          {lang === 'sr' ? '🔒 Jednokratni token • Podaci zaštićeni (ZZPL / GDPR)' : lang === 'mk' ? '🔒 Еднократен токен • Податоците се заштитени' : '🔒 Single-use token • Protected by GDPR'}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>



          {/* Live WooCommerce Order Flow Right */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4 font-sans text-xs">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-theme text-theme-muted">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span className="text-theme-primary font-bold text-xs">
                    {lang === 'sr' ? 'Živi tok obrade u WooCommerce-u' : lang === 'mk' ? 'Тек на обработка во WooCommerce' : 'Live WooCommerce & Warehouse Flow'}
                  </span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                  {lang === 'sr' ? 'AUTOMATIZOVANO' : lang === 'mk' ? 'АВТОМАТИЗИРАНО' : 'AUTOMATED'}
                </span>
              </div>

              {/* Order Life Cycle Cards */}
              <div className="mt-3 space-y-2.5">
                {/* Step 1: Order Created */}
                <div className="p-3 rounded-lg glass-panel border border-theme flex items-start gap-3 shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-theme-primary text-xs">
                        {lang === 'sr' ? `1. Porudžbina ${currentScenConfig.orderId} kreirana` : lang === 'mk' ? `1. Нарачка ${currentScenConfig.orderId} креирана` : `1. Order ${currentScenConfig.orderId} Created`}
                      </span>
                      <span className="text-[10px] text-amber-500 font-semibold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/20 shrink-0">
                        {lang === 'sr' ? 'Na čekanju (On-Hold)' : lang === 'mk' ? 'На чекање (On-Hold)' : 'On-Hold'}
                      </span>
                    </div>
                    <p className="text-theme-muted text-[11px] mt-0.5 leading-relaxed">
                      {lang === 'sr' ? 'Plaćanje pouzećem (COD). Potvrdio automatski zaustavlja štampanje adresnice dok kupac ne potvrdi.' : lang === 'mk' ? 'Плаќање при преземање (COD). Пакетот останува во магацин додека купувачот не потврди.' : 'Cash on Delivery order. Shipping label printing is automatically held until buyer verifies.'}
                    </p>
                  </div>
                </div>

                {/* Step 2: Viber Dispatched */}
                <div className="p-3 rounded-lg glass-panel border border-theme flex items-start gap-3 shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-theme-primary text-xs">
                        {lang === 'sr' ? '2. Viber verifikacija poslata kupcu' : lang === 'mk' ? '2. Viber верификација испратена' : '2. Viber Verification Dispatched'}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                        13:42:02
                      </span>
                    </div>
                    <p className="text-theme-muted text-[11px] mt-0.5 leading-relaxed">
                      {lang === 'sr' ? `Kupac ${currentScenConfig.customer} prima interaktivnu Viber poruku sa tačnom adresom i iznosom (${currentScenConfig.orderAmount[lang]}).` : lang === 'mk' ? `Купувачот ${currentScenConfig.customer} добива интерактивна Viber порака со адреса и износ (${currentScenConfig.orderAmount[lang]}).` : `Customer ${currentScenConfig.customer} receives interactive verification with full address and COD total (${currentScenConfig.orderAmount[lang]}).`}
                    </p>
                  </div>
                </div>

                {/* Step 3: Dynamic Outcome per Scenario & State */}
                {currentScenario === 1 && (
                  <div className={`p-3 rounded-lg border transition-all shadow-sm flex items-start gap-3 ${simState === 'edited' ? 'bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' : simState === 'confirmed' ? 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' : 'bg-amber-50/50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${simState === 'edited' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 border-blue-300' : simState === 'confirmed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 border-emerald-300' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 border-amber-300'}`}>
                      {simState !== 'initial' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-theme-primary text-xs">
                          {simState === 'edited'
                            ? (lang === 'sr' ? '3. Adresa dopunjena u WooCommerce-u!' : lang === 'mk' ? '3. Адресата е дополнета во WooCommerce!' : '3. Address Updated in WooCommerce!')
                            : simState === 'confirmed'
                            ? (lang === 'sr' ? '3. Kupac potvrdio tačnost' : lang === 'mk' ? '3. Купувачот потврди точност' : '3. Buyer Confirmed Details')
                            : (lang === 'sr' ? '3. Čeka se dopuna: Nedostaje stan i sprat' : lang === 'mk' ? '3. Се чека дополнување: Недостасува кат и стан' : '3. Action Required: Missing Apartment & Floor')}
                        </span>
                        {simState !== 'initial' && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                            {lang === 'sr' ? 'U obradi (Processing)' : lang === 'mk' ? 'Во обработка' : 'Processing'}
                          </span>
                        )}
                      </div>
                      <p className="text-theme-muted text-[11px] mt-0.5 leading-relaxed">
                        {simState === 'edited'
                          ? (lang === 'sr' ? `Kupac uneo: Sprat ${floorInput}, Stan ${aptInput}. WooCommerce baza ažurirana bez ijednog telefonskog poziva - adresnica je sada 100% tačna!` : lang === 'mk' ? `Внесен кат ${floorInput}, стан ${aptInput}. WooCommerce е ажуриран без телефонски повик!` : `Customer submitted Floor ${floorInput}, Apt ${aptInput}. Database updated automatically without any phone calls!`)
                          : simState === 'confirmed'
                          ? (lang === 'sr' ? 'Kupac potvrdio bez izmena. Paket je deblokiran za štampu adresnice i predaju kuriru.' : lang === 'mk' ? 'Потврдено без измени. Пакетот е подготвен за достава.' : 'Confirmed without edits. Manifest label unlocked for courier dispatch.')
                          : (lang === 'sr' ? 'Sistem sprečava slanje paketa na slepo. Kurir ne bi mogao da nađe ulaz bez broja stana.' : lang === 'mk' ? 'Системот спречува испраќање пратка без кат и стан.' : 'System prevents blind dispatch. Courier cannot deliver without apartment number.')}
                      </p>
                    </div>
                  </div>
                )}

                {currentScenario === 2 && (
                  <div className="p-3 rounded-lg bg-red-50/60 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-start gap-3 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <XCircle className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-red-700 dark:text-red-400 text-xs">
                          {lang === 'sr' ? '3. Kupac se predomislio (Nema odgovora 24h)' : lang === 'mk' ? '3. Купувачот се премислил (Нема одговор 24ч)' : '3. Customer Changed Mind (No response 24h)'}
                        </span>
                        <span className="text-[10px] text-red-700 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-500/20 px-2 py-0.5 rounded border border-red-200 shrink-0">
                          {lang === 'sr' ? 'Otkazano pre slanja' : lang === 'mk' ? 'Откажано навреме' : 'Cancelled in Time'}
                        </span>
                      </div>
                      <p className="text-theme-muted text-[11px] mt-0.5 leading-relaxed">
                        {lang === 'sr' ? 'Poslat SMS podsetnik, kupac ignoriše. Paket ostaje na polici u magacinu - sačuvano 820 RSD duple poštarine (slanje + povrat)!' : lang === 'mk' ? 'Испратен SMS потсетник, нема одговор. Пакетот останува во магацин - заштедени 820 RSD за поштарина!' : 'SMS fallback sent, no reply. Parcel never leaves warehouse shelf - ~€7 in double shipping return fees saved!'}
                      </p>
                    </div>
                  </div>
                )}

                {currentScenario === 3 && (
                  <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-3 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                          {lang === 'sr' ? '3. Potvrđeno u jednom dodiru (za 8 sekundi)' : lang === 'mk' ? '3. Потврдено со еден допир (за 8 секунди)' : '3. 1-Tap Instant Confirmation (< 8 sec)'}
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                          {lang === 'sr' ? 'Spremno za kurira' : lang === 'mk' ? 'Подготвено за курир' : 'Ready for Dispatch'}
                        </span>
                      </div>
                      <p className="text-theme-muted text-[11px] mt-0.5 leading-relaxed">
                        {lang === 'sr' ? 'Kupac je kliknuo potvrdu na telefonu. Webhook automatski generiše Post Express adresnicu i priprema nalog za pakovanje.' : lang === 'mk' ? 'Купувачот потврди на телефон. Webhook автоматски генерира адресар за курир.' : 'Buyer confirmed on Viber. Webhook generates courier shipping manifest and alerts packing station.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Warehouse Decision Footer */}
            <div className="p-3 sm:p-3.5 bg-surface-subtle rounded-lg border border-theme flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="text-theme-muted text-[10px] uppercase font-bold">{t('term_risk_status')}</div>
                <div className="font-bold text-xs mt-0.5">
                  {currentScenario === 2 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">{t('status_saved')}</span>
                  ) : simState !== 'initial' ? (
                    <span className="text-emerald-600 dark:text-emerald-400">{t('status_approved')}</span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">{t('status_waiting')}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={handleResetSim} 
                className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded bg-surface hover:bg-surface-subtle border border-theme text-theme-secondary hover:text-theme-primary text-[11px] font-medium transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] shadow-sm"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('btn_restart_sim')}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 02: Physical Manifest Label Inspector */}
      <section id="manifest" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-theme">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('man_tag')}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-theme-primary tracking-tight">{t('man_title')}</h2>
          <p className="text-xs sm:text-sm text-theme-muted mt-2 leading-relaxed">{t('man_p')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Unverified Bad Label */}
          <div className="glass-panel border-red-500/30 p-4 sm:p-6 rounded-xl relative overflow-hidden shadow-sm">
            <div className="absolute top-3 right-3 text-[10px] font-semibold bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-500/20">
              {t('man_badge_bad')}
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-theme-primary mb-4 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{t('man_bad_title')}</span>
            </h3>

            <div className="thermal-label p-3.5 sm:p-4 rounded-lg text-xs space-y-3 select-none overflow-x-auto">
              <div className="flex justify-between border-b border-slate-300 pb-2">
                <span className="font-bold">{t('man_label_header_bad')}</span>
                <span className="text-[11px]">PE-9948201-RS</span>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">{t('man_recipient_bad')}</div>
                <div className="font-bold text-slate-900">{t('man_bad_name')}</div>
                <div>{t('man_bad_addr1')}</div>
                <div className="text-red-600 font-bold text-[11px] flex items-center gap-1 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{t('man_bad_warning')}</span>
                </div>
                <div>{t('man_bad_city')}</div>
                <div>{t('man_bad_phone')}</div>
              </div>
              <div className="border-t border-slate-300 pt-2 flex justify-between items-center text-[11px]">
                <span>{t('man_cod')}</span>
                <span className="text-red-700 font-bold">{t('man_bad_return')}</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-700 dark:text-red-400 font-sans leading-relaxed">
              {t('man_bad_footer')}
            </div>
          </div>

          {/* Verified Good Label */}
          <div className="glass-panel border-emerald-500/30 p-4 sm:p-6 rounded-xl relative overflow-hidden shadow-sm">
            <div className="absolute top-3 right-3 text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
              {t('man_badge_good')}
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-theme-primary mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t('man_good_title')}</span>
            </h3>

            <div className="thermal-label p-3.5 sm:p-4 rounded-lg text-xs space-y-3 select-none overflow-x-auto">
              <div className="flex justify-between border-b border-slate-300 pb-2">
                <span className="font-bold">{t('man_label_header_good')}</span>
                <span className="text-[11px] font-bold text-emerald-800">POTVRDIO #7489</span>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">{t('man_recipient_good')}</div>
                <div className="font-bold text-slate-900">{t('man_good_name')}</div>
                <div>{t('man_good_addr1')}</div>
                <div className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t('man_good_apt')}</span>
                </div>
                <div>{t('man_good_city')}</div>
                <div>{t('man_good_phone')}</div>
              </div>
              <div className="border-t border-slate-300 pt-2 flex justify-between items-center text-[11px]">
                <span>{t('man_cod')}</span>
                <span className="text-emerald-800 font-bold">{t('man_good_delivery')}</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-400 font-sans leading-relaxed">
              {t('man_good_footer')}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: Return Freight Loss ROI Calculator */}
      <section id="kalkulator" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-theme">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('calc_tag')}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-theme-primary tracking-tight">{t('calc_title')}</h2>
          <p className="text-xs sm:text-sm text-theme-muted mt-2">{t('calc_desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center glass-panel p-4 sm:p-8 rounded-xl shadow-sm">
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            <div>
              <div className="flex justify-between items-center text-xs font-sans mb-2">
                <span className="text-theme-primary font-semibold">{t('calc_label_orders')}</span>
                <span className="text-teal-700 dark:text-[#14B8A6] font-bold text-sm bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-md border border-teal-200 dark:border-teal-800">
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
                className="w-full h-3 bg-surface-subtle rounded-lg appearance-none cursor-pointer border border-theme accent-teal-600 dark:accent-teal-500"
              />
              <div className="flex justify-between text-[10px] sm:text-[11px] font-sans text-theme-muted mt-1.5 flex-wrap gap-1">
                <span>50 ({lang === 'sr' ? 'Mala radnja' : lang === 'mk' ? 'Мала продавница' : 'Small Store'})</span>
                <span>750 ({lang === 'sr' ? 'Rastući brend' : lang === 'mk' ? 'Растечки бренд' : 'Growing Brand'})</span>
                <span>2.500+ ({lang === 'sr' ? 'Veliki shop' : lang === 'mk' ? 'Голема продавница' : 'Enterprise Store'})</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-sans mb-2">
                <span className="text-theme-primary font-semibold">{t('calc_label_rate')}</span>
                <span className="text-red-700 dark:text-red-400 font-bold text-sm bg-red-50 dark:bg-red-950/60 px-3 py-1 rounded-md border border-red-200 dark:border-red-800">
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
                className="w-full h-3 bg-surface-subtle rounded-lg appearance-none cursor-pointer border border-theme accent-teal-600 dark:accent-teal-500"
              />
              <div className="flex justify-between text-[10px] sm:text-[11px] font-sans text-theme-muted mt-1.5 flex-wrap gap-1">
                <span>{t('calc_rate_ideal')}</span>
                <span>{t('calc_rate_avg')}</span>
                <span>{t('calc_rate_high')}</span>
              </div>
            </div>

            <div className="p-3 bg-surface-subtle rounded-lg border border-theme text-xs font-sans flex flex-wrap justify-between items-center gap-2 text-theme-muted">
              <span>{t('calc_freight_note')}</span>
              <span className="text-theme-primary font-bold">{t('calc_freight_val')}</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface-subtle border border-theme p-5 sm:p-6 rounded-xl text-center space-y-5 shadow-sm">
            <div>
              <div className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider">
                {t('calc_loss_head')}
              </div>
              <div className="text-2xl sm:text-3xl font-sans font-bold text-red-600 dark:text-red-400 mt-1 tracking-tight">
                {annualLossRsd.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} RSD
              </div>
              <div className="text-xs text-theme-muted font-sans mt-0.5">
                (~{annualLossEur.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} € {lang === 'sr' ? '/ godišnje' : lang === 'mk' ? '/ годишно' : '/ year'})
              </div>
            </div>

            <div className="pt-5 border-t border-theme">
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                {t('calc_saved_head')}
              </div>
              <div className="text-xl sm:text-2xl font-sans font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {annualSavedRsd.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} RSD
              </div>
              <div className="text-[11px] text-theme-muted font-sans mt-1">
                {t('calc_roi_note')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: Credit Pool PAYG Pricing */}
      <section id="cenovnik" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-theme">
        <div className="mb-8 sm:mb-12">
          <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('price_tag')}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-theme-primary tracking-tight">{t('price_title')}</h2>
          <p className="text-xs sm:text-sm text-theme-muted mt-2 max-w-2xl">{t('price_desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-8 glass-panel rounded-xl overflow-hidden border border-theme shadow-sm">
            <div className="px-4 sm:px-5 py-3.5 border-b border-theme bg-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-sans">
              <span className="font-bold text-theme-primary">{t('price_prepaid_header')}</span>
              <span className="text-theme-muted text-[11px]">{t('price_invoice_sub')}</span>
            </div>

            <div className="overflow-x-auto touch-scroll">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-surface-subtle text-theme-muted border-b border-theme text-[10px] sm:text-[11px]">
                  <tr>
                    <th className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 font-semibold">{t('th_tier')}</th>
                    <th className="px-2 sm:px-4 py-2.5 sm:py-3.5 font-semibold">{t('th_deposit')}</th>
                    <th className="px-2 sm:px-4 py-2.5 sm:py-3.5 font-semibold">{t('th_viber_rate')}</th>
                    <th className="px-2 sm:px-4 py-2.5 sm:py-3.5 font-semibold">{t('th_sms_rate')}</th>
                    <th className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 font-semibold text-right">{t('price_btn_select')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme text-theme-secondary text-[11px] sm:text-xs">
                  {/* Starter Paket */}
                  <tr className="hover:bg-surface-subtle/50 transition">
                    <td className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 font-bold text-theme-primary whitespace-nowrap">
                      Starter Paket
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 font-bold text-theme-primary whitespace-nowrap">
                      15 €
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
                      0.026 €
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-theme-muted whitespace-nowrap">
                      0.20 €
                    </td>
                    <td className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 text-right whitespace-nowrap">
                      <button 
                        onClick={() => { playClickSound(); setShowOnboardingModal(true); }} 
                        className="btn-select-wave px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-theme text-theme-primary text-[10px] sm:text-[11px] font-semibold transition cursor-pointer min-h-[28px] sm:min-h-[32px] shadow-sm"
                      >
                        {t('price_btn_select')}
                      </button>
                    </td>
                  </tr>

                  {/* Growth Paket (Popular) */}
                  <tr className="bg-teal-50/50 dark:bg-[#14B8A6]/5 hover:bg-teal-50/80 dark:hover:bg-[#14B8A6]/10 transition">
                    <td className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 font-bold text-theme-primary">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                        <span className="whitespace-nowrap">Growth Paket</span>
                        <span className="w-fit text-[7.5px] sm:text-[9px] font-bold bg-teal-100 dark:bg-[#14B8A6]/20 text-teal-800 dark:text-[#14B8A6] px-1.5 py-0.5 rounded-full border border-teal-200 dark:border-[#14B8A6]/30 uppercase tracking-tight whitespace-nowrap">
                          {t('price_badge_popular')}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 font-bold text-theme-primary whitespace-nowrap">
                      45 €
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
                      0.024 €
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-theme-muted whitespace-nowrap">
                      0.19 €
                    </td>
                    <td className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 text-right whitespace-nowrap">
                      <button 
                        onClick={() => { playClickSound(); setShowOnboardingModal(true); }} 
                        className="btn-brand-cta px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-white font-bold text-[10px] sm:text-[11px] transition cursor-pointer min-h-[28px] sm:min-h-[32px] shadow-sm"
                      >
                        {t('price_btn_select')}
                      </button>
                    </td>
                  </tr>

                  {/* Scale Paket */}
                  <tr className="hover:bg-surface-subtle/50 transition">
                    <td className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 font-bold text-theme-primary whitespace-nowrap">
                      Scale Paket
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 font-bold text-theme-primary whitespace-nowrap">
                      120 €
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
                      0.020 €
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-theme-muted whitespace-nowrap">
                      0.17 €
                    </td>
                    <td className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 text-right whitespace-nowrap">
                      <button 
                        onClick={() => { playClickSound(); setShowOnboardingModal(true); }} 
                        className="btn-select-wave px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-surface hover:bg-surface-subtle border border-theme text-theme-primary text-[10px] sm:text-[11px] font-semibold transition cursor-pointer min-h-[28px] sm:min-h-[32px] shadow-sm"
                      >
                        {t('price_btn_select')}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3.5 sm:p-4 bg-surface-subtle border-t border-theme text-[11px] text-theme-muted font-sans flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
              <span>{t('price_note')}</span>
            </div>
          </div>

          {/* Pro Reserve */}
          <div className="lg:col-span-4 glass-panel rounded-xl p-5 sm:p-6 font-sans text-xs border border-theme shadow-sm">
            <div className="text-[10px] text-teal-600 dark:text-[#14B8A6] uppercase tracking-wider mb-2 font-semibold">{t('pro_tag')}</div>
            <h3 className="text-base font-bold text-theme-primary font-sans">{t('price_pro_title')}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-theme-primary font-sans">29 €</span>
              <span className="text-theme-muted text-xs">{t('price_per_month')}</span>
            </div>
            <p className="text-theme-muted text-[11px] mt-2 leading-relaxed">
              {t('price_pro_desc')}
            </p>

            <ul className="space-y-2.5 my-5 text-theme-secondary text-[11px]">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{t('price_pro_feat1')}</span>
                  <div className="text-[10px] text-theme-muted mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>{t('price_pro_credit_ratio')}</span>
                    <span 
                      className="group relative inline-flex items-center cursor-pointer text-theme-muted hover:text-theme-primary transition-colors"
                      title={t('price_pro_tooltip')}
                    >
                      <Info className="w-3.5 h-3.5 text-theme-muted" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 w-56 p-2.5 bg-slate-900 text-slate-100 dark:bg-slate-800 dark:text-slate-100 text-[10px] rounded-lg shadow-lg border border-slate-700 pointer-events-none leading-relaxed text-center">
                        {t('price_pro_tooltip')}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></span>
                      </span>
                    </span>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('price_pro_feat2')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t('price_pro_feat3')}</span>
              </li>
            </ul>

            <button 
              onClick={() => { playClickSound(); setShowOnboardingModal(true); }}
              className="w-full btn-brand-cta text-white font-bold py-3 rounded text-xs transition shadow-sm cursor-pointer min-h-[44px]"
            >
              {t('btn_act_pro')}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 05: Legal Framework & Code Integration */}
      <section id="integracija" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-theme">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-1 lg:min-h-[140px] flex flex-col justify-start">
              <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('leg_tag')}</div>
              <h2 className="text-xl sm:text-2xl font-bold text-theme-primary tracking-tight">{t('leg_title')}</h2>
              <p className="text-xs text-theme-muted leading-relaxed pt-1">{t('leg_p')}</p>
            </div>

            <div className="space-y-3 font-sans text-xs pt-2">
              <div className="p-3.5 rounded-xl glass-panel border border-theme shadow-sm">
                <div className="text-theme-primary font-bold mb-1 flex items-center justify-between">
                  <span>{t('leg_item1_title')}</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-sans">Pravni Osnov</span>
                </div>
                <div className="text-theme-muted text-[11px] leading-relaxed">
                  {t('leg_item1_desc')}
                </div>
              </div>

              <div className="p-3.5 rounded-xl glass-panel border border-theme shadow-sm">
                <div className="text-theme-primary font-bold mb-1 flex items-center justify-between">
                  <span>{t('leg_item2_title')}</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 font-sans">Retention 30D</span>
                </div>
                <div className="text-theme-muted text-[11px] leading-relaxed">
                  {t('leg_item2_desc')}
                </div>
              </div>

              <div className="p-3.5 rounded-xl glass-panel border border-theme shadow-sm">
                <div className="text-theme-primary font-bold mb-1 flex items-center justify-between">
                  <span>{t('leg_item3_title')}</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-sans">TLS 1.3 HMAC</span>
                </div>
                <div className="text-theme-muted text-[11px] leading-relaxed">
                  {t('leg_item3_desc')}
                </div>
              </div>
            </div>

            <a 
              href="#footer"
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-3 rounded-lg bg-surface-subtle border border-theme hover:border-emerald-500/50 hover:bg-surface transition group text-[11px] font-sans text-theme-muted hover:text-theme-primary flex items-center justify-between gap-2 cursor-pointer shadow-sm"
              title={lang === 'sr' ? 'Pogledajte pravna dokumenta i registre u podnožju' : lang === 'mk' ? 'Прегледајте ги правните документи во подножјето' : 'View legal documents & registries in footer'}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>{t('leg_bottom_note')}</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <span>{lang === 'sr' ? 'Pravna dokumenta' : lang === 'mk' ? 'Правни документи' : 'Legal Documents'}</span>
                <span className="text-xs group-hover:translate-y-0.5 transition-transform">↓</span>
              </span>
            </a>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-1 lg:min-h-[140px] flex flex-col justify-start">
              <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('dev_tag')}</div>
              <h2 className="text-xl sm:text-2xl font-bold text-theme-primary tracking-tight">{t('dev_title')}</h2>
              <p className="text-xs text-theme-muted leading-relaxed pt-1">{t('dev_p')}</p>
            </div>
            
            <div className="space-y-3 font-sans text-xs pt-2">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl glass-panel border border-theme shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-[#14B8A6]/10 text-teal-600 dark:text-[#14B8A6] border border-teal-200 dark:border-[#14B8A6]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-theme-primary font-bold mb-0.5">{t('dev_step1_title')}</div>
                  <div className="text-theme-muted text-[11px] leading-relaxed">{t('dev_step1_desc')}</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl glass-panel border border-theme shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-theme-primary font-bold mb-0.5">{t('dev_step2_title')}</div>
                  <div className="text-theme-muted text-[11px] leading-relaxed">{t('dev_step2_desc')}</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl glass-panel border border-theme shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-theme-primary font-bold mb-0.5">{t('dev_step3_title')}</div>
                  <div className="text-theme-muted text-[11px] leading-relaxed">{t('dev_step3_desc')}</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-theme text-[11px] font-sans text-theme-muted flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t('dev_hpos_note')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05.5: Frequently Asked Questions (FAQ & AI GEO Indexing) */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-theme">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <div className="text-xs font-mono text-[#14B8A6] uppercase tracking-wider">
              {t('faq_tag')}
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-theme-primary tracking-tight">
              {t('faq_title')}
            </h2>
            <p className="text-xs text-theme-muted max-w-lg mx-auto leading-relaxed">
              {t('faq_sub')}
            </p>
          </div>

          <div className="space-y-3 font-sans">
            {[
              {
                q: {
                  sr: "Kako Potvrdio tačno sprečava troškove nepreuzetih paketa pri plaćanju pouzećem?",
                  mk: "Како Potvrdio ги спречува трошоците за непреземени пакети при плаќање при преземање?",
                  en: "How does Potvrdio eliminate uncollected Cash on Delivery (COD) parcel return costs?"
                },
                a: {
                  sr: "Potvrdio presreće WooCommerce porudžbine plaćene pouzećem na checkout-u, automatski ih stavlja na status On-Hold i šalje kupcu dvosmernu Viber poruku sa zahtevom za verifikaciju adrese. Paket se pakuje i predaje kurirskoj službi (Post Express, Bex, D Express, Cargo) tek nakon što kupac potvrdi tačnost adrese i spremnost za preuzimanje.",
                  mk: "Potvrdio ги пресретнува WooCommerce нарачките со плаќање при преземање, ги става во статус On-Hold и испраќа Viber порака. Пакетот се пакува и испраќа исклучиво по потврда на купувачот.",
                  en: "Potvrdio intercepts Cash on Delivery orders at WooCommerce checkout, flags them as On-Hold, and initiates an automated 2-way Viber verification session. Parcels are packed and dispatched to courier services only post-buyer confirmation."
                }
              },
              {
                q: {
                  sr: "Da li je Viber verifikacija adrese zakonski usklađena sa ZZPL RS i EU GDPR?",
                  mk: "Дали Viber верификацијата е усогласена со законите за заштита на податоци (ZZLP MK & GDPR)?",
                  en: "Is Viber address verification fully compliant with Serbian ZZPL and EU GDPR?"
                },
                a: {
                  sr: "Da, Potvrdio funkcioniše isključivo na osnovu Člana 12 Zakona o zaštiti podataka o ličnosti RS (Službeni glasnik 87/2018), Člana 10 ZZLP Severne Makedonije i Člana 6(1)(b) EU GDPR. Obrada telefona i adrese je ugovorna obaveza za isporuku kupljene robe. Svi podaci se automatski brišu i anonimizuju 30 dana nakon dostave.",
                  mk: "Да, верификацијата функционира исклучиво врз основа на Член 10 од Законот за заштита на личните податоци (АЗЛП) и GDPR Art. 6.1.b. Податоците автоматски се бришат 30 дена по доставата.",
                  en: "Yes. Processing is grounded under Article 12 of Serbian ZZPL (Official Gazette 87/2018), Article 10 of MK ZZLP, and EU GDPR Art. 6(1)(b) for remote sales contract execution. Buyer data is automatically anonymized and purged 30 days post-delivery."
                }
              },
              {
                q: {
                  sr: "Šta se dešava ako kupac nema instaliran Viber ili ne odgovara na poruku?",
                  mk: "Што се случува ако купувачот нема Viber или не одговара на пораката?",
                  en: "What happens if the customer does not have Viber installed or ignores the message?"
                },
                a: {
                  sr: "Ako kupac nema Viber ili ignoriše poruku duže od 4 minuta, Potvrdio automatski aktivira SMS fallback rutu i šalje SMS poruku sa jedinstvenim jednokratnim token linkom za izmenu i potvrdu adrese.",
                  mk: "Ако купувачот нема Viber или не одговори во рок од 4 минути, Potvrdio автоматски активира SMS fallback со токен линк за потврда.",
                  en: "If the buyer lacks Viber or ignores the message within 4 minutes, Potvrdio automatically triggers an SMS fallback verification link with a single-use token."
                }
              },
              {
                q: {
                  sr: "Da li postoje fiksne mesečne pretplate i skriveni troškovi?",
                  mk: "Дали постојат фиксни месечни претплати или скриени трошоци?",
                  en: "Are there fixed monthly subscription retainers or hidden fees?"
                },
                a: {
                  sr: "Ne. Osnovni PAYG kreditni bazen funkcioniše po principu plaćanja samo utrošenih verifikacija, bez mesečnih ugovora i fiksnih taksi. Kupljeni krediti nema rok trajanja i nikada ne ističu. Za radnje sa preko 300 porudžbina mesečno dostupan je opcion Pro Reserve plan.",
                  mk: "Не. Основниот PAYG базен функционира без претплата. Кредитите никогаш не истекуваат. За поголеми продавници достапен е Pro Reserve план.",
                  en: "No. The core PAYG credit pool operates with zero fixed retainers or aggregator contracts. Purchased credits never expire. Pro Reserve plans are optional for high-volume stores (>300 monthly orders)."
                }
              },
              {
                q: {
                  sr: "Da li je Potvrdio eklentija kompatibilna sa WooCommerce HPOS (High-Performance Order Storage)?",
                  mk: "Дали е компатибилен со High-Performance Order Storage (HPOS)?",
                  en: "Is the Potvrdio plugin fully compatible with WooCommerce High-Performance Order Storage (HPOS)?"
                },
                a: {
                  sr: "Da, eklentija je u potpunosti testirana i podržava HPOS u verzijama WooCommerce 7.0 do 9.x sa uključenom bazičnom ili naprednom tabličnom strukturom porudžbina.",
                  mk: "Да, приклучокот е целосно тестиран и поддржува HPOS во WooCommerce 7.0 до 9.x.",
                  en: "Yes, the plugin is battle-tested and fully supports High-Performance Order Storage (HPOS) across WooCommerce 7.0 through 9.x."
                }
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-lg glass-panel border border-theme overflow-hidden transition-all duration-150"
                >
                  <button
                    onClick={() => {
                      playClickSound();
                      setOpenFaqIndex(isOpen ? null : idx);
                    }}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 text-theme-primary font-bold text-xs sm:text-sm cursor-pointer hover:bg-surface-subtle/50 transition"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-teal-600 dark:text-[#14B8A6] shrink-0" />
                      <span>{faq.q[lang]}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-theme-muted transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-teal-600 dark:text-[#14B8A6]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-2 text-theme-secondary text-xs sm:text-sm leading-relaxed border-t border-theme bg-surface-subtle/50 font-sans">
                      {faq.a[lang]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 06: Download & Installation CTA */}
      <section id="preuzmi" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-12 rounded-xl shadow-sm">
          <div className="w-12 h-12 rounded bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-[#14B8A6] flex items-center justify-center mx-auto mb-4">
            <Download className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-theme-primary tracking-tight">{t('dl_title')}</h2>
          <p className="text-xs sm:text-sm text-theme-muted mt-3 max-w-md mx-auto">{t('dl_desc')}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button 
              onClick={() => { playScannerBeep(); setShowOnboardingModal(true); }}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-3 btn-brand-cta text-white font-bold text-xs rounded-lg transition shadow-lg cursor-pointer min-h-[44px]"
            >
              {t('btn_dl_full')}
            </button>
            <a 
              href="#lab" 
              className="w-full sm:w-auto px-5 py-3.5 sm:py-3 bg-surface hover:bg-surface-subtle text-theme-primary border border-theme text-xs rounded-lg font-sans font-medium transition inline-flex items-center justify-center min-h-[44px] shadow-sm"
            >
              {t('btn_view_demo')}
            </a>
          </div>
        </div>
      </section>

      {/* Comprehensive Bank-Compliant Footer */}
      <Footer 
        theme={theme}
        lang={lang}
        onOpenPrivacy={() => { playClickSound(); setShowPrivacyModal(true); }}
        onOpenTerms={() => { playClickSound(); setShowTermsModal(true); }}
        onOpenRefund={() => { playClickSound(); setShowRefundModal(true); }}
        onOpenDelivery={() => { playClickSound(); setShowDeliveryModal(true); }}
        onOpenCookie={() => { playClickSound(); setShowCookieModal(true); }}
      />

      {/* Legal Modals (AllSecure & Raiffeisen Bank Compliance) */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyModal} 
        onClose={() => {
          setShowPrivacyModal(false);
          if (window.history && window.history.replaceState) window.history.replaceState(null, '', '/');
        }} 
        lang={lang} 
      />

      <TermsConditionsModal 
        isOpen={showTermsModal} 
        onClose={() => {
          setShowTermsModal(false);
          if (window.history && window.history.replaceState) window.history.replaceState(null, '', '/');
        }} 
        lang={lang} 
      />

      <RefundPolicyModal 
        isOpen={showRefundModal} 
        onClose={() => {
          setShowRefundModal(false);
          if (window.history && window.history.replaceState) window.history.replaceState(null, '', '/');
        }} 
        lang={lang} 
      />

      <DeliveryPolicyModal 
        isOpen={showDeliveryModal} 
        onClose={() => {
          setShowDeliveryModal(false);
          if (window.history && window.history.replaceState) window.history.replaceState(null, '', '/');
        }} 
        lang={lang} 
      />

      <CookiePolicyModal 
        isOpen={showCookieModal} 
        onClose={() => {
          setShowCookieModal(false);
          if (window.history && window.history.replaceState) window.history.replaceState(null, '', '/');
        }} 
        lang={lang} 
      />

      {/* Onboarding & Free Credits Modal */}
      <OnboardingModal 
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        lang={lang}
        playSuccessSound={playScannerBeep}
      />

      {/* Floating Quick Contact Widget (WhatsApp & Viber) */}
      <FloatingContactWidget lang={lang} />
    </div>
  );
}

