import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, CheckCheck, ShieldCheck, Clock, Info, Globe } from 'lucide-react';

interface OrderData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  totalAmount: number;
  currency: string;
  storeDomain: string;
}

type Locale = 'sr' | 'mk' | 'en' | 'tr';

const translations = {
  sr: {
    headerSub: 'VERIFIKACIJA ADRESE DOSTAVE',
    badgeSecure: 'Sigurna Dostava',
    tokenValidNotice: 'Sigurnosni token je aktivan',
    cardCurrentTitle: 'Trenutni Podaci o Isporuci',
    orderNo: 'Porudžbina',
    lblAmount: 'Iznos:',
    lblCod: 'Plaćanje pouzećem',
    btnConfirmAsIs: 'Adresa je Tačna, Šaljite Paket',
    dividerOrEdit: 'ili izmenite detalje adrese ispod:',
    formTitle: 'Proveri i Izmeni Adresu Dostave',
    formDesc: 'Proverite ulicu, broj i grad kako bi vam kurir uručio pošiljku bez odlaganja.',
    lblStreet: 'Ulica i kućni broj *',
    phStreet: 'npr. Knez Mihailova 42',
    lblApt: 'Stan / Sprat / Ulaz (opciono)',
    phApt: 'npr. Stan 12, 3. sprat',
    lblCity: 'Grad / Mesto *',
    phCity: 'npr. Beograd ili 11000 Beograd',
    lblNote: 'Napomena za kurira (opciono)',
    phNote: 'npr. Zvoniti na interfon 4 ili ostaviti kod komšije',
    btnSave: 'Sačuvaj i Potvrdi Pošiljku',
    btnSaving: 'Ažuriranje...',
    legalTitle: 'Napomena o privatnosti i zaštiti podataka (ZZPL / GDPR)',
    legalText: 'Jednokratni token važi 24 sata. Vaši podaci se koriste isključivo u svrhu potvrde i realizacije ove pošiljke.',
    successTitle: 'Uspešno Potvrđeno!',
    successDesc: 'Vaša adresa je ažurirana. Narudžbina je spremna za predaju kurirskoj službi.',
    successAddrTitle: 'Potvrđena Adresa:',
    successNotice: 'Prodavac i kurir su obavešteni. Hvala vam!',
  },
  mk: {
    headerSub: 'ВЕРИФИКАЦИЈА НА АДРЕСА ЗА ДОСТАВА',
    badgeSecure: 'Безбедна Достава',
    tokenValidNotice: 'Безбедносниот токен е активен',
    cardCurrentTitle: 'Моментални Информации за Достава',
    orderNo: 'Нарачка',
    lblAmount: 'Износ:',
    lblCod: 'Плаќање при достава',
    btnConfirmAsIs: 'Адресата е точна, испратете го пакетот',
    dividerOrEdit: 'или променете ги деталите за адресата подолу:',
    formTitle: 'Провери и промени адреса за достава',
    formDesc: 'Проверете ја улицата, бројот и градот за курирот да ја достави пратката без одложување.',
    lblStreet: 'Улица и куќен број *',
    phStreet: 'на пр. Партизански Одреди 15',
    lblApt: 'Стан / Кат / Влез (опционално)',
    phApt: 'на пр. Стан 12, 3 кат',
    lblCity: 'Град / Место *',
    phCity: 'на пр. Скопје или 1000 Скопје',
    lblNote: 'Забелешка за курирот (опционално)',
    phNote: 'на пр. Ѕвонете на домофон 4',
    btnSave: 'Зачувај и потврди нарачка',
    btnSaving: 'Се ажурира...',
    legalTitle: 'Напомена за приватност и заштита на личните податоци (LPDP)',
    legalText: 'Еднократниот токен важи 24 часа. Вашите податоци се користат исклучиво за потврда и реализација на оваа нарачка.',
    successTitle: 'Успешно Потврдено!',
    successDesc: 'Вашата адреса е ажурирана. Нарачката е подготвена за испраќање преку курир.',
    successAddrTitle: 'Потврдена Адреса:',
    successNotice: 'Продавачот и курирот се известени. Ви благодариме!',
  },
  en: {
    headerSub: 'DELIVERY ADDRESS VERIFICATION',
    badgeSecure: 'Secure Delivery',
    tokenValidNotice: 'Security token is active',
    cardCurrentTitle: 'Current Delivery Details',
    orderNo: 'Order',
    lblAmount: 'Total:',
    lblCod: 'Cash on Delivery',
    btnConfirmAsIs: 'Address is Correct, Ship the Order',
    dividerOrEdit: 'or edit delivery address details below:',
    formTitle: 'Review & Edit Delivery Address',
    formDesc: 'Please verify your street, number, and city so the courier can deliver without delay.',
    lblStreet: 'Street & House Number *',
    phStreet: 'e.g., Knez Mihailova 42',
    lblApt: 'Apt / Floor / Entrance (optional)',
    phApt: 'e.g., Apt 12, 3rd floor',
    lblCity: 'City / Postal Code *',
    phCity: 'e.g., Belgrade or 11000 Belgrade',
    lblNote: 'Courier Note (optional)',
    phNote: 'e.g., Ring doorbell 4 or leave with neighbor',
    btnSave: 'Save & Confirm Order',
    btnSaving: 'Updating...',
    legalTitle: 'Privacy & Data Protection Notice (GDPR)',
    legalText: 'Single-use security token is valid for 24 hours. Your data is used exclusively to verify and fulfill this delivery.',
    successTitle: 'Successfully Confirmed!',
    successDesc: 'Your address has been updated. The order is prepared for courier dispatch.',
    successAddrTitle: 'Confirmed Address:',
    successNotice: 'Merchant and courier have been notified. Thank you!',
  },
  tr: {
    headerSub: 'TESLİMAT ADRESİ DOĞRULAMA',
    badgeSecure: 'Güvenli Teslimat',
    tokenValidNotice: 'Güvenlik linki aktif',
    cardCurrentTitle: 'Mevcut Teslimat Bilgisi',
    orderNo: 'Sipariş',
    lblAmount: 'Tutar:',
    lblCod: 'Kapıda Ödeme',
    btnConfirmAsIs: 'Adres Doğru, Paketi Kargolayın',
    dividerOrEdit: 'veya aşağıdaki adres detaylarını düzenleyin:',
    formTitle: 'Teslimat Adresini İncele ve Düzenle',
    formDesc: 'Kuryenin paketinizi gecikmeden ulaştırabilmesi için sokak, bina ve şehir bilgilerinizi kontrol edin.',
    lblStreet: 'Cadde / Sokak ve Kapı No *',
    phStreet: 'örn. Knez Mihailova 42',
    lblApt: 'Daire / Kat / Blok (opsiyonel)',
    phApt: 'örn. Daire 12, 3. kat',
    lblCity: 'İlçe / Şehir *',
    phCity: 'örn. Belgrad veya 11000 Belgrad',
    lblNote: 'Kuryeye Not (opsiyonel)',
    phNote: 'örn. Diafonda 4 numaraya basın veya güvenliğe bırakın',
    btnSave: 'Güncelle ve Siparişi Onayla',
    btnSaving: 'Güncelleniyor...',
    legalTitle: 'Gizlilik ve Veri Koruma Bildirimi (KVKK / GDPR)',
    legalText: 'Tek kullanımlık güvenlik linki 24 saat geçerlidir. Bilgileriniz yalnızca bu siparişin doğrulanması ve teslimatı amacıyla işlenir.',
    successTitle: 'Başarıyla Onaylandı!',
    successDesc: 'Teslimat adresiniz güncellendi. Siparişiniz kargo firmasına teslim edilmek üzere hazırlandı.',
    successAddrTitle: 'Onaylanan Adres:',
    successNotice: 'Satıcı mağaza ve kargo kuryesi bilgilendirildi. Teşekkür ederiz!',
  }
};

