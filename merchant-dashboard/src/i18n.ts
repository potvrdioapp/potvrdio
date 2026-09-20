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
  
  logs: Array<{
    id: string;
    customer: string;
    phone: string;
    status: 'APPROVED' | 'EDITED_ADDRESS' | 'SMS_FALLBACK';
    channel: string;
    city: string;
    amount: string;
    time: string;
  }>;

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
    
    logs: [
      { id: '#7482', customer: 'Nikola Petrović', phone: '+381 64 123 ****', status: 'APPROVED', channel: 'Viber', city: 'Beograd', amount: '4.850 RSD', time: 'Pre 4 min' },
      { id: '#7481', customer: 'Milica Jovanović', phone: '+381 63 987 ****', status: 'EDITED_ADDRESS', channel: 'potvrdio.online', city: 'Novi Sad', amount: '8.200 RSD', time: 'Pre 18 min' },
      { id: '#7480', customer: 'Stefan Ilić', phone: '+381 61 456 ****', status: 'APPROVED', channel: 'Viber', city: 'Niš', amount: '3.100 RSD', time: 'Pre 42 min' },
      { id: '#7479', customer: 'Jelena Stojanović', phone: '+387 65 321 ****', status: 'SMS_FALLBACK', channel: 'SMS Fallback', city: 'Banja Luka', amount: '6.400 RSD', time: 'Pre 1h 12m' },
      { id: '#7478', customer: 'Marko Đorđević', phone: '+381 62 888 ****', status: 'APPROVED', channel: 'Viber', city: 'Kragujevac', amount: '5.900 RSD', time: 'Pre 2h 05m' },
    ],

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
    
    logs: [
      { id: '#7482', customer: 'Александар Николов', phone: '+389 70 123 ***', status: 'APPROVED', channel: 'Viber', city: 'Скопје', amount: '2.450 ден', time: 'Пред 4 мин' },
      { id: '#7481', customer: 'Елена Стојановска', phone: '+389 71 987 ***', status: 'EDITED_ADDRESS', channel: 'potvrdio.online', city: 'Битола', amount: '4.100 ден', time: 'Пред 18 мин' },
      { id: '#7480', customer: 'Стефан Трајков', phone: '+389 75 456 ***', status: 'APPROVED', channel: 'Viber', city: 'Охрид', amount: '1.850 ден', time: 'Пред 42 мин' },
      { id: '#7479', customer: 'Марија Димитриевска', phone: '+389 78 321 ***', status: 'SMS_FALLBACK', channel: 'SMS Fallback', city: 'Куманово', amount: '3.200 ден', time: 'Пред 1ч 12м' },
      { id: '#7478', customer: 'Горан Ристов', phone: '+389 72 888 ***', status: 'APPROVED', channel: 'Viber', city: 'Прилеп', amount: '2.900 ден', time: 'Пред 2ч 05м' },
    ],

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
    
    logs: [
      { id: '#7482', customer: 'Nikola Petrovic', phone: '+381 64 123 ****', status: 'APPROVED', channel: 'Viber', city: 'Belgrade', amount: '€42.00', time: '4 mins ago' },
      { id: '#7481', customer: 'Elena Stojanovska', phone: '+389 71 987 ****', status: 'EDITED_ADDRESS', channel: 'potvrdio.online', city: 'Skopje', amount: '€70.00', time: '18 mins ago' },
      { id: '#7480', customer: 'Stefan Ilic', phone: '+381 61 456 ****', status: 'APPROVED', channel: 'Viber', city: 'Novi Sad', amount: '€26.50', time: '42 mins ago' },
      { id: '#7479', customer: 'Marija Dimitrievska', phone: '+389 78 321 ****', status: 'SMS_FALLBACK', channel: 'SMS Fallback', city: 'Bitola', amount: '€54.00', time: '1h 12m ago' },
      { id: '#7478', customer: 'Goran Ristov', phone: '+381 62 888 ****', status: 'APPROVED', channel: 'Viber', city: 'Sarajevo', amount: '€49.00', time: '2h 05m ago' },
    ],

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
