export type CreditTimeframe = 'since_last_purchase' | '7d' | '30d' | '90d' | 'ytd' | 'lifetime';

export interface CreditSummaryStats {
  startingBalance: number;
  topUps: number;
  viberSpent: number;
  smsSpent: number;
  remainingBalance: number;
}

export interface CreditLedgerTransaction {
  id: string;
  date: string;
  type: 'TOPUP' | 'VIBER' | 'SMS';
  title: string;
  description: string;
  channel: string;
  creditsChange: number; // positive for top-up, negative for spend
  balanceAfter: number;
  receiptNumber?: string;
}

export interface CreditLedgerData {
  stats: Record<CreditTimeframe, CreditSummaryStats>;
  transactions: Record<CreditTimeframe, CreditLedgerTransaction[]>;
}

export function getCreditLedgerData(lang: 'sr' | 'mk' | 'en'): CreditLedgerData {
  // Real-time anchor: Remaining balance is 1,875 credits
  const stats: Record<CreditTimeframe, CreditSummaryStats> = {
    since_last_purchase: {
      startingBalance: 94,
      topUps: 1875,
      viberSpent: 86,
      smsSpent: 8,
      remainingBalance: 1875,
    },
    '7d': {
      startingBalance: 164,
      topUps: 1875,
      viberSpent: 152,
      smsSpent: 12,
      remainingBalance: 1875,
    },
    '30d': {
      startingBalance: 512,
      topUps: 1875,
      viberSpent: 472,
      smsSpent: 40,
      remainingBalance: 1875,
    },
    '90d': {
      startingBalance: 1290,
      topUps: 2475,
      viberSpent: 1735,
      smsSpent: 155,
      remainingBalance: 1875,
    },
    ytd: {
      startingBalance: 320,
      topUps: 6150,
      viberSpent: 4235,
      smsSpent: 360,
      remainingBalance: 1875,
    },
    lifetime: {
      startingBalance: 0,
      topUps: 8550,
      viberSpent: 6140,
      smsSpent: 535,
      remainingBalance: 1875,
    },
  };

  // Build localized transaction lists
  const allTxList: CreditLedgerTransaction[] = [
    {
      id: 'tx-109',
      date: lang === 'sr' ? '20. Sep 2026, 14:38' : lang === 'mk' ? '20 Сеп 2026, 14:38' : 'Sep 20, 2026, 14:38',
      type: 'VIBER',
      title: lang === 'sr' ? 'Viber COD Verifikacija (#7482)' : lang === 'mk' ? 'Viber COD Верификација (#7482)' : 'Viber COD Verification (#7482)',
      description: lang === 'sr' ? '1-klik verifikaciona poruka (Nikola Petrović, Beograd)' : lang === 'mk' ? '1-клик верификација (Александар Николов, Скопје)' : '1-click verification message (Nikola Petrovic, Belgrade)',
      channel: 'Viber Business',
      creditsChange: -1,
      balanceAfter: 1875,
    },
    {
      id: 'tx-108',
      date: lang === 'sr' ? '20. Sep 2026, 14:18' : lang === 'mk' ? '20 Сеп 2026, 14:18' : 'Sep 20, 2026, 14:18',
      type: 'VIBER',
      title: lang === 'sr' ? 'potvrdio.online Link Verifikacija (#7481)' : lang === 'mk' ? 'potvrdio.online Линк Верификација (#7481)' : 'potvrdio.online Link Verification (#7481)',
      description: lang === 'sr' ? 'Link za korekciju adrese (Milica Jovanović)' : lang === 'mk' ? 'Линк за корекција на адреса (Елена Стојановска)' : 'Address correction portal link (Elena Stojanovska)',
      channel: 'potvrdio.online',
      creditsChange: -1,
      balanceAfter: 1876,
    },
    {
      id: 'tx-107',
      date: lang === 'sr' ? '20. Sep 2026, 13:20' : lang === 'mk' ? '20 Сеп 2026, 13:20' : 'Sep 20, 2026, 13:20',
      type: 'SMS',
      title: lang === 'sr' ? 'SMS Fallback Gateway Ruta (#7479)' : lang === 'mk' ? 'SMS Алтернатива Рута (#7479)' : 'SMS Fallback Gateway Route (#7479)',
      description: lang === 'sr' ? 'Regionalni SMS gateway (15 min Viber timeout)' : lang === 'mk' ? 'Регионален SMS gateway (15 мин Viber тајмаут)' : 'Regional telco SMS gateway (15m Viber timeout)',
      channel: 'SMS Gateway',
      creditsChange: -2,
      balanceAfter: 1877,
    },
    {
      id: 'tx-106',
      date: lang === 'sr' ? '19. Sep 2026, 18:40' : lang === 'mk' ? '19 Сеп 2026, 18:40' : 'Sep 19, 2026, 18:40',
      type: 'VIBER',
      title: lang === 'sr' ? 'Dnevna serija Viber verifikacija' : lang === 'mk' ? 'Дневна серија Viber верификации' : 'Daily Viber verification batch',
      description: lang === 'sr' ? '38 automatskih COD upita za petak popodne' : lang === 'mk' ? '38 автоматски COD пораки' : '38 automated COD verification queries',
      channel: 'Viber Business',
      creditsChange: -38,
      balanceAfter: 1879,
    },
    {
      id: 'tx-105',
      date: lang === 'sr' ? '18. Sep 2026, 11:24' : lang === 'mk' ? '18 Сеп 2026, 11:24' : 'Sep 18, 2026, 11:24',
      type: 'TOPUP',
      title: lang === 'sr' ? 'Dopuna: Growth Paket' : lang === 'mk' ? 'Надополнување: Growth Пакет' : 'Top-up: Growth Package',
      description: lang === 'sr' ? 'Paddle Merchant of Record (Visa **** 4129)' : lang === 'mk' ? 'Paddle Merchant of Record (Visa **** 4129)' : 'Paddle Merchant of Record (Visa **** 4129)',
      channel: 'Paddle MoR',
      creditsChange: 1875,
      balanceAfter: 1917,
      receiptNumber: 'PDL-INV-2026-8942',
    },
    {
      id: 'tx-104',
      date: lang === 'sr' ? '16. Sep 2026, 16:15' : lang === 'mk' ? '16 Сеп 2026, 16:15' : 'Sep 16, 2026, 16:15',
      type: 'VIBER',
      title: lang === 'sr' ? 'Viber COD Verifikacije' : lang === 'mk' ? 'Viber COD Верификации' : 'Viber COD Verifications',
      description: lang === 'sr' ? '46 uspešnih COD poruka sa 1-klik dugmetom' : lang === 'mk' ? '46 успешни COD пораки' : '46 delivered COD verification messages',
      channel: 'Viber Business',
      creditsChange: -46,
      balanceAfter: 42,
    },
    {
      id: 'tx-103',
      date: lang === 'sr' ? '14. Sep 2026, 10:05' : lang === 'mk' ? '14 Сеп 2026, 10:05' : 'Sep 14, 2026, 10:05',
      type: 'SMS',
      title: lang === 'sr' ? 'SMS Fallback rutiranje' : lang === 'mk' ? 'SMS Алтернатива рутирање' : 'SMS Fallback routing',
      description: lang === 'sr' ? '2 SMS poruke za brojeve van Viber mreže' : lang === 'mk' ? '2 SMS пораки за броеви без Viber' : '2 SMS messages for non-Viber recipients',
      channel: 'SMS Gateway',
      creditsChange: -4,
      balanceAfter: 88,
    },
    {
      id: 'tx-102',
      date: lang === 'sr' ? '10. Sep 2026, 15:30' : lang === 'mk' ? '10 Сеп 2026, 15:30' : 'Sep 10, 2026, 15:30',
      type: 'VIBER',
      title: lang === 'sr' ? 'Viber COD Verifikacije' : lang === 'mk' ? 'Viber COD Верификации' : 'Viber COD Verifications',
      description: lang === 'sr' ? '54 automatske poruke' : lang === 'mk' ? '54 автоматски пораки' : '54 automated messages',
      channel: 'Viber Business',
      creditsChange: -54,
      balanceAfter: 92,
    },
    {
      id: 'tx-101',
      date: lang === 'sr' ? '25. Avg 2026, 09:15' : lang === 'mk' ? '25 Авг 2026, 09:15' : 'Aug 25, 2026, 09:15',
      type: 'VIBER',
      title: lang === 'sr' ? 'Viber verifikacije (Nedeljna serija)' : lang === 'mk' ? 'Viber верификации (Неделна серија)' : 'Viber verifications (Weekly batch)',
      description: lang === 'sr' ? '128 poruka za vikend porudžbine' : lang === 'mk' ? '128 пораки за викенд нарачки' : '128 messages for weekend orders',
      channel: 'Viber Business',
      creditsChange: -128,
      balanceAfter: 310,
    },
    {
      id: 'tx-100',
      date: lang === 'sr' ? '12. Jul 2026, 14:00' : lang === 'mk' ? '12 Јул 2026, 14:00' : 'Jul 12, 2026, 14:00',
      type: 'TOPUP',
      title: lang === 'sr' ? 'Dopuna: Starter Paket' : lang === 'mk' ? 'Надополнување: Starter Пакет' : 'Top-up: Starter Package',
      description: lang === 'sr' ? 'Paddle Merchant of Record' : lang === 'mk' ? 'Paddle Merchant of Record' : 'Paddle Merchant of Record',
      channel: 'Paddle MoR',
      creditsChange: 600,
      balanceAfter: 720,
      receiptNumber: 'PDL-INV-2026-6102',
    },
  ];

  const transactions: Record<CreditTimeframe, CreditLedgerTransaction[]> = {
    since_last_purchase: allTxList.slice(0, 5),
    '7d': allTxList.slice(0, 7),
    '30d': allTxList.slice(0, 9),
    '90d': allTxList,
    ytd: allTxList,
    lifetime: allTxList,
  };

  return { stats, transactions };
}
