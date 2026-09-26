import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, ExternalLink } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'sr' | 'mk' | 'en';
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const content = {
    sr: {
      title: "Politika Privatnosti i Zaštite Podataka",
      subtitle: "Usklađeno sa propisima o zaštiti podataka o ličnosti RS (ZZPL), BiH (ZZLP), MK (ZZLP) i EU GDPR",
      updated: "Poslednje ažuriranje: Septembar 2026.",
      merchant_info: "Rukovalac podacima: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, MB: 68423937, PIB: 115512104, Bulevar Patrijarha Pavla 91, sprat 4, stan 44, 21000 Novi Sad, Srbija",
      sec1_title: "1. Opšte odredbe i pravni osnov obrade",
      sec1_p1: "Potvrdio funkcioniše u potpunoj usklađenosti sa Zakonom o zaštiti podataka o ličnosti RS (ZZPL RS, Službeni glasnik 87/2018), Zakonom o zaštiti ličnih podataka Bosne i Hercegovine (ZZLP BiH, Sl. glasnik BiH br. 49/06, 76/11 i 89/11), Zakonom o zaštiti ličnih podataka Severne Makedonije (ZZLP MK) i Opštom uredbom o zaštiti podataka Evropske unije (EU GDPR 2016/679). Rukovalac obrade podataka je preduzetnik GIZEM ORUM PR Konsultantske aktivnosti Lilanova.",
      sec1_p2: "Obrada brojeva telefona i adresa kupaca vrši se isključivo na osnovu Člana 12, Stav 1, Tačka 2 ZZPL RS, člana 6 ZZLP BiH i Člana 6(1)(b) EU GDPR - obrada je pravno neophodna za izvršenje ugovora o kupoprodaji na daljinu (isporuka naručene robe pouzećem). Dodatna saglasnost za marketing nije potrebna jer se podaci ne koriste u reklamne ili promotivne svrhe.",
      
      sec2_title: "2. Podaci koje prikupljamo i obrađujemo",
      sec2_items: [
        "Broj telefona kupca (samostalno unet na WooCommerce checkout stranici trgovca).",
        "Adresa za dostavu pošiljke (ulica, broj, sprat, broj stana, interfon/napomena za kurira).",
        "ID Narudžbine i iznos otkupnine (COD vrednost u RSD/BAM/MKD/EUR).",
        "Jednokratni kriptografski token sesije (HMAC-SHA256) za passwordless verifikaciju adrese."
      ],

      sec3_title: "3. Svrha obrade i zabrana marketing spama",
      sec3_p: "Prikupljeni podaci se koriste isključivo za slanje dvosmerne Viber/SMS verifikacione sesije kupcu radi potvrde tačnosti adrese pre predaje paketa kurirskoj službi. Potvrdio garantuje da se podaci kupaca nikada ne koriste za slanje reklamnih SMS poruka, neovlašćeno kontaktiranje niti profilisanje.",

      sec4_title: "4. Automatsko brisanje i retention politika (30 Dana)",
      sec4_p: "U skladu sa načelom ograničenja čuvanja podataka (Član 31 ZZPL RS, ZZLP BiH / GDPR Art. 5(1)(e)), svi brojevi telefona, adrese i verifikacioni tokeni se automatski anonimizuju i trajno brišu sa procesnih servera u roku od tačno 30 dana nakon uspešnog uručenja pošiljke.",

      sec5_title: "5. Sigurnosna arhitektura i treća lica",
      sec5_p1: "Svi podaci u tranzitu su zaštićeni SSL/TLS 1.3 enkripcijom. Izmena adrese se vrši putem passwordless linka zaštićenog jednokratnim HMAC tokenom. Potvrdio nema pristup privatnim Viber prepiskama kupca niti brojevima bankarskih kartica (koje se obrađuju u zaštićenom sistemu ovlašćenih procesora platnih kartica).",
      sec5_p2: "Podaci se ne prodaju niti dele sa trećim licima. Jedini eksterni obrađivači su zvanični Viber Business API provajderi i telekom operateri isključivo u svrhu isporuke verifikacione poruke.",

      sec6_title: "6. Prava lica na koje se podaci odnose",
      sec6_p: "Kupac u svakom trenutku ima pravo na uvid u svoje podatke, ispravku netačne adrese, brisanje pre isteka roka od 30 dana i podnošenje prigovora nadležnom nadzornom organu. Zahteve uputiti na: podrska@potvrdio.online.",

      sec7_title: "7. Zvanični pravni registri i nadzorni organi",
      sec7_p: "Pravni osnov i rad platforme verifikovani su u skladu sa zvaničnim državnim registrima i zakonodavstvom:",
      registries: [
        {
          name: "Službeni glasnik RS (ZZPL 87/2018)",
          sub: "Pravno-informacioni sistem Republike Srbije (Čl. 12)",
          url: "https://www.pravno-informacioni-sistem.rs/SlGlasnikPortal/eli/rep/sgrs/skupstina/zakon/2018/87/1/reg",
          badge: "Sl. Glasnik RS"
        },
        {
          name: "Poverenik RS (poverenik.rs)",
          sub: "Poverenik za informacije od javnog značaja i zaštitu podataka o ličnosti",
          url: "https://www.poverenik.rs/sr-lat/",
          badge: "Nadzorni organ RS"
        },
        {
          name: "AZLP BiH (azlp.ba)",
          sub: "Agencija za zaštitu ličnih podataka u Bosni i Hercegovini",
          url: "http://www.azlp.ba",
          badge: "Nadzorni organ BiH"
        },
        {
          name: "EUR-Lex EU GDPR (2016/679)",
          sub: "Evropska unija - Član 6(1)(b) Izvršenje ugovora",
          url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679",
          badge: "EU CELEX"
        },
        {
          name: "AZLP Severna Makedonija (azlp.mk)",
          sub: "Агенција за заштита на личните податоци",
          url: "https://azlp.mk",
          badge: "АЗЛП МК"
        }
      ],
      btn_close: "Zatvori"
    },
    mk: {
      title: "Политика за Приватност и Заштита на Податоци",
      subtitle: "Усогласено со прописите за заштита на личните податоци во регионот и EU GDPR",
      updated: "Последно ажурирање: Септември 2026.",
      merchant_info: "Контролор на податоци: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, МБ: 68423937, ПИБ: 115512104, Bulevar Patrijarha Pavla 91, стан 44, 21000 Нови Сад, Србија",
      sec1_title: "1. Општи одредби и правен основ",
      sec1_p1: "Potvrdio платформата функционира во целосна усогласеност со Законот за заштита на личните податоци на С. Македонија (АЗЛП), ZZPL Србија, ZZLP БиХ и Општата уредба за заштита на податоци на ЕУ (GDPR 2016/679). Контролор на обработката е GIZEM ORUM PR Konsultantske aktivnosti Lilanova.",
      sec1_p2: "Обработката на телефонските броеви и адреси се врши исклучиво врз основа на законските одредби за исполнување на купопродажниот договор за достава на стока при преземање (COD). Дополнителна согласност за маркетинг не е потребна бидејќи пораките не се промотивни.",
      
      sec2_title: "2. Податоци кои се обработуваат",
      sec2_items: [
        "Телефонски број на купувачот ( внесен при WooCommerce checkout).",
        "Адреса за достава (улица, број, кат, стан, интерфон/забелешка за курирот).",
        "ИД на нарачката и износ на откупнина (MKD/RSD/BAM/EUR).",
        "Еднократен криптографски токен (HMAC-SHA256) за верификација."
      ],

      sec3_title: "3. Цел на обработка и забрана за спам",
      sec3_p: "Податоците се користат исклучиво за испраќање на двонасочна Viber/SMS верификациска сесија со цел потврда на адресата пред предажба на курир. Податоците никогаш не се користат за маркетинг или реклами.",

      sec4_title: "4. Автоматско бришење и retention (30 Дена)",
      sec4_p: "Сите телефонски броеви, адреси и токени автоматски се анонимизираат и трајно се бришат од серверите во рок од 30 дена по доставата на пратката.",

      sec5_title: "5. Безбедност и трети лица",
      sec5_p1: "Податоците се заштитени со SSL/TLS 1.3 енкрипција. Измената на адреса се врши преку еднократен токен. Potvrdio нема пристап до приватни Viber пораки или картички.",
      sec5_p2: "Податоците не се продаваат ниту споделуваат. Единствени обработувачи се овластените Viber Business API провајдери за достава на пораката.",

      sec6_title: "6. Права на купувачите",
      sec6_p: "Купувачот има право на увид, корекција и бришење на податоците. За сите барања обратете се на: podrska@potvrdio.online.",

      sec7_title: "7. Официјални правни регистри и надзорни органи",
      sec7_p: "Правната рамка и работата на платформата се верификувани според официјалните државни регистри:",
      registries: [
        {
          name: "АЗЛП Северна Македонија (azlp.mk)",
          sub: "Агенција за заштита на личните податоци на РСМ",
          url: "https://azlp.mk",
          badge: "АЗЛП МК"
        },
        {
          name: "EUR-Lex EU GDPR (2016/679)",
          sub: "Европска Унија - Член 6(1)(b) Извршување договор",
          url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679",
          badge: "EU CELEX"
        },
        {
          name: "Службен весник на РС (ZZPL 87/2018)",
          sub: "Правно-информативен систем на Република Србија",
          url: "https://www.pravno-informacioni-sistem.rs/SlGlasnikPortal/eli/rep/sgrs/skupstina/zakon/2018/87/1/reg",
          badge: "Sl. Glasnik RS"
        },
        {
          name: "Повереник за заштита на податоци РС",
          sub: "Надзорен орган на Република Србија (poverenik.rs)",
          url: "https://www.poverenik.rs/sr-lat/",
          badge: "poverenik.rs"
        },
        {
          name: "АЗЛП Босна и Херцеговина (azlp.ba)",
          sub: "Агенција за заштита на личните податоци во БиХ",
          url: "http://www.azlp.ba",
          badge: "azlp.ba"
        }
      ],
      btn_close: "Затвори"
    },
    en: {
      title: "Privacy & Data Protection Policy",
      subtitle: "Compliant with Serbian ZZPL, BiH ZZLP, MK ZZLP & EU GDPR (Art. 6.1.b)",
      updated: "Last updated: September 2026.",
      merchant_info: "Data Controller: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, Reg. No: 68423937, Tax ID (PIB): 115512104, Bulevar Patrijarha Pavla 91, Apt 44, 21000 Novi Sad, Serbia",
      sec1_title: "1. General Provisions & Legal Basis",
      sec1_p1: "The Potvrdio platform and WooCommerce plugin operate in full compliance with the Serbian Personal Data Protection Law (ZZPL RS 87/2018), Bosnia and Herzegovina's Law on Personal Data Protection (ZZLP BiH 49/06), North Macedonia's Personal Data Protection Law (ZZLP MK), and the European Union General Data Protection Regulation (EU GDPR 2016/679). Data Controller: GIZEM ORUM PR Konsultantske aktivnosti Lilanova.",
      sec1_p2: "Processing customer phone numbers and shipping addresses is conducted strictly pursuant to Article 12(1)(2) of ZZPL RS, Article 6 of ZZLP BiH, and Article 6(1)(b) of the EU GDPR - processing is legally necessary for executing remote sales contracts (delivering Cash on Delivery goods). Additional marketing opt-in is not required as messages are strictly operational.",
      
      sec2_title: "2. Collected & Processed Data Categories",
      sec2_items: [
        "Customer phone number (voluntarily submitted at WooCommerce checkout).",
        "Physical shipping address (street, number, floor, apartment, intercom note).",
        "Order ID and Cash on Delivery (COD) order amount (RSD / BAM / MKD / EUR).",
        "Single-use cryptographic session token (HMAC-SHA256) for passwordless verification."
      ],

      sec3_title: "3. Purpose of Processing & No Marketing Spam",
      sec3_p: "Collected data is utilized strictly to execute a 2-way Viber/SMS verification session confirming address accuracy prior to courier dispatch. Potvrdio guarantees that buyer data is never used for marketing SMS blasts, unauthorized contact, or cross-merchant profiling.",

      sec4_title: "4. Automatic Data Erasure & Retention (30 Days)",
      sec4_p: "In compliance with the storage limitation principle (GDPR Art. 5(1)(e) / ZZPL Art. 31 / ZZLP BiH Art. 11), all phone numbers, physical addresses, and single-use tokens are automatically anonymized and permanently purged from processing servers exactly 30 days post-delivery.",

      sec5_title: "5. Security Architecture & Third Parties",
      sec5_p1: "All data in transit is protected using TLS 1.3 encryption. Address edits occur via single-use passwordless HMAC tokens. Potvrdio has zero access to private Viber messages or banking payment cards (securely processed via licensed payment gateway processors).",
      sec5_p2: "Data is never sold or shared with advertising networks. The only third-party processors are authorized Viber Business API aggregators and SMS gateways strictly for message delivery.",

      sec6_title: "6. Data Subject Rights & Contact",
      sec6_p: "Buyers reserve the right to access, rectify, or request early erasure of their data prior to the 30-day purge, or lodge a complaint with their National Data Protection Authority. For inquiries: podrska@potvrdio.online.",

      sec7_title: "7. Official Legal Registries & Supervisory Authorities",
      sec7_p: "The legal foundation and platform operations are fully referenced and compliant with official national registries:",
      registries: [
        {
          name: "Official Gazette of RS (ZZPL 87/2018)",
          sub: "Legal Information System of the Republic of Serbia (Art. 12)",
          url: "https://www.pravno-informacioni-sistem.rs/SlGlasnikPortal/eli/rep/sgrs/skupstina/zakon/2018/87/1/reg",
          badge: "Official Gazette"
        },
        {
          name: "RS Commissioner for Data Protection",
          sub: "National Supervisory Authority (poverenik.rs)",
          url: "https://www.poverenik.rs/en/",
          badge: "poverenik.rs"
        },
        {
          name: "EU GDPR EUR-Lex (2016/679)",
          sub: "European Union - Article 6(1)(b) Contract Performance",
          url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679",
          badge: "EU CELEX"
        },
        {
          name: "BiH Data Protection Agency (azlp.ba)",
          sub: "Agency for Personal Data Protection in Bosnia and Herzegovina",
          url: "http://www.azlp.ba",
          badge: "azlp.ba"
        },
        {
          name: "AZLP North Macedonia (azlp.mk)",
          sub: "Personal Data Protection Agency of North Macedonia",
          url: "https://azlp.mk/en",
          badge: "azlp.mk"
        }
      ],
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
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] font-sans flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
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
            <ul className="space-y-1.5 text-[11px] text-theme-secondary pl-1">
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
            <p className="text-theme-secondary text-[11px] leading-relaxed">{t.sec3_p}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec4_title}
            </h3>
            <p className="text-theme-secondary text-[11px] leading-relaxed">{t.sec4_p}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec5_title}
            </h3>
            <p className="text-theme-secondary text-[11px] leading-relaxed">{t.sec5_p1}</p>
            <p className="text-theme-muted text-[11px] leading-relaxed">{t.sec5_p2}</p>
          </section>

          <section className="space-y-2 border-t border-theme pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec6_title}
            </h3>
            <p className="text-theme-secondary text-[11px] leading-relaxed">{t.sec6_p}</p>
          </section>

          {/* Section 7: Official Legal Evidence & Supervisory Authorities */}
          <section className="space-y-3 border-t border-theme pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec7_title}
            </h3>
            <p className="text-theme-muted text-[11px] leading-relaxed">{t.sec7_p}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {t.registries.map((reg, idx) => (
                <a
                  key={idx}
                  href={reg.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-surface-subtle border border-theme hover:border-teal-500/50 transition flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-theme-primary group-hover:text-teal-600 dark:group-hover:text-[#14B8A6] text-[11px] line-clamp-1">
                      {reg.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-theme-muted group-hover:text-teal-600 dark:group-hover:text-[#14B8A6] shrink-0 ml-1" />
                  </div>
                  <p className="text-[10px] text-theme-muted mt-1 leading-tight line-clamp-2">{reg.sub}</p>
                  <div className="mt-2 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                    <span>{reg.badge}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-surface-subtle px-5 py-3 border-t border-theme flex items-center justify-between text-[11px] font-sans shrink-0">
          <span className="text-theme-muted">Potvrdio Legal & Compliance Guard</span>
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
