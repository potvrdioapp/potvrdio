import React from 'react';
import { ShieldCheck, FileText, RotateCcw, PackageCheck, Cookie, Mail, Clock } from 'lucide-react';
import { PotvrdioLogo } from './PotvrdioLogo';

interface FooterProps {
  theme: 'light' | 'dark';
  lang: 'sr' | 'mk' | 'en';
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenRefund: () => void;
  onOpenDelivery: () => void;
  onOpenCookie: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme: _theme,
  lang,
  onOpenPrivacy,
  onOpenTerms,
  onOpenRefund,
  onOpenDelivery,
  onOpenCookie
}) => {
  const content = {
    sr: {
      mission: "Konsultantske usluge i digitalna rešenja za optimizaciju procesa COD isporuke i oporavak napuštenih korpi za WooCommerce prodavnice.",
      compliance: "Usklađeno sa propisima o zaštiti podataka o ličnosti (ZZPL RS, ZZLP BiH, ZZLP MK i EU GDPR)",
      legal_entity: "Pravno Lice",
      legal_badge: "(apr)",
      company_name: "GIZEM ORUM PR Konsultantske aktivnosti Lilanova",
      address_1: "Bulevar Patrijarha Pavla 91, sprat 4, stan 44",
      address_2: "21000 Novi Sad, Republika Srbija",
      pib_label: "PIB:",
      mb_label: "Matični broj (MB):",
      activity_label: "Delatnost:",
      activity_val: "7022 - Konsultantske aktivnosti u vezi s poslovanjem",
      vat_status: "Preduzetnik nije u sistemu PDV-a (prema čl. 33 Zakona o PDV-u RS)",
      legal_docs: "Pravna Dokumenta",
      terms_link: "Opšti uslovi poslovanja",
      privacy_link: "Politika privatnosti",
      cookie_link: "Politika kolačića (Cookies)",
      refund_link: "Reklamacije i povraćaj novca",
      delivery_link: "Način isporuke digitalnih usluga",
      support_title: "Korisnička Podrška",
      support_email_label: "E-mail:",
      support_hours: "Radno vreme: Ponedeljak – Petak (09:00 – 17:00)",
      support_sla: "Tehnički odziv na upite: u roku od 24 časa",
      system_status: "Status: Svi sistemi operativni",
      conversion_title: "Izjava o obračunu i konverziji valuta:",
      conversion_text: "Sve uplate i fakturisanje za domaća pravna lica i preduzetnike u Republici Srbiji vrše se u lokalnoj valuti (RSD) prema važećim zakonskim propisima. Za inostrane klijente obračun se vrši u EUR prema zvaničnom srednjem kursu Narodne banke Srbije (NBS) na dan izdavanja računa.",
      security_title: "Bezbednost podataka i mrežna komunikacija:",
      security_text: "Tajnost i sigurnost vaših podataka obezbeđeni su najsavremenijim sigurnosnim protokolima. Celokupna komunikacija odvija se putem zaštićenog SSL/TLS 1.3 protokola sa 256-bitnom enkripcijom. Potvrdio primenjuje stroge mere zaštite poverljivosti u skladu sa ZZPL i GDPR regulativom.",
      delivery_title: "Isporuka usluga:",
      delivery_text: "Potvrdio pruža konsultantske usluge i prateća digitalna softverska rešenja bez fizičke isporuke robe. Nakon uspešno evidentirane uplate ili aktivacije paketa, verifikacioni krediti se automatski i bez odlaganja dodeljuju na nalogu trgovca unutar WooCommerce panela.",
      copyright: "© 2026 Potvrdio. Sva prava zadržana."
    },
    mk: {
      mission: "Консалтинг услуги и дигитални решенија за оптимизација на COD испораката и враќање на напуштени кошнички за WooCommerce продавници.",
      compliance: "Усогласено со важечките прописи за заштита на личните податоци и GDPR",
      legal_entity: "Правен Субјект",
      legal_badge: "(регистар)",
      company_name: "GIZEM ORUM PR Konsultantske aktivnosti Lilanova",
      address_1: "Bulevar Patrijarha Pavla 91, кат 4, стан 44",
      address_2: "21000 Нови Сад, Република Србија",
      pib_label: "Даночен број (ПИБ):",
      mb_label: "Матичен број (МБ):",
      activity_label: "Дејност:",
      activity_val: "7022 - Консалтинг и деловни активности",
      vat_status: "Претприемачот не е во системот на ДДВ (според чл. 33 од Законот за ДДВ на РС)",
      legal_docs: "Правни Документи",
      terms_link: "Општи услови за користење",
      privacy_link: "Политика за приватност",
      cookie_link: "Политика за колачиња (Cookies)",
      refund_link: "Рекламации и враќање на средства",
      delivery_link: "Начин на испорака на дигитални услуги",
      support_title: "Корисничка Поддршка",
      support_email_label: "Е-пошта:",
      support_hours: "Работно време: Понеделник – Петок (09:00 – 17:00)",
      support_sla: "Технички одговор: во рок од 24 часа",
      system_status: "Статус: Сите системи се оперативни",
      conversion_title: "Изјава за валутна пресметка:",
      conversion_text: "Фактурирањето за правни субјекти се врши според важечките законски прописи во локална валута или EUR според официјален курс на централната банка.",
      security_title: "Безбедност на податоците:",
      security_text: "Безбедноста на вашите податоци е гарантирана со користење на SSL/TLS 1.3 протокол со 256-битна енкрипција во согласност со регулативите за заштита на податоци.",
      delivery_title: "Испорака на услуги:",
      delivery_text: "Potvrdio обезбедува консалтинг и дигитални алатки без физичка испорака. По евидентирање на уплатата, кредитите автоматски се активираат во WooCommerce панелот.",
      copyright: "© 2026 Potvrdio. Сите права се задржани."
    },
    en: {
      mission: "Consultancy services and digital solutions for Cash on Delivery (COD) logistics optimization and cart recovery for WooCommerce stores.",
      compliance: "Compliant with Personal Data Protection Laws (RS ZZPL, BiH ZZLP, MK ZZLP & EU GDPR)",
      legal_entity: "Legal Entity",
      legal_badge: "(registry)",
      company_name: "GIZEM ORUM PR Konsultantske aktivnosti Lilanova",
      address_1: "Bulevar Patrijarha Pavla 91, Apt 44, Floor 4",
      address_2: "21000 Novi Sad, Republic of Serbia",
      pib_label: "Tax ID (PIB):",
      mb_label: "Reg. Number (MB):",
      activity_label: "Activity:",
      activity_val: "7022 - Business & Management Consultancy",
      vat_status: "Sole proprietorship exempt from VAT (pursuant to Art. 33 of Serbian VAT Law)",
      legal_docs: "Legal Documents",
      terms_link: "Terms of Service",
      privacy_link: "Privacy Policy",
      cookie_link: "Cookie Policy",
      refund_link: "Complaints & Refund Policy",
      delivery_link: "Digital Service Delivery Terms",
      support_title: "Customer Support",
      support_email_label: "Email:",
      support_hours: "Working hours: Monday – Friday (09:00 – 17:00 CET)",
      support_sla: "Technical response time: within 24 hours",
      system_status: "Status: All systems operational",
      conversion_title: "Currency & Invoicing Statement:",
      conversion_text: "Invoicing and transactions for domestic legal entities are processed in accordance with Serbian fiscal legislation (RSD). International business clients are invoiced in EUR via official central bank exchange rates.",
      security_title: "Data Security & Network Confidentiality:",
      security_text: "Confidentiality and operational security are maintained through modern TLS 1.3 protocols and 256-bit encryption. Potvrdio enforces rigorous data protection policies compliant with ZZPL and EU GDPR standards.",
      delivery_title: "Service Delivery:",
      delivery_text: "Potvrdio provides business logistics consultancy and cloud automation tools without physical parcel dispatch. Upon invoice verification or package activation, verification credits are provisioned instantaneously within the WooCommerce dashboard.",
      copyright: "© 2026 Potvrdio. All rights reserved."
    }
  };

  const t = content[lang] || content.sr;

  const handleNav = (e: React.MouseEvent, openFn: () => void, path: string) => {
    e.preventDefault();
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', path);
    }
    openFn();
  };

  return (
    <footer id="footer" className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 pt-12 pb-8 font-sans mt-auto selection:bg-emerald-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Üst Satır: 4 Kolonlu Bilgi Bloğu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Kolon 1: Marka ve Misyon */}
          <div className="space-y-3.5">
            <a href="/" className="inline-block hover:opacity-90 transition-opacity">
              <PotvrdioLogo variant="horizontal" mode="dark" showSuffix={true} />
            </a>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t.mission}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.compliance}</span>
            </div>
          </div>

          {/* Kolon 2: Şirket Yasal Künyesi (Identifikacioni podaci) */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <span>{t.legal_entity}</span>
              <span className="text-[10px] text-emerald-400 font-normal lowercase">{t.legal_badge}</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li className="font-semibold text-slate-200">{t.company_name}</li>
              <li className="text-[11px] text-slate-400">{t.address_1}</li>
              <li className="text-[11px] text-slate-400">{t.address_2}</li>
              <li className="text-[11px]"><span className="text-slate-500 font-mono">{t.pib_label}</span> <span className="font-mono text-slate-300">115512104</span></li>
              <li className="text-[11px]"><span className="text-slate-500 font-mono">{t.mb_label}</span> <span className="font-mono text-slate-300">68423937</span></li>
              <li className="text-[11px]"><span className="text-slate-500">{t.activity_label}</span> {t.activity_val}</li>
              <li className="text-[11px] text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                {t.vat_status}
              </li>
            </ul>
          </div>

          {/* Kolon 3: Hukuki Sayfalar (Banka Kontrol Noktaları) */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              {t.legal_docs}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="/uslovi-koriscenja"
                  onClick={(e) => handleNav(e, onOpenTerms, '/uslovi-koriscenja')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300 hover:translate-x-0.5 transform duration-150"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{t.terms_link}</span>
                </a>
              </li>
              <li>
                <a 
                  href="/politika-privatnosti"
                  onClick={(e) => handleNav(e, onOpenPrivacy, '/politika-privatnosti')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300 hover:translate-x-0.5 transform duration-150"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.privacy_link}</span>
                </a>
              </li>
              <li>
                <a 
                  href="/politika-kolacica"
                  onClick={(e) => handleNav(e, onOpenCookie, '/politika-kolacica')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300 hover:translate-x-0.5 transform duration-150"
                >
                  <Cookie className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{t.cookie_link}</span>
                </a>
              </li>
              <li>
                <a 
                  href="/reklamacije-i-povracaj"
                  onClick={(e) => handleNav(e, onOpenRefund, '/reklamacije-i-povracaj')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300 hover:translate-x-0.5 transform duration-150"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t.refund_link}</span>
                </a>
              </li>
              <li>
                <a 
                  href="/isporuka-usluga"
                  onClick={(e) => handleNav(e, onOpenDelivery, '/isporuka-usluga')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300 hover:translate-x-0.5 transform duration-150"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{t.delivery_link}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Kolon 4: İletişim ve Müşteri Desteği */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              {t.support_title}
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.support_email_label}</span>
                <a href="mailto:podrska@potvrdio.online" className="text-emerald-400 font-medium hover:underline">
                  podrska@potvrdio.online
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{t.support_hours}</span>
              </li>
              <li className="text-[11px] text-slate-500 pl-5">
                {t.support_sla}
              </li>
            </ul>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {t.system_status}
              </span>
            </div>
          </div>

        </div>

        {/* Orta Satır: Şeffaf Güvenlik ve Fatura Bilgilendirmesi */}
        <div className="py-6 border-b border-slate-800/80 space-y-3.5 text-[11px] leading-relaxed text-slate-400">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/90 space-y-2">
            <p>
              <strong className="text-slate-200">{t.conversion_title}</strong>{' '}
              {t.conversion_text}
            </p>
            <p>
              <strong className="text-slate-200">{t.security_title}</strong>{' '}
              {t.security_text}
            </p>
            <p className="text-slate-400 text-[10.5px]">
              <strong className="text-slate-300">{t.delivery_title}</strong> {t.delivery_text}
            </p>
          </div>
        </div>

        {/* Alt Satır: Telif Hakkı */}
        <div className="pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-sans">
            {t.copyright}
          </p>
        </div>

      </div>
    </footer>
  );
};
