import React from 'react';
import { X, RotateCcw, CheckCircle2, CreditCard, Building2 } from 'lucide-react';

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'sr' | 'mk' | 'en';
}

export const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const content = {
    sr: {
      title: "Politika Reklamacija i Povraćaja Sredstava",
      subtitle: "Usklađeno sa Zakonom o obligacionim odnosima (ZOO) i standardima B2B poslovanja",
      updated: "Poslednje ažuriranje: Septembar 2026.",
      merchant_info: "Pravno lice: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, MB: 68423937, PIB: 115512104, Bulevar Patrijarha Pavla 91, sprat 4, stan 44, 21000 Novi Sad, Srbija",

      sec1_title: "1. Priroda usluge i pravo na reklamaciju (B2B)",
      sec1_p: "Potvrdio pruža konsultantske usluge i digitalna rešenja za optimizaciju procesa isporuke i COD logistike za WooCommerce trgovce. Kao pravno lice ili preduzetnik (B2B korisnik), imate pravo na podnošenje prigovora/reklamacije u slučaju tehničkih smetnji, nemogućnosti korišćenja zakupljenih verifikacionih sesija ili neusaglašenosti u obračunu transakcija.",

      sec2_title: "2. Način i rokovi za podnošenje prigovora (SLA)",
      sec2_items: [
        "Prigovor se podnosi isključivo u pisanoj formi slanjem e-maila na službenu adresu podrške: podrska@potvrdio.online.",
        "U prijavi je potrebno navesti: naziv firme/trgovca, PIB, e-mail registrovanog naloga, ID transakcije (izveštaj platnog procesora ili izvod) i detaljan opis problema.",
        "Potvrdio potvrđuje prijem prigovora u roku od 24 časa.",
        "Kao deo našeg B2B standarda kvaliteta (SLA), pisani odgovor dostavljamo najkasnije u roku od 8 dana, a konačno rešavanje osnovanog prigovora sprovodimo u roku do 15 dana."
      ],

      sec3_title: "3. Povraćaj sredstava za uplate izvršene platnim karticama",
      sec3_p1: "U slučaju odobrenog povraćaja sredstava za transakcije realizovane platnim karticama, povraćaj se vrši ISKLJUČIVO storniranjem/refundacijom na istu platnu karticu sa koje je uplata izvršena preko ovlašćenog platnog procesora.",
      sec3_p2: "U skladu sa bankarskim propisima i pravilima kartičarskih organizacija, povraćaj sredstava u gotovini ili prenos na drugu karticu ili račun nisu dozvoljeni.",

      sec4_title: "4. Povraćaj sredstava za uplate putem virmana (e-Faktura / Račun)",
      sec4_p: "Za uplate izvršene direktnim bankarskim prenosom (virmanom) na račun firme GIZEM ORUM PR Konsultantske aktivnosti Lilanova, povraćaj odobrenih sredstava vrši se nalogom za prenos direktno na zvanični dinarski tekući račun uplatioca u roku od 1 (jednog) radnog dana od dana donošenja odluke o refundaciji.",

      sec5_title: "5. Neiskorišćeni krediti i prekid korišćenja",
      sec5_p: "Zakupljeni paketi verifikacionih kredita nemaju rok važenja. U slučaju trajnog gašenja naloga od strane korisnika usled tehničke nekompatibilnosti servisa, preostali neiskorišćeni iznos refundira se srazmerno, umanjen za stvarne troškove bankarskih transakcija.",

      sec6_title: "6. Korisnička podrška za finansijska pitanja",
      sec6_p: "Za sva pitanja u vezi sa reklamacijama i uplatama kontaktirajte naš tim:",
      contact_email: "podrska@potvrdio.online",
      contact_hours: "Radnim danima: 09:00 – 17:00 CET",
      btn_close: "Zatvori"
    },
    mk: {
      title: "Политика за Рекламации и Враќање на Средства",
      subtitle: "Усогласено со Законот за облигациони односи и B2B стандардите",
      updated: "Последно ажурирање: Септември 2026.",
      merchant_info: "Правен субјект: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, МБ: 68423937, ПИБ: 115512104, Нови Сад, Србија",

      sec1_title: "1. Природа на услугата и право на приговор (B2B)",
      sec1_p: "Potvrdio обезбедува консалтинг и дигитални решенија за оптимизација на COD испораката. Трговците имаат право на приговор во случај на технички пречки или неможност за користење на кредитите.",

      sec2_title: "2. Начин и рокови за приговор (SLA)",
      sec2_items: [
        "Приговорот се поднесува во писмена форма на: podrska@potvrdio.online.",
        "Потребно е да се наведат податоците за налогот, трансакциски ID и опис на проблемот.",
        "Потврда за прием се испраќа во рок од 24 часа, а писмен одговор најдоцна во рок од 8 дена."
      ],

      sec3_title: "3. Враќање на средства за платежни картички",
      sec3_p1: "Кај уплати извршени со картички, рефундацијата се врши исклучиво на истата платежна картичка од која е извршено плаќањето преку овластениот процесор.",
      sec3_p2: "Средствата не се исплаќаат во готовина ниту на трети сметки.",

      sec4_title: "4. Враќање на средства за вирмански уплати",
      sec4_p: "За вирмански уплати, враќањето се врши директно на сметката на правниот субјект во рок од 1 (еден) работен ден од одобрувањето.",

      sec5_title: "5. Неискористени кредити",
      sec5_p: "Купените верификациски кредити немаат рок на истекување.",

      sec6_title: "6. Поддршка за корисници",
      sec6_p: "За прашања обратете се на:",
      contact_email: "podrska@potvrdio.online",
      contact_hours: "Понеделник – Петок: 09:00 – 17:00 CET",
      btn_close: "Затвори"
    },
    en: {
      title: "Complaints and Refund Policy",
      subtitle: "Governed by the Law on Contracts and Torts (ZOO) and commercial B2B SLA terms",
      updated: "Last updated: September 2026.",
      merchant_info: "Legal Entity: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, Reg. No: 68423937, Tax ID (PIB): 115512104, Novi Sad, Serbia",

      sec1_title: "1. Service Scope & Complaints Right (B2B)",
      sec1_p: "Potvrdio provides business logistics consultancy and cloud automation tools for WooCommerce merchants. As a commercial B2B client, you reserve the right to submit complaints in case of technical downtime, credit delivery discrepancies, or billing errors.",

      sec2_title: "2. Complaint Submission & SLA Timeframes",
      sec2_items: [
        "Complaints must be submitted in writing via email to: podrska@potvrdio.online.",
        "Please provide your registered merchant name, PIB / Tax ID, registered email, and Transaction ID.",
        "Receipt is acknowledged within 24 hours.",
        "Under our B2B Service Level Agreement (SLA), a formal response is issued within 8 days, with resolution completed within 15 days."
      ],

      sec3_title: "3. Card Payment Refunds",
      sec3_p1: "In case of an approved refund for card transactions, funds are returned EXCLUSIVELY by reversing the charge back to the exact payment card used, via the authorized payment processor.",
      sec3_p2: "Under standard banking regulations, cash refunds or transfers to third-party accounts are strictly prohibited.",

      sec4_title: "4. Bank Wire / Invoice Refunds",
      sec4_p: "For payments settled via electronic bank wire, approved refunds are transferred directly to the corporate bank account of the paying entity within 1 (one) business day of approval.",

      sec5_title: "5. Unused Credits",
      sec5_p: "Purchased Potvrdio verification credits never expire. In case of account termination due to technical incompatibility, unused balances are refunded proportionally minus standard banking transfer fees.",

      sec6_title: "6. Financial Support",
      sec6_p: "For any billing or refund assistance, contact us at:",
      contact_email: "podrska@potvrdio.online",
      contact_hours: "Business days: 09:00 – 17:00 CET",
      btn_close: "Close"
    }
  };

  const t = content[lang] || content.sr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-surface border border-theme rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-theme-primary font-sans text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-surface-subtle p-5 border-b border-theme flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-theme-primary">{t.title}</h2>
              <p className="text-xs text-theme-muted">{t.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-surface transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-theme-secondary font-sans leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec1_title}
            </h3>
            <p>{t.sec1_p}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec2_title}
            </h3>
            <ul className="space-y-1.5 pl-1">
              {t.sec2_items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2 p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/15">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h3 className="text-xs font-bold font-sans text-emerald-700 dark:text-emerald-300">
                {t.sec3_title}
              </h3>
            </div>
            <p className="text-[11px] text-theme-secondary">{t.sec3_p1}</p>
            <p className="text-[11px] text-theme-muted font-medium">{t.sec3_p2}</p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
                {t.sec4_title}
              </h3>
            </div>
            <p>{t.sec4_p}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec5_title}
            </h3>
            <p>{t.sec5_p}</p>
          </section>

          <section className="space-y-2 border-t border-theme pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec6_title}
            </h3>
            <p>{t.sec6_p}</p>
            <div className="p-3 bg-surface-subtle rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t.contact_email}</span>
              <span className="text-theme-muted">{t.contact_hours}</span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-surface-subtle px-5 py-3 border-t border-theme flex items-center justify-between text-[11px] font-sans shrink-0">
          <span className="text-theme-muted">Potvrdio B2B SLA Reklamacioni Postupak</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface hover:bg-surface-subtle text-theme-primary border border-theme font-bold text-xs transition cursor-pointer shadow-sm"
          >
            {t.btn_close}
          </button>
        </div>
      </div>
    </div>
  );
};
