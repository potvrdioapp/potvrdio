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
      title: "Uslovi Korišćenja SaaS Platforme i Eklentije",
      subtitle: "Pravni ugovor o korišćenju Potvrdio WooCommerce COD servisa za trgovce",
      updated: "Poslednje ažuriranje: Septembar 2026.",
      sec1_title: "1. Opšte odredbe i prihvatanje uslova",
      sec1_p1: "Ovi Uslovi korišćenja regulišu pristup i upotrebu Potvrdio SaaS platforme i WooCommerce dodatka (eklentije) namenjenog za automatizovanu verifikaciju porudžbina sa plaćanjem pouzećem (COD) u regionu Zapadnog Balkana.",
      sec1_p2: "Instalacijom dodatka u WordPress admin panelu ili registracijom naloga na potvrdio.online, trgovac izričito prihvata ove Uslove u celosti.",

      sec2_title: "2. Opis usluge i način funkcionisanja",
      sec2_p: "Potvrdio pruža tehničku infrastrukturu koja presreće WooCommerce porudžbine na checkout-u sa izabranim plaćanjem pouzećem, automatski postavlja status narudžbine na 'On-Hold' i inicira dvosmernu verifikacionu sesiju putem Viber Business API ili SMS fallback kanala.",

      sec3_title: "3. Kreditni bazen, PAYG model i plaćanje",
      sec3_items: [
        "Trgovac plaća isključivo utrošene verifikacione sesije (Pay-As-You-Go model ili Pro Reserve pretplatu).",
        "Kupljeni verifikacioni krediti nema rok trajanja i ne ističu.",
        "Potvrdio ne vrši automatsko skidanje sredstava sa platnih kartica bez prethodnog izričitog odobrenja trgovca.",
        "Fakturisanje za pravna lica se vrši e-Fakturom u RSD po srednjem kursu NBS ili u EUR za inostrane partnere."
      ],

      sec4_title: "4. Obaveze i odgovornosti trgovca",
      sec4_p1: "Trgovac je dužan da obezbedi tačne podatke pri registraciji i ispravno podešavanje WordPress okruženja.",
      sec4_p2: "Trgovac potvrđuje da je prikupljanje brojeva telefona na checkout stranici usklađeno sa Zakonom o zaštiti podataka o ličnosti RS (ZZPL Član 12) i da se poruke ne koriste u reklamne ili spammerske svrhe.",

      sec5_title: "5. Dostupnost servisa i SLA (99.9%)",
      sec5_p: "Potvrdio garantuje 99.9% mesečne dostupnosti API gateway infrastrukture. U slučaju uočenih prekida na strani Viber ili SMS operatera, sistem automatski preusmerava saobraćaj na rezervne rute.",

      sec6_title: "6. Ograničenje odgovornosti",
      sec6_p: "Potvrdio ne snosi odgovornost za eventualna kašnjenja ili neisporuku paketa uzrokovanu greškama kurirskih službi (Post Express, Bex, D Express, Cargo), niti za odluku krajnjeg kupca da odbije preuzimanje paketa na vratima uprkos prethodno izvršenoj Viber verifikaciji.",

      sec7_title: "7. Merodavno pravo i sudska nadležnost",
      sec7_p: "Na ove Uslove primenjuje se pravo Republike Srbije. Eventualni sporovi rešavaće se mirnim putem, a u suprotnom nadležan je stvarno odgovarajući sud u Novom Sadu / Beogradu.",
      btn_close: "Zatvori"
    },
    mk: {
      title: "Услови за Користење на SaaS Платформата",
      subtitle: "Правен договор за користење на Potvrdio WooCommerce COD сервисот",
      updated: "Последно ажурирање: Септември 2026.",
      sec1_title: "1. Општи одредби и прифаќање",
      sec1_p1: "Овие Услови за користење го регулираат пристапот и употребата на Potvrdio SaaS платформата и WooCommerce приклучокот за автоматизирана верификација на плаќања при преземање (COD).",
      sec1_p2: "Со инсталација на приклучокот или регистрација на potvrdio.online, трговецот ги прифаќа овие Услови во целост.",

      sec2_title: "2. Опис на услугата",
      sec2_p: "Potvrdio обезбедува техничка инфраструктура која ги пресретнува WooCommerce нарачките со плаќање при преземање, го поставува нивниот статус на 'On-Hold' и иницира двонасочна Viber/SMS верификациска сесија.",

      sec3_title: "3. Кредитен базен и наплата",
      sec3_items: [
        "Трговецот плаќа исклучиво за потрошени верификациски сесии (PAYG модел).",
        "Купените кредити немаат рок на траење и никогаш не истекуваат.",
        "Potvrdio не врши автоматско одземање од картички без одобрение.",
        "Фактурирањето за правни лица се врши во MKD/RSD/EUR."
      ],

      sec4_title: "4. Обврски на трговецот",
      sec4_p1: "Трговецот е должен да обезбеди точни податоци при регистрација.",
      sec4_p2: "Трговецот потврдува дека собирањето на броеви е во согласност со Законот за заштита на личните податоци (АЗЛП) и дека пораките не се за реклами.",

      sec5_title: "5. Достапност на сервисот (SLA 99.9%)",
      sec5_p: "Potvrdio гарантира 99.9% месечна достапност на API gateway инфраструктурата.",

      sec6_title: "6. Ограничување на одговорност",
      sec6_p: "Potvrdio не сноси одговорност за доцнења на курирските служби ниту за одлуката на купувачот да го одбие пакетот на врата и покрај потврдата.",

      sec7_title: "7. Мердоавно право",
      sec7_p: "За сите спорови меродавно е правото на Република Србија / Северна Македонија.",
      btn_close: "Затвори"
    },
    en: {
      title: "SaaS Platform Terms & Conditions",
      subtitle: "Legal merchant service agreement for Potvrdio WooCommerce COD Engine",
      updated: "Last updated: September 2026.",
      sec1_title: "1. General Terms & Agreement Acceptance",
      sec1_p1: "These Terms and Conditions govern merchant access to and use of the Potvrdio SaaS platform and WooCommerce plugin designed for automated Cash on Delivery (COD) order verification in the Western Balkans.",
      sec1_p2: "By installing the WordPress plugin or creating an account on potvrdio.online, the merchant explicitly agrees to these Terms in full.",

      sec2_title: "2. Service Description & Operation",
      sec2_p: "Potvrdio provides technical infrastructure intercepting WooCommerce COD orders at checkout, setting order status to 'On-Hold', and triggering a 2-way Viber Business API or SMS fallback address verification session.",

      sec3_title: "3. Credit Pool, PAYG & Invoicing",
      sec3_items: [
        "Merchants pay strictly per verified session (Pay-As-You-Go model or Pro Reserve plan).",
        "Purchased verification credits have no expiration date and never expire.",
        "Potvrdio executes ZERO automated recurring credit card charges without consent.",
        "Company invoicing is issued in RSD or EUR via central bank exchange rates."
      ],

      sec4_title: "4. Merchant Compliance & Responsibilities",
      sec4_p1: "The merchant is responsible for accurate account registration details and correct WordPress configuration.",
      sec4_p2: "The merchant warrants that checkout phone collection complies with Data Protection Laws (ZZPL Art. 12 / GDPR Art. 6) and that messages remain non-promotional.",

      sec5_title: "5. Service Availability & SLA (99.9%)",
      sec5_p: "Potvrdio guarantees 99.9% monthly API gateway availability with automated SMS fallback routing.",

      sec6_title: "6. Limitation of Liability",
      sec6_p: "Potvrdio shall not be liable for delivery delays caused by external courier networks (Post Express, Bex, D Express, Cargo) or buyer doorstep refusal post-verification.",

      sec7_title: "7. Governing Law & Jurisdiction",
      sec7_p: "These Terms shall be governed by the laws of the Republic of Serbia. Disputes shall be resolved amicably, or submitted to the competent court in Novi Sad / Belgrade.",
      btn_close: "Close"
    }
  };

  const t = content[lang];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#111827] light:bg-white border border-slate-700/60 light:border-slate-200/80 rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden font-sans text-xs text-slate-300 light:text-slate-700 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#0B0F19] light:bg-slate-50 px-4 sm:px-6 py-3.5 border-b border-slate-800 light:border-slate-200 flex items-center justify-between shrink-0 font-sans">
          <div className="flex items-center gap-2 text-[#14B8A6]">
            <FileText className="w-5 h-5 text-teal-400 light:text-teal-600 shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white light:text-slate-900 tracking-tight">{t.title}</h2>
              <p className="text-[10px] text-slate-400 light:text-slate-500 font-sans">{t.updated}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white light:hover:text-slate-900 transition p-1.5 rounded-lg hover:bg-white/5 light:hover:bg-slate-200/50 cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto touch-scroll leading-relaxed">
          <div className="p-3.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-300 text-[11px] font-sans flex items-start gap-2.5">
            <Scale className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>{t.subtitle}</span>
          </div>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#14B8A6]">
              {t.sec1_title}
            </h3>
            <p className="text-slate-300 text-[11px] leading-relaxed">{t.sec1_p1}</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">{t.sec1_p2}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#14B8A6]">
              {t.sec2_title}
            </h3>
            <p className="text-slate-300 text-[11px] leading-relaxed">{t.sec2_p}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#14B8A6]">
              {t.sec3_title}
            </h3>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {t.sec3_items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#14B8A6]">
              {t.sec4_title}
            </h3>
            <p className="text-slate-300 text-[11px] leading-relaxed">{t.sec4_p1}</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">{t.sec4_p2}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#14B8A6]">
              {t.sec5_title}
            </h3>
            <p className="text-slate-300 text-[11px] leading-relaxed">{t.sec5_p}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#14B8A6]">
              {t.sec6_title}
            </h3>
            <p className="text-slate-300 text-[11px] leading-relaxed">{t.sec6_p}</p>
          </section>

          <section className="space-y-2 border-t border-white/10 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#14B8A6]">
              {t.sec7_title}
            </h3>
            <p className="text-slate-300 text-[11px] leading-relaxed">{t.sec7_p}</p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-[#0B0F19] px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-sans shrink-0">
          <span className="text-slate-400">Potvrdio Merchant Terms Protection</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
          >
            {t.btn_close}
          </button>
        </div>

      </div>
    </div>
  );
};
