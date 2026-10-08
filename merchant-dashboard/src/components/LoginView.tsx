import React, { useState } from 'react';
import { 
  Store, Mail, Key, ArrowRight, Sparkles, ShieldCheck, 
  CheckCircle2, Sun, Moon, ArrowLeft, AlertCircle, Rocket,
  Package, Zap, Building, Phone, Globe
} from 'lucide-react';
import { PotvrdioLogo } from './PotvrdioLogo';
import { Language } from '../i18n';
import { LANDING_URL, API_URL } from '../config';

interface LoginViewProps {
  selectedLang: Language;
  onSelectLang: (lang: Language) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLoginSuccess: (accountData: {
    email: string;
    fullName?: string;
    isDemo: boolean;
    activeStore: {
      id: string;
      storeName: string;
      storeDomain: string;
      apiKey: string;
      isTrial: boolean;
      trialRemaining: number;
      credits: number;
    };
    stores: Array<{
      id: string;
      storeName: string;
      storeDomain: string;
      apiKey: string;
      isTrial: boolean;
      trialRemaining: number;
      credits: number;
    }>;
  }) => void;
  onEnterDemo: () => void;
}

export function LoginView({
  selectedLang,
  onSelectLang,
  theme,
  onToggleTheme,
  onLoginSuccess,
  onEnterDemo,
}: LoginViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderVolume, setOrderVolume] = useState('100-300');
  const [courier, setCourier] = useState('bex');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [devMagicUrl, setDevMagicUrl] = useState<string | null>(null);

  const DICTIONARY = {
    sr: {
      title: 'Merchant Dashboard Prijava',
      subtitle: 'Prijavite se na vaš nalog za uvid u verifikacije, kredite i WooCommerce integraciju.',
      tabLogin: 'Prijava na Nalog',
      tabRegister: 'Registracija (25 Besplatno)',
      emailLabel: 'E-pošta naloga',
      emailPlaceholder: 'marko@prodavnica.rs',
      passLabel: 'Pristupni kod ili API ključ',
      passPlaceholder: 'pk_live_... ili šifra',
      passOptional: 'iz e-maila dobrodošlice',
      loginBtn: 'Prijavi se pristupnim kodom',
      loggingIn: 'Prijavljujem...',
      orMagicDivider: 'ili bezbedna prijava na email',
      magicLinkBtn: 'Pošalji mi Magic Link za prijavu',
      magicLinkSending: 'Šaljem sigurnosni link...',
      magicLinkSent: 'Sigurnosni prijavni link je poslat na vašu email adresu! Proverite prijemno sanduče za brzi ulaz.',
      invalidCredentials: 'Neispravan pristupni kod ili API ključ. Proverite podatke ili zatražite Magic Link na email.',
      credentialsRequired: 'Unesite vaš API ključ (Access Code) ili zatražite Magic Link na email.',
      tokenExpired: 'Prijavni link je istekao ili je već iskorišćen. Molimo zatražite novi.',
      emailRequired: 'Molimo unesite email adresu.',
      storeUrlLabel: 'Web prodavnica (WooCommerce)',
      storeUrlPlaceholder: 'mojaprodavnica.rs',
      nameLabel: 'Ime i prezime / Naziv firme',
      namePlaceholder: 'Petar Petrović',
      regEmailLabel: 'Poslovna e-pošta',
      regEmailPlaceholder: 'petar@mojaradnja.rs',
      phoneLabel: 'Broj telefona / Viber',
      phonePlaceholder: '+381 64 123 4567',
      labelVolume: 'Mesečni broj narudžbina pouzećem (COD)',
      labelCourier: 'Glavna kurirska služba',
      volUnder100: '< 100 porudžbina / mesec',
      vol100to300: '100 - 300 porudžbina / mesec',
      vol300to1000: '300 - 1.000 porudžbina / mesec',
      vol1000plus: '1.000+ porudžbina (Pro Reserve)',
      courierPostExpress: 'Post Express (Pošta Srbije)',
      courierBex: 'Bex Express',
      courierDExpress: 'D Express',
      courierCityExpress: 'City Express',
      courierCargoMk: 'Cargo Express MK (Makedonija)',
      courierOther: 'Via Courier / Ostalo',
      trialBenefitNotice: 'Dobijate 25 garantovanih besplatnih verifikacija odmah nakon kreiranja.',
      registerBtn: 'Pokreni 25 Besplatnih Verifikacija',
      creatingAccount: 'Kreiram nalog...',
      orDemoBadge: 'BEZ REGISTRACIJE I KARTICE',
      orDemoTitle: 'Želite prvo da vidite kako Potvrdio izgleda uživo?',
      orDemoDesc: 'Istražite realističnu analitiku, 412 obrađenih porudžbina, izveštaje o sprečenim troškovima povrata i SMS/Viber logove na primeru Balkan Style Shop.',
      demoFeature1: '412 potvrđenih COD porudžbina uživo',
      demoFeature2: '€1,240 sačuvano na kurirskim povratima',
      demoFeature3: 'Realističan WordPress Admin simulator',
      demoBtn: 'Otvori Demo Prodavnicu (Balkan Style Shop)',
      demoNoCardFooter: 'Nije potrebna registracija · 1-klik pristup',
      backHome: 'Povratak na potvrdio.online',
      secureConnection: 'Sigurno povezivanje (SHA-256)',
      officeLocation: 'Lilanova PR · Novi Sad',
      footerCopyright: '© 2026 Potvrdio · Napredna verifikacija adresa i COD paketa za WooCommerce',
      loginNotFound: 'Nalog sa ovom e-poštom nije pronađen. Molimo registrujte se ili isprobajte Demo prodavnicu.',
      regErrorGeneric: 'Greška pri registraciji',
      networkError: 'Nije moguće povezati se sa serverom. Molimo pokušajte ponovo.',
      noAccount: 'Nemate nalog?',
      hasAccount: 'Već imate nalog?',
      themeLight: 'Prebaci na svetlu temu',
      themeDark: 'Prebaci na tamnu temu',
    },
    mk: {
      title: 'Merchant Dashboard Најава',
      subtitle: 'Најавете се на вашиот налог за преглед на верификации, кредити и WooCommerce интеграција.',
      tabLogin: 'Најава на Налог',
      tabRegister: 'Регистрација (25 Бесплатно)',
      emailLabel: 'Е-пошта на налогот',
      emailPlaceholder: 'marko@prodavnica.mk',
      passLabel: 'Пристапен код или API клуч',
      passPlaceholder: 'pk_live_... или лозинка',
      passOptional: 'од е-поштата за добредојде',
      loginBtn: 'Најави се со пристапен код',
      loggingIn: 'Се најавувам...',
      orMagicDivider: 'или безбедна најава на е-пошта',
      magicLinkBtn: 'Испрати ми Magic Link за најава',
      magicLinkSending: 'Се испраќа безбедносен линк...',
      magicLinkSent: 'Безбедносниот линк за најава е испратен на вашата е-пошта! Проверете го вашето сандаче.',
      invalidCredentials: 'Невалиден пристапен код или API клуч. Проверете ги податоците или побарајте Magic Link на е-пошта.',
      credentialsRequired: 'Внесете го вашиот API клуч (Access Code) или побарајте Magic Link на е-пошта.',
      tokenExpired: 'Линкот за најава е истечен или веќе искористен. Побарајте нов.',
      emailRequired: 'Ве молиме внесете е-пошта.',
      storeUrlLabel: 'Веб продавница (WooCommerce)',
      storeUrlPlaceholder: 'mojaprodavnica.mk',
      nameLabel: 'Име и презиме / Фирма',
      namePlaceholder: 'Петар Петровски',
      regEmailLabel: 'Деловна е-пошта',
      regEmailPlaceholder: 'petar@mojaradnja.mk',
      phoneLabel: 'Телефонски број / Viber',
      phonePlaceholder: '+389 70 123 456',
      labelVolume: 'Месечен број на COD нарачки',
      labelCourier: 'Главна курирска служба',
      volUnder100: '< 100 нарачки / месец',
      vol100to300: '100 - 300 нарачки / месец',
      vol300to1000: '300 - 1.000 нарачки / месец',
      vol1000plus: '1.000+ нарачки (Pro Reserve)',
      courierPostExpress: 'Post Express (Србија)',
      courierBex: 'Bex Express',
      courierDExpress: 'D Express',
      courierCityExpress: 'City Express',
      courierCargoMk: 'Cargo Express MK (Македонија)',
      courierOther: 'Via Courier / Друго',
      trialBenefitNotice: 'Добивате 25 загарантирани бесплатни верификации веднаш по креирањето.',
      registerBtn: 'Активирај 25 Бесплатни Верификации',
      creatingAccount: 'Се креира налог...',
      orDemoBadge: 'БЕЗ РЕГИСТРАЦИЈА И КАРТИЧКА',
      orDemoTitle: 'Сакате прво да видите како работи Potvrdio во живо?',
      orDemoDesc: 'Истражете реална аналитика, 412 обработени нарачки, заштеди на поштарина и SMS/Viber логови на примерот на Balkan Style Shop.',
      demoFeature1: '412 потврдени COD нарачки во живо',
      demoFeature2: '€1,240 заштедено на курирски поврат',
      demoFeature3: 'Реалистичен WordPress Admin симулатор',
      demoBtn: 'Отвори Демо Продавница (Balkan Style Shop)',
      demoNoCardFooter: 'Не е потребна регистрација · 1-клик пристап',
      backHome: 'Назад кон potvrdio.online',
      secureConnection: 'Безбедна врска (SHA-256)',
      officeLocation: 'Lilanova PR · Нови Сад',
      footerCopyright: '© 2026 Potvrdio · Напредна верификација на адреси и COD пратки за WooCommerce',
      loginNotFound: 'Налог со оваа е-пошта не е пронајден. Ве молиме регистрирајте се или отворете Демо продавница.',
      regErrorGeneric: 'Грешка при регистрација',
      networkError: 'Не може да се воспостави врска со серверот. Ве молиме обидете се повторно.',
      noAccount: 'Немате налог?',
      hasAccount: 'Веќе имате налог?',
      themeLight: 'Префрли на светла тема',
      themeDark: 'Префрли на темна тема',
    },
    en: {
      title: 'Merchant Dashboard Sign In',
      subtitle: 'Sign in to access order verifications, credits, and WooCommerce integration settings.',
      tabLogin: 'Sign In',
      tabRegister: 'Register (25 Free)',
      emailLabel: 'Account Email',
      emailPlaceholder: 'owner@mystore.com',
      passLabel: 'Access Code or API Key',
      passPlaceholder: 'pk_live_... or password',
      passOptional: 'from your welcome email',
      loginBtn: 'Sign In with Access Code',
      loggingIn: 'Signing in...',
      orMagicDivider: 'or secure email sign in',
      magicLinkBtn: 'Send Magic Link to Email',
      magicLinkSending: 'Sending secure link...',
      magicLinkSent: 'Secure magic login link sent to your email! Check your inbox to sign in instantly.',
      invalidCredentials: 'Invalid access code or API key. Please check your details or request a Magic Link to your email.',
      credentialsRequired: 'Please enter your API Key (Access Code) or request a Magic Link to your email.',
      tokenExpired: 'Login link has expired or has already been used. Please request a new one.',
      emailRequired: 'Please enter your email address.',
      storeUrlLabel: 'Store Domain / URL (WooCommerce)',
      storeUrlPlaceholder: 'mystore.com',
      nameLabel: 'Contact Name / Company',
      namePlaceholder: 'Peter Smith',
      regEmailLabel: 'Business Email',
      regEmailPlaceholder: 'owner@mystore.com',
      phoneLabel: 'Phone Number / Viber',
      phonePlaceholder: '+381 64 123 4567',
      labelVolume: 'Monthly Cash on Delivery (COD) Volume',
      labelCourier: 'Primary Courier Partner',
      volUnder100: '< 100 orders / month',
      vol100to300: '100 - 300 orders / month',
      vol300to1000: '300 - 1,000 orders / month',
      vol1000plus: '1,000+ orders (Pro Reserve)',
      courierPostExpress: 'Post Express (Serbia)',
      courierBex: 'Bex Express',
      courierDExpress: 'D Express',
      courierCityExpress: 'City Express',
      courierCargoMk: 'Cargo Express MK (Macedonia)',
      courierOther: 'Via Courier / Other',
      trialBenefitNotice: 'You receive 25 guaranteed free verifications immediately upon account creation.',
      registerBtn: 'Start 25 Free Verifications',
      creatingAccount: 'Creating account...',
      orDemoBadge: 'NO REGISTRATION OR CREDIT CARD',
      orDemoTitle: 'Want to preview how Potvrdio works live first?',
      orDemoDesc: 'Explore realistic analytics, 412 processed orders, prevented return cost reports, and SMS/Viber timeline logs on demo store Balkan Style Shop.',
      demoFeature1: '412 live verified COD orders',
      demoFeature2: '€1,240 saved on courier returns',
      demoFeature3: 'Realistic WordPress Admin simulator',
      demoBtn: 'Launch Demo Store (Balkan Style Shop)',
      demoNoCardFooter: 'No registration needed · 1-click instant access',
      backHome: 'Back to potvrdio.online',
      secureConnection: 'Secure Connection (SHA-256)',
      officeLocation: 'Lilanova PR · Novi Sad',
      footerCopyright: '© 2026 Potvrdio · Advanced Address & COD Order Verification for WooCommerce',
      loginNotFound: 'No merchant account found with this email. Please register or explore the Demo store.',
      regErrorGeneric: 'Registration error',
      networkError: 'Unable to connect to server. Please try again.',
      noAccount: 'No account yet?',
      hasAccount: 'Already have an account?',
      themeLight: 'Switch to light theme',
      themeDark: 'Switch to dark theme',
    },
  };

  const texts = (DICTIONARY as Record<string, typeof DICTIONARY.sr>)[selectedLang] || DICTIONARY.sr;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    // If demo is entered in login box
    if (email.trim().toLowerCase() === 'demo' || email.trim().toLowerCase() === 'demo@potvrdio.online') {
      setIsLoading(false);
      onEnterDemo();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/merchant/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), accessCode: password.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Fallback: check localStorage for saved registered merchant
        const localSaved = localStorage.getItem('potvrdio_registered_merchant');
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (parsed && (parsed.email === email.trim() || !parsed.email)) {
            onLoginSuccess({
              email: email.trim(),
              fullName: parsed.storeName || 'Merchant',
              isDemo: false,
              activeStore: {
                id: parsed.id || 'store_local',
                storeName: parsed.storeName || 'Moja Prodavnica',
                storeDomain: parsed.storeDomain || 'mojaradnja.rs',
                apiKey: parsed.apiKey,
                isTrial: parsed.isTrial ?? true,
                trialRemaining: parsed.trialRemaining ?? 25,
                credits: parsed.credits ?? 0,
              },
              stores: [
                {
                  id: parsed.id || 'store_local',
                  storeName: parsed.storeName || 'Moja Prodavnica',
                  storeDomain: parsed.storeDomain || 'mojaradnja.rs',
                  apiKey: parsed.apiKey,
                  isTrial: parsed.isTrial ?? true,
                  trialRemaining: parsed.trialRemaining ?? 25,
                  credits: parsed.credits ?? 0,
                }
              ]
            });
            setIsLoading(false);
            return;
          }
        }

        // Map backend error codes strictly to active language dictionary
        if (data.code === 'ACCOUNT_NOT_FOUND' || response.status === 404) {
          setErrorMsg(texts.loginNotFound);
        } else if (data.code === 'INVALID_CREDENTIALS') {
          setErrorMsg(texts.invalidCredentials);
        } else if (data.code === 'CREDENTIALS_REQUIRED') {
          setErrorMsg(texts.credentialsRequired);
        } else if (data.code === 'TOKEN_INVALID_OR_EXPIRED') {
          setErrorMsg(texts.tokenExpired);
        } else {
          setErrorMsg(texts.loginNotFound);
        }
        setIsLoading(false);
        return;
      }

      onLoginSuccess({
        email: data.account.email,
        fullName: data.account.fullName,
        isDemo: data.isDemo ?? false,
        activeStore: data.activeStore,
        stores: data.account.stores,
      });
    } catch {
      setErrorMsg(texts.networkError);
      setIsLoading(false);
    }
  };

  const handleSendMagicLink = async () => {
    if (!email.trim()) {
      setErrorMsg(texts.emailRequired);
      return;
    }

    setIsSendingMagicLink(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setDevMagicUrl(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/merchant/magic-link/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.code === 'ACCOUNT_NOT_FOUND' || response.status === 404) {
          setErrorMsg(texts.loginNotFound);
        } else {
          setErrorMsg(texts.networkError);
        }
        setIsSendingMagicLink(false);
        return;
      }

      setSuccessMsg(texts.magicLinkSent);
      if (data.devMagicUrl) {
        setDevMagicUrl(data.devMagicUrl);
      }
    } catch {
      setErrorMsg(texts.networkError);
    } finally {
      setIsSendingMagicLink(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !storeUrl.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/merchant/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeUrl: storeUrl.trim(),
          fullName: fullName.trim() || storeUrl.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.error || texts.regErrorGeneric);
        setIsLoading(false);
        return;
      }

      onLoginSuccess({
        email: email.trim(),
        fullName: fullName.trim() || storeUrl.trim(),
        isDemo: false,
        activeStore: data.activeStore,
        stores: data.account?.stores || [data.activeStore],
      });
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMsg(texts.networkError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col justify-between selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <header className="px-6 py-4 border-b border-theme bg-surface/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PotvrdioLogo variant="horizontal" mode={theme} />
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-surface-subtle border border-theme rounded-xl p-1 text-xs font-semibold shadow-xs">
            {(['sr', 'mk', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => onSelectLang(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  selectedLang === lang
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-surface-subtle hover:bg-surface border border-theme text-theme-muted hover:text-theme-primary transition-all cursor-pointer shadow-xs"
            title={theme === 'dark' ? texts.themeLight : texts.themeDark}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Back to Homepage */}
          <a
            href={LANDING_URL}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-subtle hover:bg-surface border border-theme text-theme-secondary hover:text-theme-primary text-xs font-semibold transition shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{texts.backHome}</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Form Card (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-theme shadow-card flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-black text-theme-primary tracking-tight">
                  {texts.title}
                </h1>
                <p className="text-xs text-theme-muted mt-1.5 leading-relaxed">
                  {texts.subtitle}
                </p>
              </div>

              {/* Mode Switch Tabs */}
              <div className="flex bg-surface-subtle p-1 rounded-2xl border border-theme mb-6">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-surface text-theme-primary shadow-xs border border-theme/60'
                      : 'text-theme-muted hover:text-theme-primary'
                  }`}
                >
                  {texts.tabLogin}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'register'
                      ? 'bg-surface text-teal-600 dark:text-teal-400 shadow-xs border border-theme/60'
                      : 'text-theme-muted hover:text-theme-primary'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-teal-500" />
                  {texts.tabRegister}
                </button>
              </div>

              {/* Success Notice */}
              {successMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs flex flex-col gap-2 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
                    <span>{successMsg}</span>
                  </div>
                  {devMagicUrl && (
                    <a
                      href={devMagicUrl}
                      className="mt-1 text-[11px] underline font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Lokalno testiranje: Kliknite ovde za direktan ulaz na Dashboard &rarr;</span>
                    </a>
                  )}
                </div>
              )}

              {/* Error Notice */}
              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-theme-secondary mb-1.5">
                      {texts.emailLabel}
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-theme-muted absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={texts.emailPlaceholder}
                        className="w-full bg-surface-subtle border border-theme rounded-xl pl-10 pr-4 py-2.5 text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-theme-secondary">
                        {texts.passLabel}
                      </label>
                      <span className="text-[11px] text-theme-muted italic">
                        {texts.passOptional}
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <Key className="w-4 h-4 text-theme-muted absolute left-3.5 pointer-events-none" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={texts.passPlaceholder}
                        className="w-full bg-surface-subtle border border-theme rounded-xl pl-10 pr-4 py-2.5 text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 rounded-xl btn-brand-cta text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.99] disabled:opacity-60"
                  >
                    <span>{isLoading ? texts.loggingIn : texts.loginBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Magic Link Alternative Option */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="border-t border-theme w-full absolute"></div>
                    <span className="bg-surface px-3 text-[11px] text-theme-muted uppercase tracking-wider relative font-semibold">
                      {texts.orMagicDivider}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendMagicLink}
                    disabled={isSendingMagicLink || isLoading}
                    className="w-full py-2.5 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-60"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isSendingMagicLink ? texts.magicLinkSending : texts.magicLinkBtn}</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setErrorMsg(null); setSuccessMsg(null); }}
                      className="text-xs text-theme-muted hover:text-teal-600 dark:hover:text-teal-400 font-semibold cursor-pointer transition-colors"
                    >
                      {texts.noAccount} <span className="underline font-bold text-teal-600 dark:text-teal-400">{texts.tabRegister}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-theme-secondary mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{texts.storeUrlLabel}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={storeUrl}
                      onChange={(e) => setStoreUrl(e.target.value)}
                      placeholder={texts.storeUrlPlaceholder}
                      className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-theme-secondary mb-1 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>{texts.nameLabel}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={texts.namePlaceholder}
                        className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-theme-secondary mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>{texts.regEmailLabel}</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={texts.regEmailPlaceholder}
                        className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-secondary mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{texts.phoneLabel}</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={texts.phonePlaceholder}
                      className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 text-xs text-theme-primary placeholder-theme-muted focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-700 dark:text-teal-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>{texts.trialBenefitNotice}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl btn-brand-cta text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.99] disabled:opacity-60"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>{isLoading ? texts.creatingAccount : texts.registerBtn}</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMsg(null); }}
                      className="text-xs text-theme-muted hover:text-theme-primary font-semibold cursor-pointer transition-colors"
                    >
                      {texts.hasAccount} <span className="underline font-bold text-theme-primary">{texts.tabLogin}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Trust Info */}
            <div className="mt-8 pt-4 border-t border-theme/60 flex items-center justify-between text-[11px] text-theme-muted">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                {texts.secureConnection}
              </span>
              <span>{texts.officeLocation}</span>
            </div>
          </div>

          {/* Right Column: Demo Exploration Card (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-900/20 via-surface to-surface border border-purple-500/30 flex flex-col justify-between shadow-card relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300">
                <Sparkles className="w-3 h-3 text-purple-500" />
                {texts.orDemoBadge}
              </span>

              <h2 className="text-lg sm:text-xl font-black text-theme-primary leading-snug">
                {texts.orDemoTitle}
              </h2>

              <p className="text-xs text-theme-muted leading-relaxed">
                {texts.orDemoDesc}
              </p>

              {/* Demo Highlights List */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-theme-secondary">
                  <div className="w-5 h-5 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{texts.demoFeature1}</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-theme-secondary">
                  <div className="w-5 h-5 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{texts.demoFeature2}</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-theme-secondary">
                  <div className="w-5 h-5 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{texts.demoFeature3}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                type="button"
                onClick={onEnterDemo}
                className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Rocket className="w-4 h-4 shrink-0" />
                <span>{texts.demoBtn}</span>
              </button>
              <p className="text-[10px] text-center text-theme-muted mt-2">
                {texts.demoNoCardFooter}
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-theme-muted border-t border-theme">
        <span>{texts.footerCopyright}</span>
      </footer>
    </div>
  );
}
