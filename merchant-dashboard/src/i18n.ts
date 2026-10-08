import { getVerificationLogs, VerificationLogItem, LogTimelineEvent } from './verificationLogs';

export type { VerificationLogItem, LogTimelineEvent };
export type Language = 'sr' | 'mk' | 'en';

export interface TranslationSchema {
  langCode: string;
  storeName: string;
  storeDomain: string;
  storeSubtitle: string;
  connected: string;
  creditPool: string;
  remaining: string;
  topUpCredits: string;
  supportTitle: string;
  supportDesc: string;
  themeLightTitle: string;
  themeDarkTitle: string;
  
  // Navigation
  navOverview: string;
  navCredits: string;
  navSettings: string;
  
  // Timeframe Filter
  timeframe30d: string;
  timeframeLifetime: string;
  timeframe7d: string;

  // Overview Stats
  statConfirmedTitle: string;
  statConfirmedBadge: string;
  statConfirmedSub: string;
  
  statDeliveryTitle: string;
  statDeliverySub: string;
  
  statSavedTitle: string;
  statSavedSub: string;
  
  statViberTitle: string;
  statViberSub: string;
  
  // Logs Table
  tableTitle: string;
  tableSubtitle: string;
  tableBadge: string;
  colOrder: string;
  colCustomer: string;
  colCity: string;
  colAmount: string;
  colStatus: string;
  colTime: string;
  statusApproved: string;
  statusAddressEdited: string;
  statusSmsFallback: string;
  statusCancelled: string;
  tableExpandHint: string;
  timelineHeading: string;
  timelineSummaryTitle: string;
  timelineResponseTimeLabel: string;
  timelineChannelLabel: string;
  timelineOutcomeLabel: string;
  timelineSavingsLabel: string;
  timelineAddressCorrectionLabel: string;
  
  logs: VerificationLogItem[];

  // Credits Tab
  creditsHeading: string;
  creditsSubheading: string;
  starterTitle: string;
  starterCredits: string;
  starterDesc: string;
  starterBtn: string;
  
  growthBadge: string;
  growthTitle: string;
  growthCredits: string;
  growthDesc: string;
  growthBtn: string;
  
  proTitle: string;
  proCredits: string;
  proDesc: string;
  proBtn: string;
  
  reserveTitle: string;
  reservePerMonth: string;
  reserveCredits: string;
  reserveDesc: string;
  reserveBtn: string;
  loadingText: string;
  successTopupAlert: (count: number, cost: number) => string;

  // Credit Ledger & Usage History
  ledgerHeading: string;
  ledgerSubheading: string;
  ledgerTimeframeSinceLast: string;
  ledgerTimeframe7d: string;
  ledgerTimeframe30d: string;
  ledgerTimeframe90d: string;
  ledgerTimeframeYtd: string;
  ledgerTimeframeLifetime: string;
  ledgerStartingBalance: string;
  ledgerTopupsLabel: string;
  ledgerViberSent: string;
  ledgerSmsSent: string;
  ledgerRemainingBalance: string;
  ledgerCreditsUnit: string;
  ledgerTableColDate: string;
  ledgerTableColType: string;
  ledgerTableColDesc: string;
  ledgerTableColChange: string;
  ledgerTableColBalance: string;
  ledgerTableColReceipt: string;
  ledgerDownloadReceipt: string;
  ledgerEmpty: string;

  // Settings Tab
  settingsHeading: string;
  settingsSubheading: string;
  credentialsTitle: string;
  credentialsSub: string;
  shaSecurity: string;
  copyBtn: string;
  copiedBtn: string;
  
  labelEndpoint: string;
  labelApiKey: string;
  labelApiSecret: string;
  
  connStatusTitle: string;
  connStatusActive: string;
  connStoreLabel: string;
  connWooLabel: string;
  connPingLabel: string;
  connTestPrompt: string;
  connTestingBtn: string;
  connSuccessBtn: string;
  connDefaultBtn: string;

  guideTitle: string;
  guideSubtitle: string;
  
  // Guide step cards
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  
  saveChangesBtn: string;
  finalStepBadge: string;
  pasteHereBadge: string;
  clickToLocate: string;
  stepActiveBadge: string;
  guideInteractiveHint: string;
  mockupStaticBadge: string;
  step1Badge: string;
  step2Badge: string;
  step3Badge: string;
  startHereBadge: string;
  previewBadge: string;
  selectStepPrompt: string;
  breadcrumbMenuPath: string;

  // Store Profile & Logistics Settings
  logisticsTitle: string;
  logisticsSub: string;
  labelCourier: string;
  labelVolume: string;
  saveLogisticsBtn: string;
  logisticsSavedToast: string;
  courierPostExpress: string;
  courierBex: string;
  courierDExpress: string;
  courierCityExpress: string;
  courierCargoMk: string;
  courierOther: string;
  volUnder100: string;
  vol100to300: string;
  vol300to1000: string;
  vol1000plus: string;
  logisticsEstimateBadge: string;
  onboardingLogisticsCardTitle: string;
  onboardingLogisticsCardDesc: string;
  onboardingLogisticsBadge: string;
  onboardingLogisticsDoneBadge: string;

  // Header & Badges
  badgePilotAccount: string;
  badgeDemoAccount: string;
  yourStoresLabel: string;
  addStoreBtn: string;
  signInRealAccountBtn: string;
  logoutBtn: string;
  signInBtn: string;
  demoStoreBtn: string;
  pilotVerificationsLabel: string;
  remainingLabel: string;

  // Overview Header & Pilot Trial
  overviewMetricsSubtitle: string;
  pilotTrialBannerTitle: string;
  pilotTrialRemainingText: (remaining: number) => string;
  pilotTrialDesc: string;
  demoBannerNotice: string;
  demoBannerSignIn: string;
  demoBannerRegister: string;

  // Zero-State & Live Verification Stats
  statZeroConfirmedBadge: string;
  statZeroProcessedBadge: (count: number) => string;
  statZeroWaitingOrder: string;
  statZeroRemainingPilot: (remaining: number) => string;
  statZeroDeliveryPending: string;
  statZeroVerifiedAddresses: string;
  statZeroPotentialSavings: string;
  statZeroSavedCourier: string;
  statZeroAwaitingFirst: string;
  statZeroCustomerResponse: string;

  // Simulation & Order Table Zero State
  simulateOrderBtn: string;
  simulatingBtn: string;
  simulateOrderTitleTooltip: string;
  orderCountUnit: string;
  waitingFirstOrderTitle: string;
  waitingFirstOrderDesc: (apiKey: string, remaining: number, storeDomain: string) => string;
  simulateTestOrderBtn: string;
  wpSetupGuideBtn: string;

