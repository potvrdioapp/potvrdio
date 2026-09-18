import React, { useState } from 'react';
import { X, Rocket, CheckCircle2, ShieldCheck, ArrowRight, Building, Mail, Phone, Globe, Package, Zap } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'sr' | 'mk' | 'en';
  playSuccessSound?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, lang, playSuccessSound }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [storeUrl, setStoreUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderVolume, setOrderVolume] = useState('100-300');
  const [courier, setCourier] = useState('post-express');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate fast processing
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      if (playSuccessSound) playSuccessSound();
    }, 600);
  };

  const handleResetAndClose = () => {
    setStep('form');
    onClose();
  };

  const content = {
    sr: {
      badge: "Besplatna Registracija & 25 Verifikacija",
      title: "Zaštitite Vašu WooCommerce Prodavnicu",
      subtitle: "Unesite podatke vaše radnje za instant aktivaciju Viber verifikacionog ključa.",
      label_store: "Domain / Web Prodavnica",
      placeholder_store: "npr. mojaradnja.rs",
      label_name: "Ime i Prezime",
      placeholder_name: "Petar Petrović",
      label_email: "Poslovna E-pošta",
      placeholder_email: "petar@mojaradnja.rs",
      label_phone: "Telefon / Viber za tehnički nalog",
      placeholder_phone: "+381 63 123 4567",
      label_volume: "Mesečni broj narudžbina pouzećem (COD)",
      label_courier: "Glavna kurirska služba",
      btn_submit: "Aktiviraj Besplatnih 25 Sesija",
      btn_submitting: "Aktivacija u toku...",
      note_legal: "🔒 Bez kreditne kartice. Usklađeno sa Čl. 12 ZZPL RS & GDPR.",
      success_title: "Verifikacioni Ključ Uspešno Generisan!",
      success_sub: "Dobrodošli u Potvrdio mrežu! Dobili ste 25 besplatnih verifikacionih kredita.",
      success_step1: "1. Preuzmite i aktivirajte Potvrdio WordPress plugin (.zip)",
      success_step2: "2. Vaš API ključ je poslat na vašu e-poštu:",
      success_step3: "3. Podrška za besplatnu instalaciju vam stoji na raspolaganju 24/7.",
      btn_dl_zip: "Preuzmi WordPress Plugin (.zip)",
      btn_close: "Završi Registraciju"
    },
    mk: {
      badge: "Бесплатна Регистрација & 25 Верификации",
      title: "Заштитете ја вашата WooCommerce продавница",
      subtitle: "Внесете ги податоците за инстант активација на Viber клучот.",
      label_store: "Веб Продавница",
      placeholder_store: "пр. mojaradnja.mk",
      label_name: "Име и Презиме",
      placeholder_name: "Петар Петровски",
      label_email: "Деловен Е-пошта",
      placeholder_email: "petar@mojaradnja.mk",
      label_phone: "Телефон / Viber за контакт",
      placeholder_phone: "+389 70 123 456",
      label_volume: "Месечен број на COD нарачки",
      label_courier: "Главна курирска служба",
      btn_submit: "Активирај Бесплатни 25 Сесии",
      btn_submitting: "Активација во тек...",
      note_legal: "🔒 Без кредитна картичка. Усогласено со Закон за лични податоци.",
      success_title: "Верификацискиот Клуч е Успешно Генериран!",
      success_sub: "Добредојдовте во Potvrdio! Добивте 25 бесплатни верификации.",
      success_step1: "1. Преземете го и активирајте го WordPress приклучокот (.zip)",
      success_step2: "2. Вашиот API клуч е испратен на вашата е-пошта:",
      success_step3: "3. Поддршката за инсталација ви стои на располагање 24/7.",
      btn_dl_zip: "Преземи WordPress Plugin (.zip)",
      btn_close: "Заврши Регистрација"
    },
    en: {
      badge: "Free Onboarding & 25 Credits Included",
      title: "Protect Your WooCommerce E-Store",
      subtitle: "Enter store details for instant Viber Business verification key activation.",
      label_store: "Store Domain / URL",
      placeholder_store: "e.g. mystore.com",
      label_name: "Contact Name",
      placeholder_name: "Peter Smith",
      label_email: "Business Email",
      placeholder_email: "peter@mystore.com",
      label_phone: "Phone / Viber for Technical Account",
      placeholder_phone: "+381 63 123 4567",
      label_volume: "Monthly Cash on Delivery (COD) Volume",
      label_courier: "Primary Courier Partner",
      btn_submit: "Activate 25 Free Verification Sessions",
      btn_submitting: "Activating Key...",
      note_legal: "🔒 No credit card required. Compliant with ZZPL Art 12 & EU GDPR.",
      success_title: "Verification API Key Activated!",
      success_sub: "Welcome to Potvrdio! Your store has been credited with 25 free sessions.",
      success_step1: "1. Download & activate the Potvrdio WordPress plugin (.zip)",
      success_step2: "2. Your API key has been dispatched to:",
      success_step3: "3. Free technical installation support available 24/7.",
      btn_dl_zip: "Download WordPress Plugin (.zip)",
      btn_close: "Complete Registration"
    }
  };

  const t = content[lang];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-surface border border-theme rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-xs text-theme-secondary animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-surface-subtle px-4 sm:px-5 py-3.5 border-b border-theme flex items-center justify-between shrink-0 font-sans">
          <div className="flex items-center gap-2 text-teal-600 dark:text-[#14B8A6]">
            <Rocket className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="text-xs font-bold text-theme-primary tracking-wide uppercase">{t.badge}</span>
          </div>
          <button 
            onClick={handleResetAndClose}
            className="text-theme-muted hover:text-theme-primary transition p-1 cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto touch-scroll">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-theme-primary tracking-tight">{t.title}</h3>
                <p className="text-[11px] text-theme-muted mt-0.5">{t.subtitle}</p>
              </div>

              <div className="space-y-3 font-sans">
                {/* Store URL */}
                <div>
                  <label className="block text-[11px] text-theme-secondary font-bold mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-[#14B8A6]" />
                    <span>{t.label_store} *</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder={t.placeholder_store}
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    className="w-full bg-surface border border-theme focus:border-teal-500 rounded-lg px-3 py-2 text-theme-primary font-sans text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[40px]"
                  />
                </div>

                {/* Grid 2 cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-theme-secondary font-bold mb-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-teal-600 dark:text-[#14B8A6]" />
                      <span>{t.label_name} *</span>
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder={t.placeholder_name}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface border border-theme focus:border-teal-500 rounded-lg px-3 py-2 text-theme-primary font-sans text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[40px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-theme-secondary font-bold mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-[#14B8A6]" />
                      <span>{t.label_email} *</span>
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder={t.placeholder_email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-theme focus:border-teal-500 rounded-lg px-3 py-2 text-theme-primary font-sans text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[40px]"
                    />
                  </div>
                </div>

                {/* Phone & Volume */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-theme-secondary font-bold mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-[#14B8A6]" />
                      <span>{t.label_phone} *</span>
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder={t.placeholder_phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-surface border border-theme focus:border-teal-500 rounded-lg px-3 py-2 text-theme-primary font-sans text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[40px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-theme-secondary font-bold mb-1 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-teal-600 dark:text-[#14B8A6]" />
                      <span>{t.label_volume}</span>
                    </label>
                    <select 
                      value={orderVolume}
                      onChange={(e) => setOrderVolume(e.target.value)}
                      className="w-full bg-surface border border-theme focus:border-teal-500 rounded-lg px-3 py-2 text-theme-primary font-sans text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[40px] cursor-pointer"
                    >
                      <option value="<100">&lt; 100 porudžbina / mesec</option>
                      <option value="100-300">100 - 300 porudžbina / mesec</option>
                      <option value="300-1000">300 - 1.000 porudžbina / mesec</option>
                      <option value="1000+">1.000+ porudžbina (Pro Reserve)</option>
                    </select>
                  </div>
                </div>

                {/* Courier Selection */}
                <div>
                  <label className="block text-[11px] text-theme-secondary font-bold mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-[#14B8A6]" />
                    <span>{t.label_courier}</span>
                  </label>
                  <select 
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-full bg-surface border border-theme focus:border-teal-500 rounded-lg px-3 py-2 text-theme-primary font-sans text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-[40px] cursor-pointer"
                  >
                    <option value="post-express">Post Express (Pošta Srbije)</option>
                    <option value="bex">Bex Express</option>
                    <option value="d-express">D Express</option>
                    <option value="city-express">City Express</option>
                    <option value="cargo-mk">Cargo Express MK (Makedonija)</option>
                    <option value="via-courier">Via Courier / Ostalo</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-brand-cta text-white font-bold py-3 rounded-lg text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-3 min-h-[44px]"
              >
                {isSubmitting ? (
                  <span>{t.btn_submitting}</span>
                ) : (
                  <>
                    <span>{t.btn_submit}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[10px] text-theme-muted font-sans text-center flex items-center justify-center gap-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t.note_legal}</span>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center py-2 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-theme-primary font-sans">{t.success_title}</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 font-sans">{t.success_sub}</p>
              </div>

              <div className="p-4 bg-surface-subtle border border-theme rounded-xl text-left text-xs font-sans space-y-2 text-theme-secondary">
                <p className="text-theme-primary font-bold">{t.success_step1}</p>
                <p className="text-theme-muted">
                  {t.success_step2} <span className="text-teal-600 dark:text-[#14B8A6] underline font-medium">{email || 'petar@mojaradnja.rs'}</span>
                </p>
                <p className="text-theme-muted">{t.success_step3}</p>
              </div>

              <div className="space-y-2 pt-2">
                <button 
                  onClick={handleResetAndClose}
                  className="w-full btn-brand-cta text-white font-bold py-3 rounded-lg text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer min-h-[44px]"
                >
                  <Rocket className="w-4 h-4" />
                  <span>{t.btn_dl_zip}</span>
                </button>

                <button 
                  onClick={handleResetAndClose}
                  className="w-full bg-surface hover:bg-surface-subtle text-theme-secondary border border-theme font-sans font-medium py-2.5 rounded-lg text-xs transition cursor-pointer"
                >
                  {t.btn_close}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
