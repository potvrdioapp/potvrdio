import React from 'react';
import { X, PackageCheck, Zap, CheckCircle2 } from 'lucide-react';

interface DeliveryPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'sr' | 'mk' | 'en';
}

export const DeliveryPolicyModal: React.FC<DeliveryPolicyModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const content = {
    sr: {
      title: "Način Isporuke Digitalnih Usluga",
      subtitle: "Uslovi aktivacije i isporuke verifikacionih paketa za WooCommerce prodavnice",
      updated: "Poslednje ažuriranje: Septembar 2026.",
      merchant_info: "Pravno lice: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, MB: 68423937, PIB: 115512104, Bulevar Patrijarha Pavla 91, Novi Sad",

      sec1_title: "1. Priroda usluge (Bez fizičke dostave robe)",
      sec1_p: "Potvrdio pruža konsultantske usluge i prateća digitalna softverska rešenja za WooCommerce trgovce. Platforma ne isporučuje fizičku robu niti koristi kurirske službe za isporuku svojih servisa. Sve usluge se isporučuju u digitalnom obliku putem softverske infrastrukture, API konekcija i veb interfejsa.",

      sec2_title: "2. Način i brzina aktivacije verifikacionih kredita",
      sec2_items: [
        "Platne kartice (Visa, Mastercard, DinaCard): Nakon uspešno autorizovane transakcije preko licenciranog platnog procesora, zakupljeni verifikacioni paketi se automatski i bez odlaganja (u realnom vremenu) aktiviraju na korisničkom nalogu trgovca.",
        "NBS IPS QR plaćanje (IPS Skeniraj): Odmah po verifikaciji instant naloga od strane Narodne banke Srbije, krediti su aktivni u sistemu.",
        "Bankarski prenos (Virman / e-Faktura): Nakon evidentiranja uplate na tekući račun firme GIZEM ORUM PR Konsultantske aktivnosti Lilanova, administratorski tim vrši aktivaciju paketa istog radnog dana, najkasnije u roku od 2 sata od knjiženja uplate."
      ],

      sec3_title: "3. Pristup uslugama i potvrda isporuke",
      sec3_p1: "Potvrda o uspešnoj isporuci i aktivaciji kredita šalje se na e-mail adresu povezanu sa nalogom trgovca zajedno sa računom / specifikacijom transakcije.",
      sec3_p2: "Trgovac ima neprekidan 24/7 uvid u stanje raspoloživih kredita, istorijat verifikovanih narudžbina i analitiku uspešnosti isporuka direktno unutar svog WordPress / WooCommerce admin panela.",

      sec4_title: "4. Tehnička podrška pri aktivaciji",
      sec4_p: "U slučaju da nakon uspešne uplate krediti ne budu vidljivi u vašem WooCommerce panelu u roku od nekoliko minuta usled mrežnog prekida, naša tehnička podrška je dostupna za hitnu asistenciju:",
      contact_email: "podrska@potvrdio.online",
      contact_hours: "Radnim danima: 09:00 – 17:00 CET (odziv unutar 24 časa)",
      btn_close: "Zatvori"
    },
    mk: {
      title: "Начин на Испорака на Дигитални Услуги",
      subtitle: "Услови за активација на дигиталните верификациски пакети",
      updated: "Последно ажурирање: Септември 2026.",
      merchant_info: "Правен субјект: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, МБ: 68423937, ПИБ: 115512104, Нови Сад, Србија",

      sec1_title: "1. Природа на услугата (Без физичка достава)",
      sec1_p: "Potvrdio обезбедува консалтинг и дигитални решенија за оптимизација на испораката. Нема физичка достава преку карго или пошта; сите услуги се испорачуваат дигитално преку cloud инфраструктура.",

      sec2_title: "2. Брзина и начин на активација",
      sec2_items: [
        "Платежни картички: По успешна трансакција, кредитите веднаш и автоматски се активираат на корисничкиот налог.",
        "Вирманско плаќање: Активацијата се врши веднаш по евидентирање на уплатата во текот на истиот работен ден."
      ],

      sec3_title: "3. Пристап и потврда",
      sec3_p1: "Потврдата за активација се испраќа по е-пошта заедно со фактурата.",
      sec3_p2: "Трговецот има 24/7 увид во потрошувачката директно во својот WooCommerce контролен панел.",

      sec4_title: "4. Поддршка при активација",
      sec4_p: "За помош контактирајте го нашиот технички тим:",
      contact_email: "podrska@potvrdio.online",
      contact_hours: "Понеделник – Петок: 09:00 – 17:00 CET",
      btn_close: "Затвори"
    },
    en: {
      title: "Digital Service Delivery Terms",
      subtitle: "Instant activation and provisioning rules for SaaS verification credit packages",
      updated: "Last updated: September 2026.",
      merchant_info: "Legal Entity: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, Reg. No: 68423937, Tax ID (PIB): 115512104, Novi Sad, Serbia",

      sec1_title: "1. Digital Consultancy & Cloud Tool (No Physical Shipping)",
      sec1_p: "Potvrdio provides business logistics consultancy and cloud automation tools for WooCommerce e-commerce stores. We do not dispatch physical parcels or use courier logistics. All deliverables are delivered electronically via API, cloud infrastructure, and WooCommerce admin extensions.",

      sec2_title: "2. Instant Activation Timeframe",
      sec2_items: [
        "Payment Cards (Visa, Mastercard, DinaCard): Upon successful authorization via licensed payment processors, purchased verification credits are automatically activated immediately without delay in real time.",
        "NBS IPS QR Instant Payments: Activated instantly once the National Bank of Serbia settlement is broadcast.",
        "Bank Wire (Proforma Invoice): Activated promptly within business hours upon receipt of bank confirmation on GIZEM ORUM PR Konsultantske aktivnosti Lilanova account."
      ],

      sec3_title: "3. Access and Proof of Delivery",
      sec3_p1: "A digital receipt and confirmation email are automatically dispatched to the merchant's registered email address upon credit activation.",
      sec3_p2: "Merchants maintain 24/7 visibility into active credit balances and real-time logs directly within their WordPress/WooCommerce administrative dashboard.",

      sec4_title: "4. Activation Assistance",
      sec4_p: "In case of any unexpected delay, our dedicated support team is at your service:",
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
              <PackageCheck className="w-5 h-5" />
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
          <section className="space-y-2 p-3.5 bg-blue-500/5 rounded-xl border border-blue-500/15">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <h3 className="text-xs font-bold font-sans text-blue-700 dark:text-blue-300">
                {t.sec1_title}
              </h3>
            </div>
            <p className="text-[11px] text-theme-secondary">{t.sec1_p}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec2_title}
            </h3>
            <ul className="space-y-2 pl-1">
              {t.sec2_items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec3_title}
            </h3>
            <p>{t.sec3_p1}</p>
            <p className="text-theme-muted">{t.sec3_p2}</p>
          </section>

          <section className="space-y-2 border-t border-theme pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec4_title}
            </h3>
            <p>{t.sec4_p}</p>
            <div className="p-3 bg-surface-subtle rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t.contact_email}</span>
              <span className="text-theme-muted">{t.contact_hours}</span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-surface-subtle px-5 py-3 border-t border-theme flex items-center justify-between text-[11px] font-sans shrink-0">
          <span className="text-theme-muted">Digitalna Isporuka • Trenutna Aktivacija Kredita</span>
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