export default function App() {
  const [locale, setLocale] = useState<Locale>('sr');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tokenTimeLeft, setTokenTimeLeft] = useState('23:58:40');

  // Simulated or fetched order data
  const [order, setOrder] = useState<OrderData>({
    orderId: '7482',
    customerName: 'Nikola Petrović',
    customerPhone: '+381 64 123 4567',
    address1: 'Knez Mihailova 42',
    address2: 'Stan 12, 3. sprat',
    city: 'Beograd',
    postcode: '11000',
    totalAmount: 4850,
    currency: 'RSD',
    storeDomain: 'prodavnica.rs',
  });

  const [form, setForm] = useState({
    address1: order.address1,
    address2: order.address2,
    city: order.city,
    orderNote: '',
  });

  const t = translations[locale];

  // Detect token or currency from URL query parameters if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang') as Locale;
    if (['sr', 'mk', 'en', 'tr'].includes(langParam)) {
      setLocale(langParam);
    }
    const currParam = params.get('currency');
    if (currParam) {
      setOrder(prev => ({ ...prev, currency: currParam }));
    }
  }, []);

  // 24-hour token timer countdown
  useEffect(() => {
    let totalSeconds = 24 * 3600 - 80;
    const interval = setInterval(() => {
      totalSeconds--;
      if (totalSeconds <= 0) {
        clearInterval(interval);
        setTokenTimeLeft('00:00:00');
        return;
      }
      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      setTokenTimeLeft(
        `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  const handleConfirmAsIs = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-['Inter',sans-serif]">
        <div className="bg-white max-w-md w-full rounded-2xl p-6 sm:p-8 text-center border border-slate-200 shadow-lg">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.successTitle}</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            {t.successDesc} <span className="text-teal-700 font-bold">#{order.orderId}</span>.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200 mb-6 space-y-1">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">{t.successAddrTitle}</div>
            <div className="text-slate-900 font-semibold text-base flex items-start gap-2 pt-1">
              <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <div>{form.address1} {form.address2 && `, ${form.address2}`}</div>
                <div className="text-slate-500 text-sm">{form.city}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-emerald-800 bg-emerald-50 py-3.5 px-4 rounded-xl border border-emerald-200 font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>{t.successNotice}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between py-6 px-4 sm:px-6 font-['Inter',sans-serif]">
      <div className="max-w-md w-full mx-auto space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-sm">
              P
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Potvrdio<span className="text-teal-600">.online</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-bold tracking-wider uppercase">
                {t.headerSub}
              </span>
            </div>
          </div>

          {/* Locale Selector Button */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs font-semibold shadow-sm">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <button
              onClick={() => setLocale('sr')}
              className={`px-1.5 py-1 rounded transition-colors ${locale === 'sr' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              title="Srpski / Hrvatski (Latin)"
            >
              SR
            </button>
            <button
              onClick={() => setLocale('mk')}
              className={`px-1.5 py-1 rounded transition-colors ${locale === 'mk' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              title="Македонски (Кирилица)"
            >
              MK
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-1.5 py-1 rounded transition-colors ${locale === 'en' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLocale('tr')}
              className={`px-1.5 py-1 rounded transition-colors ${locale === 'tr' ? 'bg-teal-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              title="Türkçe"
            >
              TR
            </button>
          </div>
        </div>

        {/* 24-Hour Token Validity Status Bar (Replacing heavy tracking & map) */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{t.tokenValidNotice}</span>
          </div>
          <div className="font-mono font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            {tokenTimeLeft}
          </div>
        </div>

        {/* Clean Static Order & Address Summary Card (Zero-Blur & High Contrast) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.cardCurrentTitle}
            </div>
            <span className="text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full">
              {t.orderNo} #{order.orderId}
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-base leading-snug">
                {form.address1} {form.address2 && `, ${form.address2}`}
              </div>
              <div className="text-slate-600 text-sm font-medium">{form.city}</div>
              <div className="text-xs text-slate-500 mt-1">
                {t.lblAmount} <strong className="text-slate-800">{order.totalAmount.toLocaleString()} {order.currency}</strong> ({t.lblCod})
              </div>
            </div>
          </div>

          {/* One-click Confirm As-Is Action */}
          <div className="pt-2">
            <button
              onClick={handleConfirmAsIs}
              disabled={loading}
              className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t.btnConfirmAsIs}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Edit Address Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {t.formTitle}
            </h3>
            <p className="text-xs text-slate-600 leading-normal">
              {t.formDesc}
            </p>
          </div>

          <div className="space-y-3.5">
            {/* Street and Number (Min 48px height, 16px font) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t.lblStreet}
              </label>
              <input
                type="text"
                required
                value={form.address1}
                onChange={(e) => setForm({ ...form, address1: e.target.value })}
                placeholder={t.phStreet}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-[16px] text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all min-h-[48px]"
              />
            </div>

            {/* Apt & City Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t.lblApt}
                </label>
                <input
                  type="text"
                  value={form.address2}
                  onChange={(e) => setForm({ ...form, address2: e.target.value })}
                  placeholder={t.phApt}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-[16px] text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all min-h-[48px]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t.lblCity}
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder={t.phCity}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-[16px] text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all min-h-[48px]"
                />
              </div>
            </div>

            {/* Order note */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t.lblNote}
              </label>
              <textarea
                rows={2}
                value={form.orderNote}
                onChange={(e) => setForm({ ...form, orderNote: e.target.value })}
                placeholder={t.phNote}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-[16px] text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Primary CTA (52px Touch Target) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[52px] bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <CheckCheck className="w-5 h-5" />
                <span>{t.btnSave}</span>
              </>
            )}
          </button>
        </form>

        {/* Legal & Privacy Notice (ZZPL / GDPR / LPDP) */}
        <div className="bg-slate-100 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5 border border-slate-200">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Info className="w-4 h-4 text-teal-700 shrink-0" />
            <span>{t.legalTitle}</span>
          </div>
          <p className="leading-relaxed">
            {t.legalText}
          </p>
        </div>

      </div>
    </div>
  );
}
