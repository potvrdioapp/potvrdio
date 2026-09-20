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
    navSettings: 'WooCommerce API Ključ',
    
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
    starterBtn: 'Kupi sa Paddle MoR',
    
    growthBadge: 'NAJPOPULARNIJE',
    growthTitle: 'Growth Paket',
    growthCredits: '1,875 Viber Kredita',
    growthDesc: '€0.024 / poruci. Za srednje e-trgovce u Srbiji i regionu.',
    growthBtn: 'Kupi sa Lemon Squeezy',
    
    proTitle: 'Pro Paket',
    proCredits: '6,000 Viber Kredita',
    proDesc: '€0.020 / poruci. Najniža cena poruke za visoki obim pošiljki.',
    proBtn: 'Kupi sa Paddle MoR',
    
    reserveTitle: 'Pro Reserve (MRR)',
    reservePerMonth: '/mesec',
    reserveCredits: '1,800 Kredita / Mesec',
    reserveDesc: 'Automatska mesečna rezervacija garancije sa popustom na poruke.',
    reserveBtn: 'Aktiviraj Pretplatu',
    loadingText: 'Učitavanje...',
    successTopupAlert: (count: number, cost: number) => `[PADDLE / LEMON SQUEEZY] Uspešno ste dopunili ${count} kredita za €${cost}!`,

    // Credit Ledger & Usage History
    ledgerHeading: 'Istorijat dopuna i potrošnje kredita (Kreditna kartica)',
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
    step1Desc: 'Ulogujte se u WordPress admin panel (/wp-admin) i kliknite na Podešavanja ➔ Potvrdio Viber COD.',
    step2Title: 'Nalepite Ključeve',
    step2Desc: 'Kopirajte 3 polja sa vrha ovog ekrana i nalepite ih u odgovarajuća polja unutar WordPress forme.',
    step3Title: 'Sačuvajte i Gotovo!',
    step3Desc: 'Kliknite na plavo dugme Sačuvaj izmene. Vaša prodavnica je odmah zaštićena od lažnih COD porudžbina.',
    
    saveChangesBtn: 'Sačuvaj izmene (Save Changes)',
    finalStepBadge: 'Poslednji korak',
    pasteHereBadge: '✓ Nalepiti ovde',
    clickToLocate: 'Kliknite za prikaz ↓',
    stepActiveBadge: '● Označeno dole ↓'
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
    navSettings: 'WooCommerce API Клуч',
    
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
    starterBtn: 'Купи со Paddle MoR',
    
    growthBadge: 'НАЈПОПУЛАРНО',
    growthTitle: 'Growth Пакет',
    growthCredits: '1,875 Viber Кредити',
    growthDesc: '€0.024 / порака. За средни е-трговци во Македонија и регионот.',
    growthBtn: 'Купи со Lemon Squeezy',
    
    proTitle: 'Pro Пакет',
    proCredits: '6,000 Viber Кредити',
    proDesc: '€0.020 / порака. Најниска цена по порака за голем обем на пратки.',
    proBtn: 'Купи со Paddle MoR',
    
    reserveTitle: 'Pro Reserve (MRR)',
    reservePerMonth: '/месец',
    reserveCredits: '1,800 Кредити / Месец',
    reserveDesc: 'Автоматска месечна резервација на гаранција со попуст на пораки.',
    reserveBtn: 'Активирај Претплата',
    loadingText: 'Вчитување...',
    successTopupAlert: (count: number, cost: number) => `[PADDLE / LEMON SQUEEZY] Успешно надополнивте ${count} кредити за €${cost}!`,

    // Credit Ledger & Usage History
    ledgerHeading: 'Историја на надополнување и потрошувачка на кредити',
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
    step1Desc: 'Најавете се во WordPress администрацијата (/wp-admin) и кликнете на Поставки (Settings) ➔ Potvrdio Viber COD.',
    step2Title: 'Вметнете ги Клучевите',
    step2Desc: 'Копирајте ги 3-те полиња од врвот на овој екран и залепете ги во соодветните полиња во WordPress формата.',
    step3Title: 'Зачувајте и Готово!',
    step3Desc: 'Кликнете на синото копче Зачувај измени. Вашата продавница е веднаш заштитена од лажни COD нарачки.',
    
    saveChangesBtn: 'Зачувај измени (Save Changes)',
    finalStepBadge: 'Последен чекор',
    pasteHereBadge: '✓ Вметнете овде',
    clickToLocate: 'Кликнете за приказ ↓',
    stepActiveBadge: '● Означено долу ↓'
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
    navSettings: 'WooCommerce API Key',
    
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
    starterBtn: 'Purchase with Paddle MoR',
    
    growthBadge: 'MOST POPULAR',
    growthTitle: 'Growth Plan',
    growthCredits: '1,875 Viber Credits',
    growthDesc: '€0.024 / message. Tailored for high-growth merchants across Balkan region.',
    growthBtn: 'Purchase with Lemon Squeezy',
    
    proTitle: 'Pro Plan',
    proCredits: '6,000 Viber Credits',
    proDesc: '€0.020 / message. Lowest rate per verification message for high volume.',
    proBtn: 'Purchase with Paddle MoR',
    
    reserveTitle: 'Pro Reserve (MRR)',
    reservePerMonth: '/month',
    reserveCredits: '1,800 Credits / Month',
    reserveDesc: 'Automated monthly credit warranty replenishment with priority volume discount.',
    reserveBtn: 'Activate Subscription',
    loadingText: 'Loading...',
    successTopupAlert: (count: number, cost: number) => `[PADDLE / LEMON SQUEEZY] Successfully topped up ${count} credits for €${cost}!`,

    // Credit Ledger & Usage History
    ledgerHeading: 'Credit Top-Up and Usage History (Credit Ledger)',
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
    step1Desc: 'Log in to your WordPress admin panel (/wp-admin) and navigate to Settings ➔ Potvrdio Viber COD.',
    step2Title: 'Paste Credentials',
    step2Desc: 'Copy the 3 parameters from the top card and paste them into the corresponding fields in WordPress.',
    step3Title: 'Save & Protect!',
    step3Desc: 'Click the blue Save Changes button. Your store is now immediately guarded against fake COD returns.',
    
    saveChangesBtn: 'Save Changes',
    finalStepBadge: 'Final Step',
    pasteHereBadge: '✓ Paste here',
    clickToLocate: 'Click to locate ↓',
    stepActiveBadge: '● Active below ↓'
  }
};