  // Store Connection & Onboarding
  connPendingBadge: string;
  connConnectedBadge: string;
  connectStoreTitle: string;
  connectStoreDesc: string;
  stepDownloadPluginTitle: string;
  stepDownloadPluginDesc: string;
  downloadPluginBtn: string;
  stepPasteKeysTitle: string;
  stepPasteKeysDesc: string;
  seeDetailsBtn: string;
  stepVerifyTitle: string;
  stepVerifyDesc: string;
  verifyConnectionBtn: string;
  verifyingConnectionBtn: string;
  connectionSuccessBadge: string;
  connectionFailedTitle: string;
  connectionNoSignalError: string;
  connectedAwaitingOrdersTitle: string;
  connectedAwaitingOrdersDesc: (storeDomain: string, remaining: number) => string;
  tryDemoSandboxPrompt: string;
  tryDemoSandboxBtn: string;
}

export const translations: Record<Language, TranslationSchema> = {
  sr: {
    langCode: 'sr-RS',
    storeName: 'Balkan Style Shop',
    storeDomain: 'balkanshop.rs',
    storeSubtitle: 'Sprečite COD troškove i povećajte dostavu paketa na 98%+',
    connected: 'WooCommerce Connected',
    creditPool: 'Bazen Kredita',
    remaining: 'Preostalo',
    topUpCredits: 'Dopuni Kredite',
    supportTitle: 'Korisnička Podrška',
    supportDesc: 'Pomoć oko integracije i podešavanja',
    themeLightTitle: 'Prebaci na Svetlu Temu',
    themeDarkTitle: 'Prebaci na Tamnu Temu',
    
    // Navigation
    navOverview: 'Pregled & Analitika',
    navCredits: 'Krediti & Dopuna',
    navSettings: 'Podešavanja',
    
    // Timeframe Filter
    timeframe30d: 'Poslednjih 30 dana',
    timeframeLifetime: 'Ukupno (Lifetime)',
    timeframe7d: 'Poslednjih 7 dana',

    // Overview Stats
    statConfirmedTitle: 'Potvrđene COD Porudžbine',
    statConfirmedBadge: '+18% ovog meseca',
    statConfirmedSub: 'Uspešno verifikovano putem Viber-a',
    
    statDeliveryTitle: 'Stopa Uspešne Dostave',
    statDeliverySub: 'Pre Potvrdio: 74% (Kargo povrati spali na 3.6%)',
    
    statSavedTitle: 'Ušteđeni Kargo Troškovi',
    statSavedSub: 'Sprečene povratne poštarine (Post Express)',
    
    statViberTitle: 'Viber Otvaranje (Open Rate)',
    statViberSub: 'Prosečno vreme potvrde: 2.4 minuta',
    
    // Logs Table
    tableTitle: 'Poslednje Verifikacije Pošiljki',
    tableSubtitle: 'Real-time praćenje Viber poruka i potvrdio.online izmena',
    tableBadge: 'Aktivno Praćenje',
    colOrder: 'Porudžbina',
    colCustomer: 'Kupac & Telefon',
    colCity: 'Grad / Mesto',
    colAmount: 'Iznos',
    colStatus: 'Status & Kanal',
    colTime: 'Vreme',
    statusApproved: 'Potvrđeno',
    statusAddressEdited: 'Izmenjena Adresa',
    statusSmsFallback: 'SMS Fallback',
    statusCancelled: 'Otkazano (Kupac)',
    tableExpandHint: 'Kliknite na red za detaljnu istoriju i hronologiju verifikacije',
    timelineHeading: 'Hronologija Verifikacije Paketa',
    timelineSummaryTitle: 'Operativni Detalji',
    timelineResponseTimeLabel: 'Brzina odziva kupca',
    timelineChannelLabel: 'Verifikacioni kanal',
    timelineOutcomeLabel: 'Status u magacinu',
    timelineSavingsLabel: 'Ušteda troškova povrata',
    timelineAddressCorrectionLabel: 'Korigovana adresa za kurira',
    
    logs: getVerificationLogs('sr'),

    // Credits Tab
    creditsHeading: 'Zajednički Bazen Viber Kredita',
    creditsSubheading: 'Bez mesečne provizije, dopunite samo onoliko kredita koliko vam je potrebno za COD verifikaciju.',
    starterTitle: 'Starter Paket',
    starterCredits: '600 Viber Kredita',
    starterDesc: '€0.025 / poruci. Idealno za manje prodavnice (do 50 porudžbina/mesec).',
    starterBtn: 'Dopuni Kredite (IPS QR)',
    
    growthBadge: 'NAJPOPULARNIJE',
    growthTitle: 'Growth Paket',
    growthCredits: '1,875 Viber Kredita',
    growthDesc: '€0.024 / poruci. Za srednje e-trgovce u Srbiji i regionu.',
    growthBtn: 'Dopuni Kredite (IPS QR)',
    
    proTitle: 'Pro Paket',
    proCredits: '6,000 Viber Kredita',
    proDesc: '€0.020 / poruci. Najniža cena poruke za visoki obim pošiljki.',
    proBtn: 'Dopuni Kredite (IPS QR)',
    
    reserveTitle: 'Pro Reserve (MRR)',
    reservePerMonth: '/mesec',
    reserveCredits: '1,800 Kredita / Mesec',
    reserveDesc: 'Automatska mesečna rezervacija garancije sa popustom na poruke.',
    reserveBtn: 'Aktiviraj Pretplatu (IPS QR)',
    loadingText: 'Učitavanje...',
    successTopupAlert: (count: number, cost: number) => `Uspešno ste dopunili ${count} kredita za €${cost} (IPS QR / Predračun)!`,

    // Credit Ledger & Usage History
    ledgerHeading: 'Istorijat dopuna i potrošnje kredita (B2B Predračun / IPS QR)',
    ledgerSubheading: 'Pregled početnog stanja, utrošenih Viber i SMS poruka i preostalog stanja po odabranom periodu.',
    ledgerTimeframeSinceLast: 'Od poslednje kupovine',
    ledgerTimeframe7d: 'Poslednjih 7 dana',
    ledgerTimeframe30d: 'Poslednjih 30 dana',
    ledgerTimeframe90d: 'Poslednjih 90 dana',
    ledgerTimeframeYtd: 'Od početka godine (YTD)',
    ledgerTimeframeLifetime: 'Sve vreme (Lifetime)',
    ledgerStartingBalance: 'Početni balans',
    ledgerTopupsLabel: 'Dopunjeno u periodu',
    ledgerViberSent: 'Viber poruke (period)',
    ledgerSmsSent: 'SMS fallback (period)',
    ledgerRemainingBalance: 'Trenutni preostali balans',
    ledgerCreditsUnit: 'kredita',
    ledgerTableColDate: 'Datum i vreme',
    ledgerTableColType: 'Kanal / Tip',
    ledgerTableColDesc: 'Opis transakcije',
    ledgerTableColChange: 'Promena kredita',
    ledgerTableColBalance: 'Stanje posle',
    ledgerTableColReceipt: 'Priznanica / Račun',
    ledgerDownloadReceipt: 'Preuzmi PDF',
    ledgerEmpty: 'Nema transakcija za odabrani period.',

    // Settings Tab
    settingsHeading: 'WooCommerce API Ključevi & Povezivanje Prodavnice',
    settingsSubheading: 'Uputstvo korak-po-korak: Pogledajte tačno na kojoj stranici u WordPress admin panelu se unose ovi ključevi.',
    credentialsTitle: 'Vaši Kredencijali za Povezivanje',
    credentialsSub: 'Kliknite na dugme za brzo kopiranje svakog parametra',
    shaSecurity: 'SHA-256 Sigurno',
    copyBtn: 'Kopiraj',
    copiedBtn: 'Kopirano!',
    
    labelEndpoint: 'Central Backend API Endpoint',
    labelApiKey: 'API Key (ID Prodavnice / Store ID)',
    labelApiSecret: 'API Secret (HMAC Tajni Ključ)',
    
    connStatusTitle: 'Status Veze',
    connStatusActive: 'Aktivno',
    connStoreLabel: 'Prodavnica:',
    connWooLabel: 'WooCommerce:',
    connPingLabel: 'Webhook Ping:',
    connTestPrompt: 'Nakon unosa ključeva u WordPress, kliknite ispod da testirate dvosmernu komunikaciju.',
    connTestingBtn: 'Provera veze...',
    connSuccessBtn: '200 OK · Veza je Ispravna!',
    connDefaultBtn: 'Testiraj WooCommerce Povezivanje',

    guideTitle: 'Vizuelni Prikaz: Gde se unosi u WordPress-u?',
    guideSubtitle: 'Pratite označeni meni sa leve strane vaše administratorske table',
    
    // Guide step cards
    step1Title: 'Otvorite Podešavanja',
    step1Desc: 'Ulogujte se u WordPress admin panel (/wp-admin) i kliknite na Podešavanja > Potvrdio Viber COD.',
    step2Title: 'Kopirajte i Nalepite Ključeve',
    step2Desc: 'Kopirajte 3 polja sa vrha ovog ekrana i nalepite ih u odgovarajuća polja unutar WordPress forme.',
    step3Title: 'Sačuvajte i Gotovo!',
    step3Desc: 'Kliknite na plavo dugme Sačuvaj izmene. Vaša prodavnica je odmah zaštićena od lažnih COD porudžbina.',
    
    saveChangesBtn: 'Sačuvaj izmene (Save Changes)',
    finalStepBadge: 'Poslednji korak',
    pasteHereBadge: 'Nalepiti ovde',
    clickToLocate: 'Kliknite za prikaz na slici dole ↓',
    stepActiveBadge: 'Aktivno označeno na slici dole ↓',
    guideInteractiveHint: 'Interaktivni vodič: Kliknite na bilo koju karticu koraka (1, 2 ili 3) da biste videli tačnu poziciju označenu na WordPress slici ispod:',
    mockupStaticBadge: 'Statički grafički prikaz (Ilustrativan snimak ekrana · Nije za kliktanje)',
    step1Badge: 'Korak 1',
    step2Badge: 'Korak 2',
    step3Badge: 'Korak 3',
    startHereBadge: 'Počnite ovde (Kliknite)',
    previewBadge: 'Prikazano',
    selectStepPrompt: 'Izaberite korak iznad za pregled',
    breadcrumbMenuPath: 'Putanja menija',

    // Store Profile & Logistics Settings
    logisticsTitle: 'Logistički Profil Prodavnice & Kurirski Partner',
    logisticsSub: 'Izaberite primarnu kurirsku službu i mesečni obim porudžbina za tačno prilagođavanje SMS/Viber šablona i kalkulaciju uštede.',
    labelCourier: 'Glavna Kurirska Služba',
    labelVolume: 'Mesečni Broj Narudžbina Pouzećem (COD)',
    saveLogisticsBtn: 'Sačuvaj Logistički Profil',
    logisticsSavedToast: 'Logistički profil uspešno ažuriran!',
    courierPostExpress: 'Post Express (Pošta Srbije)',
    courierBex: 'Bex Express',
    courierDExpress: 'D Express',
    courierCityExpress: 'City Express',
    courierCargoMk: 'Cargo Express MK (Makedonija)',
    courierOther: 'Via Courier / Ostalo',
    volUnder100: '< 100 porudžbina / mesec',
    vol100to300: '100 - 300 porudžbina / mesec',
    vol300to1000: '300 - 1.000 porudžbina / mesec',
    vol1000plus: '1.000+ porudžbina (Pro Reserve)',
    logisticsEstimateBadge: 'Automatska optimizacija formata praćenja aktivna',
    onboardingLogisticsCardTitle: 'Prilagodite vašu kurirsku službu i COD obim',
    onboardingLogisticsCardDesc: 'Definišite primarnog kurira kako bismo prilagodili SMS/Viber linkove praćenja i procenili mesečnu uštedu na sprečenim povratima.',
    onboardingLogisticsBadge: 'ONBOARDING KORAK',
    onboardingLogisticsDoneBadge: 'PROFIL PODEŠEN',

    // Header & Badges
    badgePilotAccount: 'PILOT PERIOD',
    badgeDemoAccount: 'DEMO PODACI',
    yourStoresLabel: 'Vaše WooCommerce Prodavnice',
    addStoreBtn: '+ Dodaj novu prodavnicu',
    signInRealAccountBtn: 'Prijavi se na pravi nalog',
    logoutBtn: 'Odjavi se sa naloga',
    signInBtn: 'Prijavi se na nalog',
    demoStoreBtn: 'Idi na Demo',
    pilotVerificationsLabel: 'Pilot Verifikacije',
    remainingLabel: 'Preostalo',

    // Overview Header & Pilot Trial
    overviewMetricsSubtitle: 'Ključni pokazatelji COD poslovanja i operativne verifikacije',
    pilotTrialBannerTitle: 'Besplatan Pilot Period',
    pilotTrialRemainingText: (remaining: number) => `${remaining} / 25 besplatnih verifikacija preostalo`,
    pilotTrialDesc: 'Vaš nalog koristi 25 garantovanih besplatnih verifikacija za vaše prve porudžbine (bez obzira na SMS ili Viber kanal). Nema automatske naplate niti skrivenih troškova.',
    demoBannerNotice: 'Gledate primer demo prodavnice (Balkan Style Shop) sa simuliranim podacima. Da povežete vaš WooCommerce i dobijete 25 besplatnih verifikacija:',
    demoBannerSignIn: 'Prijavite se',
    demoBannerRegister: 'Registrujte se (25 Besplatno)',

    // Zero-State & Live Verification Stats
    statZeroConfirmedBadge: 'Početak pilot perioda',
    statZeroProcessedBadge: (count: number) => `+${count} obrađeno`,
    statZeroWaitingOrder: 'Čeka prvu COD porudžbinu',
    statZeroRemainingPilot: (remaining: number) => `${remaining} preostalo u pilotu`,
    statZeroDeliveryPending: 'Biće izračunato nakon isporuke',
    statZeroVerifiedAddresses: '100% verifikovanih adresa',
    statZeroPotentialSavings: 'Potencijalna ušteda u toku',
    statZeroSavedCourier: 'Sačuvano na kurirskim troškovima',
    statZeroAwaitingFirst: 'Čeka se prva porudžbina',
    statZeroCustomerResponse: 'Trenutni odziv kupaca',

    // Simulation & Order Table Zero State
    simulateOrderBtn: 'Simuliraj porudžbinu',
    simulatingBtn: 'Simuliram...',
    simulateOrderTitleTooltip: 'Simuliraj novu WooCommerce porudžbinu',
    orderCountUnit: 'naloga',
    waitingFirstOrderTitle: 'Čekamo vašu prvu WooCommerce porudžbinu',
    waitingFirstOrderDesc: (apiKey: string, remaining: number, storeDomain: string) =>
      `Vaš API ključ (${apiKey}) je aktivan sa ${remaining} besplatnih verifikacija. Čim kupac napravi COD porudžbinu na ${storeDomain}, pojaviće se ovde u realnom vremenu.`,
    simulateTestOrderBtn: 'Simuliraj Test Porudžbinu',
    wpSetupGuideBtn: 'Uputstvo za WordPress Povezivanje',

    // Store Connection & Onboarding
    connPendingBadge: 'ČEKA POVEZIVANJE',
    connConnectedBadge: 'POVEZANO I AKTIVNO',
    connectStoreTitle: 'Povežite vašu WooCommerce prodavnicu',
    connectStoreDesc: 'Pre nego što kupci počnu da naručuju pouzećem, instalirajte Potvrdio eklentiju kako bi SMS/Viber verifikacioni linkovi automatski radili.',
    stepDownloadPluginTitle: '1. Preuzmite Potvrdio WordPress eklentiju',
    stepDownloadPluginDesc: 'Instalirajte .zip arhivu kroz WordPress administraciju (Plugins > Add New > Upload Plugin).',
    downloadPluginBtn: 'Preuzmi potvrdio-woocommerce.zip',
    stepPasteKeysTitle: '2. Unesite sva 3 ključa u WordPress (Podešavanja > Potvrdio)',
    stepPasteKeysDesc: 'U WordPress adminu (Podešavanja > Potvrdio Viber COD) unesite ova 3 bezbednosna parametra:',
    seeDetailsBtn: 'Pogledaj detalje (See details)',
    stepVerifyTitle: '3. Verifikujte dvosmernu vezu',
    stepVerifyDesc: 'Kada sačuvate podešavanja u WordPress-u, kliknite ispod ili sačekajte automatski sinhronizacioni signal.',
    verifyConnectionBtn: 'Proveri i verifikuj vezu',
    verifyingConnectionBtn: 'Proveravam komunikaciju sa prodavnicom...',
    connectionSuccessBadge: '200 OK · Uspešno povezano sa WooCommerce!',
    connectionFailedTitle: 'Nije Detektovan Signal Prodavnice',
    connectionNoSignalError: 'Još uvek nismo primili signal sa vašeg WordPress sajta. Molimo proverite da li ste instalirali eklentiju i da su podešavanja uneta kako je navedeno, pa pokušajte ponovo.',
    connectedAwaitingOrdersTitle: 'WooCommerce je uspešno povezan i sluša',
    connectedAwaitingOrdersDesc: (storeDomain: string, remaining: number) =>
      `Vaša prodavnica (${storeDomain}) je aktivna sa ${remaining} besplatnih verifikacija. Čim kupac izabere plaćanje pouzećem (COD), Potvrdio će poslati verifikacioni link i ovde prikazati status.`,
    tryDemoSandboxPrompt: 'Želite prvo da isprobate kako Viber verifikacija radi pre povezivanja vašeg WordPress-a?',
    tryDemoSandboxBtn: 'Otvori Demo Nalog (Balkan Style Shop)',
  },
  mk: {
    langCode: 'mk-MK',
    storeName: 'Balkan Style Shop',
    storeDomain: 'balkanshop.mk',
    storeSubtitle: 'Спречете COD трошоци и зголемете ја испораката на пратки на 98%+',
    connected: 'WooCommerce Connected',
    creditPool: 'Базен на Кредити',
    remaining: 'Преостанато',
    topUpCredits: 'Дополни Кредити',
    supportTitle: 'Корисничка Поддршка',
    supportDesc: 'Помош околу интеграцијата и поставките',
    themeLightTitle: 'Префрли на Светла Тема',
    themeDarkTitle: 'Префрли на Темна Тема',
    
    // Navigation
    navOverview: 'Преглед и Аналитика',
    navCredits: 'Кредити и Дополнување',
    navSettings: 'Поставки',
    
    // Timeframe Filter
    timeframe30d: 'Последните 30 дена',
    timeframeLifetime: 'Вкупно (Lifetime)',
    timeframe7d: 'Последните 7 дена',

    // Overview Stats
    statConfirmedTitle: 'Потврдени COD Нарачки',
    statConfirmedBadge: '+18% овој месец',
    statConfirmedSub: 'Успешно верификувано преку Viber',
    
    statDeliveryTitle: 'Стапка на Успешна Испорака',
    statDeliverySub: 'Пред Potvrdio: 74% (Карго враќањата паднаа на 3.6%)',
    
    statSavedTitle: 'Заштедени Карго Трошоци',
    statSavedSub: 'Спречена повратна поштарина (Брза Пошта / Карго)',
    
    statViberTitle: 'Viber Отворање (Open Rate)',
    statViberSub: 'Просечно време на потврда: 2.4 минути',
    
    // Logs Table
    tableTitle: 'Последни Верификации на Пратки',
    tableSubtitle: 'Следење во реално време на Viber пораки и potvrdio.online измени',
    tableBadge: 'Активно Следење',
    colOrder: 'Нарачка',
    colCustomer: 'Купувач & Телефон',
    colCity: 'Град / Место',
    colAmount: 'Износ',
    colStatus: 'Статус & Канал',
    colTime: 'Време',
    statusApproved: 'Потврдено',
    statusAddressEdited: 'Изменета Адреса',
    statusSmsFallback: 'SMS Алтернатива',
    statusCancelled: 'Откажано (Купувач)',
    tableExpandHint: 'Кликнете на редот за детална историја и хронологија на верификација',
    timelineHeading: 'Хронологија на Верификација на Пратката',
    timelineSummaryTitle: 'Оперативни Детали',
    timelineResponseTimeLabel: 'Брзина на одѕив на купувачот',
    timelineChannelLabel: 'Канал за верификација',
    timelineOutcomeLabel: 'Статус во магацинот',
    timelineSavingsLabel: 'Заштеда на курирски трошоци',
    timelineAddressCorrectionLabel: 'Коригирана адреса за достава',
    
    logs: getVerificationLogs('mk'),

    // Credits Tab
    creditsHeading: 'Заеднички Базен на Viber Кредити',
    creditsSubheading: 'Без месечна претплата, надополнете само онолку кредити колку што ви се потребни за COD верификација.',
    starterTitle: 'Starter Пакет',
    starterCredits: '600 Viber Кредити',
    starterDesc: '€0.025 / порака. Идеално за помали продавници (до 50 нарачки/месец).',
    starterBtn: 'Надополни Кредити (IPS QR)',
    
    growthBadge: 'НАЈПОПУЛАРНО',
    growthTitle: 'Growth Пакет',
    growthCredits: '1,875 Viber Кредити',
    growthDesc: '€0.024 / порака. За средни е-трговци во Македонија и регионот.',
    growthBtn: 'Надополни Кредити (IPS QR)',
    
    proTitle: 'Pro Пакет',
    proCredits: '6,000 Viber Кредити',
    proDesc: '€0.020 / порака. Најниска цена по порака за голем обем на пратки.',
    proBtn: 'Надополни Кредити (IPS QR)',
    
    reserveTitle: 'Pro Reserve (MRR)',
    reservePerMonth: '/месец',
    reserveCredits: '1,800 Кредити / Месец',
    reserveDesc: 'Автоматска месечна резервација на гаранција со попуст на пораки.',
    reserveBtn: 'Активирај Претплата (IPS QR)',
    loadingText: 'Вчитување...',
    successTopupAlert: (count: number, cost: number) => `Успешно надополнивте ${count} кредити за €${cost} (IPS QR / Фактура)!`,

    // Credit Ledger & Usage History
    ledgerHeading: 'Историја на надополнување и потрошувачка на кредити (Фактура / IPS QR)',
    ledgerSubheading: 'Преглед на почетно салдо, потрошени Viber и SMS пораки и преостанато салдо за избраниот период.',
    ledgerTimeframeSinceLast: 'Од последно купување',
    ledgerTimeframe7d: 'Последни 7 дена',
    ledgerTimeframe30d: 'Последни 30 дена',
    ledgerTimeframe90d: 'Последни 90 дена',
    ledgerTimeframeYtd: 'Од почетокот на годината (YTD)',
    ledgerTimeframeLifetime: 'Цело време (Lifetime)',
    ledgerStartingBalance: 'Почетно салдо',
    ledgerTopupsLabel: 'Надополнето во периодот',
    ledgerViberSent: 'Viber пораки (период)',
    ledgerSmsSent: 'SMS fallback (период)',
    ledgerRemainingBalance: 'Тековно преостанато салдо',
    ledgerCreditsUnit: 'кредити',
    ledgerTableColDate: 'Датум и време',
    ledgerTableColType: 'Канал / Тип',
    ledgerTableColDesc: 'Опис на трансакција',
    ledgerTableColChange: 'Промена на кредити',
    ledgerTableColBalance: 'Салдо потоа',
    ledgerTableColReceipt: 'Сметка / Фактура',
    ledgerDownloadReceipt: 'Преземи PDF',
    ledgerEmpty: 'Нема трансакции за избраниот период.',

    // Settings Tab
    settingsHeading: 'WooCommerce API Клучеви и Поврзување на Продавница',
    settingsSubheading: 'Чекор-по-чекор упатство: Погледнете точно на која страница во WordPress администрацијата се внесуваат овие клучеви.',
    credentialsTitle: 'Ваши Кредиенцијали за Поврзување',
    credentialsSub: 'Кликнете на копчето за брзо копирање на секој параметар',
    shaSecurity: 'SHA-256 Безбедно',
    copyBtn: 'Копирај',
    copiedBtn: 'Копирано!',
    
    labelEndpoint: 'Central Backend API Endpoint',
    labelApiKey: 'API Key (ID на Продавница / Store ID)',
    labelApiSecret: 'API Secret (HMAC Таен Клуч)',
    
    connStatusTitle: 'Статус на Врска',
    connStatusActive: 'Активно',
    connStoreLabel: 'Продавница:',
    connWooLabel: 'WooCommerce:',
    connPingLabel: 'Webhook Ping:',
    connTestPrompt: 'По внесувањето на клучевите во WordPress, кликнете подолу за тестирање на двонасочната комуникација.',
    connTestingBtn: 'Проверка на врска...',
    connSuccessBtn: '200 OK · Врската е Исправна!',
    connDefaultBtn: 'Тестирај WooCommerce Поврзување',

    guideTitle: 'Визуелен Приказ: Каде се внесува во WordPress?',
    guideSubtitle: 'Следете го означеното мени од левата страна на вашата администраторска табла',
    
    // Guide step cards
    step1Title: 'Отворете Поставки',
    step1Desc: 'Најавете се во WordPress администрацијата (/wp-admin) и кликнете на Поставки (Settings) > Potvrdio Viber COD.',
    step2Title: 'Копирајте и Вметнете Клучеви',
    step2Desc: 'Копирајте ги 3-те полиња од врвот на овој екран и залепете ги во соодветните полиња во WordPress формата.',
    step3Title: 'Зачувајте и Готово!',
    step3Desc: 'Кликнете на синото копче Зачувај измени. Вашата продавница е веднаш заштитена од лажни COD нарачки.',
    
    saveChangesBtn: 'Зачувај измени (Save Changes)',
    finalStepBadge: 'Последен чекор',
    pasteHereBadge: 'Вметнете овде',
    clickToLocate: 'Кликнете за приказ на сликата долу ↓',
    stepActiveBadge: 'Активно означено на сликата долу ↓',
    guideInteractiveHint: 'Интерактивен водич: Кликнете на било која картичка за чекор (1, 2 или 3) за да ја видите точната локација на WordPress сликата подолу:',
    mockupStaticBadge: 'Статички графички приказ (Илустративен приказ на екран · Не е за кликање)',
    step1Badge: 'Чекор 1',
    step2Badge: 'Чекор 2',
    step3Badge: 'Чекор 3',
    startHereBadge: 'Започнете овде (Кликнете)',
    previewBadge: 'Прикажано',
    selectStepPrompt: 'Изберете чекор погоре за приказ',
    breadcrumbMenuPath: 'Патека на менито',

    // Store Profile & Logistics Settings
    logisticsTitle: 'Логистички Профил на Продавница & Курирски Партнер',
    logisticsSub: 'Изберете примарна курирска служба и месечен обем на нарачки за прецизно прилагодување на SMS/Viber пораките и пресметка на заштеди.',
    labelCourier: 'Главна Курирска Служба',
    labelVolume: 'Месечен Број на Нарачки со Плаќање при Преземање (COD)',
    saveLogisticsBtn: 'Зачувај Логистички Профил',
    logisticsSavedToast: 'Логистичкиот профил е успешно зачуван!',
    courierPostExpress: 'Post Express (Србија)',
    courierBex: 'Bex Express',
    courierDExpress: 'D Express',
    courierCityExpress: 'City Express',
    courierCargoMk: 'Cargo Express MK (Македонија)',
    courierOther: 'Via Courier / Друго',
    volUnder100: '< 100 нарачки / месец',
    vol100to300: '100 - 300 нарачки / месец',
    vol300to1000: '300 - 1.000 нарачки / месец',
    vol1000plus: '1.000+ нарачки (Pro Reserve)',
    logisticsEstimateBadge: 'Препорачана оптимизација на следење е активна',
    onboardingLogisticsCardTitle: 'Прилагодете ја курирската служба и COD обемот',
    onboardingLogisticsCardDesc: 'Дефинирајте го примарниот курир за соодветни SMS/Viber линкови и проценка на заштедите од спречени вратени пратки.',
    onboardingLogisticsBadge: 'ONBOARDING ЧЕКОР',
    onboardingLogisticsDoneBadge: 'ПРОФИЛОТ Е ПОДГОТВЕН',

    // Header & Badges
    badgePilotAccount: 'ПИЛОТ ПЕРИОД',
    badgeDemoAccount: 'ДЕМО ПОДАТОЦИ',
    yourStoresLabel: 'Вашите WooCommerce Продавници',
    addStoreBtn: '+ Додај нова продавница',
    signInRealAccountBtn: 'Најави се на вистински налог',
    logoutBtn: 'Одјави се од налогот',
    signInBtn: 'Најави се на налог',
    demoStoreBtn: 'Оди на Демо',
    pilotVerificationsLabel: 'Пилот Верификации',
    remainingLabel: 'Преостанато',

    // Overview Header & Pilot Trial
    overviewMetricsSubtitle: 'Клучни показатели за COD работење и оперативна верификација',
    pilotTrialBannerTitle: 'Бесплатен Пилот Период',
    pilotTrialRemainingText: (remaining: number) => `${remaining} / 25 бесплатни верификации преостанати`,
    pilotTrialDesc: 'Вашиот налог користи 25 загарантирани бесплатни верификации за вашите први нарачки без скриени трошоци.',
    demoBannerNotice: 'Гледате пример на демо продавница (Balkan Style Shop) со симулирани податоци. За да го поврзете вашиот WooCommerce и да добиете 25 бесплатни верификации:',
    demoBannerSignIn: 'Најавете се',
    demoBannerRegister: 'Регистрирајте се (25 Бесплатно)',

    // Zero-State & Live Verification Stats
    statZeroConfirmedBadge: 'Почеток на пилот период',
    statZeroProcessedBadge: (count: number) => `+${count} обработено`,
    statZeroWaitingOrder: 'Се чека прва COD нарачка',
    statZeroRemainingPilot: (remaining: number) => `${remaining} преостанати во пилот`,
    statZeroDeliveryPending: 'Ќе биде пресметано по испорака',
    statZeroVerifiedAddresses: '100% верификувани адреси',
    statZeroPotentialSavings: 'Потенцијална заштеда во тек',
    statZeroSavedCourier: 'Заштедено на курирски трошоци',
    statZeroAwaitingFirst: 'Се чека прва нарачка',
    statZeroCustomerResponse: 'Моментален одѕив на купувачи',

    // Simulation & Order Table Zero State
    simulateOrderBtn: 'Симулирај нарачка',
    simulatingBtn: 'Се симулира...',
    simulateOrderTitleTooltip: 'Симулирај нова WooCommerce нарачка',
    orderCountUnit: 'нарачки',
    waitingFirstOrderTitle: 'Ја чекаме вашата прва WooCommerce нарачка',
    waitingFirstOrderDesc: (apiKey: string, remaining: number, storeDomain: string) =>
      `Вашиот API клуч (${apiKey}) е активен со ${remaining} бесплатни верификации. Штом купувач направи COD нарачка на ${storeDomain}, таа ќе се појави тука во реално време.`,
    simulateTestOrderBtn: 'Симулирај Тест Нарачка',
    wpSetupGuideBtn: 'Упатство за WordPress',

    // Store Connection & Onboarding
    connPendingBadge: 'СЕ ЧЕКА ПОВРЗУВАЊЕ',
    connConnectedBadge: 'ПОВРЗАНО И АКТИВНО',
    connectStoreTitle: 'Поврзете ја вашата WooCommerce веб продавница',
    connectStoreDesc: 'Пред купувачите да нарачуваат со плаќање при преземање (COD), инсталирајте го Potvrdio плугинот за автоматска Viber/SMS верификација.',
    stepDownloadPluginTitle: '1. Преземете го Potvrdio WordPress плугинот',
    stepDownloadPluginDesc: 'Инсталирајте ја .zip архивата преку WordPress (Plugins > Add New > Upload Plugin).',
    downloadPluginBtn: 'Преземи potvrdio-woocommerce.zip',
    stepPasteKeysTitle: '2. Внесете ги сите 3 клучеви во WordPress (Settings > Potvrdio)',
    stepPasteKeysDesc: 'Во WordPress админ (Подесувања > Potvrdio Viber COD) внесете ги овие 3 безбедносни параметри:',
    seeDetailsBtn: 'Погледни детали (See details)',
    stepVerifyTitle: '3. Верификувајте ја врската',
    stepVerifyDesc: 'По зачувување на поставките во WordPress, кликнете подолу или почекајте автоматски сигнал.',
    verifyConnectionBtn: 'Провери и потврди поврзување',
    verifyingConnectionBtn: 'Се проверува комуникацијата со продавницата...',
    connectionSuccessBadge: '200 OK · Успешно поврзано со WooCommerce!',
    connectionFailedTitle: 'Не е Детектиран Сигнал',
    connectionNoSignalError: 'Сѐ уште не е примен сигнал од вашата WordPress веб-страница. Проверете дали го инсталиравте плугинот и поставките се внесени според упатството, па обидете се повторно.',
    connectedAwaitingOrdersTitle: 'WooCommerce е успешно поврзан и слуша',
    connectedAwaitingOrdersDesc: (storeDomain: string, remaining: number) =>
      `Вашиот налог за (${storeDomain}) е активен со ${remaining} бесплатни верификации. Штом купувач направи COD нарачка, Potvrdio ќе испрати верификациски линк и ќе го прикаже тука во реално време.`,
    tryDemoSandboxPrompt: 'Сакате прво да видите како работи пред да го поврзете вашиот WordPress?',
    tryDemoSandboxBtn: 'Отвори Демо Налог (Balkan Style Shop)',
  },
  en: {
    langCode: 'en-US',
    storeName: 'Balkan Style Shop',
    storeDomain: 'balkanshop.com',
    storeSubtitle: 'Prevent COD return costs and boost parcel delivery rate to 98%+',
    connected: 'WooCommerce Connected',
    creditPool: 'Credit Pool',
    remaining: 'Remaining',
    topUpCredits: 'Top-up Credits',
    supportTitle: 'Support & Helpdesk',
    supportDesc: 'Help with setup & WooCommerce integration',
    themeLightTitle: 'Switch to Light Theme',
    themeDarkTitle: 'Switch to Dark Theme',
    
    // Navigation
    navOverview: 'Overview & Analytics',
    navCredits: 'Credits & Top-up',
    navSettings: 'Settings',
    
    // Timeframe Filter
    timeframe30d: 'Last 30 Days',
    timeframeLifetime: 'All-time (Lifetime)',
    timeframe7d: 'Last 7 Days',

    // Overview Stats
    statConfirmedTitle: 'Confirmed COD Orders',
    statConfirmedBadge: '+18% this month',
    statConfirmedSub: 'Successfully verified via automated Viber flow',
    
    statDeliveryTitle: 'Successful Delivery Rate',
    statDeliverySub: 'Before Potvrdio: 74% (Courier returns dropped to 3.6%)',
    
    statSavedTitle: 'Saved Return Shipping',
    statSavedSub: 'Avoided return courier costs (Post Express / Cargo)',
    
    statViberTitle: 'Viber Open Rate',
    statViberSub: 'Average confirmation turnaround: 2.4 minutes',
    
    // Logs Table
    tableTitle: 'Recent Parcel Verifications',
    tableSubtitle: 'Real-time monitoring of Viber messages and potvrdio.online address edits',
    tableBadge: 'Live Monitoring',
    colOrder: 'Order',
    colCustomer: 'Customer & Phone',
    colCity: 'City / Location',
    colAmount: 'Amount',
    colStatus: 'Status & Channel',
    colTime: 'Time',
    statusApproved: 'Approved',
    statusAddressEdited: 'Address Updated',
    statusSmsFallback: 'SMS Fallback',
    statusCancelled: 'Cancelled by Buyer',
    tableExpandHint: 'Click any row to view full verification history and timeline',
    timelineHeading: 'Parcel Verification Lifecycle',
    timelineSummaryTitle: 'Operational Summary',
    timelineResponseTimeLabel: 'Customer Response Time',
    timelineChannelLabel: 'Verification Channel',
    timelineOutcomeLabel: 'Warehouse Dispatch Status',
    timelineSavingsLabel: 'Prevented Return Expenses',
    timelineAddressCorrectionLabel: 'Updated Delivery Address',
    
    logs: getVerificationLogs('en'),

    // Credits Tab
    creditsHeading: 'Shared Viber Credit Pool',
    creditsSubheading: 'Zero monthly lock-in fees. Top up only the credits you need for automated COD parcel verification.',
    starterTitle: 'Starter Plan',
    starterCredits: '600 Viber Credits',
    starterDesc: '€0.025 / message. Perfect for small shops (up to 50 orders/mo).',
    starterBtn: 'Top Up Credits (IPS QR)',
    
    growthBadge: 'MOST POPULAR',
    growthTitle: 'Growth Plan',
    growthCredits: '1,875 Viber Credits',
    growthDesc: '€0.024 / message. Tailored for high-growth merchants across Balkan region.',
    growthBtn: 'Top Up Credits (IPS QR)',
    
    proTitle: 'Pro Plan',
    proCredits: '6,000 Viber Credits',
    proDesc: '€0.020 / message. Lowest rate per verification message for high volume.',
    proBtn: 'Top Up Credits (IPS QR)',
    
    reserveTitle: 'Pro Reserve (MRR)',
    reservePerMonth: '/month',
    reserveCredits: '1,800 Credits / Month',
    reserveDesc: 'Automated monthly credit warranty replenishment with priority volume discount.',
    reserveBtn: 'Activate Subscription (IPS QR)',
    loadingText: 'Loading...',
    successTopupAlert: (count: number, cost: number) => `Successfully topped up ${count} credits for €${cost} (IPS QR / Invoice)!`,

    // Credit Ledger & Usage History
    ledgerHeading: 'Credit Top-Up and Usage History (B2B Invoice / IPS QR)',
    ledgerSubheading: 'Audit breakdown of starting balance, Viber & SMS dispatches, and remaining balance for the selected period.',
    ledgerTimeframeSinceLast: 'Since last purchase',
    ledgerTimeframe7d: 'Last 7 days',
    ledgerTimeframe30d: 'Last 30 days',
    ledgerTimeframe90d: 'Last 90 days',
    ledgerTimeframeYtd: 'Year-to-date (YTD)',
    ledgerTimeframeLifetime: 'All-time (Lifetime)',
    ledgerStartingBalance: 'Starting Balance',
    ledgerTopupsLabel: 'Top-ups in Period',
    ledgerViberSent: 'Viber Messages (Period)',
    ledgerSmsSent: 'SMS Fallback (Period)',
    ledgerRemainingBalance: 'Current Remaining Balance',
    ledgerCreditsUnit: 'credits',
    ledgerTableColDate: 'Date & Time',
    ledgerTableColType: 'Channel / Type',
    ledgerTableColDesc: 'Transaction Description',
    ledgerTableColChange: 'Credit Change',
    ledgerTableColBalance: 'Balance After',
    ledgerTableColReceipt: 'Receipt / Invoice',
    ledgerDownloadReceipt: 'Download PDF',
    ledgerEmpty: 'No transactions found for the selected period.',

    // Settings Tab
    settingsHeading: 'WooCommerce API Credentials & Store Connection',
    settingsSubheading: 'Step-by-step walkthrough: Discover the exact settings page in WordPress admin where credentials must be pasted.',
    credentialsTitle: 'Your Connection Credentials',
    credentialsSub: 'Click any copy button to instantly copy the parameter to clipboard',
    shaSecurity: 'SHA-256 Secure',
    copyBtn: 'Copy',
    copiedBtn: 'Copied!',
    
    labelEndpoint: 'Central Backend API Endpoint',
    labelApiKey: 'API Key (Store ID)',
    labelApiSecret: 'API Secret (HMAC Signature Key)',
    
    connStatusTitle: 'Connection Status',
    connStatusActive: 'Active',
    connStoreLabel: 'Store Domain:',
    connWooLabel: 'WooCommerce:',
    connPingLabel: 'Webhook Ping:',
    connTestPrompt: 'After pasting credentials into WordPress, click below to verify bidirectional communication.',
    connTestingBtn: 'Checking link...',
    connSuccessBtn: '200 OK · Connection Verified!',
    connDefaultBtn: 'Test WooCommerce Connection',

    guideTitle: 'Visual Walkthrough: Where to paste in WordPress',
    guideSubtitle: 'Follow the highlighted navigation path in your WordPress admin menu',
    
    // Guide step cards
    step1Title: 'Open Settings',
    step1Desc: 'Log in to your WordPress admin panel (/wp-admin) and navigate to Settings > Potvrdio Viber COD.',
    step2Title: 'Copy & Paste Credentials',
    step2Desc: 'Copy the 3 parameters from the top card and paste them into the corresponding fields in WordPress.',
    step3Title: 'Save & Protect!',
    step3Desc: 'Click the blue Save Changes button. Your store is now immediately guarded against fake COD returns.',
    
    saveChangesBtn: 'Save Changes',
    finalStepBadge: 'Final Step',
    pasteHereBadge: 'Paste here',
    clickToLocate: 'Click to preview on mockup below ↓',
    stepActiveBadge: 'Active on mockup preview below ↓',
    guideInteractiveHint: 'Interactive Visual Guide: Click any step card (1, 2, or 3) to illuminate its exact position on the WordPress screenshot reference below:',
    mockupStaticBadge: 'Static Visual Reference (Screenshot Mockup · Non-interactive)',
    step1Badge: 'Step 1',
    step2Badge: 'Step 2',
    step3Badge: 'Step 3',
    startHereBadge: 'Start here (Click)',
    previewBadge: 'Highlighted',
    selectStepPrompt: 'Select a step above to preview',
    breadcrumbMenuPath: 'Menu Path',

    // Store Profile & Logistics Settings
    logisticsTitle: 'Store Logistics & Primary Courier Profile',
    logisticsSub: 'Select your primary parcel courier and monthly COD order volume to calibrate SMS/Viber tracking templates and ROI projection.',
    labelCourier: 'Primary Courier Partner',
    labelVolume: 'Monthly Cash on Delivery (COD) Volume',
    saveLogisticsBtn: 'Save Logistics Profile',
    logisticsSavedToast: 'Logistics profile updated successfully!',
    courierPostExpress: 'Post Express (Serbia)',
    courierBex: 'Bex Express',
    courierDExpress: 'D Express',
    courierCityExpress: 'City Express',
    courierCargoMk: 'Cargo Express MK (Macedonia)',
    courierOther: 'Via Courier / Other',
    volUnder100: '< 100 orders / month',
    vol100to300: '100 - 300 orders / month',
    vol300to1000: '300 - 1,000 orders / month',
    vol1000plus: '1,000+ orders (Pro Reserve)',
    logisticsEstimateBadge: 'Automated carrier tracking format enabled',
    onboardingLogisticsCardTitle: 'Configure Courier Partner & COD Volume',
    onboardingLogisticsCardDesc: 'Define your primary delivery carrier to tailor SMS/Viber tracking links and estimate monthly savings from prevented courier returns.',
    onboardingLogisticsBadge: 'ONBOARDING STEP',
    onboardingLogisticsDoneBadge: 'PROFILE CONFIGURED',

    // Header & Badges
    badgePilotAccount: 'PILOT PERIOD',
    badgeDemoAccount: 'DEMO DATA',
    yourStoresLabel: 'Your WooCommerce Stores',
    addStoreBtn: '+ Add new store',
    signInRealAccountBtn: 'Sign in to real account',
    logoutBtn: 'Sign out of account',
    signInBtn: 'Sign in to account',
    demoStoreBtn: 'Go to Demo',
    pilotVerificationsLabel: 'Pilot Verifications',
    remainingLabel: 'Remaining',

    // Overview Header & Pilot Trial
    overviewMetricsSubtitle: 'Key COD performance indicators and operational verification',
    pilotTrialBannerTitle: 'Free Pilot Period',
    pilotTrialRemainingText: (remaining: number) => `${remaining} / 25 free verifications remaining`,
    pilotTrialDesc: 'Your account uses 25 guaranteed free verifications for your first orders (regardless of SMS or Viber channel). No automatic billing or hidden fees.',
    demoBannerNotice: 'You are viewing a demo store example (Balkan Style Shop) with simulated data. To connect your WooCommerce and get 25 free verifications:',
    demoBannerSignIn: 'Sign In',
    demoBannerRegister: 'Register (25 Free)',

    // Zero-State & Live Verification Stats
    statZeroConfirmedBadge: 'Pilot period started',
    statZeroProcessedBadge: (count: number) => `+${count} processed`,
    statZeroWaitingOrder: 'Awaiting first COD order',
    statZeroRemainingPilot: (remaining: number) => `${remaining} remaining in pilot`,
    statZeroDeliveryPending: 'Calculated upon delivery',
    statZeroVerifiedAddresses: '100% verified addresses',
    statZeroPotentialSavings: 'Potential savings in progress',
    statZeroSavedCourier: 'Saved on courier return fees',
    statZeroAwaitingFirst: 'Awaiting first order',
    statZeroCustomerResponse: 'Current customer response',

    // Simulation & Order Table Zero State
    simulateOrderBtn: 'Simulate Order',
    simulatingBtn: 'Simulating...',
    simulateOrderTitleTooltip: 'Simulate a new WooCommerce order',
    orderCountUnit: 'orders',
    waitingFirstOrderTitle: 'Awaiting your first WooCommerce order',
    waitingFirstOrderDesc: (apiKey: string, remaining: number, storeDomain: string) =>
      `Your API key (${apiKey}) is active with ${remaining} free verifications. As soon as a customer places a COD order on ${storeDomain}, it will appear here in real time.`,
    simulateTestOrderBtn: 'Simulate Test Order',
    wpSetupGuideBtn: 'WordPress Setup Guide',

    // Store Connection & Onboarding
    connPendingBadge: 'CONNECTION PENDING',
    connConnectedBadge: 'CONNECTED & ACTIVE',
    connectStoreTitle: 'Connect Your WooCommerce Store',
    connectStoreDesc: 'Before customers place COD orders, install the Potvrdio plugin so automated Viber/SMS verification links trigger in real time.',
    stepDownloadPluginTitle: '1. Download the Potvrdio WordPress Plugin',
    stepDownloadPluginDesc: 'Upload and activate the .zip package in WordPress (Plugins > Add New > Upload Plugin).',
    downloadPluginBtn: 'Download potvrdio-woocommerce.zip',
    stepPasteKeysTitle: '2. Paste All 3 Credentials in WordPress (Settings > Potvrdio)',
    stepPasteKeysDesc: 'In WordPress Admin (Settings > Potvrdio Viber COD) paste these 3 security parameters:',
    seeDetailsBtn: 'See details',
    stepVerifyTitle: '3. Verify Bi-directional Connection',
    stepVerifyDesc: 'After saving settings in WordPress, click below to verify or wait for the automatic ping.',
    verifyConnectionBtn: 'Verify Store Connection',
    verifyingConnectionBtn: 'Testing communication with WooCommerce...',
    connectionSuccessBadge: '200 OK · Successfully connected to WooCommerce!',
    connectionFailedTitle: 'No Signal Detected Yet',
    connectionNoSignalError: 'No signal has been received from your WordPress site yet. Please make sure you installed the plugin, configured the settings as instructed, and try again.',
    connectedAwaitingOrdersTitle: 'WooCommerce Store Connected & Listening',
    connectedAwaitingOrdersDesc: (storeDomain: string, remaining: number) =>
      `Your store (${storeDomain}) is active with ${remaining} free verifications. As soon as a customer places a cash on delivery (COD) order, Potvrdio will intercept it and display it here in real time.`,
    tryDemoSandboxPrompt: 'Want to see how customer Viber/SMS verification works before connecting your live WordPress?',
    tryDemoSandboxBtn: 'Open Interactive Demo (Balkan Style Shop)',
  }
};
