import React, { useState, useEffect } from 'react';
import { 
  Check, Download, AlertTriangle, ArrowDown, ChevronRight, 
  RotateCcw, ShieldCheck, Terminal, MapPin, CheckCircle2, XCircle, FileText,
  X, Lock, ExternalLink, Menu, Scale, HelpCircle, ChevronDown, Rocket, Sun, Moon
} from 'lucide-react';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsConditionsModal } from './components/TermsConditionsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PotvrdioLogo } from './components/PotvrdioLogo';

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
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [floorInput, setFloorInput] = useState<string>('3');
  const [aptInput, setAptInput] = useState<string>('14');
  
  // ROI Calculator States
  const [ordersCount, setOrdersCount] = useState<number>(450);
  const [failureRate, setFailureRate] = useState<number>(13);

  const t = (key: string): string => {
    const translations: Record<Lang, Record<string, string>> = {
      sr: {
        top_networks: "Post Express, D Express, Bex, City Express",
        nav_sub: "Lojistička COD Zaštita · WP v2.1",
        nav_lab: "Simulacija na terenu",
        nav_manifest: "Inspekcija adresnice",
        nav_calc: "Matrica gubitka",
        nav_pricing: "Bazen kredita",
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
        viber_success_confirmed: "Potvrđeno bez izmena! Paket je spreman za štampu adresnice.",
        viber_success_edited: "Adresa dopunjena! Dodat sprat i stan. WooCommerce ažuriran.",
        status_saved: "SAČUVANO: Paket nije poslat, 820 RSD u džepu",
        status_approved: "ODOBRENO: Štampaj Post Express adresnicu",
        status_waiting: "ČEKANJE: Ne pakovati paket iz magacina",
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
        leg_tag: "05 / Pravni okvir & Usklađenost",
        leg_title: "Usklađenost sa Zakonom o zaštiti podataka o ličnosti (ZZPL RS & EU GDPR)",
        leg_p: "Slanje verifikacionih poruka funkcioniše isključivo na osnovu Člana 12 Zakona o zaštiti podataka o ličnosti RS (Službeni glasnik 87/2018), Člana 10 ZZLP Severne Makedonije i Člana 6(1)(b) EU GDPR. Obrada je zakonski neophodna za izvršenje ugovora o kupoprodaji na daljinu.",
        dev_tag: "Tehnička integracija",
        dev_title: "Kako izgleda kod u WooCommerce eklentiji?",
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
        man_badge_good: "POTVRDIO VALIDIRANO",
        man_label_header_bad: "STANDARDNA ADRESNICA",
        man_label_header_good: "VERIFIKOVANA ADRESNICA",
        man_recipient_bad: "PRIMALAC:",
        man_recipient_good: "PRIMALAC (KUPAC POTVRDIO NA VIBERU):",
        man_bad_warning: "NEMA BROJ ZGRADE, NEMA STAN",
        man_bad_phone: "Tel: 063/123-xxx (Isključen telefon)",
        man_good_apt: "Ulaz 2, Sprat 4, Stan 18 (Interfon radi)",
        man_good_phone: "Tel: +381 63 948 2190 (Proveren prijem)",
        man_cod: "OTKUPNINA: 3.200 RSD",
        man_bad_return: "POVRAT: +410 RSD",
        man_good_delivery: "ISPORUKA: 98.4%",
        price_prepaid_header: "Prepaid Dopuna (Krediti nikada ne ističu)",
        price_invoice_sub: "Faktura za pravna lica (RSD / EUR)",
        price_badge_popular: "NAJČEŠĆE",
        price_btn_select: "Izaberi",
        price_pro_title: "Pro Reserve Pretplata",
        price_per_month: "/ mesečno",
        price_pro_desc: "Uključuje 1.800 verifikacija (~0.016 € po poruci). Prioritetna Viber linija sa direktnim prolazom bez čekanja.",
        price_pro_feat1: "1.800 uključenih kredita / mesec",
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
        leg_proof_title: "Zvanični Pravni Registri i Zakonski Dokazi",
        leg_ref_pis: "Pravno-informacioni sistem RS",
        leg_ref_pis_sub: "Sl. glasnik RS 87/2018 (Član 12 - Zakonitost obrade)",
        leg_ref_poverenik: "Poverenik za informacije RS",
        leg_ref_poverenik_sub: "Organ nadzora za zaštitu podataka (poverenik.rs)",
        leg_ref_gdpr: "EU GDPR EUR-Lex Portal",
        leg_ref_gdpr_sub: "Uredba (EU) 2016/679 - Član 6.1.b (Contract Law)",
        leg_ref_azlp: "AZLP Severna Makedonija",
        leg_ref_azlp_sub: "Agencija za zaštitu ličnih podataka (azlp.mk)",
        modal_legal_notice: "🔒 Kriptografski HMAC Token · Usklađeno sa Čl. 12 ZZPL RS & GDPR Art. 6",
        footer_privacy: "Politika Privatnosti",
        footer_terms: "Uslovi Korišćenja",
        leg_action_privacy: "Politika Privatnosti (ZZPL & GDPR)",
        leg_action_terms: "Uslovi Korišćenja SaaS Platforme",
        dev_code_comment: "// 1. Presretanje porudžbine u functions.php ili pluginu",
        dev_status_note: "Potvrdio: Čeka Viber potvrdu kupca",
        dev_hpos_note: "Testirano na WooCommerce 7.0 do 9.x sa High-Performance Order Storage (HPOS) uključenim.",
        footer_sub: "— Regionalna infrastruktura za WooCommerce pouzeće",
        footer_location: "Novi Sad / Beograd",
        top_gateway: "Viber Gateway RS: AKTIVAN",
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
        hero_btn_activate: "Aktiviraj 25 Besplatnih Verifikacija",
        scen2_ignored_notice: "Kupac nije odgovorio 24h. Porudžbina stornirana pre pakovanja.",
        calc_orders_unit: "narudžbina",
        modal_alert_tip: "⚡ Popunite sprat i stan kako bi kurir bez zastoja pronašao vaš ulaz.",
        faq_tag: "06 / Često Postavljana Pitanja",
        faq_title: "Sve što treba da znate o Potvrdio COD verifikaciji",
        faq_sub: "Odgovori na ključna tehnička, pravna i operativna pitanja trgovaca.",
        floor_word: "Sprat",
        apt_word: "Stan"
      },
      mk: {
        top_networks: "Post Express, D Express, Cargo Express, Via Courier",
        nav_sub: "Логистичка COD Заштита · WP v2.1",
        nav_lab: "Симулација на терен",
        nav_manifest: "Инспекција на адреса",
        nav_calc: "Матрица на загуби",
        nav_pricing: "Кредитен базен",
        nav_dev: "API & HPOS",
        btn_dl: "Преземи ZIP",
        hero_tag: "WooCommerce Заштита на плаќање при преземање (COD)",
        hero_title: "Купувачот нарачува со плаќање при преземање, не го презема пакетот. Вие плаќате и достава и враќање.",
        hero_p: "Во регионот над 65% од e-commerce нарачките се со плаќање при преземање. Секоја петта вратена пратка ве чини меѓу 720 и 890 RSD чиста загуба. Potvrdio автоматски ја задржува нарачката во статус On-Hold, испраќа двонасочна Viber верификација и дозволува печатење на адресарот исклучиво по потврда на купувачот.",
        hero_cta_primary: "Тестирај интерактивна верификација",
        hero_free_credits: "бесплатни верификации вклучени со приклучокот",
        stat_open_rate: "Одзив на порака",
        stat_open_sub: "Viber во рок од 4 мин.",
        stat_hold_cost: "Загуба по пакет",
        stat_hold_sub: "Двојна курирска пошта",
        stat_recovery: "Пад на вратени пратки",
        stat_recovery_sub: "Од 14.8% на 2.5%",
        hero_box_note: "Пакетот физички не се подигнува од магацин додека купувачот не кликне потврда на Viber. Со тоа ризикот се сведува на нула.",
        lab_tag: "01 / Интерактивна лабораторија",
        lab_title: "Испробајте 3 реални сценарија од балканската пракса",
        lab_subtitle: "Кликнете на сценарио за да го видите однесувањето на Viber ботот и WooCommerce базата:",
        scen1_title: "Нецелосна адреса (Скопје)",
        scen1_desc: "Купувачот заборавил број на стан и кат. Ги корегира податоците со еден клик преку токен линк.",
        scen2_title: "Купувачот се премисли (Битола)",
        scen2_desc: "Купувачот ја игнорира Viber пораката и SMS. Пакетот останува во магацин, а продавачот заштедува 820 RSD.",
        scen3_title: "Инстант 1-Click Потврда",
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
        viber_success_confirmed: "Потврдено без измени! Пакетот е подготвен за достава.",
        viber_success_edited: "Адресата е дополнета! Додаден кат и стан. WooCommerce е ажуриран.",
        status_saved: "ЗАШТЕДЕНО: Пакетот не е испратен, 820 RSD во џеб",
        status_approved: "ОДОБРЕНО: Печати адресар за достава",
        status_waiting: "ЧЕКАЊЕ: Не пакувај го пакетот од магацин",
        term_title: "Real-Time WP Event Terminal",
        term_risk_status: "Статус на магацин",
        btn_restart_sim: "Рестартирај тест",
        man_tag: "02 / Физички адресар",
        man_title: "Зошто куририте враќаат пакети? Анатомија на неисправна адреса",
        man_p: "Курирот има просечно 45 секунди по адреса. Ако нема кат или стан, го означува како 'Неиспорачано'. Трошокот паѓа на продавачот.",
        man_bad_title: "Стандарден WooCommerce Внос (Висок ризик)",
        man_bad_footer: "Резултат: Курирот не може да ја најде зградата. Пакетот се враќа на продавачот. Загуба: 780 RSD.",
        man_good_title: "Чист адресар по Viber потврда",
        man_good_footer: "Резултат: Курирот го наоѓа интерфонот од прв обид. Купувачот го очекува пакетот.",
        calc_tag: "03 / Математика на загуба",
        calc_title: "Преметајте ги годишните загуби на курирски услуги",
        calc_desc: "Калкулацијата ги зема предвид официјалните ценовници на курирските служби во регионот.",
        calc_label_orders: "Месечен број на COD нарачки:",
        calc_label_rate: "Процент на неиспорачани пакети:",
        calc_loss_head: "Годишна директна загуба од поштарина",
        calc_saved_head: "Нето заштедено со Potvrdio:",
        calc_roi_note: "По одземање на трошокот за Viber кредити (ROI > 14x)",
        price_tag: "04 / Кредитен базен (PAYG)",
        price_title: "Без договори. Плаќате само за испратени пораки.",
        price_desc: "Директен Viber Business API бара фиксни месечни закупнини од 150€+. Potvrdio ве обединува за најниска цена.",
        th_tier: "Пакет",
        th_deposit: "Износ за уплата",
        th_viber_rate: "Viber цена",
        th_sms_rate: "SMS Fallback",
        price_note: "Фактурирање во денари/евра. Без автоматско одземање од картичка.",
        pro_tag: "За продавници со > 300 нарачки",
        btn_act_pro: "Активирај Pro Reserve",
        leg_tag: "05 / Правна Рамка & Усогласеност",
        leg_title: "Усогласеност со Законот за заштита на личните податоци (ZZLP MK & EU GDPR)",
        leg_p: "Испраќањето верификациски пораки функционира исклучиво врз основа на Член 10 од Законот за заштита на личните податоци на С. Македонија (АЗЛП), Член 12 од ZZPL RS и Член 6(1)(b) од EU GDPR. Обработката е законски неопходна за исполнување на купопродажниот договор.",
        dev_tag: "Техничка интеграција",
        dev_title: "Како изгледа кодот во WooCommerce?",
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
        price_prepaid_header: "Prepaid Дополнување (Кредитите никогаш не истекуваат)",
        price_invoice_sub: "Фактура за правни лица (RSD / EUR)",
        price_badge_popular: "НАЈЧЕСТО",
        price_btn_select: "Избери",
        price_pro_title: "Pro Reserve Претплата",
        price_per_month: "/ месечно",
        price_pro_desc: "Вклучува 1.800 верификации (~0.016 € по порака). Приоритетна Viber линија со директен премин.",
        price_pro_feat1: "1.800 вклучени кредити / месец",
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
        leg_proof_title: "Официјални Правни Регистри и Законски Докази",
        leg_ref_pis: "Правно-информационен систем на Србија",
        leg_ref_pis_sub: "Сл. гласник RS 87/2018 (Член 12 - Законитост)",
        leg_ref_poverenik: "Повереник за информации на Србија",
        leg_ref_poverenik_sub: "Надзорен орган за заштита на податоци (poverenik.rs)",
        leg_ref_gdpr: "ЕУ GDPR EUR-Lex Портал",
        leg_ref_gdpr_sub: "Уредба (ЕУ) 2016/679 - Член 6.1.б (Договор)",
        leg_ref_azlp: "АЗЛП Северна Македонија",
        leg_ref_azlp_sub: "Агенција за заштита на личните податоци (azlp.mk)",
        modal_legal_notice: "🔒 Криптографски HMAC Токен · Усогласено со Чл. 10 ZZLP MK & GDPR Art. 6",
        footer_privacy: "Политика за Приватност",
        footer_terms: "Услови за Користење",
        leg_action_privacy: "Политика за Приватност (ZZLP & GDPR)",
        leg_action_terms: "Услови за Користење на Платформата",
        dev_code_comment: "// 1. Интерцепција во functions.php или приклучок",
        dev_status_note: "Potvrdio: Се чека Viber потврда",
        dev_hpos_note: "Тестирано на WooCommerce 7.0 до 9.x со вклучен High-Performance Order Storage (HPOS).",
        footer_sub: "— Регионална инфраструктура за WooCommerce плаќање при преземање",
        footer_location: "Скопје / Битола / Белград",
        top_gateway: "Viber Gateway: АКТИВЕН",
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
        hero_btn_activate: "Активирај 25 Бесплатни Верификации",
        scen2_ignored_notice: "Купувачот не одговори 24ч. Нарачката е откажана пред пакување.",
        calc_orders_unit: "нарачки",
        modal_alert_tip: "⚡ Пополнете кат и стан за курирот без застој да го најде вашиот влез.",
        faq_tag: "06 / Често Поставувани Прашања",
        faq_title: "Сè што треба да знаете за Potvrdio COD верификацијата",
        faq_sub: "Одговори на клучните технички и правни прашања.",
        floor_word: "Кат",
        apt_word: "Стан"
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
        viber_success_confirmed: "Confirmed without edits! Parcel ready for shipping label printing.",
        viber_success_edited: "Address updated! Floor and apartment added. WooCommerce updated.",
        status_saved: "SAVED: Parcel not dispatched, ~€7 saved in pocket",
        status_approved: "APPROVED: Print Post Express shipping label",
        status_waiting: "ON HOLD: Do not pack parcel from warehouse",
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
        leg_tag: "05 / Legal Framework & Compliance",
        leg_title: "Compliant with Serbian ZZPL Art. 12, MK ZZLP & EU GDPR",
        leg_p: "Customer address verification messages operate strictly under Article 12 of the Serbian Personal Data Protection Law (ZZPL), Article 10 of North Macedonia's ZZLP, and Article 6(1)(b) of the EU GDPR. Processing is legally grounded in remote sales contract execution.",
        dev_tag: "Technical Integration",
        dev_title: "How clean is the WooCommerce code?",
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
        price_prepaid_header: "Prepaid Credits (Credits never expire)",
        price_invoice_sub: "Invoices for Companies (RSD / EUR)",
        price_badge_popular: "MOST POPULAR",
        price_btn_select: "Select",
        price_pro_title: "Pro Reserve Plan",
        price_per_month: "/ month",
        price_pro_desc: "Includes 1,800 verifications (~€0.016 / message). Priority Viber gateway with zero waiting queue.",
        price_pro_feat1: "1,800 included credits / month",
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
        leg_proof_title: "Official Legal Registries & Evidence Links",
        leg_ref_pis: "Serbian Legal Information System",
        leg_ref_pis_sub: "Official Gazette RS 87/2018 (Art. 12 Lawfulness)",
        leg_ref_poverenik: "RS Data Protection Commissioner",
        leg_ref_poverenik_sub: "Data Inspectorate Authority (poverenik.rs)",
        leg_ref_gdpr: "EU GDPR EUR-Lex Official Portal",
        leg_ref_gdpr_sub: "Regulation (EU) 2016/679 - Art. 6.1.b (Contract Law)",
        leg_ref_azlp: "AZLP North Macedonia",
        leg_ref_azlp_sub: "Personal Data Protection Agency (azlp.mk)",
        modal_legal_notice: "🔒 Cryptographic HMAC Token · Compliant with Art. 12 ZZPL & EU GDPR Art. 6",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms & Conditions",
        leg_action_privacy: "Privacy Policy (ZZPL & GDPR)",
        leg_action_terms: "SaaS Platform Terms & Conditions",
        dev_code_comment: "// 1. Intercept order inside functions.php or custom plugin",
        dev_status_note: "Potvrdio: Awaiting buyer Viber confirmation",
        dev_hpos_note: "Battle-tested on WooCommerce 7.0 through 9.x with High-Performance Order Storage (HPOS) enabled.",
        footer_sub: "— Regional Infrastructure for WooCommerce Cash on Delivery (COD)",
        footer_location: "Belgrade / Novi Sad / Skopje",
        top_gateway: "Viber Gateway: ACTIVE",
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
        hero_btn_activate: "Activate 25 Free Credits",
        scen2_ignored_notice: "Customer ignored for 24h. Order cancelled before packing.",
        calc_orders_unit: "orders",
        modal_alert_tip: "⚡ Fill floor and apartment so the courier can find your entrance without delay.",
        faq_tag: "06 / Frequently Asked Questions",
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
    <div className="min-h-[100dvh] flex flex-col saas-bg bg-[#0B0F19] light:bg-[#F8FAFC] text-slate-300 light:text-slate-700 font-['Inter',sans-serif] selection:bg-[#14B8A6] selection:text-white transition-colors duration-200">
      
      {/* Top Network & Legal Bar */}
      <aside className="border-b border-white/10 light:border-slate-200/80 bg-[#0B0F19]/90 light:bg-white/80 px-3 sm:px-4 py-1.5 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-sans">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 light:text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-medium text-white light:text-slate-900">{t('top_gateway')}</span>
            </span>
            <span className="text-white/10 light:text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-400 light:text-slate-600">{t('top_networks')}</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <a href="#integracija" className="text-slate-400 light:text-slate-600 hover:text-[#14B8A6] transition-colors hidden md:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600 shrink-0" />
              <span>{t('top_protocol')}</span>
            </a>
            <span className="text-white/10 light:text-slate-300 hidden md:inline">|</span>
            <span className="text-amber-400 light:text-amber-600 font-medium">{t('top_avg_penalty')}</span>
          </div>
        </div>
      </aside>

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 light:border-slate-200/80 bg-[#0B0F19]/90 light:bg-white/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <PotvrdioLogo variant="horizontal" mode={theme} />
            <div className="hidden sm:block pl-2 border-l border-white/10 light:border-slate-200 text-[10px] font-sans text-slate-400 light:text-slate-500">
              {t('nav_sub')}
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 light:text-slate-600 font-medium">
            <a href="#lab" className="hover:text-white light:hover:text-slate-900 transition-colors">{t('nav_lab')}</a>
            <a href="#manifest" className="hover:text-white light:hover:text-slate-900 transition-colors">{t('nav_manifest')}</a>
            <a href="#kalkulator" className="hover:text-white light:hover:text-slate-900 transition-colors">{t('nav_calc')}</a>
            <a href="#cenovnik" className="hover:text-white light:hover:text-slate-900 transition-colors">{t('nav_pricing')}</a>
            <a href="#integracija" className="hover:text-white light:hover:text-slate-900 transition-colors">{t('nav_dev')}</a>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[#131C2E] light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 transition-all cursor-pointer flex items-center justify-center min-h-[34px] min-w-[34px]"
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
            <div className="flex items-center bg-[#131C2E] light:bg-slate-100 border border-white/10 light:border-slate-200 rounded-lg p-0.5 text-xs font-sans">
              <button 
                onClick={() => { playClickSound(); setLang('sr'); }} 
                className={`px-1.5 sm:px-2 py-0.5 rounded font-bold transition-all text-[11px] sm:text-xs ${lang === 'sr' ? 'bg-[#14B8A6] text-black' : 'text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'}`}
              >
                SR
              </button>
              <button 
                onClick={() => { playClickSound(); setLang('mk'); }} 
                className={`px-1.5 sm:px-2 py-0.5 rounded font-bold transition-all text-[11px] sm:text-xs ${lang === 'mk' ? 'bg-[#14B8A6] text-black' : 'text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'}`}
              >
                MK
              </button>
              <button 
                onClick={() => { playClickSound(); setLang('en'); }} 
                className={`px-1.5 sm:px-2 py-0.5 rounded font-bold transition-all text-[11px] sm:text-xs ${lang === 'en' ? 'bg-[#14B8A6] text-black' : 'text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'}`}
              >
                EN
              </button>
            </div>

            <button 
              onClick={() => { playClickSound(); setShowOnboardingModal(true); }}
              className="hidden sm:inline-flex btn-brand-cta text-white font-bold text-xs px-3 sm:px-3.5 py-2 rounded transition-all items-center gap-1.5 shadow-sm min-h-[36px] cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>{lang === 'sr' ? 'Registracija (25 Kredita)' : lang === 'mk' ? 'Регистрација (25 Кредити)' : 'Register Store (25 Free)'}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => { playClickSound(); setMobileMenuOpen(!mobileMenuOpen); }}
              className="md:hidden p-2 rounded-lg bg-[#0D121F] border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#14B8A6]" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#070A13]/98 backdrop-blur-xl px-4 py-4 space-y-3 font-mono text-xs animate-in slide-in-from-top-2 duration-200">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">
              {lang === 'sr' ? 'Navigacija' : lang === 'mk' ? 'Навигација' : 'Navigation'}
            </div>
            <a 
              href="#lab" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2.5 text-slate-200 hover:text-[#14B8A6] transition-colors border-b border-white/5 flex items-center justify-between"
            >
              <span>01. {t('nav_lab')}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </a>
            <a 
              href="#manifest" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2.5 text-slate-200 hover:text-[#14B8A6] transition-colors border-b border-white/5 flex items-center justify-between"
            >
              <span>02. {t('nav_manifest')}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </a>
            <a 
              href="#kalkulator" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2.5 text-slate-200 hover:text-[#14B8A6] transition-colors border-b border-white/5 flex items-center justify-between"
            >
              <span>03. {t('nav_calc')}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </a>
            <a 
              href="#cenovnik" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2.5 text-slate-200 hover:text-[#14B8A6] transition-colors border-b border-white/5 flex items-center justify-between"
            >
              <span>04. {t('nav_pricing')}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </a>
            <a 
              href="#integracija" 
              onClick={() => setMobileMenuOpen(false)} 
              className="py-2.5 text-slate-200 hover:text-[#14B8A6] transition-colors border-b border-white/5 flex items-center justify-between"
            >
              <span>05. {t('nav_dev')}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
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
      <section className="border-b border-white/10 bg-gradient-to-b from-[#111827] to-[#0B0F19] pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
              <div className="inline-flex items-center gap-2 border border-slate-700/60 bg-slate-800/60 px-3 py-1 rounded-full text-xs text-slate-300 w-fit max-w-full flex-wrap">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse shrink-0"></span>
                <span className="text-white font-semibold">{t('hero_tag')}</span>
                <span className="text-white/20">•</span>
                <span className="text-emerald-400 font-medium">{t('hero_no_sub')}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-[1.2]">
                {t('hero_title')}
              </h1>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-2xl">
                {t('hero_p')}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a 
                  href="#lab" 
                  onClick={playClickSound}
                  className="btn-brand-cta text-white font-bold text-xs px-5 py-3.5 sm:py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span>{t('hero_cta_primary')}</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </a>
                <button 
                  onClick={() => { playClickSound(); setShowOnboardingModal(true); }}
                  className="px-5 py-3.5 sm:py-3 bg-[#131C2E] hover:bg-slate-800 text-white border border-[#14B8A6]/40 hover:border-[#14B8A6] text-xs rounded-lg font-bold transition inline-flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Rocket className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>{lang === 'sr' ? 'Aktiviraj 25 Besplatnih Verifikacija' : lang === 'mk' ? 'Активирај 25 Бесплатни Верификации' : 'Activate 25 Free Credits'}</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-5 sm:pt-6 border-t border-white/10 mt-2 sm:mt-3 font-sans">
                <div className="glass-panel p-2.5 sm:p-3 rounded-lg">
                  <div className="text-[10px] sm:text-xs text-slate-400 mb-0.5 sm:mb-1 font-medium">{t('stat_open_rate')}</div>
                  <div className="text-base sm:text-2xl font-bold text-white tracking-tight">89.6%</div>
                  <div className="text-[9px] sm:text-[10px] text-emerald-400 mt-0.5 truncate font-medium">{t('stat_open_sub')}</div>
                </div>
                <div className="glass-panel p-2.5 sm:p-3 rounded-lg">
                  <div className="text-[10px] sm:text-xs text-slate-400 mb-0.5 sm:mb-1 font-medium">{t('stat_hold_cost')}</div>
                  <div className="text-base sm:text-2xl font-bold text-amber-400 tracking-tight">{t('stat_hold_val')}</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate font-medium">{t('stat_hold_sub')}</div>
                </div>
                <div className="glass-panel p-2.5 sm:p-3 rounded-lg">
                  <div className="text-[10px] sm:text-xs text-slate-400 mb-0.5 sm:mb-1 font-medium">{t('stat_recovery')}</div>
                  <div className="text-base sm:text-2xl font-bold text-emerald-400 tracking-tight">-83%</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate font-medium">{t('stat_recovery_sub')}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Status Dashboard */}
            <div className="lg:col-span-5 glass-panel rounded-xl p-4 sm:p-5 shadow-2xl relative border border-slate-800">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]"></span>
                  <span className="text-xs font-semibold text-white tracking-wide">WooCommerce Integration</span>
                </div>
                <div className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">HPOS Ready</div>
              </div>

              {/* Order Card */}
              <div className="bg-[#0B0F19] p-3 sm:p-3.5 rounded-lg border border-slate-800 mb-4 text-xs space-y-2">
                <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-white/10 pb-2">
                  <span>{t('order_word')} #RS-8492</span>
                  <span>17. Sep 2026, 09:14</span>
                </div>
                <div className="flex justify-between items-center text-white pt-1">
                  <span className="font-bold font-sans text-sm">{t('dash_customer_name')}</span>
                  <span className="text-[#14B8A6] font-bold">{t('dash_order_amount')}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                  <span>{t('dash_address')}</span>
                </div>
                <div className="flex items-center justify-between pt-2 text-[11px]">
                  <span className="text-slate-400">{t('dash_courier')}</span>
                  <span className="text-white font-medium">{t('dash_courier_val')}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{t('dash_risk_label')}</span>
                  <span className="text-red-400">{t('dash_risk_val')}</span>
                </div>
              </div>

              {/* Logistics State */}
              <div className="p-3 bg-[#0D121F] rounded border border-white/10 font-mono text-[11px] space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('dash_order_status_label')}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    HOLD_WAITING_VIBER
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('dash_label_print_label')}</span>
                  <span className="text-red-400 font-semibold">{t('dash_label_blocked')}</span>
                </div>
              </div>

              {/* Note */}
              <div className="text-[11px] text-slate-400 font-mono leading-relaxed border-t border-white/10 pt-3 flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                <span>{t('hero_box_note')}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 01: Interactive Lab Simulator */}
      <section id="lab" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('lab_tag')}</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('lab_title')}</h2>
          </div>
          <div className="text-xs text-slate-400 font-sans">
            {t('lab_subtitle')}
          </div>
        </div>

        {/* Scenario Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 sm:mb-8">
          <button 
            onClick={() => handleScenarioChange(1)} 
            className={`text-left p-3.5 sm:p-4 rounded-xl glass-panel text-xs transition-all shadow-sm cursor-pointer ${currentScenario === 1 ? 'border border-[#14B8A6] ring-1 ring-[#14B8A6]/30' : 'border border-white/10 hover:border-white/20'}`}
          >
            <div className="flex items-center justify-between mb-1.5 font-sans">
              <span className={`font-bold text-xs uppercase tracking-wider ${currentScenario === 1 ? 'text-[#14B8A6]' : 'text-slate-400'}`}>Scenario A</span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{t('scen_common_tag')}</span>
            </div>
            <div className="font-bold text-white text-sm mb-1">{t('scen1_title')}</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">{t('scen1_desc')}</div>
          </button>

          <button 
            onClick={() => handleScenarioChange(2)} 
            className={`text-left p-3.5 sm:p-4 rounded-xl glass-panel text-xs transition-all shadow-sm cursor-pointer ${currentScenario === 2 ? 'border border-[#14B8A6] ring-1 ring-[#14B8A6]/30' : 'border border-white/10 hover:border-white/20'}`}
          >
            <div className="flex items-center justify-between mb-1.5 font-sans">
              <span className={`font-bold text-xs uppercase tracking-wider ${currentScenario === 2 ? 'text-[#14B8A6]' : 'text-slate-400'}`}>Scenario B</span>
              <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">{t('scen_saved_tag')}</span>
            </div>
            <div className="font-bold text-white text-sm mb-1">{t('scen2_title')}</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">{t('scen2_desc')}</div>
          </button>

          <button 
            onClick={() => handleScenarioChange(3)} 
            className={`text-left p-3.5 sm:p-4 rounded-xl glass-panel text-xs transition-all shadow-sm cursor-pointer ${currentScenario === 3 ? 'border border-[#14B8A6] ring-1 ring-[#14B8A6]/30' : 'border border-white/10 hover:border-white/20'}`}
          >
            <div className="flex items-center justify-between mb-1.5 font-sans">
              <span className={`font-bold text-xs uppercase tracking-wider ${currentScenario === 3 ? 'text-[#14B8A6]' : 'text-slate-400'}`}>Scenario C</span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{t('scen_fast_tag')}</span>
            </div>
            <div className="font-bold text-white text-sm mb-1">{t('scen3_title')}</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">{t('scen3_desc')}</div>
          </button>
        </div>

        {/* Simulator Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start glass-panel p-4 sm:p-6 rounded-lg">
          
          {/* Viber Phone Mockup Left */}
          <div className="lg:col-span-5 bg-[#1E1838] border border-[#46377B] rounded-xl p-3.5 sm:p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#46377B] pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#7360F2] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  VB
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                    <span>Potvrdio · {t('viber_verified_title')}</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded font-mono">{t('viber_verified_badge')}</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#A798CE]">Viber Business Gateway #782</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#8B79B2] shrink-0">13:42</span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#E6DDFA]">
              {/* Scenario 1 Warning Banner */}
              {currentScenario === 1 && simState === 'initial' && (
                <div className="p-2.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[11px] font-mono flex items-start gap-2 shadow-sm animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{t('scen1_warning')}</span>
                </div>
              )}

              {/* Scenario 2 Warning Banner */}
              {currentScenario === 2 && (
                <div className="p-2.5 rounded bg-red-500/20 border border-red-400/40 text-red-200 text-[11px] font-mono flex items-start gap-2 shadow-sm">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{t('scen2_warning')}</span>
                </div>
              )}

              <div className="bg-[#29204A] p-3 sm:p-3.5 rounded-lg border border-[#46377B]">
                <p className="mb-2">
                  {t('viber_greeting')} <strong>{currentScenConfig.customer.split(' ')[0]}</strong>! {t('viber_order_received')} <strong>{currentScenConfig.orderId}</strong> ({currentScenConfig.orderAmount[lang]}).
                </p>
                <div className="p-2.5 rounded bg-[#1E1838] border border-[#46377B] font-mono text-[11px] text-[#C4B5FD] mb-3">
                  <span className="text-slate-400 block text-[10px]">{t('viber_shipping_address')}</span>
                  <span className="text-white font-medium">
                    {simState === 'edited' ? (
                      <span>
                        {currentScenConfig.address[lang]}
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-400/40 animate-pulse">
                          + {lang === 'sr' ? `Sprat ${floorInput}, Stan ${aptInput}` : lang === 'mk' ? `Кат ${floorInput}, Стан ${aptInput}` : `Floor ${floorInput}, Apt ${aptInput}`}
                        </span>
                      </span>
                    ) : currentScenConfig.address[lang]}
                  </span>
                </div>
                <p className="text-[11px] text-[#DDD6FE]">
                  {t('viber_confirm_prompt')}
                </p>
              </div>

              {currentScenario === 2 ? (
                <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono text-center flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{t('status_saved')}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-sans">
                    {lang === 'sr' ? 'Kupac nije odgovorio 24h. Porudžbina stornirana pre pakovanja.' : lang === 'mk' ? 'Купувачот не одговори 24ч. Нарачката е откажана пред пакување.' : 'Customer ignored for 24h. Order cancelled before packing.'}
                  </p>
                </div>
              ) : simState === 'initial' ? (
                <div className="space-y-2 pt-1">
                  <button 
                    onClick={() => handleSimAction('confirm')} 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded text-xs transition active:scale-[0.99] flex items-center justify-center gap-2 shadow-md cursor-pointer min-h-[44px]"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t('viber_btn_yes')}</span>
                  </button>
                  <button 
                    onClick={() => handleSimAction('edit')} 
                    className="w-full bg-[#191A2B] hover:bg-[#252840] text-slate-200 py-2.5 rounded text-xs transition border border-white/10 flex items-center justify-center gap-2 cursor-pointer min-h-[42px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>{t('viber_btn_edit')}</span>
                  </button>
                </div>
              ) : simState === 'edited' ? (
                <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono text-center flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{t('viber_success_edited')}</span>
                </div>
              ) : (
                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono text-center flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('viber_success_confirmed')}</span>
                </div>
              )}
            </div>
          </div>

          {/* WP Event Terminal Right */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4 font-mono text-xs">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  <span className="text-white font-bold">{t('term_title')}</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400">HMAC-SHA256 SIGNED</span>
              </div>

              <div className="mt-3 bg-[#070A13] p-3 sm:p-3.5 rounded border border-white/10 space-y-1.5 h-56 sm:h-64 overflow-y-auto touch-scroll text-[10px] sm:text-[11px]">
                <div className="text-neutral-400">[13:42:01] WC Order Created: {currentScenConfig.orderId} {t('term_log_cod')}.</div>
                <div className="text-amber-400">[13:42:01] Potvrdio Hook: Order status switched to ON-HOLD. Label printing suspended.</div>
                
                {currentScenario === 1 && (
                  <>
                    <div className="text-neutral-300">[13:42:02] Viber Gateway: Transaction #VB-9201 dispatched (+381642918472). Status: DELIVERED.</div>
                    {simState === 'confirmed' && (
                      <>
                        <div className="text-emerald-400 font-bold">[13:42:08] Viber Action: [DIRECT_CONFIRM] Customer approved address as-is without edits.</div>
                        <div className="text-slate-200">[13:42:09] WooCommerce Hook: Order status changed -&gt; PROCESSING. Dispatch label ready.</div>
                      </>
                    )}
                    {simState === 'edited' && (
                      <>
                        <div className="text-blue-400 font-bold">[13:42:12] Token Link Opened: Customer filled missing floor &amp; apartment form.</div>
                        <div className="text-blue-300">[13:42:15] WooCommerce Metadata: Overwritten with '+ {lang === 'sr' ? `Sprat ${floorInput}, Stan ${aptInput}` : lang === 'mk' ? `Кат ${floorInput}, Стан ${aptInput}` : `Floor ${floorInput}, Apt ${aptInput}`}'.</div>
                        <div className="text-emerald-300 font-semibold">[13:42:16] Order unblocked -&gt; PROCESSING. Clean manifest label generated.</div>
                      </>
                    )}
                  </>
                )}

                {currentScenario === 2 && (
                  <>
                    <div className="text-amber-400">[13:42:02] Viber sent. No read receipt within 20 minutes.</div>
                    <div className="text-amber-500">[13:42:22] {t('term_sms_log')}</div>
                    <div className="text-red-400">[14:02:00] 24h Expired: No customer action. Order safely CANCELLED.</div>
                    <div className="text-emerald-400">{t('term_saved_log')}</div>
                  </>
                )}

                {currentScenario === 3 && (
                  <>
                    <div className="text-neutral-300">[13:42:02] Viber sent. Customer active.</div>
                    {simState === 'confirmed' && (
                      <>
                        <div className="text-emerald-400 font-bold">[13:42:08] Viber Action: [CONFIRM_TAP_EVENT] received.</div>
                        <div className="text-slate-200">[13:42:09] Webhook: POST /wc-api/potvrdio_verify (200 OK).</div>
                        <div className="text-emerald-300 font-semibold">[13:42:09] WooCommerce order status changed to PROCESSING.</div>
                        <div className="text-white">[13:42:10] Barcode generated: PE-7892014-RS.</div>
                      </>
                    )}
                  </>
                )}

                {simState === 'initial' && currentScenario !== 2 && (
                  <div className="text-slate-400">{t('term_waiting_log')}</div>
                )}
              </div>
            </div>

            {/* Warehouse Decision Footer */}
            <div className="p-3 sm:p-3.5 bg-[#0D121F] rounded border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">{t('term_risk_status')}</div>
                <div className="font-bold text-xs mt-0.5">
                  {currentScenario === 2 ? (
                    <span className="text-emerald-400">{t('status_saved')}</span>
                  ) : simState !== 'initial' ? (
                    <span className="text-emerald-400">{t('status_approved')}</span>
                  ) : (
                    <span className="text-amber-400">{t('status_waiting')}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={handleResetSim} 
                className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded bg-[#070A13] hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('btn_restart_sim')}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 02: Physical Manifest Label Inspector */}
      <section id="manifest" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-white/10">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('man_tag')}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('man_title')}</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">{t('man_p')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Unverified Bad Label */}
          <div className="glass-panel border-red-500/30 p-4 sm:p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-semibold bg-red-500/10 text-red-400 px-2.5 py-0.5 rounded-full border border-red-500/20">
              {t('man_badge_bad')}
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-4 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
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

            <div className="mt-4 text-xs text-red-400 font-sans leading-relaxed">
              {t('man_bad_footer')}
            </div>
          </div>

          {/* Verified Good Label */}
          <div className="glass-panel border-emerald-500/30 p-4 sm:p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {t('man_badge_good')}
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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

            <div className="mt-4 text-xs text-emerald-400 font-sans leading-relaxed">
              {t('man_good_footer')}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: Return Freight Loss ROI Calculator */}
      <section id="kalkulator" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-white/10">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('calc_tag')}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('calc_title')}</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">{t('calc_desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center glass-panel p-4 sm:p-8 rounded-xl">
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            <div>
              <div className="flex justify-between items-center text-xs font-sans mb-2">
                <span className="text-white font-semibold">{t('calc_label_orders')}</span>
                <span className="text-[#14B8A6] font-bold text-sm bg-[#0B0F19] px-3 py-1 rounded-md border border-slate-800">
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
                className="w-full h-3 bg-[#0B0F19] rounded-lg appearance-none cursor-pointer border border-slate-800"
              />
              <div className="flex justify-between text-[10px] sm:text-[11px] font-sans text-slate-400 mt-1.5 flex-wrap gap-1">
                <span>50 ({lang === 'sr' ? 'Mala radnja' : lang === 'mk' ? 'Мала продавница' : 'Small Store'})</span>
                <span>750 ({lang === 'sr' ? 'Rastući brend' : lang === 'mk' ? 'Растечки бренд' : 'Growing Brand'})</span>
                <span>2.500+ ({lang === 'sr' ? 'Veliki shop' : lang === 'mk' ? 'Голема продавница' : 'Enterprise Store'})</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-sans mb-2">
                <span className="text-white font-semibold">{t('calc_label_rate')}</span>
                <span className="text-red-400 font-bold text-sm bg-[#0B0F19] px-3 py-1 rounded-md border border-slate-800">
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
                className="w-full h-3 bg-[#0B0F19] rounded-lg appearance-none cursor-pointer border border-slate-800"
              />
              <div className="flex justify-between text-[10px] sm:text-[11px] font-sans text-slate-400 mt-1.5 flex-wrap gap-1">
                <span>{t('calc_rate_ideal')}</span>
                <span>{t('calc_rate_avg')}</span>
                <span>{t('calc_rate_high')}</span>
              </div>
            </div>

            <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 text-xs font-sans flex flex-wrap justify-between items-center gap-2 text-slate-400">
              <span>{t('calc_freight_note')}</span>
              <span className="text-white font-bold">{t('calc_freight_val')}</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#131C2E] border border-slate-800 p-5 sm:p-6 rounded-xl text-center space-y-5">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {t('calc_loss_head')}
              </div>
              <div className="text-2xl sm:text-3xl font-sans font-bold text-red-400 mt-1 tracking-tight">
                {annualLossRsd.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} RSD
              </div>
              <div className="text-xs text-slate-400 font-sans mt-0.5">
                (~{annualLossEur.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} € {lang === 'sr' ? '/ godišnje' : lang === 'mk' ? '/ годишно' : '/ year'})
              </div>
            </div>

            <div className="pt-5 border-t border-white/10">
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                {t('calc_saved_head')}
              </div>
              <div className="text-xl sm:text-2xl font-sans font-bold text-emerald-400 mt-1">
                {annualSavedRsd.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} RSD
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-1">
                {t('calc_roi_note')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: Credit Pool PAYG Pricing */}
      <section id="cenovnik" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-white/10">
        <div className="mb-8 sm:mb-12">
          <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('price_tag')}</div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('price_title')}</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">{t('price_desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-8 glass-panel rounded-xl overflow-hidden border border-slate-800">
            <div className="px-4 sm:px-5 py-3.5 border-b border-white/10 bg-[#131C2E] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-sans">
              <span className="font-bold text-white">{t('price_prepaid_header')}</span>
              <span className="text-slate-400 text-[11px]">{t('price_invoice_sub')}</span>
            </div>

            <div className="overflow-x-auto touch-scroll">
              <table className="w-full text-left text-xs font-sans min-w-[500px]">
                <thead className="bg-[#0B0F19] text-slate-400 border-b border-white/10 text-[11px]">
                  <tr>
                    <th className="p-3.5 sm:p-4 font-semibold">{t('th_tier')}</th>
                    <th className="p-3.5 sm:p-4 font-semibold">{t('th_deposit')}</th>
                    <th className="p-3.5 sm:p-4 font-semibold">{t('th_viber_rate')}</th>
                    <th className="p-3.5 sm:p-4 font-semibold">{t('th_sms_rate')}</th>
                    <th className="p-3.5 sm:p-4 font-semibold text-right">{t('price_btn_select')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-300">
                  <tr className="hover:bg-[#131C2E]/50 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-white">Starter Pool</td>
                    <td className="p-3.5 sm:p-4 font-bold text-white">15 €</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">0.026 €</td>
                    <td className="p-3.5 sm:p-4 text-slate-400">0.048 €</td>
                    <td className="p-3.5 sm:p-4 text-right">
                      <button onClick={playClickSound} className="px-3 py-1.5 rounded-lg bg-[#131C2E] hover:bg-slate-700 border border-white/10 text-white text-[11px] font-semibold transition cursor-pointer min-h-[32px]">
                        {t('price_btn_select')}
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-[#14B8A6]/5 hover:bg-[#14B8A6]/10 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-white flex items-center gap-2">
                      Growth Pool
                      <span className="text-[9px] font-semibold bg-[#14B8A6]/20 text-[#14B8A6] px-2 py-0.5 rounded-full border border-[#14B8A6]/30">{t('price_badge_popular')}</span>
                    </td>
                    <td className="p-3.5 sm:p-4 font-bold text-white">45 €</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">0.024 €</td>
                    <td className="p-3.5 sm:p-4 text-slate-400">0.042 €</td>
                    <td className="p-3.5 sm:p-4 text-right">
                      <button onClick={playClickSound} className="px-3 py-1.5 rounded-lg bg-[#14B8A6] hover:bg-[#0F766E] text-black font-bold text-[11px] transition cursor-pointer min-h-[32px]">
                        {t('price_btn_select')}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#131C2E]/50 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-white">Scale Volume</td>
                    <td className="p-3.5 sm:p-4 font-bold text-white">120 €</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">0.020 €</td>
                    <td className="p-3.5 sm:p-4 text-slate-400">0.038 €</td>
                    <td className="p-3.5 sm:p-4 text-right">
                      <button onClick={playClickSound} className="px-3 py-1.5 rounded-lg bg-[#131C2E] hover:bg-slate-700 border border-white/10 text-white text-[11px] font-semibold transition cursor-pointer min-h-[32px]">
                        {t('price_btn_select')}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3.5 sm:p-4 bg-[#0B0F19] border-t border-white/10 text-[11px] text-slate-400 font-sans flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
              <span>{t('price_note')}</span>
            </div>
          </div>

          {/* Pro Reserve */}
          <div className="lg:col-span-4 glass-panel rounded-xl p-5 sm:p-6 font-sans text-xs border border-slate-800">
            <div className="text-[10px] text-[#14B8A6] uppercase tracking-wider mb-2 font-semibold">{t('pro_tag')}</div>
            <h3 className="text-base font-bold text-white font-sans">{t('price_pro_title')}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white font-sans">29 €</span>
              <span className="text-slate-400 text-xs">{t('price_per_month')}</span>
            </div>
            <p className="text-slate-400 text-[11px] mt-2 leading-relaxed">
              {t('price_pro_desc')}
            </p>

            <ul className="space-y-2.5 my-5 text-slate-300 text-[11px]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t('price_pro_feat1')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t('price_pro_feat2')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
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
      <section id="integracija" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('leg_tag')}</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('leg_title')}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{t('leg_p')}</p>

            <div className="space-y-3 font-sans text-xs pt-2">
              <div className="p-3.5 rounded-xl glass-panel border border-white/10">
                <div className="text-white font-bold mb-1 flex items-center justify-between">
                  <span>{t('leg_item1_title')}</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">Pravni Osnov</span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  {t('leg_item1_desc')}
                </div>
              </div>

              <div className="p-3.5 rounded-xl glass-panel border border-white/10">
                <div className="text-white font-bold mb-1 flex items-center justify-between">
                  <span>{t('leg_item2_title')}</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-sans">Retention 30D</span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  {t('leg_item2_desc')}
                </div>
              </div>

              <div className="p-3.5 rounded-xl glass-panel border border-white/10">
                <div className="text-white font-bold mb-1 flex items-center justify-between">
                  <span>{t('leg_item3_title')}</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-sans">TLS 1.3 HMAC</span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  {t('leg_item3_desc')}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider mb-1">{t('dev_tag')}</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t('dev_title')}</h2>
            
            <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-3.5 sm:p-4 font-mono text-xs text-slate-300 overflow-x-auto touch-scroll">
              <div className="text-slate-400 text-[11px] mb-2 font-sans">{t('dev_code_comment')}</div>
              <div className="text-[#14B8A6]">add_action('woocommerce_checkout_order_processed', function($order_id) &#123;</div>
              <div className="pl-4 text-slate-400">$order = wc_get_order($order_id);</div>
              <div className="pl-4 text-slate-400">if ($order-&gt;get_payment_method() === 'cod') &#123;</div>
              <div className="pl-8 text-emerald-400">$order-&gt;update_status('on-hold', '{t('dev_status_note')}');</div>
              <div className="pl-8 text-slate-300">Potvrdio_Client::dispatch_viber_session($order);</div>
              <div className="pl-4 text-slate-400">&#125;</div>
              <div className="text-[#14B8A6]">&#125;);</div>
            </div>

            <div className="text-[11px] font-sans text-slate-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t('dev_hpos_note')}</span>
            </div>
          </div>
        </div>

        {/* Official Legal Evidence & Regulatory Links Grid */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-4 h-4 text-[#14B8A6]" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase font-sans tracking-wider">
              {t('leg_proof_title')}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Link 1: Pravno-informacioni sistem RS */}
            <a 
              href="https://www.pravno-informacioni-sistem.rs/SlGlasnikPortal/eli/rep/sgrs/skupstina/zakon/2018/87/1/reg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl glass-panel border border-white/10 hover:border-[#14B8A6]/60 transition group flex flex-col justify-between cursor-pointer min-h-[105px]"
            >
              <div>
                <div className="flex items-center justify-between text-slate-200 font-bold text-xs group-hover:text-[#14B8A6] transition">
                  <span className="line-clamp-1">{t('leg_ref_pis')}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#14B8A6] shrink-0 ml-1" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-sans">{t('leg_ref_pis_sub')}</p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-400 font-sans flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Sl. Glasnik RS 87/2018</span>
              </div>
            </a>

            {/* Link 2: Poverenik RS */}
            <a 
              href={lang === 'en' ? 'https://www.poverenik.rs/en/' : 'https://www.poverenik.rs/sr-lat/'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl glass-panel border border-white/10 hover:border-[#14B8A6]/60 transition group flex flex-col justify-between cursor-pointer min-h-[105px]"
            >
              <div>
                <div className="flex items-center justify-between text-slate-200 font-bold text-xs group-hover:text-[#14B8A6] transition">
                  <span className="line-clamp-1">{t('leg_ref_poverenik')}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#14B8A6] shrink-0 ml-1" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-sans">{t('leg_ref_poverenik_sub')}</p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-400 font-sans flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span>poverenik.rs</span>
              </div>
            </a>

            {/* Link 3: EUR-Lex EU GDPR */}
            <a 
              href={lang === 'sr' ? 'https://eur-lex.europa.eu/legal-content/HR/TXT/?uri=CELEX:32016R0679' : 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl glass-panel border border-white/10 hover:border-[#14B8A6]/60 transition group flex flex-col justify-between cursor-pointer min-h-[105px]"
            >
              <div>
                <div className="flex items-center justify-between text-slate-200 font-bold text-xs group-hover:text-[#14B8A6] transition">
                  <span className="line-clamp-1">{t('leg_ref_gdpr')}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#14B8A6] shrink-0 ml-1" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-sans">{t('leg_ref_gdpr_sub')}</p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-400 font-sans flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>CELEX 32016R0679</span>
              </div>
            </a>

            {/* Link 4: AZLP MK */}
            <a 
              href={lang === 'en' ? 'https://azlp.mk/en' : 'https://azlp.mk'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl glass-panel border border-white/10 hover:border-[#14B8A6]/60 transition group flex flex-col justify-between cursor-pointer min-h-[105px]"
            >
              <div>
                <div className="flex items-center justify-between text-slate-200 font-bold text-xs group-hover:text-[#14B8A6] transition">
                  <span className="line-clamp-1">{t('leg_ref_azlp')}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#14B8A6] shrink-0 ml-1" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-sans">{t('leg_ref_azlp_sub')}</p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-400 font-sans flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span>azlp.mk</span>
              </div>
            </a>
          </div>
        </div>

        {/* Full Legal Documents Action Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4 font-sans text-xs">
          <button 
            onClick={() => { playClickSound(); setShowPrivacyModal(true); }} 
            className="px-4 py-2.5 rounded-lg glass-panel border border-[#14B8A6]/40 hover:border-[#14B8A6] text-white hover:text-teal-300 font-bold transition flex items-center gap-2 cursor-pointer min-h-[42px]"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('leg_action_privacy')}</span>
          </button>

          <button 
            onClick={() => { playClickSound(); setShowTermsModal(true); }} 
            className="px-4 py-2.5 rounded glass-panel border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition flex items-center gap-2 cursor-pointer min-h-[42px]"
          >
            <FileText className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{t('leg_action_terms')}</span>
          </button>
        </div>
      </section>

      {/* SECTION 05.5: Frequently Asked Questions (FAQ & AI GEO Indexing) */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-20 border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <div className="text-xs font-mono text-[#14B8A6] uppercase tracking-wider">
              {lang === 'sr' ? '06 / Često Postavljana Pitanja' : lang === 'mk' ? '06 / Често Поставувани Прашања' : '06 / Frequently Asked Questions'}
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              {lang === 'sr' ? 'Sve što treba da znate o Potvrdio COD verifikaciji' : lang === 'mk' ? 'Сè што треба да знаете за Potvrdio COD верификацијата' : 'Everything you need to know about Potvrdio COD verification'}
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              {lang === 'sr' ? 'Odgovori na ključna tehnička, pravna i operativna pitanja trgovaca.' : lang === 'mk' ? 'Одговори на клучните технички и правни прашања.' : 'Answers to key technical, legal, and operational questions.'}
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
                  className="rounded-lg glass-panel border border-white/10 overflow-hidden transition-all duration-150"
                >
                  <button
                    onClick={() => {
                      playClickSound();
                      setOpenFaqIndex(isOpen ? null : idx);
                    }}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 text-white font-bold text-xs sm:text-sm cursor-pointer hover:bg-white/5 transition"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#14B8A6] shrink-0" />
                      <span>{faq.q[lang]}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#14B8A6]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-1 text-slate-300 text-xs leading-relaxed border-t border-white/5 bg-[#070A13]/40 font-mono">
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
        <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-12 rounded-xl">
          <div className="w-12 h-12 rounded bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[#14B8A6] flex items-center justify-center mx-auto mb-4">
            <Download className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">{t('dl_title')}</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-md mx-auto">{t('dl_desc')}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button 
              onClick={() => { playScannerBeep(); setShowOnboardingModal(true); }}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-3 btn-brand-cta text-white font-bold text-xs rounded transition shadow-lg cursor-pointer min-h-[44px]"
            >
              {t('btn_dl_full')}
            </button>
            <a 
              href="#lab" 
              className="w-full sm:w-auto px-5 py-3.5 sm:py-3 bg-[#0D121F] hover:bg-white/10 text-white border border-white/10 text-xs rounded font-mono transition inline-flex items-center justify-center min-h-[44px]"
            >
              {t('btn_view_demo')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070A13] py-8 text-xs text-slate-400 font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <PotvrdioLogo variant="horizontal" mode="dark" />
            <span className="text-white/20 hidden sm:inline">•</span>
            <span>{t('footer_sub')}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-400">
            <button 
              onClick={() => { playClickSound(); setShowPrivacyModal(true); }} 
              className="hover:text-[#14B8A6] transition cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t('footer_privacy')}</span>
            </button>
            <span className="text-white/20 hidden sm:inline">•</span>
            <button 
              onClick={() => { playClickSound(); setShowTermsModal(true); }} 
              className="hover:text-[#14B8A6] transition cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{t('footer_terms')}</span>
            </button>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span>{t('footer_location')}</span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <a href="mailto:info@potvrdio.online" className="hover:text-white transition">info@potvrdio.online</a>
          </div>
        </div>
      </footer>

      {/* Address Edit Token Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0D121F] border border-[#14B8A6]/50 rounded-xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            
            {/* Browser Header / URL bar */}
            <div className="bg-[#070A13] px-3.5 sm:px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <div className="flex items-center gap-2 text-[#14B8A6] font-mono truncate mr-2">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-slate-200 truncate">potvrdio.online/edit-address?token=vbr_9842</span>
              </div>
              <button 
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-white transition p-1 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto touch-scroll">
              <div>
                <div className="text-[10px] text-[#14B8A6] uppercase font-bold tracking-wider mb-0.5">
                  {t('modal_badge')}
                </div>
                <h3 className="text-base font-bold text-white font-sans">{t('modal_title')}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{t('modal_subtitle')}</p>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-amber-300 text-[11px] flex items-start gap-2 font-sans">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'sr' ? '⚡ Popunite sprat i stan kako bi kurir bez zastoja pronašao vaš ulaz.' : lang === 'mk' ? '⚡ Пополнете кат и стан за курирот без застој да го најде вашиот влез.' : '⚡ Fill floor and apartment so the courier can find your entrance without delay.'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{t('modal_street')}</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={currentScenConfig.address[lang]}
                    className="w-full bg-[#070A13] border border-white/10 rounded px-3 py-2 text-slate-400 font-mono text-xs cursor-not-allowed min-h-[40px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-200 font-bold mb-1">{t('modal_floor')}</label>
                    <input 
                      type="text" 
                      value={floorInput}
                      onChange={(e) => setFloorInput(e.target.value)}
                      className="w-full bg-[#070A13] border border-[#14B8A6] rounded px-3 py-2 text-white font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[#14B8A6] min-h-[40px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-200 font-bold mb-1">{t('modal_apt')}</label>
                    <input 
                      type="text" 
                      value={aptInput}
                      onChange={(e) => setAptInput(e.target.value)}
                      className="w-full bg-[#070A13] border border-[#14B8A6] rounded px-3 py-2 text-white font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[#14B8A6] min-h-[40px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{t('modal_intercom')}</label>
                  <input 
                    type="text" 
                    defaultValue={lang === 'sr' ? 'Radi interfon, ime na zvonu Ninković' : lang === 'mk' ? 'Работи интерфон, име на ѕвоно Ниновиќ' : 'Intercom works, ring name Ninkovic'}
                    className="w-full bg-[#070A13] border border-white/10 rounded px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-white/30 font-sans min-h-[40px]"
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveModalAddress}
                className="w-full btn-brand-cta text-white font-bold py-3 rounded-lg text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-2 min-h-[44px]"
              >
                <Check className="w-4 h-4" />
                <span>{t('modal_btn_save')}</span>
              </button>

              <div className="pt-2 text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5 text-center leading-normal">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t('modal_legal_notice')}</span>
                <button 
                  onClick={() => { playClickSound(); setShowPrivacyModal(true); }}
                  className="text-[#14B8A6] hover:underline cursor-pointer ml-1"
                >
                  [{t('footer_privacy')}]
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Legal Modals */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
        lang={lang} 
      />

      <TermsConditionsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
        lang={lang} 
      />

      {/* Onboarding & Free Credits Modal */}
      <OnboardingModal 
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        lang={lang}
        playSuccessSound={playScannerBeep}
      />
    </div>
  );
}

