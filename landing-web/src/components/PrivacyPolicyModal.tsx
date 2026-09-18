import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

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
      subtitle: "Usklađeno sa Članom 12 ZZPL RS (Sl. glasnik 87/2018), ZZLP MK i EU GDPR (Art. 6.1.b)",
      updated: "Poslednje ažuriranje: Septembar 2026.",
      sec1_title: "1. Opšte odredbe i pravni osnov obrade",
      sec1_p1: "Potvrdio platforma i WooCommerce eklentija funkcionišu u potpunoj usklađenosti sa Zakonom o zaštiti podataka o ličnosti RS (ZZPL RS, Službeni glasnik 87/2018), Zakonom o zaštiti ličnih podataka Severne Makedonije (ZZLP MK) i Opštom uredbom o zaštiti podataka Evropske unije (EU GDPR 2016/679).",
      sec1_p2: "Obrada brojeva telefona i adresa kupaca vrši se isključivo na osnovu Člana 12, Stav 1, Tačka 2 ZZPL RS i Člana 6(1)(b) EU GDPR - obrada je pravno neophodna za izvršenje ugovora o kupoprodaji na daljinu (isporuka naručene robe pouzećem). Dodatna saglasnost za marketing nije potrebna jer se poruke ne koriste u reklamne ili promotivne svrhe.",
      
      sec2_title: "2. Podaci koje prikupljamo i obrađujemo",
      sec2_items: [
        "Broj telefona kupca (samostalno unet na WooCommerce checkout stranici trgovca).",
        "Adresa za dostavu pošiljke (ulica, broj, sprat, broj stana, interfon/napomena za kurira).",
        "ID Narudžbine i iznos otkupnine (COD vrenost u RSD/MKD/EUR).",
        "Jednokratni kriptografski token sesije (HMAC-SHA256) za passwordless verifikaciju adrese."
      ],

      sec3_title: "3. Svrha obrade i zabrana marketing spama",
      sec3_p: "Prikupljeni podaci se koriste isključivo za slanje dvosmerne Viber/SMS verifikacione sesije kupcu radi potvrde tačnosti adrese pre predaje paketa kurirskoj službi. Potvrdio nudi garanciju da se podaci kupaca nikada ne koriste za slanje reklamnih SMS poruka, neovlašćeno kontaktiranje niti profilisanje.",

      sec4_title: "4. Automatsko brisanje i retention politika (30 Dana)",
      sec4_p: "U skladu sa načelom ograničenja čuvanja podataka (Član 31 ZZPL / GDPR Art. 5(1)(e)), svi brojevi telefona, adrese i verifikacioni tokeni se automatski anonimizuju i trajno brišu sa procesnih servera u roku od tačno 30 dana nakon uspešnog uručenja pošiljke.",

      sec5_title: "5. Sigurnosna arhitektura i treća lica",
      sec5_p1: "Svi podaci u tranzitu su zaštićeni SSL/TLS 1.3 enkripcijom. Izmena adrese se vrši putem passwordless linka zaštićenog jednokratnim HMAC tokenom. Potvrdio nema pristup privatnim Viber prepiskama kupca niti bankarskim karticama.",
      sec5_p2: "Podaci se ne prodaju niti dele sa trećim licima. Jedini eksterni obrađivači su zvanični Viber Business API provajderi i telekom operateri isključivo u svrhu isporuke verifikacione poruke.",

      sec6_title: "6. Prava lica na koje se podaci odnose",
      sec6_p: "Kupac u svakom trenutku ima pravo na uvid u svoje podatke, ispravku neaccurate adrese, brisanje pre isteka roka od 30 dana i podnošenje prigovora Nadzornom organu (Poverenik za informacije od javnog značaja i zaštitu podataka o ličnosti RS). Za zahteve pisati na: privacy@potvrdio.online.",
      btn_close: "Zatvori"
    },
    mk: {
      title: "Политика за Приватност и Заштита на Податоци",
      subtitle: "Усогласено со Член 10 од ZZLP MK (АЗЛП), ZZPL RS и EU GDPR (Art. 6.1.b)",
      updated: "Последно ажурирање: Септември 2026.",
      sec1_title: "1. Општи одредби и правен основ",
      sec1_p1: "Potvrdio платформата и WooCommerce приклучокот функционираат во целосна усогласеност со Законот за заштита на личните податоци на С. Македонија (АЗЛП), ZZPL Србија и Општата уредба за заштита на податоци на ЕУ (GDPR 2016/679).",
      sec1_p2: "Обработката на телефонските броеви и адреси се врши исклучиво врз основа на Член 10 од Законот за заштита на личните податоци - обработката е законски неопходна за исполнување на купопродажниот договор за достава на стока при преземање (COD).",
      
      sec2_title: "2. Податоци кои се обработуваат",
      sec2_items: [
        "Телефонски број на купувачот ( внесен при WooCommerce checkout).",
        "Адреса за достава (улица, број, кат, стан, интерфон/забелешка за курирот).",
        "ИД на нарачката и износ на откупнина (MKD/RSD/EUR).",
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
      sec6_p: "Купувачот има право на увид, корекција и бришење на податоците. За сите барања обратете се на: privacy@potvrdio.online.",
      btn_close: "Затвори"
    },
    en: {
      title: "Privacy & Data Protection Policy",
      subtitle: "Compliant with Serbian ZZPL Art. 12, MK ZZLP & EU GDPR (Art. 6.1.b)",
      updated: "Last updated: September 2026.",
      sec1_title: "1. General Provisions & Legal Basis",
      sec1_p1: "The Potvrdio platform and WooCommerce plugin operate in full compliance with the Serbian Personal Data Protection Law (ZZPL RS 87/2018), North Macedonia's Personal Data Protection Law (ZZLP MK), and the European Union General Data Protection Regulation (EU GDPR 2016/679).",
      sec1_p2: "Processing customer phone numbers and shipping addresses is conducted strictly pursuant to Article 12(1)(2) of ZZPL RS and Article 6(1)(b) of the EU GDPR - processing is legally necessary for executing remote sales contracts (delivering Cash on Delivery goods). Additional marketing opt-in is not required as messages are non-promotional.",
      
      sec2_title: "2. Collected & Processed Data Categories",
      sec2_items: [
        "Customer phone number (voluntarily submitted at WooCommerce checkout).",
        "Physical shipping address (street, number, floor, apartment, intercom note).",
        "Order ID and Cash on Delivery (COD) order amount (RSD / MKD / EUR).",
        "Single-use cryptographic session token (HMAC-SHA256) for passwordless verification."
      ],

      sec3_title: "3. Purpose of Processing & No Marketing Spam",
      sec3_p: "Collected data is utilized strictly to execute a 2-way Viber/SMS verification session confirming address accuracy prior to courier dispatch. Potvrdio guarantees that buyer data is never used for marketing SMS blasts, unauthorized contact, or cross-merchant profiling.",

      sec4_title: "4. Automatic Data Erasure & Retention (30 Days)",
      sec4_p: "In compliance with the storage limitation principle (GDPR Art. 5(1)(e) / ZZPL Art. 31), all phone numbers, physical addresses, and single-use tokens are automatically anonymized and permanently purged from processing servers exactly 30 days post-delivery.",

      sec5_title: "5. Security Architecture & Third Parties",
      sec5_p1: "All data in transit is protected using TLS 1.3 encryption. Address edits occur via single-use passwordless HMAC tokens. Potvrdio has zero access to private Viber messages or banking payment cards.",
      sec5_p2: "Data is never sold or shared with advertising networks. The only third-party processors are authorized Viber Business API aggregators and SMS gateways strictly for message delivery.",

      sec6_title: "6. Data Subject Rights & Contact",
      sec6_p: "Buyers reserve the right to access, rectify, or request early erasure of their data prior to the 30-day purge, or lodge a complaint with the National Data Protection Commissioner. For inquiries: privacy@potvrdio.online.",
      btn_close: "Close"
    }
  };

  const t = content[lang];

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
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto touch-scroll leading-relaxed">
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
            <ul className="space-y-1.5 text-[11px] text-theme-secondary">
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
