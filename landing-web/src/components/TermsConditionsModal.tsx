import React from 'react';
import { X, FileText, CheckCircle2, Scale } from 'lucide-react';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'sr' | 'mk' | 'en';
}

export const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const content = {
    sr: {
      title: "Opšti Uslovi Poslovanja",
      subtitle: "Ugovor o pružanju konsultantskih usluga i digitalnih rešenja za WooCommerce trgovce",
      updated: "Poslednje ažuriranje: Septembar 2026.",
      merchant_info: "Pravno lice: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, MB: 68423937, PIB: 115512104, Bulevar Patrijarha Pavla 91, sprat 4, stan 44, 21000 Novi Sad, Srbija",
      sec1_title: "1. Opšte odredbe i prihvatanje uslova",
      sec1_p1: "Ovi Opšti uslovi poslovanja regulišu pristup i korišćenje Potvrdio servisa – konsultantskih usluga za optimizaciju procesa isporuke robe i pratećeg softverskog dodatka (eklentije) za automatizaciju dvosmerne verifikacije porudžbina sa pouzećem (COD) za WooCommerce e-prodavnice. Usluge pruža preduzetnik GIZEM ORUM PR Konsultantske aktivnosti Lilanova.",
      sec1_p2: "Instalacijom dodatka u WordPress admin panelu ili registracijom naloga na potvrdio.online, trgovac (pravno lice ili preduzetnik) izričito i u celosti prihvata ove Uslove poslovanja.",

      sec2_title: "2. Opis usluge i način funkcionisanja",
      sec2_p: "Potvrdio pruža tehničku infrastrukturu i savetodavnu optimizaciju koja presreće WooCommerce porudžbine na checkout-u sa izabranim plaćanjem pouzećem, automatski postavlja status narudžbine na 'On-Hold' i inicira dvosmernu verifikacionu sesiju putem Viber Business API ili SMS fallback kanala radi smanjenja neisporučenih paketa.",

      sec3_title: "3. Kreditni bazen, paketi i platni promet",
      sec3_items: [
        "Trgovac plaća isključivo utrošene verifikacione sesije (Pay-As-You-Go model ili Pro Reserve pretplatu).",
        "Kupljeni verifikacioni krediti nemaju vremensko ograničenje i ne ističu.",
        "Potvrdio ne vrši automatsko skidanje sredstava sa platnih kartica bez prethodnog izričitog odobrenja trgovca.",
        "Sva plaćanja platnim karticama procesiraju se u lokalnoj valuti Republike Srbije (RSD) po zvaničnom srednjem kursu NBS preko ovlašćenih i licenciranih procesora u skladu sa 3D Secure standardima.",
        "Fakturisanje za domaća pravna lica i preduzetnike vrši se e-Fakturom u RSD, odnosno u EUR za inostrane partnere."
      ],

      sec4_title: "4. Obaveze i odgovornosti trgovca (B2B)",
      sec4_p1: "Trgovac je dužan da obezbedi tačne podatke pri registraciji i ispravno podešavanje WordPress okruženja.",
      sec4_p2: "Trgovac potvrđuje da je prikupljanje brojeva telefona na checkout stranici usklađeno sa Zakonom o zaštiti podataka o ličnosti (ZZPL) i da se poruke koriste isključivo za realizaciju narudžbine bez reklamnog spama.",

      sec5_title: "5. Dostupnost servisa i SLA (99.9%)",
      sec5_p: "Potvrdio garantuje 99.9% mesečne dostupnosti API gateway infrastrukture. U slučaju uočenih prekida na strani primarnih operatera, sistem automatski preusmerava saobraćaj na rezervne rute.",

      sec6_title: "6. Ograničenje odgovornosti",
      sec6_p: "Potvrdio pruža rešenja za optimizaciju komunikacije i ne snosi odgovornost za eventualna kašnjenja ili neisporuku paketa uzrokovanu propustima kurirskih službi (Post Express, Bex, D Express, Cargo), niti za odluku krajnjeg kupca da odbije preuzimanje paketa uprkos verifikaciji.",

      sec7_title: "7. Merodavno pravo i nadležnost suda",
      sec7_p: "Na ove Uslove primenjuje se pravo Republike Srbije (Zakon o obligacionim odnosima). Eventualni sporovi rešavaće se mirnim putem, a u suprotnom nadležan je privredni sud u Novom Sadu.",
      btn_close: "Zatvori"
    },
    mk: {
      title: "Општи Услови за Користење",
      subtitle: "Договор за консалтинг и дигитални решенија за оптимизација на WooCommerce испорака",
      updated: "Последно ажурирање: Септември 2026.",
      merchant_info: "Правен субјект: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, МБ: 68423937, ПИБ: 115512104, Bulevar Patrijarha Pavla 91, Нови Сад, Србија",
      sec1_title: "1. Општи одредби и прифаќање",
      sec1_p1: "Овие Услови за користење го регулираат пристапот и употребата на Potvrdio сервисот – консалтинг и дигитална алатка за автоматска верификација на плаќања при преземање (COD). Услугите ги обезбедува GIZEM ORUM PR Konsultantske aktivnosti Lilanova.",
      sec1_p2: "Со инсталација на приклучокот или регистрација на potvrdio.online, трговецот ги прифаќа овие Услови во целост.",

      sec2_title: "2. Опис на услугата",
      sec2_p: "Potvrdio обезбедува техничка инфраструктура која ги пресретнува WooCommerce нарачките со плаќање при преземање, го поставува нивниот статус на 'On-Hold' и иницира двонасочна Viber/SMS верификациска сесија.",

      sec3_title: "3. Кредитен базен и наплата",
      sec3_items: [
        "Трговецот плаќа исклучиво за потрошени верификациски сесии (PAYG модел или Pro Reserve план).",
        "Купените кредити немаат рок на траење и никогаш не истекуваат.",
        "Potvrdio не врши автоматско одземање од картички без претходно одобрение.",
        "Плаќањата со картички се процесираат во локална валута (RSD) според официјален курс на НБС преку лиценцирани процесори со 3D Secure стандард.",
        "Фактурирањето за правни лица се врши со e-Faktura во RSD/MKD/EUR."
      ],

      sec4_title: "4. Обврски на трговецот (B2B)",
      sec4_p1: "Трговецот е должен да обезбеди точни податоци при регистрација.",
      sec4_p2: "Трговецот потврдува дека собирањето на броеви е во согласност со законите за заштита на податоци и дека пораките не се за реклами.",

      sec5_title: "5. Достапност на сервисот (SLA 99.9%)",
      sec5_p: "Potvrdio гарантира 99.9% месечна достапност на API gateway инфраструктурата.",

      sec6_title: "6. Ограничување на одговорност",
      sec6_p: "Potvrdio не сноси одговорност за доцнења на курирските служби ниту за одлуката на купувачот да го одбие пакетот на врата и покрај потврдата.",

      sec7_title: "7. Мердоавно право",
      sec7_p: "За сите спорови меродавно е правото на Република Србија (Закон за облигациони односи).",
      btn_close: "Затвори"
    },
    en: {
      title: "Terms of Service",
      subtitle: "Service agreement for COD logistics optimization consultancy and digital tools",
      updated: "Last updated: September 2026.",
      merchant_info: "Legal Entity: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, Reg. No: 68423937, Tax ID (PIB): 115512104, Bulevar Patrijarha Pavla 91, Novi Sad, Serbia",
      sec1_title: "1. General Terms & Agreement Acceptance",
      sec1_p1: "These Terms and Conditions govern access to Potvrdio services – logistics consultancy for delivery optimization paired with software integration for automated Cash on Delivery (COD) order verification for WooCommerce. Services provided by GIZEM ORUM PR Konsultantske aktivnosti Lilanova.",
      sec1_p2: "By installing the WordPress plugin or creating an account on potvrdio.online, the merchant (business entity / entrepreneur) explicitly agrees to these Terms in full.",

      sec2_title: "2. Service Description & Operation",
      sec2_p: "Potvrdio provides technical infrastructure intercepting WooCommerce COD orders at checkout, setting order status to 'On-Hold', and triggering a 2-way Viber Business API or SMS fallback address verification session to prevent return parcels.",

      sec3_title: "3. Credit Pool, PAYG & Invoicing",
      sec3_items: [
        "Merchants pay strictly per verified session (Pay-As-You-Go model or Pro Reserve plan).",
        "Purchased verification credits have no expiration date and never expire.",
        "Potvrdio executes ZERO automated recurring credit card charges without explicit consent.",
        "Credit card payments are settled in Serbian Dinar (RSD) via NBS daily middle exchange rates through licensed 3D Secure payment processors.",
        "Company invoicing is issued in RSD or EUR via compliant fiscal invoices."
      ],

      sec4_title: "4. Merchant Compliance & Responsibilities (B2B)",
      sec4_p1: "The merchant is responsible for accurate account registration details and correct WordPress configuration.",
      sec4_p2: "The merchant warrants that checkout phone collection complies with Data Protection Laws (ZZPL / GDPR) and that messages remain non-promotional.",

      sec5_title: "5. Service Availability & SLA (99.9%)",
      sec5_p: "Potvrdio guarantees 99.9% monthly API gateway availability with automated SMS fallback routing.",

      sec6_title: "6. Limitation of Liability",
      sec6_p: "Potvrdio shall not be liable for delivery delays caused by external courier networks (Post Express, Bex, D Express, Cargo) or buyer doorstep refusal post-verification.",

      sec7_title: "7. Governing Law & Jurisdiction",
      sec7_p: "These Terms shall be governed by the laws of the Republic of Serbia (Law on Contracts and Torts - ZOO). Commercial disputes shall be resolved by the competent court in Novi Sad.",
      btn_close: "Close"
    }
  };

  const t = content[lang] || content.sr;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-surface border border-theme rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden font-sans text-xs text-theme-secondary animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-surface-subtle px-4 sm:px-6 py-3.5 border-b border-theme flex items-center justify-between shrink-0 font-sans">
          <div className="flex items-center gap-2 text-teal-600 dark:text-[#14B8A6]">
            <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-theme-primary tracking-tight">{t.title}</h2>
              <p className="text-[10px] text-theme-muted font-sans">{t.updated}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-theme-muted hover:text-theme-primary transition p-1.5 rounded-lg hover:bg-surface-subtle cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto touch-scroll leading-relaxed text-left">
          <div className="p-3.5 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 rounded-xl text-teal-800 dark:text-teal-300 text-[11px] font-sans flex items-start gap-2.5">
            <Scale className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <span>{t.subtitle}</span>
          </div>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec1_title}
            </h3>
            <p className="text-theme-secondary text-[11px] leading-relaxed">{t.sec1_p1}</p>
            <p className="text-theme-muted text-[11px] leading-relaxed">{t.sec1_p2}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec2_title}
            </h3>
            <p className="text-theme-secondary text-[11px] leading-relaxed">{t.sec2_p}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec3_title}
            </h3>
            <ul className="space-y-1.5 text-[11px] text-theme-secondary pl-1">
              {t.sec3_items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec4_title}
            </h3>
            <p className="text-theme-secondary text-[11px] leading-relaxed">{t.sec4_p1}</p>
            <p className="text-theme-muted text-[11px] leading-relaxed">{t.sec4_p2}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec5_title}
            </h3>
            <p className="text-theme-secondary text-[11px] leading-relaxed">{t.sec5_p}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec6_title}
            </h3>
            <p className="text-theme-secondary text-[11px] leading-relaxed">{t.sec6_p}</p>
          </section>

          <section className="space-y-2 border-t border-theme pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec7_title}
            </h3>
            <p className="text-theme-secondary text-[11px] leading-relaxed">{t.sec7_p}</p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-surface-subtle px-5 py-3 border-t border-theme flex items-center justify-between text-[11px] font-sans shrink-0">
          <span className="text-theme-muted">Potvrdio Merchant Terms Protection</span>
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
