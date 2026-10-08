import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  QrCode, 
  FileText, 
  Check, 
  Copy, 
  Printer, 
  RefreshCw, 
  ShieldCheck, 
  Building2,
  ChevronDown
} from 'lucide-react';

export interface IpsPaymentPlan {
  id: string;
  name: string;
  euroPrice: number;
  credits: number;
  type: 'ONE_TIME' | 'MONTHLY';
}

interface IpsPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: IpsPaymentPlan | null;
  lang: 'sr' | 'mk' | 'en';
  onPaymentSuccess?: (credits: number, planId: string) => void;
  onSelectPlan?: (plan: IpsPaymentPlan) => void;
}

export const IpsPaymentModal: React.FC<IpsPaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  lang,
  onPaymentSuccess,
  onSelectPlan,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plan?.id || 'growth');
  const [exchangeRate, setExchangeRate] = useState<number>(117.20);
  const [rateLoading, setRateLoading] = useState<boolean>(true);
  const [rateDate, setRateDate] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'qr' | 'slip'>('qr');
  const [predracunNumber, setPredracunNumber] = useState<string>('');
  const [isNotifying, setIsNotifying] = useState<boolean>(false);
  const [notified, setNotified] = useState<boolean>(false);

  // Sync internal selection when external plan changes
  useEffect(() => {
    if (plan?.id) {
      setSelectedPlanId(plan.id);
    }
  }, [plan?.id]);

  // Official Legal Entity Details (Activity Code 7022 compliant)
  const LEGAL = {
    name: 'GIZEM ORUM PR Konsultantske aktivnosti Lilanova',
    address: 'Bulevar Patrijarha Pavla 91, sprat 4, stan 44',
    city: '21000 Novi Sad, Srbija',
    pib: '115512104',
    mb: '68423937',
    bankAccount: '265-7590310000855-51',
    bankAccountRaw: '265759031000085551', // Exactly 18 digits for NBS IPS
    bankName: 'Raiffeisen Banka a.d. Beograd',
    activityCode: '7022 - Konsultantske aktivnosti u vezi s poslovanjem',
    paymentCode: '221', // Bezgotovinski prenos za usluge / pravna lica i preduzetnici
    vatStatus: 'Preduzetnik nije u sistemu PDV-a (prema čl. 33 Zakona o PDV-u RS)',
  };

  const strings = {
    sr: {
      title: 'Dopuna Kredita – Zvanični Predračun i IPS QR Plaćanje',
      subtitle: 'Bezbedno B2B plaćanje direktno sa vašeg e-banking / m-banking računa bez provizije',
      badge7022: 'Usklađeno sa šifrom delatnosti 7022',
      creditsSuffix: 'kredita',
      perMonthSuffix: '/mesec',
      selectedPackageLabel: 'Osnovni Paket',
      changePackageLabel: 'Promeni paket',
      priceEurLabel: 'Cena u EUR',
      priceEurSub: 'Fakturisana osnovica',
      totalRsdLabel: 'Ukupno za uplatu (RSD)',
      totalRsdSub: 'Tačan iznos za nalog / QR',
      liveRate: 'Zvanični srednji kurs NBS:',
      rateNotice: 'Obračun se vrši u RSD prema članu 34. Zakona o deviznom poslovanju RS.',
      tabQr: 'IPS QR Kod (m-banking)',
      tabSlip: 'Podaci za Nalog / Virman (e-banking)',
      qrStandardBadge: 'NBS IPS STANDARDIZOVANI QR KOD',
      qrGenerating: 'Generisanje QR koda...',
      qrRefPrefix: 'Poziv:',
      howToPayTitle: 'Kako platiti u 2 sekunde?',
      qrInstructions: 'Otvorite mobilnu aplikaciju bilo koje banke u Srbiji (Intesa Mobi, Raiffeisen, OTP, UniCredit, NLB Komercijalna itd.), izaberite opciju „IPS Skeniraj” i usmerite kameru ka QR kodu ispod.',
      qrNote: 'Nalog se popunjava automatski sa tačnim iznosom i pozivom na broj.',
      receiverLabel: 'Primalac:',
      accountLabel: 'Broj računa:',
      amountLabel: 'Iznos za uplatu:',
      paymentCodeLabel: 'Šifra plaćanja:',
      paymentCodeInline: (code: string) => `(Šifra ${code})`,
      purposeLabel: 'Svrha uplate:',
      referenceLabel: 'Poziv na broj:',
      bankLabel: 'Banka:',
      pibLabel: 'PIB primaoca:',
      mbLabel: 'MB primaoca:',
      proformaTitle: 'Predračun (Proforma račun)',
      proformaNo: 'Broj predračuna:',
      issueDate: 'Datum izdavanja:',
      dueDate: 'Rok za uplatu:',
      vatExemptText: 'Preduzetnik nije u sistemu PDV-a prema čl. 33 Zakona o PDV-u. PDV nije obračunat.',
      eInvoiceNoticeTitle: 'Elektronska Faktura (SEF / e-Faktura):',
      eInvoiceNoticeText: 'Nakon evidentirane uplate u bankarskom izvodu, zvanična elektronska faktura (konačni račun) se automatski izdaje kroz SEF na PIB vaše firme u zakonskom roku.',
      confirmPaymentBtn: 'Poslao/la sam uplatu',
      checkingPayment: 'Provera uplate...',
      notifiedSuccess: 'Prijava uplate zabeležena! Krediti se aktiviraju odmah po proknjiženju na računu.',
      printBtn: 'Štampaj / Sačuvaj Predračun',
      closeBtn: 'Zatvori',
      copyBtn: 'Kopiraj',
      copiedBtn: 'Kopirano',
      planStarter: 'Starter Paket',
      planGrowth: 'Growth Paket',
      planPro: 'Pro Scale Paket',
      planReserve: 'Pro Reserve Pretplata',
    },
    mk: {
      title: 'Дополнување Кредити – Официјална Профактура и IPS QR Плаќање',
      subtitle: 'Безбедно B2B плаќање директно од вашата e-banking / m-banking сметка без провизија',
      badge7022: 'Усогласено со дејност 7022 (Консалтинг)',
      creditsSuffix: 'кредити',
      perMonthSuffix: '/месец',
      selectedPackageLabel: 'Избран Пакет',
      changePackageLabel: 'Промени пакет',
      priceEurLabel: 'Цена во EUR',
      priceEurSub: 'Фактурирана основа',
      totalRsdLabel: 'Вкупно за уплата (RSD)',
      totalRsdSub: 'Точен износ за налог / QR',
      liveRate: 'Официјален курс на централна банка:',
      rateNotice: 'Пресметката се врши според важечките прописи за платен промет.',
      tabQr: 'IPS QR Код (Србија m-banking)',
      tabSlip: 'Податоци за Вирман (e-banking)',
      qrStandardBadge: 'NBS IPS СТАНДАРДИЗИРАН QR КОД',
      qrGenerating: 'Генерирање QR код...',
      qrRefPrefix: 'Повик:',
      howToPayTitle: 'Како да платите за 2 секунди?',
      qrInstructions: 'Скенирајте го кодот преку вашата мобилна банкарска апликација со опцијата за инстант плаќање („IPS Скенирај”).',
      qrNote: 'Сите податоци се пополнуваат автоматски со точниот износ и повикувачки број.',
      receiverLabel: 'Примач:',
      accountLabel: 'Број на сметка:',
      amountLabel: 'Износ за уплата:',
      paymentCodeLabel: 'Шифра на плаќање:',
      paymentCodeInline: (code: string) => `(Шифра ${code})`,
      purposeLabel: 'Цел на дознака:',
      referenceLabel: 'Повикувачки број:',
      bankLabel: 'Банка:',
      pibLabel: 'ПИБ:',
      mbLabel: 'МБ:',
      proformaTitle: 'Профактура (Предрачун)',
      proformaNo: 'Број на профактура:',
      issueDate: 'Датум на издавање:',
      dueDate: 'Рок на плаќање:',
      vatExemptText: 'Субјектот не е во систем на ДДВ според важечкиот закон. ДДВ не е пресметан.',
      eInvoiceNoticeTitle: 'Електронска фактура:',
      eInvoiceNoticeText: 'По евидентирање на уплатата на изводот, официјалната e-фактура автоматски се доставува.',
      confirmPaymentBtn: 'Испратив уплата',
      checkingPayment: 'Проверка на уплата...',
      notifiedSuccess: 'Пријавата е евидентирана! Кредитите се активираат веднаш по приемот на уплатата.',
      printBtn: 'Печати Профактура',
      closeBtn: 'Затвори',
      copyBtn: 'Копирај',
      copiedBtn: 'Копирано',
      planStarter: 'Starter Пакет',
      planGrowth: 'Growth Пакет',
      planPro: 'Pro Scale Пакет',
      planReserve: 'Pro Reserve Претплата',
    },
    en: {
      title: 'Top-Up Credits – Proforma Invoice & Instant NBS IPS Payment',
      subtitle: 'Secure B2B payment directly via your corporate e-banking / m-banking account without processor fees',
      badge7022: 'Compliant with business activity 7022',
      creditsSuffix: 'credits',
      perMonthSuffix: '/mo',
      selectedPackageLabel: 'Selected Package',
      changePackageLabel: 'Change package',
      priceEurLabel: 'Price in EUR',
      priceEurSub: 'Invoiced subtotal',
      totalRsdLabel: 'Total Payable (RSD)',
      totalRsdSub: 'Exact amount for slip / QR',
      liveRate: 'Official NBS Middle Exchange Rate:',
      rateNotice: 'Calculated in RSD according to the Serbian Foreign Exchange Act (Art. 34).',
      tabQr: 'Instant IPS QR Code (m-banking)',
      tabSlip: 'Wire Transfer Details (e-banking)',
      qrStandardBadge: 'NBS IPS STANDARDIZED QR CODE',
      qrGenerating: 'Generating QR code...',
      qrRefPrefix: 'Ref:',
      howToPayTitle: 'How to pay in 2 seconds?',
      qrInstructions: 'Open your Serbian mobile banking app (Raiffeisen, Intesa, OTP, UniCredit, etc.), select „IPS Scan” and scan the code below.',
      qrNote: 'The transfer slip is populated automatically with exact amount and reference ID.',
      receiverLabel: 'Beneficiary:',
      accountLabel: 'Bank Account:',
      amountLabel: 'Total Amount:',
      paymentCodeLabel: 'Payment Code:',
      paymentCodeInline: (code: string) => `(Code ${code})`,
      purposeLabel: 'Payment Purpose:',
      referenceLabel: 'Reference / Invoice No:',
      bankLabel: 'Bank:',
      pibLabel: 'Tax ID (PIB):',
      mbLabel: 'Company Reg. (MB):',
      proformaTitle: 'Proforma Invoice (Predračun)',
      proformaNo: 'Proforma No:',
      issueDate: 'Issue Date:',
      dueDate: 'Payment Due:',
      vatExemptText: 'Sole proprietorship exempt from VAT (Art. 33 of Serbian VAT Law). VAT 0%.',
      eInvoiceNoticeTitle: 'Electronic Invoice (e-Faktura / SEF):',
      eInvoiceNoticeText: 'Upon bank statement verification, the final electronic invoice is registered directly to your corporate Tax ID via the official SEF portal.',
      confirmPaymentBtn: 'I have transferred funds',
      checkingPayment: 'Checking payment...',
      notifiedSuccess: 'Payment notice submitted! Credits will be active as soon as booked on the bank statement.',
      printBtn: 'Print / Save Proforma PDF',
      closeBtn: 'Close',
      copyBtn: 'Copy',
      copiedBtn: 'Copied',
      planStarter: 'Starter Plan',
      planGrowth: 'Growth Plan',
      planPro: 'Pro Scale Plan',
      planReserve: 'Pro Reserve Subscription',
    },
  };

  const t = strings[lang] || strings.sr;

  // Available packages list with localized titles
  const availablePlans = useMemo<IpsPaymentPlan[]>(() => [
    {
      id: 'starter',
      name: t.planStarter,
      euroPrice: 15,
      credits: 600,
      type: 'ONE_TIME',
    },
    {
      id: 'growth',
      name: t.planGrowth,
      euroPrice: 45,
      credits: 1875,
      type: 'ONE_TIME',
    },
    {
      id: 'pro',
      name: t.planPro,
      euroPrice: 120,
      credits: 6000,
      type: 'ONE_TIME',
    },
    {
      id: 'reserve',
      name: t.planReserve,
      euroPrice: 29,
      credits: 1800,
      type: 'MONTHLY',
    },
  ], [t]);

  // Active plan derived from user selection
  const activePlan = useMemo<IpsPaymentPlan>(() => {
    const found = availablePlans.find((p) => p.id === selectedPlanId);
    if (found) return found;
    if (plan) {
      return {
        ...plan,
        name:
          plan.id === 'starter'
            ? t.planStarter
            : plan.id === 'growth'
            ? t.planGrowth
            : plan.id === 'pro'
            ? t.planPro
            : plan.id === 'reserve'
            ? t.planReserve
            : plan.name,
      };
    }
    return availablePlans[1]; // default to growth
  }, [availablePlans, selectedPlanId, plan, t]);

  const handlePlanChange = (newPlanId: string) => {
    setSelectedPlanId(newPlanId);
    const chosen = availablePlans.find((p) => p.id === newPlanId);
    if (chosen && onSelectPlan) {
      onSelectPlan(chosen);
    }
  };

  // Generate persistent proforma invoice reference upon opening
  useEffect(() => {
    if (isOpen) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const invoiceNo = `POT-${currentYear}-${randomSuffix}`;
      setPredracunNumber(invoiceNo);
      setNotified(false);
      setIsNotifying(false);
    }
  }, [isOpen, selectedPlanId]);

  // Fetch real-time exchange rate with fallback to NBS official middle rate (117.20)
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setRateLoading(true);

    fetch('https://open.er-api.com/v6/latest/EUR')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data && data.rates && typeof data.rates.RSD === 'number') {
          const liveRate = Number(data.rates.RSD.toFixed(2));
          setExchangeRate(liveRate);
          setRateDate(new Date().toLocaleDateString('sr-RS'));
        } else {
          setExchangeRate(117.20);
          setRateDate(new Date().toLocaleDateString('sr-RS'));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setExchangeRate(117.20);
        setRateDate(new Date().toLocaleDateString('sr-RS'));
      })
      .finally(() => {
        if (isMounted) setRateLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Calculate RSD amount
  const rsdAmount = activePlan ? Math.round(activePlan.euroPrice * exchangeRate) : 0;
  const formattedRsd = rsdAmount.toLocaleString('sr-RS');

  // Generate NBS IPS QR Code string according to NBS Specification (K:PR format)
  useEffect(() => {
    if (!isOpen || !activePlan || !predracunNumber) return;

    // NBS IPS String specification:
    // Svrha plaćanja max 35 chars
    const svrhaPlacanja = `Konsultantske usluge ${predracunNumber}`.slice(0, 35);
    // Naziv primaoca max 70 chars
    const primalac = `${LEGAL.name}, Novi Sad`.slice(0, 70);
    // Iznos format: RSDxxxx,xx
    const iznosNbs = `RSD${rsdAmount},00`;
    // Poziv na broj: Model 00 + predracun
    const pozivNaBroj = `00${predracunNumber.replace(/[^A-Za-z0-9]/g, '')}`;

    const nbsIpsString = [
      'K:PR',
      'V:01',
      'C:1',
      `R:${LEGAL.bankAccountRaw}`,
      `N:${primalac}`,
      `I:${iznosNbs}`,
      `SF:${LEGAL.paymentCode}`,
      `S:${svrhaPlacanja}`,
      `RO:${pozivNaBroj}`
    ].join('|');

    QRCode.toDataURL(nbsIpsString, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate NBS IPS QR code:', err);
      });
  }, [isOpen, activePlan, predracunNumber, rsdAmount, exchangeRate]);

  if (!isOpen || !activePlan) return null;

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulatePaymentNotice = () => {
    setIsNotifying(true);
    setTimeout(() => {
      setIsNotifying(false);
      setNotified(true);
      if (onPaymentSuccess && activePlan) {
        onPaymentSuccess(activePlan.credits, activePlan.id);
      }
    }, 1200);
  };

  const svrhaText = `Konsultantske usluge i digitalna optimizacija COD isporuke po predračunu ${predracunNumber}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl bg-surface border border-theme rounded-2xl shadow-2xl overflow-hidden my-auto text-theme-primary">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-theme bg-surface-subtle flex items-start justify-between">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                {t.badge7022}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {activePlan.name} (+{activePlan.credits.toLocaleString()} {t.creditsSuffix})
              </span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {t.title}
            </h3>
            <p className="text-xs text-theme-muted">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-theme-muted hover:text-theme-primary hover:bg-surface rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live NBS Exchange Rate Banner */}
        <div className="px-6 py-2.5 bg-teal-500/5 border-b border-teal-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-3.5 h-3.5 text-teal-500 ${rateLoading ? 'animate-spin' : ''}`} />
            <span className="text-theme-secondary font-medium">
              {t.liveRate} <strong className="text-teal-600 dark:text-teal-400 font-mono text-sm">1 EUR = {exchangeRate.toFixed(2)} RSD</strong>
            </span>
            {rateDate && (
              <span className="text-[11px] text-theme-muted">({rateDate})</span>
            )}
          </div>
          <div className="text-[11px] text-theme-muted flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.rateNotice}</span>
          </div>
        </div>

        {/* Amount Summary Cards (Interactive Package Selector) */}
        <div className="p-6 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Package Selector Card */}
          <div className="p-3.5 rounded-xl bg-surface border border-theme flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="modal-package-select" className="block text-[11px] text-theme-muted uppercase font-semibold">
                  {t.selectedPackageLabel}
                </label>
              </div>
              <div className="relative">
                <select
                  id="modal-package-select"
                  value={activePlan.id}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full bg-surface-subtle hover:bg-surface border border-theme rounded-lg pl-2.5 pr-8 py-1.5 text-xs font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none shadow-2xs"
                >
                  {availablePlans.map((p) => (
                    <option key={p.id} value={p.id} className="bg-surface text-theme-primary py-1">
                      {p.name} ({p.type === 'MONTHLY' ? `€${p.euroPrice}${t.perMonthSuffix}` : `€${p.euroPrice}`} • {p.credits.toLocaleString()} {t.creditsSuffix})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-theme-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-medium">
              <span>+{activePlan.credits.toLocaleString()} {t.creditsSuffix}</span>
              {activePlan.type === 'MONTHLY' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold uppercase">
                  {t.perMonthSuffix}
                </span>
              )}
            </div>
          </div>

          {/* EUR Price Card */}
          <div className="p-3.5 rounded-xl bg-surface border border-theme flex flex-col justify-between">
            <div>
              <span className="block text-[11px] text-theme-muted uppercase font-semibold">{t.priceEurLabel}</span>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                €{activePlan.euroPrice.toFixed(2)}
                {activePlan.type === 'MONTHLY' && (
                  <span className="text-xs font-normal text-theme-muted"> {t.perMonthSuffix}</span>
                )}
              </div>
            </div>
            <span className="block text-[11px] text-theme-muted mt-2">{t.priceEurSub}</span>
          </div>

          {/* RSD Total Card */}
          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 flex flex-col justify-between">
            <div>
              <span className="block text-[11px] text-teal-700 dark:text-teal-300 uppercase font-semibold">{t.totalRsdLabel}</span>
              <span className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400 mt-1 block">{formattedRsd} RSD</span>
            </div>
            <span className="block text-[10px] text-teal-600/80 dark:text-teal-400/80 mt-2">{t.totalRsdSub}</span>
          </div>
        </div>

        {/* Navigation Tabs (QR vs Slip) */}
        <div className="px-6 border-b border-theme flex gap-2">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-theme-muted hover:text-theme-primary'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>{t.tabQr}</span>
          </button>
          <button
            onClick={() => setActiveTab('slip')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'slip'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-theme-muted hover:text-theme-primary'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.tabSlip}</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[55vh] overflow-y-auto">
          {activeTab === 'qr' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* QR Code Presentation */}
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-inner text-center">
                <div className="mb-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                  <span>{t.qrStandardBadge}</span>
                </div>
                {qrCodeDataUrl ? (
                  <div className="p-2 bg-white rounded-xl border-2 border-slate-900 shadow-sm">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="NBS IPS QR Kod" 
                      className="w-56 h-56 mx-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-xl text-xs text-slate-500">
                    {t.qrGenerating}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-900">
                  <span>{formattedRsd} RSD</span>
                  <span className="text-slate-400">•</span>
                  <span>{t.qrRefPrefix} {predracunNumber}</span>
                </div>
              </div>

              {/* Instructions and Steps */}
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-theme space-y-2">
                  <h4 className="font-bold text-sm text-theme-primary flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    {t.howToPayTitle}
                  </h4>
                  <p className="text-theme-muted leading-relaxed">
                    {t.qrInstructions}
                  </p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{t.qrNote}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1.5 border-b border-theme/60">
                    <span className="text-theme-muted">{t.receiverLabel}</span>
                    <span className="font-semibold text-right text-slate-800 dark:text-slate-200 text-[11px]">{LEGAL.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-theme/60">
                    <span className="text-theme-muted">{t.accountLabel}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{LEGAL.bankAccount}</span>
                      <button 
                        onClick={() => copyToClipboard(LEGAL.bankAccount, 'acc')}
                        className="p-1 hover:text-teal-500 transition-colors cursor-pointer"
                        title={t.copyBtn}
                      >
                        {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-theme/60">
                    <span className="text-theme-muted">{t.referenceLabel}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold">{predracunNumber}</span>
                      <button 
                        onClick={() => copyToClipboard(predracunNumber, 'ref')}
                        className="p-1 hover:text-teal-500 transition-colors cursor-pointer"
                        title={t.copyBtn}
                      >
                        {copiedField === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-theme/60">
                    <span className="text-theme-muted">{t.paymentCodeLabel}</span>
                    <span className="font-mono font-bold">{LEGAL.paymentCode}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Proforma Invoice / Bank Transfer Slip */
            <div className="space-y-4">
              <div className="p-5 bg-surface-subtle border border-theme rounded-2xl space-y-4">
                {/* Invoice Top Details */}
                <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-theme">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-500" />
                      {LEGAL.name}
                    </h4>
                    <p className="text-xs text-theme-muted mt-0.5">{LEGAL.address}, {LEGAL.city}</p>
                    <p className="text-[11px] font-mono text-theme-muted mt-0.5">
                      PIB: <strong className="text-theme-primary">{LEGAL.pib}</strong> | MB: <strong className="text-theme-primary">{LEGAL.mb}</strong>
                    </p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium mt-1">
                      {LEGAL.activityCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 font-mono">
                      {t.proformaTitle}: {predracunNumber}
                    </span>
                    <p className="text-[11px] text-theme-muted mt-1.5">
                      {t.issueDate} <strong>{new Date().toLocaleDateString('sr-RS')}</strong>
                    </p>
                    <p className="text-[11px] text-theme-muted">
                      {t.dueDate} <strong>{new Date(Date.now() + 7 * 86400000).toLocaleDateString('sr-RS')}</strong>
                    </p>
                  </div>
                </div>

                {/* Transfer Slip Rows with 1-Click Copy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  
                  {/* Primalac */}
                  <div className="p-3 bg-surface border border-theme rounded-xl space-y-1">
                    <span className="text-[10px] text-theme-muted uppercase font-semibold">{t.receiverLabel}</span>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{LEGAL.name}</div>
                    <div className="text-[11px] text-theme-muted">{LEGAL.address}, Novi Sad</div>
                  </div>

                  {/* Račun */}
                  <div className="p-3 bg-surface border border-theme rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-theme-muted uppercase font-semibold">{t.accountLabel} ({LEGAL.bankName})</span>
                      <button 
                        onClick={() => copyToClipboard(LEGAL.bankAccount, 'acc2')}
                        className="text-[10px] text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {copiedField === 'acc2' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedField === 'acc2' ? t.copiedBtn : t.copyBtn}
                      </button>
                    </div>
                    <div className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">{LEGAL.bankAccount}</div>
                  </div>

                  {/* Iznos */}
                  <div className="p-3 bg-surface border border-theme rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-theme-muted uppercase font-semibold">{t.amountLabel}</span>
                      <button 
                        onClick={() => copyToClipboard(rsdAmount.toString(), 'amount')}
                        className="text-[10px] text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {copiedField === 'amount' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedField === 'amount' ? t.copiedBtn : t.copyBtn}
                      </button>
                    </div>
                    <div className="font-mono text-base font-black text-slate-900 dark:text-white">
                      {formattedRsd} RSD <span className="text-xs text-theme-muted font-normal">(€{activePlan.euroPrice.toFixed(2)})</span>
                    </div>
                  </div>

                  {/* Poziv na broj */}
                  <div className="p-3 bg-surface border border-theme rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-theme-muted uppercase font-semibold">{t.referenceLabel}</span>
                      <button 
                        onClick={() => copyToClipboard(predracunNumber, 'ref2')}
                        className="text-[10px] text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {copiedField === 'ref2' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedField === 'ref2' ? t.copiedBtn : t.copyBtn}
                      </button>
                    </div>
                    <div className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                      Model 00, {predracunNumber}
                    </div>
                  </div>

                  {/* Svrha uplate (Full width) */}
                  <div className="sm:col-span-2 p-3 bg-surface border border-theme rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-theme-muted uppercase font-semibold">{t.purposeLabel} {t.paymentCodeInline(LEGAL.paymentCode)}</span>
                      <button 
                        onClick={() => copyToClipboard(svrhaText, 'svrha')}
                        className="text-[10px] text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {copiedField === 'svrha' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedField === 'svrha' ? t.copiedBtn : t.copyBtn}
                      </button>
                    </div>
                    <div className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {svrhaText}
                    </div>
                  </div>

                </div>

                {/* Fiscal Note */}
                <div className="p-3 bg-slate-900/5 dark:bg-slate-900/40 rounded-xl border border-theme/80 text-[11px] text-theme-muted">
                  <p>{LEGAL.vatStatus}. {t.vatExemptText}</p>
                </div>
              </div>
            </div>
          )}

          {/* Legal / SEF e-Faktura Assurance Note */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{t.eInvoiceNoticeTitle}</strong>
              <p className="text-[11px] text-theme-muted leading-relaxed">
                {t.eInvoiceNoticeText}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-theme bg-surface-subtle flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border border-theme text-theme-muted hover:text-theme-primary hover:bg-surface transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printBtn}</span>
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-theme-muted hover:text-theme-primary transition-colors cursor-pointer"
            >
              {t.closeBtn}
            </button>

            <button
              onClick={handleSimulatePaymentNotice}
              disabled={isNotifying || notified}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer ${
                notified
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-teal-600 hover:bg-teal-500 active:scale-95 text-white'
              }`}
            >
              {isNotifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.checkingPayment}</span>
                </>
              ) : notified ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.notifiedSuccess}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.confirmPaymentBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
