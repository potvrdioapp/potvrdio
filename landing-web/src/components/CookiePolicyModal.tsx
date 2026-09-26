import React from 'react';
import { X, Cookie, CheckCircle2 } from 'lucide-react';

interface CookiePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'sr' | 'mk' | 'en';
}

export const CookiePolicyModal: React.FC<CookiePolicyModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const content = {
    sr: {
      title: "Politika Kolačića (Cookie Policy)",
      subtitle: "Transparentna upotreba kolačića i lokalnog skladišta u skladu sa ZZPL i GDPR regulativom",
      updated: "Poslednje ažuriranje: Septembar 2026.",
      merchant_info: "Pravno lice: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, MB: 68423937, PIB: 115512104, Novi Sad, Srbija",

      sec1_title: "1. Šta su kolačići (cookies)?",
      sec1_p: "Kolačići su male tekstualne datoteke koje veb-sajt čuva na vašem uređaju (računar, tablet ili pametni telefon) prilikom posete. Oni omogućavaju sajtu da zapamti vaše postavke (npr. izabrani jezik, temu prikaza) tokom određenog vremenskog perioda kako ih ne biste morali ponovo unositi pri svakom povratku na stranicu.",

      sec2_title: "2. Vrste kolačića koje Potvrdio koristi",
      sec2_items: [
        "Neophodni (funkcionalni) kolačići: Ovi kolačići su ključni za ispravno funkcionisanje sajta. Koriste se za pamćenje izabranog jezika (srpski/makedonski/engleski), tamne ili svetle teme, kao i za bezbednosne tokene sesije (CSRF zaštita).",
        "Analitički i performantni kolačići: Služe isključivo za agregirano praćenje posećenosti i optimizaciju brzine učitavanja platforme. Svi podaci se prikupljaju u potpuno anonimizovanom obliku (bez skladištenja IP adrese ili ličnih podataka).",
        "Nema praćenja u marketinške svrhe: Potvrdio ne koristi kolačiće za profilisanje korisnika, remarketing niti deli podatke sa oglašivačkim mrežama (Google Ads remarketing, Meta Pixel)."
      ],

      sec3_title: "3. Trajanje skladištenja",
      sec3_p: "Kolačići sesije se automatski brišu čim zatvorite internet pregledač. Funkcionalni kolačići za izbor teme i jezika čuvaju se u lokalnom skladištu pregledača (LocalStorage) najduže do 12 meseci ili dok ih korisnik ručno ne obriše.",

      sec4_title: "4. Kako možete upravljati kolačićima?",
      sec4_p: "Korisnik u svakom trenutku može samostalno kontrolisati, blokirati ili obrisati kolačiće putem podešavanja u svom veb pregledaču (Chrome, Firefox, Safari, Edge). Imajte u vidu da onemogućavanje neophodnih kolačića može uticati na funkcionalnost prikaza sajta.",

      sec5_title: "5. Pitanja i kontakt",
      sec5_p: "Za sva dodatna pitanja o privatnosti i kolačićima možete nas kontaktirati na:",
      contact_email: "podrska@potvrdio.online",
      btn_close: "Zatvori"
    },
    mk: {
      title: "Политика за Колачиња (Cookie Policy)",
      subtitle: "Употреба на колачиња во согласност со прописите за заштита на податоци и GDPR",
      updated: "Последно ажурирање: Септември 2026.",
      merchant_info: "Правен субјект: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, МБ: 68423937, ПИБ: 115512104, Нови Сад, Србија",

      sec1_title: "1. Што се колачиња?",
      sec1_p: "Колачињата се мали текстуални датотеки кои се зачувуваат на вашиот уред со цел памтење на преференциите (јазик, тема).",

      sec2_title: "2. Видови колачиња кои ги користиме",
      sec2_items: [
        "Неопходни (функционални): За памтење на јазикот и темата на сајтот.",
        "Аналитички: За оптимизација на перформансите во анонимна форма.",
        "Без маркетинг спам: Не продаваме податоци на трети страни за таргетирано рекламирање."
      ],

      sec3_title: "3. Времетраење на чување",
      sec3_p: "Сесиските колачиња се бришат по затворање на прелистувачот, а преференциите се чуваат до 12 месеци.",

      sec4_title: "4. Управување со колачиња",
      sec4_p: "Корисникот може во секое време да ги избрише или блокира колачињата преку поставките на прелистувачот.",

      sec5_title: "5. Контакт",
      sec5_p: "За прашања:",
      contact_email: "podrska@potvrdio.online",
      btn_close: "Затвори"
    },
    en: {
      title: "Cookie Policy",
      subtitle: "Transparent disclosure on cookies and local storage usage under regional data laws and GDPR",
      updated: "Last updated: September 2026.",
      merchant_info: "Legal Entity: GIZEM ORUM PR Konsultantske aktivnosti Lilanova, Reg. No: 68423937, Tax ID (PIB): 115512104, Novi Sad, Serbia",

      sec1_title: "1. What are cookies?",
      sec1_p: "Cookies are small text files placed on your device to remember user settings such as interface language and dark/light color mode during your browsing session.",

      sec2_title: "2. Types of cookies used by Potvrdio",
      sec2_items: [
        "Strictly Necessary & Functional: Essential for core navigation, maintaining language preference (SR/MK/EN), dark/light theme, and CSRF protection tokens.",
        "Performance & Analytics: Aggregated and strictly anonymized performance metrics to ensure rapid page load speeds.",
        "No Behavioral Ad Tracking: We do not deploy third-party advertising tracking cookies or sell behavioral profiles."
      ],

      sec3_title: "3. Storage Duration",
      sec3_p: "Session cookies expire upon browser termination. Persistent preference tokens (such as language choice) remain in LocalStorage for up to 12 months unless cleared.",

      sec4_title: "4. Managing and Disabling Cookies",
      sec4_p: "You can manage, block, or delete cookies at any time via your browser preferences (Chrome, Safari, Firefox, Edge).",

      sec5_title: "5. Contact Information",
      sec5_p: "If you have any questions regarding our cookie practices, please contact:",
      contact_email: "podrska@potvrdio.online",
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
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
              <Cookie className="w-5 h-5" />
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
            <p>{t.sec3_p}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec4_title}
            </h3>
            <p>{t.sec4_p}</p>
          </section>

          <section className="space-y-2 border-t border-theme pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-teal-700 dark:text-[#14B8A6]">
              {t.sec5_title}
            </h3>
            <p>{t.sec5_p}</p>
            <div className="p-3 bg-surface-subtle rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t.contact_email}</span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-surface-subtle px-5 py-3 border-t border-theme flex items-center justify-between text-[11px] font-sans shrink-0">
          <span className="text-theme-muted">Privatnost i Zaštita Podataka • ZZPL & GDPR</span>
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
