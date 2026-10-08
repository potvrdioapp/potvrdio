import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, CreditCard, CheckCircle2, TrendingUp, AlertTriangle, 
  MessageSquare, RefreshCw, Key, ShieldCheck, Zap, Settings, BarChart2, Layers, Sun, Moon,
  Copy, Check, ChevronRight, Monitor, Store, LifeBuoy, Mail, XCircle, Calendar,
  Clock, MapPin, Eye, EyeOff, Download, ArrowDownRight, ArrowUpRight, ArrowDown, ArrowRight, History, FileText, Send, Coins, Rocket,
  Package, ExternalLink, ChevronDown, LogOut, Plus, User, LogIn, Lightbulb, Camera
} from 'lucide-react';
import { PotvrdioLogo } from './components/PotvrdioLogo';
import { DateRangePicker, PeriodType, DateRange, formatDateRange } from './components/DateRangePicker';
import { translations, Language, VerificationLogItem } from './i18n';
import { CreditTimeframe, getCreditLedgerData, CreditSummaryStats, CreditLedgerTransaction } from './creditLedger';
import { IpsPaymentModal, IpsPaymentPlan } from './components/IpsPaymentModal';
import { LoginView } from './components/LoginView';
import { AddStoreModal } from './components/AddStoreModal';
import { LANDING_URL, API_URL } from './config';

type Theme = 'dark' | 'light';

export interface ActiveMerchant {
  id: string;
  storeName: string;
  storeDomain: string;
  apiKey: string;
  apiSecret?: string;
  isTrial: boolean;
  trialRemaining: number;
  credits: number;
  isDemo: boolean;
  courier?: string;
  orderVolume?: string;
  isConnected?: boolean;
  lastPingAt?: string | null;
}

export interface UserSession {
  email: string;
  fullName?: string;
  isDemo: boolean;
  activeStoreId: string;
  stores: ActiveMerchant[];
}

const DEMO_MERCHANT: ActiveMerchant = {
  id: 'demo',
  storeName: 'Balkan Style Shop',
  storeDomain: 'balkanstyleshop.rs',
  apiKey: 'demo_api_key_123',
  apiSecret: 'demo_secret_456',
  isTrial: false,
  trialRemaining: 0,
  credits: 1875,
  isDemo: true,
  isConnected: true,
  lastPingAt: new Date().toISOString(),
  courier: 'bex',
  orderVolume: '300-1000',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'settings'>('overview');
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);

  // User Session Management
  const [session, setSession] = useState<UserSession | null>(() => {
    // 1. Explicit ?demo=true query parameter (for direct testing/links only)
    const params = new URLSearchParams(window.location.search);
    const qDemo = params.get('demo');
    if (qDemo === 'true') {
      try {
        window.history.replaceState({}, '', window.location.pathname);
      } catch {}
      return {
        email: 'demo@potvrdio.online',
        fullName: 'Demo Korisnik',
        isDemo: true,
        activeStoreId: 'demo',
        stores: [DEMO_MERCHANT],
      };
    }

    // 2. Explicit onboarding redirect with api_key & store query params
    const qApiKey = params.get('api_key');
    const qApiSecret = params.get('api_secret');
    const qStore = params.get('store');
    if (qApiKey && qApiKey !== 'demo' && qApiKey !== 'demo_api_key_123') {
      const storeName = qStore || 'Moja Prodavnica';
      const store: ActiveMerchant = {
        id: 'store_reg_1',
        storeName,
        storeDomain: storeName.replace(/^https?:\/\//i, '').replace(/\/.*$/, ''),
        apiKey: qApiKey,
        apiSecret: qApiSecret || (qApiKey.startsWith('pk_live_') ? qApiKey.replace(/^pk_live_/, 'sec_live_') : 'demo_secret_456'),
        isTrial: true,
        trialRemaining: 25,
        credits: 0,
        isDemo: false,
      };
      const newSession: UserSession = {
        email: params.get('email') || `${store.storeDomain}@merchant.local`,
        fullName: storeName,
        isDemo: false,
        activeStoreId: store.id,
        stores: [store],
      };
      try {
        window.history.replaceState({}, '', window.location.pathname);
        localStorage.setItem('potvrdio_session', JSON.stringify(newSession));
      } catch {}
      return newSession;
    }

    // 3. Check localStorage for active authenticated session
    const saved = localStorage.getItem('potvrdio_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // STRICT: Only genuine authenticated non-demo sessions.
        if (
          parsed &&
          parsed.isDemo === false &&
          parsed.email &&
          parsed.email !== 'demo@potvrdio.online' &&
          !parsed.email.toLowerCase().includes('demo') &&
          Array.isArray(parsed.stores) &&
          parsed.stores.length > 0 &&
          parsed.stores[0]?.apiKey &&
          parsed.stores[0]?.apiKey !== 'demo_api_key_123' &&
          parsed.stores[0]?.apiKey !== 'demo' &&
          parsed.stores[0]?.isDemo !== true
        ) {
          try { localStorage.setItem('potvrdio_real_account', JSON.stringify(parsed)); } catch {}
          return parsed;
        }
      } catch {}
    }

    // In all other cases (demo, corrupted, logged out, or fallback):
    // Purge session storage so it never lingers or resurrects!
    try {
      localStorage.removeItem('potvrdio_session');
      localStorage.removeItem('potvrdio_registered_merchant');
    } catch {}

    return null; // DIRECTLY SHOW LOGIN VIEW
  });

  const activeMerchant = session
    ? (session.stores.find((s) => s.id === session.activeStoreId) || session.stores[0] || DEMO_MERCHANT)
    : DEMO_MERCHANT;

  const trialRemaining = activeMerchant.trialRemaining;
  const credits = activeMerchant.credits;
  const isTrial = activeMerchant.isTrial;
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const merchantSecret = activeMerchant.apiSecret || (activeMerchant.apiKey.startsWith('pk_live_') ? activeMerchant.apiKey.replace(/^pk_live_/, 'sec_live_') : 'demo_secret_456');

  // Zero-state registered orders list
  const [registeredOrders, setRegisteredOrders] = useState<VerificationLogItem[]>(() => {
    const saved = localStorage.getItem('potvrdio_registered_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  const [, setBalance] = useState(45.00);
  const [isSimulating, setIsSimulating] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<IpsPaymentPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [activeStepHighlight, setActiveStepHighlight] = useState<number | null>(null);
  const walkthroughPreviewRef = useRef<HTMLDivElement>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>('#7482');
  const [creditTimeframe, setCreditTimeframe] = useState<CreditTimeframe>('since_last_purchase');
  const [downloadingReceiptId, setDownloadingReceiptId] = useState<string | null>(null);
  const [isVerifyingConnection, setIsVerifyingConnection] = useState<boolean>(false);
  const [, setConnectionJustVerified] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const updateActiveStore = (updater: (prev: ActiveMerchant) => ActiveMerchant) => {
    setSession((prev) => {
      if (!prev) return null;
      const updatedStores = prev.stores.map((s) => (s.id === prev.activeStoreId ? updater(s) : s));
      const updated = { ...prev, stores: updatedStores };
      if (!prev.isDemo) {
        try { localStorage.setItem('potvrdio_session', JSON.stringify(updated)); } catch {}
      }
      return updated;
    });
  };

  // Option A: Auto-listening for WooCommerce ping
  useEffect(() => {
    if (!session || session.isDemo || activeMerchant.isDemo || activeMerchant.isConnected) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/merchant/store/status?apiKey=${encodeURIComponent(activeMerchant.apiKey)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isConnected) {
            updateActiveStore((prev) => ({
              ...prev,
              isConnected: true,
              lastPingAt: data.lastPingAt || new Date().toISOString(),
            }));
            setConnectionJustVerified(true);
            setTimeout(() => setConnectionJustVerified(false), 4000);
          }
        }
      } catch {}
    }, 6000);
    return () => clearInterval(interval);
  }, [session, activeMerchant.apiKey, activeMerchant.isDemo, activeMerchant.isConnected]);

  // Option B: User-initiated verify connection
  const handleVerifyStoreConnection = async () => {
    setIsVerifyingConnection(true);
    setConnectionError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/merchant/store/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: activeMerchant.apiKey }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && data?.isConnected) {
        updateActiveStore((prev) => ({
          ...prev,
          isConnected: true,
          lastPingAt: data.lastPingAt || new Date().toISOString(),
        }));
        setConnectionJustVerified(true);
        setConnectionError(null);
        setTimeout(() => setConnectionJustVerified(false), 4000);
      } else {
        setConnectionError(t.connectionNoSignalError);
      }
    } catch {
      setConnectionError(t.connectionNoSignalError);
    } finally {
      setIsVerifyingConnection(false);
    }
  };

  const [selectedCourier, setSelectedCourier] = useState<string>(() => {
    return activeMerchant.courier || localStorage.getItem(`potvrdio_courier_${activeMerchant.id}`) || 'bex';
  });
  const [selectedVolume, setSelectedVolume] = useState<string>(() => {
    return activeMerchant.orderVolume || localStorage.getItem(`potvrdio_volume_${activeMerchant.id}`) || '100-300';
  });
  const [isLogisticsSaved, setIsLogisticsSaved] = useState<boolean>(() => {
    return Boolean(activeMerchant.courier || localStorage.getItem(`potvrdio_courier_${activeMerchant.id}`));
  });
  const [logisticsToast, setLogisticsToast] = useState<boolean>(false);

  // Auto-login via Magic Token from URL query parameter (?magic_token=... or ?token=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get('magic_token') || params.get('token');
    if (magicToken && !session) {
      fetch(`${API_URL}/api/v1/merchant/magic-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: magicToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.account) {
            const activeStore = data.activeStore || data.account.stores[0];
            const newSession: UserSession = {
              email: data.account.email,
              fullName: data.account.fullName || activeStore?.storeName || 'Merchant',
              isDemo: false,
              activeStoreId: activeStore?.id || 'store_1',
              stores: data.account.stores,
            };
            setSession(newSession);
            localStorage.setItem('potvrdio_session', JSON.stringify(newSession));
            window.history.replaceState({}, '', window.location.pathname);
          }
        })
        .catch((err) => {
          console.warn('[MAGIC LOGIN FAILED]', err);
        });
    }
  }, [session]);

  useEffect(() => {
    const savedC = activeMerchant.courier || localStorage.getItem(`potvrdio_courier_${activeMerchant.id}`) || 'bex';
    const savedV = activeMerchant.orderVolume || localStorage.getItem(`potvrdio_volume_${activeMerchant.id}`) || '100-300';
    setSelectedCourier(savedC);
    setSelectedVolume(savedV);
    setIsLogisticsSaved(Boolean(activeMerchant.courier || localStorage.getItem(`potvrdio_courier_${activeMerchant.id}`)));
  }, [activeMerchant.id, activeMerchant.courier, activeMerchant.orderVolume]);

  const handleSaveLogistics = (courierVal: string, volumeVal: string) => {
    setSelectedCourier(courierVal);
    setSelectedVolume(volumeVal);
    setIsLogisticsSaved(true);
    try {
      localStorage.setItem(`potvrdio_courier_${activeMerchant.id}`, courierVal);
      localStorage.setItem(`potvrdio_volume_${activeMerchant.id}`, volumeVal);
    } catch {}
    updateActiveStore((prev) => ({
      ...prev,
      courier: courierVal,
      orderVolume: volumeVal,
    }));
    setLogisticsToast(true);
    setTimeout(() => setLogisticsToast(false), 2500);
  };

  const handleLogout = () => {
    setSession(null);
    try {
      localStorage.removeItem('potvrdio_session');
      localStorage.removeItem('potvrdio_real_account');
      localStorage.removeItem('potvrdio_registered_merchant');
      localStorage.removeItem('potvrdio_registered_orders');
    } catch {}
    try {
      window.history.replaceState({}, '', window.location.pathname);
    } catch {}
  };

  const handleSwitchStore = (storeId: string) => {
    setSession((prev) => {
      if (!prev) return null;
      const updated = { ...prev, activeStoreId: storeId, isDemo: false };
      try { 
        localStorage.setItem('potvrdio_session', JSON.stringify(updated));
        localStorage.setItem('potvrdio_real_account', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setIsStoreDropdownOpen(false);
  };

  const handleSwitchToDemo = () => {
    if (session && !session.isDemo) {
      try { localStorage.setItem('potvrdio_real_account', JSON.stringify(session)); } catch {}
    }
    setSession({
      email: 'demo@potvrdio.online',
      fullName: 'Demo Korisnik',
      isDemo: true,
      activeStoreId: 'demo',
      stores: [DEMO_MERCHANT],
    });
    try { localStorage.removeItem('potvrdio_session'); } catch {}
    setIsStoreDropdownOpen(false);
  };

  const handleRestoreRealSession = () => {
    try {
      const saved = localStorage.getItem('potvrdio_real_account');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && !parsed.isDemo && parsed.email !== 'demo@potvrdio.online') {
          setSession(parsed);
          localStorage.setItem('potvrdio_session', JSON.stringify(parsed));
          setIsStoreDropdownOpen(false);
          return;
        }
      }
    } catch {}
    handleLogout();
  };

  const savedRealAccount: UserSession | null = (() => {
    try {
      const raw = localStorage.getItem('potvrdio_real_account');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && !parsed.isDemo && parsed.email !== 'demo@potvrdio.online') {
          return parsed;
        }
      }
    } catch {}
    return null;
  })();

  const hasRealAccount = Boolean(session && !session.isDemo) || Boolean(savedRealAccount);
  const realStoreName = (!session?.isDemo ? activeMerchant.storeName : savedRealAccount?.stores?.[0]?.storeName) || 'Moja Prodavnica';

  const handleSimulateTestOrder = async () => {
    setIsSimulating(true);
    const newOrderId = Math.floor(1000 + Math.random() * 9000);
    const orderNum = `#${newOrderId}`;

    // Call backend API if running
    try {
      await fetch(`${API_URL}/api/v1/orders/intercept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-potvrdio-api-key': activeMerchant.apiKey,
        },
        body: JSON.stringify({
          order_id: newOrderId,
          store_domain: activeMerchant.storeDomain,
          customer_name: 'Jelena Petrović',
          customer_phone: '+381645551234',
          shipping_address: { address_1: 'Bulevar Oslobođenja 12', city: 'Novi Sad', postcode: '21000' },
          total_amount: 3490,
          currency: 'RSD',
        }),
      });
    } catch (err) {
      console.warn('Backend offline or simulated locally:', err);
    }

    const newOrderLog: VerificationLogItem = {
      id: orderNum,
      customer: selectedLang === 'mk' ? 'Елена Николовска' : selectedLang === 'en' ? 'Elena Petrovic' : 'Jelena Petrović',
      phone: selectedLang === 'mk' ? '+389 70 555 ****' : '+381 64 555 ****',
      status: 'APPROVED',
      channel: 'SMS Link',
      city: selectedLang === 'mk' ? 'Скопје' : selectedLang === 'en' ? 'Belgrade' : 'Novi Sad',
      amount: selectedLang === 'mk' ? '1.850 МКД' : selectedLang === 'en' ? '€32.00' : '3.490 RSD',
      time: selectedLang === 'sr' ? 'Pre 5 sek' : selectedLang === 'mk' ? 'Пред 5 сек' : '5 sec ago',
      responseTime: selectedLang === 'sr' ? '35 sek' : selectedLang === 'mk' ? '35 сек' : '35 sec',
      warehouseAction: selectedLang === 'sr'
        ? 'Spremno za slanje · WooCommerce status "Processing"'
        : selectedLang === 'mk'
        ? 'Подготвено за испраќање · WooCommerce статус "Processing"'
        : 'Ready for dispatch · WooCommerce status "Processing"',
      costSaved: '€3.50',
      history: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'order',
          badge: `WooCommerce ${orderNum}`,
          title: selectedLang === 'sr' ? 'Porudžbina kreirana (COD)' : selectedLang === 'mk' ? 'Нарачка креирана (COD)' : 'Order created (COD)',
          desc: selectedLang === 'sr'
            ? 'Kupac je izabrao plaćanje pouzećem. Verifikacioni SMS link poslat.'
            : selectedLang === 'mk'
            ? 'Купувачот избра плаќање при преземање. Испратен верификациски SMS линк.'
            : 'Customer chose cash on delivery. Verification SMS link sent.',
        },
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'action',
          badge: selectedLang === 'sr' ? 'Potvrđeno 1-Klik' : selectedLang === 'mk' ? 'Потврдено 1-Клик' : 'Confirmed 1-Click',
          title: selectedLang === 'sr' ? 'Kupac potvrdio narudžbinu' : selectedLang === 'mk' ? 'Купувачот ја потврди нарачката' : 'Customer confirmed order',
          desc: selectedLang === 'sr'
            ? 'Adresa i kontakt uspešno verifikovani bez izmena.'
            : selectedLang === 'mk'
            ? 'Адресата и контактот се успешно верификувани без измени.'
            : 'Address and contact successfully verified without changes.',
        },
      ],
    };

    const updatedOrders = [newOrderLog, ...registeredOrders];
    setRegisteredOrders(updatedOrders);
    try { localStorage.setItem('potvrdio_registered_orders', JSON.stringify(updatedOrders)); } catch {}

    const newRemaining = Math.max(0, trialRemaining - 1);
    updateActiveStore(prev => {
      const updated = { ...prev, trialRemaining: newRemaining };
      try { localStorage.setItem('potvrdio_registered_merchant', JSON.stringify(updated)); } catch {}
      return updated;
    });

    setIsSimulating(false);
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  const toggleStepHighlight = (stepNum: number) => {
    setActiveStepHighlight(stepNum);
    setTimeout(() => {
      if (walkthroughPreviewRef.current) {
        walkthroughPreviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const [selectedLang, setSelectedLang] = useState<Language>(() => {
    const saved = localStorage.getItem('potvrdio_lang') as Language | null;
    return saved && ['sr', 'mk', 'en'].includes(saved) ? saved : 'sr';
  });

  const [timeframe, setTimeframe] = useState<PeriodType>('30d');
  const [customRange, setCustomRange] = useState<DateRange>({
    start: new Date(2026, 8, 10),
    end: new Date(2026, 8, 20),
  });

  const customDays = Math.max(1, Math.round((customRange.end.getTime() - customRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  useEffect(() => {
    localStorage.setItem('potvrdio_lang', selectedLang);
  }, [selectedLang]);

  const t = translations[selectedLang];

  const statsConfig: Record<PeriodType, {
    confirmed: string;
    confirmedBadge: string;
    confirmedSub: string;
    deliveryRate: string;
    deliverySub: string;
    saved: string;
    savedSub: string;
    viberOpen: string;
    viberSub: string;
  }> = {
    '30d': {
      confirmed: '412',
      confirmedBadge: t.statConfirmedBadge,
      confirmedSub: t.statConfirmedSub,
      deliveryRate: '96.4%',
      deliverySub: t.statDeliverySub,
      saved: '€1,240',
      savedSub: t.statSavedSub,
      viberOpen: '93.8%',
      viberSub: t.statViberSub,
    },
    'lifetime': {
      confirmed: '3,840',
      confirmedBadge: selectedLang === 'sr' ? 'Ukupno od početka' : selectedLang === 'mk' ? 'Вкупно од почетокот' : 'All-time verified',
      confirmedSub: selectedLang === 'sr' ? 'Automatski obrađene COD porudžbine' : selectedLang === 'mk' ? 'Автоматски обработени COD нарачки' : 'Automated COD orders processed',
      deliveryRate: '95.8%',
      deliverySub: selectedLang === 'sr' ? 'Pre Potvrdio: 74% (Kumulativni prosek)' : selectedLang === 'mk' ? 'Пред Potvrdio: 74% (Кумулативен просек)' : 'Baseline was 74% (Cumulative)',
      saved: '€11,520',
      savedSub: selectedLang === 'sr' ? 'Sprečeni troškovi povratne poštarine' : selectedLang === 'mk' ? 'Спречени трошоци за повратна поштарина' : 'Saved in prevented return carrier fees',
      viberOpen: '92.5%',
      viberSub: selectedLang === 'sr' ? 'Globalna stopa uspešne isporuke' : selectedLang === 'mk' ? 'Глобална стапка на испорака' : 'Global message delivery rate',
    },
    '7d': {
      confirmed: '94',
      confirmedBadge: selectedLang === 'sr' ? '+6% ove nedelje' : selectedLang === 'mk' ? '+6% оваа недела' : '+6% this week',
      confirmedSub: selectedLang === 'sr' ? 'Verifikovano u zadnjih 7 dana' : selectedLang === 'mk' ? 'Верификувано во последните 7 дена' : 'Verified in the last 7 days',
      deliveryRate: '97.2%',
      deliverySub: selectedLang === 'sr' ? 'Vrhunska isporučenost ove sedmice' : selectedLang === 'mk' ? 'Врвна испорака оваа недела' : 'Peak weekly delivery performance',
      saved: '€295',
      savedSub: selectedLang === 'sr' ? 'Ušteda na kurirskim službama' : selectedLang === 'mk' ? 'Заштеда на курирски служби' : 'Saved on carrier return costs',
      viberOpen: '94.6%',
      viberSub: selectedLang === 'sr' ? 'Odziv kupaca unutar 1.8 min' : selectedLang === 'mk' ? 'Одѕив на купувачи под 1.8 мин' : 'Customer response in < 1.8 mins',
    },
    '90d': {
      confirmed: '1,180',
      confirmedBadge: selectedLang === 'sr' ? '+14% u kvartalu' : selectedLang === 'mk' ? '+14% во квартал' : '+14% this quarter',
      confirmedSub: selectedLang === 'sr' ? 'Verifikovano u zadnjih 90 dana' : selectedLang === 'mk' ? 'Верификувано во последните 90 дена' : 'Verified in the last 90 days',
      deliveryRate: '96.1%',
      deliverySub: selectedLang === 'sr' ? 'Stabilan prosek na 1.200 pošiljki' : selectedLang === 'mk' ? 'Стабилен просек на 1.200 пратки' : 'Stable average across 1,200 parcels',
      saved: '€3,540',
      savedSub: selectedLang === 'sr' ? 'Kumulativna ušteda u 3 meseca' : selectedLang === 'mk' ? 'Кумулативна заштеда за 3 месеци' : 'Cumulative 3-month savings',
      viberOpen: '93.2%',
      viberSub: selectedLang === 'sr' ? 'Konstantan visok odziv kupaca' : selectedLang === 'mk' ? 'Константен висок одѕив' : 'Sustained high response rate',
    },
    'ytd': {
      confirmed: '3,120',
      confirmedBadge: selectedLang === 'sr' ? 'U toku 2026. god' : selectedLang === 'mk' ? 'Во текот на 2026 год' : 'Year-to-date 2026',
      confirmedSub: selectedLang === 'sr' ? 'Od 1. januara do danas' : selectedLang === 'mk' ? 'Од 1 јануари до денес' : 'From Jan 1 until today',
      deliveryRate: '95.9%',
      deliverySub: selectedLang === 'sr' ? 'Godišnji prosek uspešnih COD paketa' : selectedLang === 'mk' ? 'Годишен просек на успешни COD пратки' : 'Annual delivery completion benchmark',
      saved: '€9,360',
      savedSub: selectedLang === 'sr' ? 'Sačuvano od poštanskih penala' : selectedLang === 'mk' ? 'Заштедено од поштенски пенали' : 'Saved in courier return fees',
      viberOpen: '92.9%',
      viberSub: selectedLang === 'sr' ? 'Godišnja stopa otvaranja poruka' : selectedLang === 'mk' ? 'Годишна стапка на отворање' : 'Annual message read rate',
    },
    'custom': {
      confirmed: Math.round(customDays * 13.7).toLocaleString(),
      confirmedBadge: selectedLang === 'sr' ? `${customDays} dana` : selectedLang === 'mk' ? `${customDays} дена` : `${customDays} days`,
      confirmedSub: formatDateRange(customRange.start, customRange.end, selectedLang),
      deliveryRate: '96.8%',
      deliverySub: selectedLang === 'sr' ? 'Isporučenost u izabranim danima' : selectedLang === 'mk' ? 'Испорака во избраните денови' : 'Delivery rate in selected range',
      saved: `€${Math.round(customDays * 41.3).toLocaleString()}`,
      savedSub: selectedLang === 'sr' ? 'Sprečeni neisporučeni troškovi' : selectedLang === 'mk' ? 'Спречени неиспорачани troškovi' : 'Prevented return expenses',
      viberOpen: '94.1%',
      viberSub: selectedLang === 'sr' ? 'Odziv za odabrane dane' : selectedLang === 'mk' ? 'Одѕив за избраните денови' : 'Response rate in selected range',
    },
    'since_last_purchase': {
      confirmed: '28',
      confirmedBadge: selectedLang === 'sr' ? 'Od zadnje dopune' : selectedLang === 'mk' ? 'Од последно надополнување' : 'Since last top-up',
      confirmedSub: selectedLang === 'sr' ? '18. sep 2026 – danas' : selectedLang === 'mk' ? '18 сеп 2026 – денес' : 'Sep 18, 2026 – today',
      deliveryRate: '96.8%',
      deliverySub: selectedLang === 'sr' ? 'Stopa isporuke u tekućem ciklusu' : selectedLang === 'mk' ? 'Стапка на испорака во тековниот циклус' : 'Delivery rate in current cycle',
      saved: '€84',
      savedSub: selectedLang === 'sr' ? 'Sprečeni troškovi povrata' : selectedLang === 'mk' ? 'Спречени трошоци за поврат' : 'Saved return expenses',
      viberOpen: '94.2%',
      viberSub: selectedLang === 'sr' ? 'Prosečan odziv: 2.1 min' : selectedLang === 'mk' ? 'Просечен одѕив: 2.1 мин' : 'Average turnaround: 2.1 min',
    },
  };
  const demoStats = statsConfig[timeframe] || statsConfig['30d'];
  const zeroStateStats = {
    confirmed: String(registeredOrders.length),
    confirmedBadge: registeredOrders.length === 0 ? t.statZeroConfirmedBadge : t.statZeroProcessedBadge(registeredOrders.length),
    confirmedSub: registeredOrders.length === 0 ? t.statZeroWaitingOrder : t.statZeroRemainingPilot(trialRemaining),
    deliveryRate: registeredOrders.length === 0 ? '—' : '100%',
    deliverySub: registeredOrders.length === 0 ? t.statZeroDeliveryPending : t.statZeroVerifiedAddresses,
    saved: registeredOrders.length === 0 ? '0 €' : `€${(registeredOrders.length * 3.5).toFixed(0)}`,
    savedSub: registeredOrders.length === 0 ? t.statZeroPotentialSavings : t.statZeroSavedCourier,
    viberOpen: registeredOrders.length === 0 ? '—' : '100%',
    viberSub: registeredOrders.length === 0 ? t.statZeroAwaitingFirst : t.statZeroCustomerResponse,
  };
  const activeStats = activeMerchant.isDemo ? demoStats : zeroStateStats;
  const displayLogs = activeMerchant.isDemo ? t.logs : registeredOrders;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
    }, 1200);
  };

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('potvrdio_theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('potvrdio_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const PLAN_DETAILS: Record<string, IpsPaymentPlan> = {
    starter: {
      id: 'starter',
      name: 'Starter Paket',
      euroPrice: 15,
      credits: 600,
      type: 'ONE_TIME',
    },
    growth: {
      id: 'growth',
      name: 'Growth Paket',
      euroPrice: 45,
      credits: 1875,
      type: 'ONE_TIME',
    },
    pro: {
      id: 'pro',
      name: 'Pro Scale Paket',
      euroPrice: 120,
      credits: 6000,
      type: 'ONE_TIME',
    },
    reserve: {
      id: 'reserve',
      name: 'Pro Reserve Pretplata',
      euroPrice: 29,
      credits: 1800,
      type: 'MONTHLY',
    },
  };

  const handleBuyCredit = (planId: string, cost: number, count: number) => {
    const plan = PLAN_DETAILS[planId] || {
      id: planId,
      name: `${planId.toUpperCase()} Paket`,
      euroPrice: cost,
      credits: count,
      type: 'ONE_TIME',
    };
    setSelectedPaymentPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (addedCredits: number, planId: string) => {
    const plan = PLAN_DETAILS[planId];
    updateActiveStore(prev => ({
      ...prev,
      credits: prev.credits + addedCredits,
      isTrial: false,
    }));
    if (plan) {
      setBalance(prev => prev + plan.euroPrice);
    }
  };

  if (!session) {
    return (
      <LoginView
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLoginSuccess={(accountData) => {
          const newSession: UserSession = {
            email: accountData.email,
            fullName: accountData.fullName,
            isDemo: accountData.isDemo,
            activeStoreId: accountData.activeStore.id,
            stores: accountData.stores.map((s) => ({
              ...s,
              isDemo: accountData.isDemo,
            })),
          };
          setSession(newSession);
          try {
            localStorage.setItem('potvrdio_session', JSON.stringify(newSession));
            if (!newSession.isDemo) {
              localStorage.setItem('potvrdio_real_account', JSON.stringify(newSession));
            }
          } catch {}
        }}
        onEnterDemo={() => {
          const demoSession: UserSession = {
            email: 'demo@potvrdio.online',
            fullName: 'Demo Korisnik',
            isDemo: true,
            activeStoreId: 'demo',
            stores: [DEMO_MERCHANT],
          };
          setSession(demoSession);
          // Demo is purely transient in-memory; do not persist to localStorage
          try { localStorage.removeItem('potvrdio_session'); } catch {}
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-theme-secondary font-sans transition-colors duration-200 flex">
      {/* Sidebar Navigation: w-72 with strict left-alignment and zero wrapping */}
      <aside className="w-72 bg-surface border-r border-theme min-h-screen p-5 flex flex-col justify-between hidden md:flex transition-colors shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="px-2 text-left">
            <PotvrdioLogo variant="horizontal" mode={theme} />
            <span className="block text-[10px] text-theme-muted font-medium tracking-wide mt-1 pl-10.5 text-left">MERCHANT DASHBOARD</span>
          </div>

          <nav className="space-y-1.5 pt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-start text-left gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 shadow-xs' : 'text-theme-muted hover:bg-surface-subtle hover:text-theme-primary'
              }`}
            >
              <BarChart2 className="w-4 h-4 shrink-0 text-left" />
              <span className="truncate text-left">{t.navOverview}</span>
            </button>

            <button
              onClick={() => setActiveTab('credits')}
              className={`w-full flex items-center justify-start text-left gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'credits' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 shadow-xs' : 'text-theme-muted hover:bg-surface-subtle hover:text-theme-primary'
              }`}
            >
              <Coins className="w-4 h-4 shrink-0 text-left" />
              <span className="truncate text-left">{t.navCredits}</span>
              <span className="ml-auto bg-teal-500/15 text-teal-600 dark:text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30 shrink-0">
                {isTrial ? `${trialRemaining}/25 pilot` : credits}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-start text-left gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 shadow-xs' : 'text-theme-muted hover:bg-surface-subtle hover:text-theme-primary'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0 text-left" />
              <span className="truncate text-left">{t.navSettings}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Section: Support & Store Selector at the very bottom */}
        <div className="space-y-3">
          {/* Support & Helpdesk Card */}
          <div className="glass-panel rounded-2xl p-3 border border-theme space-y-1.5 text-left">
            <div className="flex items-center gap-1.5 text-xs text-theme-muted font-medium">
              <LifeBuoy className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{t.supportTitle}</span>
            </div>

            <a 
              href="mailto:podrska@potvrdio.online" 
              className="flex items-center gap-2 text-xs font-bold text-theme-primary hover:text-teal-600 dark:hover:text-teal-400 transition-colors group"
            >
              <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate">podrska@potvrdio.online</span>
            </a>

            <div className="text-[10px] text-theme-muted leading-relaxed">
              {t.supportDesc}
            </div>
          </div>

          {/* Store Selector Component (Sol Menüde En Altta) */}
          <div className="relative pt-2 border-t border-theme">
            <button
              onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className="w-full flex items-center justify-between gap-2.5 p-2 rounded-xl bg-surface-subtle hover:bg-surface border border-theme hover:border-teal-500/40 transition-all cursor-pointer text-left shadow-2xs group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold shrink-0 shadow-2xs">
                  <Store className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-theme-primary truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {activeMerchant.storeName}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                      activeMerchant.isDemo
                        ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    }`}>
                      {activeMerchant.isDemo ? t.badgeDemoAccount : t.badgePilotAccount}
                    </span>
                  </div>
                  <div className="text-[10px] text-theme-muted font-mono truncate">
                    {activeMerchant.storeDomain}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-theme-muted group-hover:text-theme-primary transition-transform shrink-0 ${isStoreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Upward Multi-Store Dropdown Menu */}
            {isStoreDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setIsStoreDropdownOpen(false)} 
                />
                <div className="absolute left-0 bottom-full mb-2 w-72 rounded-2xl glass-panel border border-theme shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 bg-surface">
                  <div className="px-3 py-2 border-b border-theme/60 text-[11px] text-theme-muted flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate">{session.email}</span>
                  </div>

                  <div className="py-1 max-h-52 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                      {t.yourStoresLabel}
                    </div>
                    {session.stores.map((s) => {
                      const isCurrent = s.id === activeMerchant.id && !session.isDemo;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            handleSwitchStore(s.id);
                            setIsStoreDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/20'
                              : 'hover:bg-surface-subtle text-theme-secondary hover:text-theme-primary'
                          }`}
                        >
                          <div className="truncate">
                            <div className="truncate font-semibold">{s.storeName}</div>
                            <div className="text-[10px] text-theme-muted font-mono truncate">{s.storeDomain}</div>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-teal-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-theme/60 pt-1 space-y-0.5">
                    <button
                      onClick={() => { setIsStoreDropdownOpen(false); setIsAddStoreOpen(true); }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.addStoreBtn}</span>
                    </button>

                    {!session.isDemo ? (
                      <button
                        onClick={() => {
                          handleSwitchToDemo();
                          setIsStoreDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Demo (Balkan Style Shop)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsStoreDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{t.signInRealAccountBtn}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsStoreDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.logoutBtn}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Streamlined Store Banner Header */}
        <header className="sticky top-0 z-20 bg-surface/98 backdrop-blur-lg shadow-xs border-b border-theme px-6 md:px-8 h-16 flex items-center transition-colors">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Header Left: Section / Tab Title (Desktop) & Logo (Mobile) */}
            <div className="flex items-center gap-3">
              <div className="md:hidden flex items-center gap-2">
                <PotvrdioLogo variant="horizontal" mode={theme} />
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm font-bold text-theme-primary">
                {activeTab === 'overview' && (
                  <>
                    <BarChart2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{t.navOverview}</span>
                  </>
                )}
                {activeTab === 'credits' && (
                  <>
                    <Coins className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{t.navCredits}</span>
                  </>
                )}
                {activeTab === 'settings' && (
                  <>
                    <Settings className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{t.navSettings}</span>
                  </>
                )}
              </div>
            </div>

            {/* Streamlined Action Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Store Switcher Quick Button */}
              <div className="hidden sm:flex items-center">
                {session.isDemo ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-bold text-xs transition cursor-pointer shadow-xs"
                    title={selectedLang === 'sr' ? 'Prijavi se na vaš registrovani nalog' : selectedLang === 'mk' ? 'Најави се на регистрираната сметка' : 'Sign in to your registered account'}
                  >
                    <LogIn className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{t.signInBtn}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSwitchToDemo}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-xs transition cursor-pointer shadow-xs"
                    title={selectedLang === 'sr' ? 'Pregledaj demo dashboard sa 412 porudžbina' : selectedLang === 'mk' ? 'Прегледај демо контролна табла со 412 нарачки' : 'Explore demo dashboard with 412 sample orders'}
                  >
                    <Store className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{t.demoStoreBtn}</span>
                  </button>
                )}
              </div>
              {/* Language Switcher */}
              <div className="flex items-center bg-surface-subtle border border-theme rounded-xl p-1 text-xs font-semibold shadow-xs">
                {(['sr', 'mk', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                      selectedLang === lang
                        ? 'bg-teal-600 text-white font-bold shadow-xs'
                        : 'text-theme-muted hover:text-theme-primary'
                    }`}
                    title={lang === 'sr' ? 'Srbija (sr-RS)' : lang === 'mk' ? 'Северна Македонија (mk-MK)' : 'International (en-US)'}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Quick Credit Top-up Pill */}
              <button 
                onClick={() => setActiveTab('credits')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-subtle hover:bg-surface border border-theme hover:border-teal-500/40 text-theme-primary font-bold text-xs transition-all cursor-pointer shadow-xs"
                title={t.topUpCredits}
              >
                {isTrial ? (
                  <>
                    <Rocket className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{trialRemaining}/25</span>
                    <span className="text-teal-600 dark:text-teal-400 text-[11px] font-semibold hidden md:inline">
                      {t.pilotVerificationsLabel}
                    </span>
                  </>
                ) : (
                  <>
                    <Coins className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{credits}</span>
                    <span className="text-theme-muted text-[11px] font-normal hidden md:inline">{t.remaining}</span>
                  </>
                )}
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-surface-subtle hover:bg-surface border border-theme text-theme-secondary hover:text-theme-primary transition-all cursor-pointer flex items-center justify-center shadow-xs"
                title={theme === 'dark' ? t.themeLightTitle : t.themeDarkTitle}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-surface-subtle hover:bg-red-500/10 border border-theme hover:border-red-500/30 text-theme-muted hover:text-red-500 transition-all cursor-pointer flex items-center justify-center shadow-xs"
                title={t.logoutBtn}
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Demo Mode Top Notification Banner */}
        {session.isDemo && (
          <div className="bg-gradient-to-r from-purple-950/90 via-purple-900/80 to-purple-950/90 border-b border-purple-500/40 px-6 py-2.5 text-xs text-purple-100 flex items-center justify-between flex-wrap gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{t.demoBannerNotice}</span>
            </div>
            <div className="flex items-center gap-2">
              {hasRealAccount ? (
                /* Merchant ALREADY in pilot period: NO "Register" button! Direct return button */
                <button
                  onClick={handleRestoreRealSession}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>
                    {selectedLang === 'sr'
                      ? `Povratak na vaš nalog (${realStoreName})`
                      : selectedLang === 'mk'
                      ? `Назад кон вашиот налог (${realStoreName})`
                      : `Back to Your Store (${realStoreName})`}
                  </span>
                </button>
              ) : (
                /* Pure guest browsing demo without an account: show Sign in and Register */
                <>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                  >
                    {t.demoBannerSignIn}
                  </button>
                  <a
                    href={LANDING_URL}
                    className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-purple-50 text-purple-950 border border-purple-200 font-bold text-xs transition shadow-xs"
                  >
                    {t.demoBannerRegister}
                  </a>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header & Timeframe Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-theme-primary flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    {t.navOverview}
                  </h2>
                  <p className="text-xs text-theme-muted mt-0.5">
                    {t.overviewMetricsSubtitle}
                  </p>
                </div>

                {/* Timeframe Date Range Picker Dropdown */}
                <DateRangePicker 
                  selectedPeriod={timeframe} 
                  customRange={customRange}
                  onApply={(p, _label, range) => {
                    setTimeframe(p);
                    if (range) {
                      setCustomRange(range);
                    }
                  }} 
                  lang={selectedLang} 
                />
              </div>

              {/* Pilot / Probni Period (25 Guaranteed Verifications) Card */}
              {isTrial && (
                <div className="p-4 sm:p-5 rounded-2xl bg-surface border-2 border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200">
                  <div className="space-y-1.5 max-w-xl w-full">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold text-[10px] uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
                        <Rocket className="w-3 h-3 text-teal-500" />
                        <span>{t.pilotTrialBannerTitle}</span>
                      </span>
                      <span className="text-xs font-bold text-theme-primary">
                        {t.pilotTrialRemainingText(trialRemaining)}
                      </span>
                    </div>
                    <p className="text-xs text-theme-muted leading-relaxed">
                      {t.pilotTrialDesc}
                    </p>
                    {/* Progress Bar */}
                    <div className="w-full bg-surface-subtle border border-theme h-2 rounded-full overflow-hidden mt-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
                        style={{ width: `${Math.max(8, ((25 - trialRemaining) / 25) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyCredit('growth', 45, 1875)}
                    className="shrink-0 px-4 py-2.5 rounded-xl btn-brand-cta text-white font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer min-h-[40px]"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{selectedLang === 'sr' ? 'Aktiviraj Kredite (IPS QR)' : selectedLang === 'mk' ? 'Активирај Кредити (IPS QR)' : 'Upgrade to Credits (IPS QR)'}</span>
                  </button>
                </div>
              )}

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-all shadow-card">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>{t.statConfirmedTitle}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary flex items-baseline gap-2">
                    {activeStats.confirmed} 
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {activeStats.confirmedBadge}
                    </span>
                  </div>
                  <div className="text-[11px] text-theme-muted">{activeStats.confirmedSub}</div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-all shadow-card">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>{t.statDeliveryTitle}</span>
                    <TrendingUp className="w-4 h-4 text-teal-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary">{activeStats.deliveryRate}</div>
                  <div className="text-[11px] text-theme-muted">{activeStats.deliverySub}</div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-all shadow-card">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>{t.statSavedTitle}</span>
                    <Layers className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary text-emerald-600 dark:text-emerald-400">{activeStats.saved}</div>
                  <div className="text-[11px] text-theme-muted">{activeStats.savedSub}</div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-theme space-y-2 hover:border-teal-500/30 transition-all shadow-card">
                  <div className="flex items-center justify-between text-theme-muted text-xs">
                    <span>{t.statViberTitle}</span>
                    <MessageSquare className="w-4 h-4 text-pink-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-theme-primary">{activeStats.viberOpen}</div>
                  <div className="text-[11px] text-theme-muted">{activeStats.viberSub}</div>
                </div>
              </div>

              {/* Logs Table Section */}
              <div className="glass-panel rounded-2xl p-6 border border-theme space-y-4 shadow-card">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold text-theme-primary">{t.tableTitle}</h3>
                    <p className="text-xs text-theme-muted mt-0.5">{t.tableSubtitle}</p>
                    {displayLogs.length > 0 && (
                      <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 mt-1">
                        <ChevronRight className="w-3 h-3" /> {t.tableExpandHint}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {activeMerchant.isDemo && (
                      <button
                        onClick={handleSimulateTestOrder}
                        disabled={isSimulating}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        title={t.simulateOrderTitleTooltip}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isSimulating ? t.simulatingBtn : t.simulateOrderBtn}</span>
                      </button>
                    )}
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                      {t.tableBadge} · {displayLogs.length} {t.orderCountUnit}
                    </span>
                  </div>
                </div>

                {displayLogs.length === 0 ? (
                  !activeMerchant.isConnected ? (
                    /* STATE 1: STORE NOT CONNECTED YET (Actionable 3-Step Setup Onboarding) */
                    <div className="py-6 px-3 sm:px-4 max-w-2xl mx-auto space-y-6">
                      <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          <span>{t.connPendingBadge}</span>
                        </div>
                        <h4 className="text-lg font-bold text-theme-primary">
                          {t.connectStoreTitle}
                        </h4>
                        <p className="text-xs text-theme-muted max-w-lg mx-auto leading-relaxed">
                          {t.connectStoreDesc}
                        </p>
                      </div>

                      {/* 3 Steps Container */}
                      <div className="grid grid-cols-1 gap-3.5">
                        {/* Step 1 */}
                        <div className="p-4 rounded-2xl bg-surface-subtle border border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-theme-primary flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                              <span>{t.stepDownloadPluginTitle}</span>
                            </div>
                            <p className="text-[11px] text-theme-muted pl-7">
                              {t.stepDownloadPluginDesc}
                            </p>
                          </div>
                          <a
                            href="/potvrdio-woocommerce.zip"
                            download="potvrdio-woocommerce.zip"
                            className="shrink-0 px-3.5 py-2 rounded-xl btn-brand-cta text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition hover:opacity-95"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t.downloadPluginBtn}</span>
                          </a>
                        </div>

                        {/* Step 2 */}
                        <div className="p-4 rounded-2xl bg-surface-subtle border border-theme space-y-3 shadow-2xs">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="text-xs font-bold text-theme-primary flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                                <span>{t.stepPasteKeysTitle}</span>
                              </div>
                              <button
                                onClick={() => setActiveTab('settings')}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 hover:underline cursor-pointer transition-colors"
                              >
                                <span>{t.seeDetailsBtn}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[11px] text-theme-muted pl-7">
                              {t.stepPasteKeysDesc}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pl-0 sm:pl-7">
                            {/* 1. API Endpoint */}
                            <div className="p-2.5 rounded-xl bg-surface border border-theme flex items-center justify-between gap-2 shadow-xs">
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">1. Central API Endpoint</div>
                                <div className="font-mono text-xs text-theme-primary font-semibold truncate" title="https://api.potvrdio.online/api/v1">
                                  https://api.potvrdio.online/api/v1
                                </div>
                              </div>
                              <button
                                onClick={() => handleCopy('https://api.potvrdio.online/api/v1', 'onboardingEndpoint')}
                                className="p-1.5 rounded-lg hover:bg-surface-subtle text-theme-muted hover:text-teal-600 transition cursor-pointer shrink-0"
                                title="Copy API Endpoint"
                              >
                                {copiedField === 'onboardingEndpoint' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            {/* 2. API Key */}
                            <div className="p-2.5 rounded-xl bg-surface border border-theme flex items-center justify-between gap-2 shadow-xs">
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">2. API Key (Store ID)</div>
                                <div className="font-mono text-xs text-theme-primary font-semibold truncate" title={activeMerchant.apiKey}>
                                  {activeMerchant.apiKey}
                                </div>
                              </div>
                              <button
                                onClick={() => handleCopy(activeMerchant.apiKey, 'onboardingApiKey')}
                                className="p-1.5 rounded-lg hover:bg-surface-subtle text-theme-muted hover:text-teal-600 transition cursor-pointer shrink-0"
                                title="Copy API Key"
                              >
                                {copiedField === 'onboardingApiKey' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            {/* 3. API Secret (HMAC Signature Key) */}
                            <div className="p-2.5 rounded-xl bg-surface border border-theme flex items-center justify-between gap-2 shadow-xs">
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide flex items-center gap-1">
                                  <span>3. API Secret (HMAC)</span>
                                </div>
                                <div className="font-mono text-xs text-theme-primary font-semibold truncate" title={merchantSecret}>
                                  {isSecretVisible ? merchantSecret : '••••••••••••••••'}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setIsSecretVisible(prev => !prev)}
                                  className="p-1.5 rounded-lg hover:bg-surface-subtle text-theme-muted hover:text-theme-primary transition cursor-pointer"
                                  title={isSecretVisible ? 'Hide Secret' : 'Show Secret'}
                                >
                                  {isSecretVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleCopy(merchantSecret, 'onboardingApiSecret')}
                                  className="p-1.5 rounded-lg hover:bg-surface-subtle text-theme-muted hover:text-teal-600 transition cursor-pointer"
                                  title="Copy API Secret"
                                >
                                  {copiedField === 'onboardingApiSecret' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-2.5">
                          <div className="p-4 rounded-2xl bg-surface-subtle border border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-theme-primary flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                                <span>{t.stepVerifyTitle}</span>
                              </div>
                              <p className="text-[11px] text-theme-muted pl-7">
                                {t.stepVerifyDesc}
                              </p>
                            </div>
                            <button
                              onClick={handleVerifyStoreConnection}
                              disabled={isVerifyingConnection}
                              className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition disabled:opacity-60"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingConnection ? 'animate-spin' : ''}`} />
                              <span>{isVerifyingConnection ? t.verifyingConnectionBtn : t.verifyConnectionBtn}</span>
                            </button>
                          </div>

                          {/* Connection Failure Notice (when no signal received yet) */}
                          {connectionError && (
                            <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-3 shadow-2xs animate-in fade-in duration-200">
                              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                              <div className="space-y-1 flex-1">
                                <div className="font-bold text-amber-900 dark:text-amber-100 flex items-center justify-between">
                                  <span>{t.connectionFailedTitle}</span>
                                  <button
                                    onClick={() => setConnectionError(null)}
                                    className="text-theme-muted hover:text-theme-primary text-xs cursor-pointer px-1 py-0.5 rounded hover:bg-amber-500/10"
                                    title="Close notice"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-200/90">
                                  {connectionError}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Try in Demo sandbox prompt */}
                      <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-purple-700 dark:text-purple-300">
                          <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                          <span>{t.tryDemoSandboxPrompt}</span>
                        </div>
                        <button
                          onClick={handleSwitchToDemo}
                          className="shrink-0 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.tryDemoSandboxBtn}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* STATE 2: STORE CONNECTED, AWAITING FIRST LIVE COD ORDER */
                    <div className="py-12 px-4 text-center max-w-lg mx-auto space-y-4 animate-in fade-in">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{t.connConnectedBadge}</span>
                        </div>
                        <h4 className="text-base font-bold text-theme-primary">
                          {t.connectedAwaitingOrdersTitle}
                        </h4>
                        <p className="text-xs text-theme-muted leading-relaxed">
                          {t.connectedAwaitingOrdersDesc(activeMerchant.storeDomain, trialRemaining)}
                        </p>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          onClick={() => setActiveTab('settings')}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-subtle border border-theme text-theme-secondary hover:text-theme-primary font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Settings className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span>{t.navSettings}</span>
                        </button>
                        <button
                          onClick={handleSwitchToDemo}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                          <span>{t.tryDemoSandboxBtn}</span>
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-theme-secondary">
                      <thead className="bg-surface-subtle text-theme-muted uppercase tracking-wider text-[10px] border-b border-theme">
                        <tr>
                          <th className="py-3 px-4 rounded-l-xl">{t.colOrder}</th>
                          <th className="py-3 px-4">{t.colCustomer}</th>
                          <th className="py-3 px-4">{t.colCity}</th>
                          <th className="py-3 px-4">{t.colAmount}</th>
                          <th className="py-3 px-4">{t.colStatus}</th>
                          <th className="py-3 px-4 rounded-r-xl">{t.colTime}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme">
                        {displayLogs.map((log) => {
                        const isExpanded = expandedRowId === log.id;
                        return (
                          <React.Fragment key={log.id}>
                            <tr 
                              onClick={() => toggleRowExpand(log.id)}
                              className={`cursor-pointer transition-all ${
                                isExpanded 
                                  ? 'bg-surface-subtle/80 shadow-2xs' 
                                  : 'hover:bg-surface-subtle/50'
                              }`}
                            >
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleRowExpand(log.id);
                                    }}
                                    className={`p-1 rounded-md hover:bg-surface border border-transparent hover:border-theme transition-all ${
                                      isExpanded 
                                        ? 'text-teal-600 dark:text-teal-400 rotate-90 bg-surface shadow-2xs' 
                                        : 'text-theme-muted'
                                    }`}
                                    aria-label="Toggle verification history"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200" />
                                  </button>
                                  <span className="font-bold text-theme-primary font-mono">{log.id}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-theme-primary">{log.customer}</div>
                                <div className="text-[10px] text-theme-muted font-mono">{log.phone}</div>
                              </td>
                              <td className="py-3.5 px-4 text-theme-secondary">{log.city}</td>
                              <td className="py-3.5 px-4 font-bold text-teal-600 dark:text-teal-400 font-mono">{log.amount}</td>
                              <td className="py-3.5 px-4">
                                {log.status === 'APPROVED' && (
                                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                                    <CheckCircle2 className="w-3 h-3" /> {t.statusApproved} ({log.channel})
                                  </span>
                                )}
                                {log.status === 'EDITED_ADDRESS' && (
                                  <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-semibold">
                                    <Sparkles className="w-3 h-3" /> {t.statusAddressEdited}
                                  </span>
                                )}
                                {log.status === 'SMS_FALLBACK' && (
                                  <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-semibold">
                                    <AlertTriangle className="w-3 h-3" /> {t.statusSmsFallback}
                                  </span>
                                )}
                                {log.status === 'CANCELLED' && (
                                  <span 
                                    className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full font-semibold"
                                    title={selectedLang === 'sr' ? 'Kupac otkazao pre slanja — sprečen trošak povrata paketa!' : selectedLang === 'mk' ? 'Купувачот откажа пред праќање — спречен трошок за поврат!' : 'Buyer cancelled before shipping — prevented return courier fee!'}
                                  >
                                    <XCircle className="w-3 h-3" /> {t.statusCancelled} ({log.channel})
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-theme-muted font-medium">{log.time}</td>
                            </tr>

                            {/* Expandable History Drawer */}
                            {isExpanded && (
                              <tr className="bg-surface-subtle/30 border-b border-theme">
                                <td colSpan={6} className="p-0">
                                  <div className="p-4 sm:p-6 border-l-4 border-l-teal-500 bg-surface/70 dark:bg-surface-subtle/40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* Drawer Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-theme/60">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                                          <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                          <div className="text-xs font-bold text-theme-primary flex items-center gap-2">
                                            <span>{t.timelineHeading}</span>
                                            <span className="font-mono text-[10px] text-teal-700 dark:text-teal-300 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 font-bold">
                                              {log.id}
                                            </span>
                                          </div>
                                          <div className="text-[10px] text-theme-muted mt-0.5">
                                            {log.customer} · {log.city} · {log.amount}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 flex-wrap text-xs">
                                        <div className="flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-xl border border-theme shadow-2xs">
                                          <span className="text-[10px] font-semibold text-theme-muted">{t.timelineResponseTimeLabel}:</span>
                                          <span className="font-bold text-[11px] text-theme-primary font-mono">{log.responseTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-xl border border-theme shadow-2xs">
                                          <span className="text-[10px] font-semibold text-theme-muted">{t.timelineChannelLabel}:</span>
                                          <span className="font-bold text-[11px] text-teal-600 dark:text-teal-400">{log.channel}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Drawer Body: Timeline + Summary Box */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                      {/* Vertical Timeline */}
                                      <div className="lg:col-span-2 pt-1">
                                        <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-emerald-500 before:to-slate-300 dark:before:to-slate-700">
                                          {log.history.map((event, eventIdx) => (
                                            <div key={eventIdx} className="relative group">
                                              {/* Milestone Node Icon on line */}
                                              <div className="absolute -left-[32px] top-0 w-6 h-6 rounded-full flex items-center justify-center shadow-xs ring-4 ring-surface bg-surface border border-theme">
                                                {event.type === 'order' && <Store className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                                                {event.type === 'dispatch' && <MessageSquare className="w-3 h-3 text-viber-purple" />}
                                                {event.type === 'read' && <Eye className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                                                {event.type === 'action' && (log.status === 'EDITED_ADDRESS' ? <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />)}
                                                {event.type === 'fallback' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                                                {event.type === 'cancel' && <XCircle className="w-3 h-3 text-rose-500" />}
                                                {event.type === 'saved' && <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                                              </div>

                                              <div className="bg-surface rounded-xl p-3 border border-theme shadow-2xs space-y-1">
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                  <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs text-theme-primary">{event.title}</span>
                                                    {event.badge && (
                                                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-subtle border border-theme text-theme-secondary">
                                                        {event.badge}
                                                      </span>
                                                    )}
                                                  </div>
                                                  <span className="font-mono text-[10px] font-semibold text-theme-muted bg-surface-subtle px-1.5 py-0.5 rounded border border-theme">
                                                    {event.time}
                                                  </span>
                                                </div>
                                                <p className="text-xs text-theme-muted leading-relaxed">{event.desc}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Right Operational Summary Card */}
                                      <div className="space-y-3">
                                        <div className="p-4 rounded-xl bg-surface border border-theme shadow-xs space-y-3">
                                          <div className="text-xs font-bold text-theme-primary uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-theme/60">
                                            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                            {t.timelineSummaryTitle}
                                          </div>

                                          {/* Warehouse Outcome */}
                                          <div className="space-y-1">
                                            <div className="text-[10px] uppercase font-bold text-theme-muted">{t.timelineOutcomeLabel}</div>
                                            <div className="text-xs font-semibold text-theme-primary bg-surface-subtle p-2.5 rounded-lg border border-theme flex items-start gap-2">
                                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                                              <span>{log.warehouseAction}</span>
                                            </div>
                                          </div>

                                          {/* Updated Address if applicable */}
                                          {log.updatedAddress && (
                                            <div className="space-y-1">
                                              <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {t.timelineAddressCorrectionLabel}
                                              </div>
                                              <div className="text-xs font-medium text-blue-950 dark:text-blue-200 bg-blue-500/10 p-2.5 rounded-lg border border-blue-500/20">
                                                {log.updatedAddress}
                                              </div>
                                            </div>
                                          )}

                                          {/* Prevented Costs if applicable */}
                                          {log.costSaved && (
                                            <div className="space-y-1">
                                              <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" /> {t.timelineSavingsLabel}
                                              </div>
                                              <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                                                {log.costSaved}
                                              </div>
                                            </div>
                                          )}

                                          {/* Customer Contact Quick Reference */}
                                          <div className="pt-2 border-t border-theme/60 flex items-center justify-between text-[11px] text-theme-muted font-mono">
                                            <span>{log.phone}</span>
                                            <span className="font-bold text-theme-primary">{log.amount}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

          {/* TAB 2: CREDIT PACKAGES & MOR BILLING */}
          {/* TAB 2: CREDITS */}
          {activeTab === 'credits' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-theme-primary">{t.creditsHeading}</h2>
                  <p className="text-xs text-theme-muted mt-1">{t.creditsSubheading}</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-semibold self-start sm:self-auto">
                  <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>
                    {selectedLang === 'sr'
                      ? 'Zvanično B2B Plaćanje: NBS IPS QR & Predračun'
                      : selectedLang === 'mk'
                      ? 'Официјално B2B Плаќање: NBS IPS QR & Фактура'
                      : 'Official B2B Payment: NBS IPS QR & Invoice'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Starter Package */}
                <div className="glass-panel rounded-2xl p-6 border border-theme flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-card">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-theme-muted uppercase tracking-wider">{t.starterTitle}</div>
                    <div className="text-3xl font-black text-theme-primary">€15</div>
                    <div className="text-sm font-bold text-teal-600 dark:text-teal-400">{t.starterCredits}</div>
                    <p className="text-xs text-theme-muted leading-relaxed">{t.starterDesc}</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('starter', 15, 600)}
                    disabled={purchasing === 'starter'}
                    className="btn-select-wave w-full mt-6 bg-surface hover:bg-surface-subtle border border-theme text-theme-primary font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span>{purchasing === 'starter' ? t.loadingText : t.starterBtn}</span>
                  </button>
                </div>

                {/* Growth Package */}
                <div className="glass-panel rounded-2xl p-6 border-2 border-teal-500/60 bg-teal-500/5 flex flex-col justify-between relative shadow-xl shadow-teal-500/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm">
                    {t.growthBadge}
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold text-teal-600 dark:text-teal-300 uppercase tracking-wider">{t.growthTitle}</div>
                    <div className="text-3xl font-black text-theme-primary">€45</div>
                    <div className="text-sm font-bold text-teal-600 dark:text-teal-400">{t.growthCredits}</div>
                    <p className="text-xs text-theme-muted leading-relaxed">{t.growthDesc}</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('growth', 45, 1875)}
                    disabled={purchasing === 'growth'}
                    className="btn-brand-cta w-full mt-6 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>{purchasing === 'growth' ? t.loadingText : t.growthBtn}</span>
                  </button>
                </div>

                {/* Pro Package */}
                <div className="glass-panel rounded-2xl p-6 border border-theme flex flex-col justify-between hover:border-teal-500/40 transition-all shadow-card">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-theme-muted uppercase tracking-wider">{t.proTitle}</div>
                    <div className="text-3xl font-black text-theme-primary">€120</div>
                    <div className="text-sm font-bold text-teal-600 dark:text-teal-400">{t.proCredits}</div>
                    <p className="text-xs text-theme-muted leading-relaxed">{t.proDesc}</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('pro', 120, 6000)}
                    disabled={purchasing === 'pro'}
                    className="btn-select-wave w-full mt-6 bg-surface hover:bg-surface-subtle border border-theme text-theme-primary font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span>{purchasing === 'pro' ? t.loadingText : t.proBtn}</span>
                  </button>
                </div>

                {/* Pro Reserve Subscription */}
                <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between relative shadow-card">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t.reserveTitle}</div>
                    <div className="text-3xl font-black text-theme-primary">€29 <span className="text-xs text-theme-muted font-normal">{t.reservePerMonth}</span></div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t.reserveCredits}</div>
                    <p className="text-xs text-theme-muted leading-relaxed">{t.reserveDesc}</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredit('reserve', 29, 1800)}
                    disabled={purchasing === 'reserve'}
                    className="btn-brand-cta w-full mt-6 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>{purchasing === 'reserve' ? t.loadingText : t.reserveBtn}</span>
                  </button>
                </div>
              </div>

              {/* CREDIT TOP-UP & USAGE HISTORY (LEDGER) */}
              {(() => {
                const ledgerData = getCreditLedgerData(selectedLang);
                const activeStats: CreditSummaryStats = activeMerchant.isDemo 
                  ? (ledgerData.stats[creditTimeframe] || ledgerData.stats.since_last_purchase)
                  : {
                      startingBalance: 25,
                      topUps: 25,
                      viberSpent: 0,
                      smsSpent: registeredOrders.length,
                      remainingBalance: trialRemaining,
                    };
                const activeTransactions: CreditLedgerTransaction[] = activeMerchant.isDemo
                  ? (ledgerData.transactions[creditTimeframe] || [])
                  : [
                      ...registeredOrders.map((ro) => ({
                        id: `TX-${ro.id.replace('#', '')}`,
                        date: ro.time,
                        type: 'SMS' as const,
                        title: selectedLang === 'sr' ? 'Verifikacija porudžbine' : selectedLang === 'mk' ? 'Верификација на нарачка' : 'Order verification',
                        description: `${ro.id} · ${ro.customer} (${ro.city})`,
                        channel: 'SMS Fallback',
                        creditsChange: -1,
                        balanceAfter: trialRemaining,
                        receiptNumber: `ORD-${ro.id.replace('#', '')}`,
                      })),
                      {
                        id: 'TX-PILOT-INIT',
                        date: selectedLang === 'sr' ? 'Registracija' : selectedLang === 'mk' ? 'Регистрација' : 'Registration',
                        type: 'TOPUP' as const,
                        title: selectedLang === 'sr' ? 'Aktivacija naloga' : selectedLang === 'mk' ? 'Активација на налог' : 'Account activation',
                        description: selectedLang === 'sr' ? '25 besplatnih verifikacija' : selectedLang === 'mk' ? '25 бесплатни верификации' : '25 free verifications',
                        channel: 'Potvrdio Pilot',
                        creditsChange: 25,
                        balanceAfter: 25,
                        receiptNumber: 'PILOT-25-FREE',
                      }
                    ];

                const handleDownloadReceipt = (receiptNo: string, e: React.MouseEvent) => {
                  e.stopPropagation();
                  setDownloadingReceiptId(receiptNo);
                  setTimeout(() => {
                    setDownloadingReceiptId(null);
                    const blob = new Blob([
                      `POTVRDIO VIBER COD - OFFICIAL RECEIPT / POTVRDA O DOPUNI\n` +
                      `=======================================================\n` +
                      `Receipt Reference: ${receiptNo}\n` +
                      `Store Domain: ${activeMerchant.storeDomain}\n` +
                      `Date of Issue: ${new Date().toISOString().split('T')[0]}\n` +
                      `Current Balance: ${activeMerchant.isDemo ? '1,875 credits' : `${trialRemaining} verif.`}\n` +
                      `Processor: NBS IPS QR / B2B Bank Transfer (Predračun)\n` +
                      `Security Status: Verified via SHA-256 HMAC\n` +
                      `=======================================================\n`
                    ], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `potvrdio-receipt-${receiptNo}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }, 600);
                };

                return (
                  <div className="glass-panel rounded-2xl border border-theme p-6 sm:p-7 space-y-6 shadow-card">
                    {/* Header & Timeframe Filter */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-theme">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                          <History className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-theme-primary">{t.ledgerHeading}</h3>
                          <p className="text-xs text-theme-muted mt-0.5">{t.ledgerSubheading}</p>
                        </div>
                      </div>

                      {/* Date Range Picker Dropdown (Same component as Overview) */}
                      <DateRangePicker
                        mode="credits"
                        selectedPeriod={creditTimeframe}
                        lang={selectedLang}
                        onApply={(period) => {
                          if (period !== 'custom') {
                            setCreditTimeframe(period as CreditTimeframe);
                          }
                        }}
                      />
                    </div>

                    {/* 4 Metric Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 1: Starting Balance */}
                      <div className="p-4 rounded-xl bg-surface-subtle/50 border border-theme flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider">{t.ledgerStartingBalance}</span>
                          <Clock className="w-4 h-4 text-theme-muted" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-theme-primary">{activeStats.startingBalance.toLocaleString()}</span>
                          <span className="text-xs text-theme-muted">{t.ledgerCreditsUnit}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-theme-muted">
                          {activeStats.topUps > 0 ? `+${activeStats.topUps.toLocaleString()} ${t.ledgerCreditsUnit} ${t.ledgerTopupsLabel.toLowerCase()}` : `0 ${t.ledgerCreditsUnit}`}
                        </div>
                      </div>

                      {/* 2: Viber Dispatches */}
                      <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">{t.ledgerViberSent}</span>
                          <MessageSquare className="w-4 h-4 text-viber-purple" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-viber-purple">-{activeStats.viberSpent.toLocaleString()}</span>
                          <span className="text-xs text-purple-600/70 dark:text-purple-400/70">{t.ledgerCreditsUnit}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-purple-600/80 dark:text-purple-400/80 font-medium">
                          €0.024 / msg · Viber Business
                        </div>
                      </div>

                      {/* 3: SMS Fallback */}
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{t.ledgerSmsSent}</span>
                          <Send className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">-{activeStats.smsSpent.toLocaleString()}</span>
                          <span className="text-xs text-amber-600/70 dark:text-amber-400/70">{t.ledgerCreditsUnit}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-amber-600/80 dark:text-amber-400/80 font-medium">
                          Tier-1 Direct Carrier Routes
                        </div>
                      </div>

                      {/* 4: Remaining Balance */}
                      <div className="p-4 rounded-xl bg-teal-500/10 border-2 border-teal-500/40 flex flex-col justify-between shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">{t.ledgerRemainingBalance}</span>
                          <Coins className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-teal-600 dark:text-teal-400">{activeStats.remainingBalance.toLocaleString()}</span>
                          <span className="text-xs font-semibold text-teal-600/80 dark:text-teal-400/80">{t.ledgerCreditsUnit}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-teal-600/90 dark:text-teal-400/90 font-medium">
                          ≈ {activeStats.remainingBalance} parcel verifications ready
                        </div>
                      </div>
                    </div>

                    {/* Itemized Transaction Table */}
                    <div className="border border-theme rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-surface-subtle text-theme-muted uppercase tracking-wider text-[10px] border-b border-theme">
                            <tr>
                              <th className="py-3 px-4">{t.ledgerTableColDate}</th>
                              <th className="py-3 px-4">{t.ledgerTableColType}</th>
                              <th className="py-3 px-4">{t.ledgerTableColDesc}</th>
                              <th className="py-3 px-4 text-right">{t.ledgerTableColChange}</th>
                              <th className="py-3 px-4 text-right">{t.ledgerTableColBalance}</th>
                              <th className="py-3 px-4 text-right">{t.ledgerTableColReceipt}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-theme">
                            {activeTransactions.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-theme-muted text-xs">
                                  {t.ledgerEmpty}
                                </td>
                              </tr>
                            ) : (
                              activeTransactions.map((tx) => {
                                const isTopup = tx.type === 'TOPUP';
                                const isViber = tx.type === 'VIBER';
                                const isSms = tx.type === 'SMS';

                                return (
                                  <tr key={tx.id} className="hover:bg-surface-subtle/50 transition-colors">
                                    {/* Date */}
                                    <td className="py-3 px-4 text-theme-muted whitespace-nowrap font-mono text-[11px]">
                                      {tx.date}
                                    </td>

                                    {/* Type / Channel Badge */}
                                    <td className="py-3 px-4 whitespace-nowrap">
                                      {isTopup && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                          <ArrowUpRight className="w-3 h-3" />
                                          TOP-UP
                                        </span>
                                      )}
                                      {isViber && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-500/10 text-viber-purple border border-purple-500/20">
                                          <MessageSquare className="w-3 h-3" />
                                          Viber
                                        </span>
                                      )}
                                      {isSms && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                          <ArrowDownRight className="w-3 h-3" />
                                          SMS Fallback
                                        </span>
                                      )}
                                    </td>

                                    {/* Description */}
                                    <td className="py-3 px-4">
                                      <div className="font-semibold text-theme-primary">{tx.title}</div>
                                      <div className="text-[11px] text-theme-muted">{tx.description}</div>
                                    </td>

                                    {/* Credit Change */}
                                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold">
                                      {isTopup ? (
                                        <span className="text-emerald-600 dark:text-emerald-400">
                                          +{tx.creditsChange.toLocaleString()}
                                        </span>
                                      ) : (
                                        <span className="text-theme-primary">
                                          {tx.creditsChange.toLocaleString()}
                                        </span>
                                      )}
                                    </td>

                                    {/* Running Balance */}
                                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-semibold text-theme-muted">
                                      {tx.balanceAfter.toLocaleString()}
                                    </td>

                                    {/* Receipt Download */}
                                    <td className="py-3 px-4 text-right whitespace-nowrap">
                                      {tx.receiptNumber ? (
                                        <button
                                          onClick={(e) => handleDownloadReceipt(tx.receiptNumber!, e)}
                                          disabled={downloadingReceiptId === tx.receiptNumber}
                                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                          title={`Receipt ${tx.receiptNumber}`}
                                        >
                                          {downloadingReceiptId === tx.receiptNumber ? (
                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                          ) : (
                                            <Download className="w-3 h-3" />
                                          )}
                                          {tx.receiptNumber}
                                        </button>
                                      ) : (
                                        <span className="text-[11px] text-theme-muted/50">—</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: SETTINGS & VISUAL WORDPRESS API KEY GUIDE */}
          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-5xl">
              {/* Header */}
              <div>
                <h2 className="text-xl font-bold text-theme-primary flex items-center gap-2">
                  <Key className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  {t.settingsHeading}
                </h2>
                <p className="text-xs text-theme-muted mt-1">
                  {t.settingsSubheading}
                </p>
              </div>

              {/* Grid: Left Column = API Keys with Copy Buttons | Right Column = Live Connection Test */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* API Keys Card (2 cols) */}
                <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-theme space-y-5 shadow-card">
                  <div className="flex items-center justify-between pb-3 border-b border-theme">
                    <div>
                      <h3 className="text-sm font-bold text-theme-primary">{t.credentialsTitle}</h3>
                      <p className="text-[11px] text-theme-muted">{t.credentialsSub}</p>
                    </div>
                    <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 px-2.5 py-1 rounded-full font-bold">
                      {t.shaSecurity}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Endpoint */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-theme-secondary flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-surface-subtle text-teal-600 dark:text-teal-400 text-[10px] font-bold flex items-center justify-center border border-theme">1</span>
                          {t.labelEndpoint}
                        </label>
                        {copiedField === 'endpoint' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> {t.copiedBtn}
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          readOnly
                          value="https://api.potvrdio.online/api/v1"
                          className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 pr-24 text-xs text-teal-600 dark:text-teal-400 font-mono select-all focus:outline-none focus:border-teal-500"
                        />
                        <button
                          onClick={() => handleCopy('https://api.potvrdio.online/api/v1', 'endpoint')}
                          className="absolute right-2 px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-600 dark:text-teal-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-teal-500/20"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{t.copyBtn}</span>
                        </button>
                      </div>
                    </div>

                    {/* API Key */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-theme-secondary flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-surface-subtle text-teal-600 dark:text-teal-400 text-[10px] font-bold flex items-center justify-center border border-theme">2</span>
                          {t.labelApiKey}
                        </label>
                        {copiedField === 'key' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> {t.copiedBtn}
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          readOnly
                          value={activeMerchant.apiKey}
                          className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 pr-24 text-xs text-theme-primary font-mono select-all font-bold focus:outline-none focus:border-teal-500"
                        />
                        <button
                          onClick={() => handleCopy(activeMerchant.apiKey, 'key')}
                          className="absolute right-2 px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-600 dark:text-teal-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-teal-500/20"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{t.copyBtn}</span>
                        </button>
                      </div>
                    </div>

                    {/* API Secret */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-theme-secondary flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-surface-subtle text-teal-600 dark:text-teal-400 text-[10px] font-bold flex items-center justify-center border border-theme">3</span>
                          {t.labelApiSecret}
                        </label>
                        {copiedField === 'secret' && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                            <Check className="w-3 h-3" /> {t.copiedBtn}
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type={isSecretVisible ? "text" : "password"}
                          readOnly
                          value={merchantSecret}
                          className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 pr-28 text-xs text-theme-secondary font-mono select-all focus:outline-none focus:border-teal-500"
                        />
                        <div className="absolute right-2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setIsSecretVisible(prev => !prev)}
                            className="p-1.5 rounded-lg text-theme-muted hover:text-theme-primary transition cursor-pointer"
                            title={isSecretVisible ? "Hide Secret" : "Show Secret"}
                          >
                            {isSecretVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopy(merchantSecret, 'secret')}
                            className="px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-600 dark:text-teal-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-teal-500/20"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{t.copyBtn}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connection Status & Live Test (1 col) */}
                <div className="glass-panel rounded-2xl p-6 border border-theme flex flex-col justify-between space-y-4 shadow-card">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-theme-muted font-semibold uppercase tracking-wider">{t.connStatusTitle}</span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {t.connStatusActive}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-subtle border border-theme space-y-2 text-xs">
                      <div className="flex items-center justify-between text-theme-muted">
                        <span>{t.connStoreLabel}</span>
                        <span className="text-theme-primary font-semibold">{t.storeDomain}</span>
                      </div>
                      <div className="flex items-center justify-between text-theme-muted">
                        <span>{t.connWooLabel}</span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold font-mono">v9.2.1 (HPOS)</span>
                      </div>
                      <div className="flex items-center justify-between text-theme-muted">
                        <span>{t.connPingLabel}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">24ms (OK)</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-theme-muted leading-relaxed">
                      {t.connTestPrompt}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={handleTestConnection}
                      disabled={testStatus === 'testing'}
                      className="w-full py-2.5 px-4 rounded-xl bg-surface-subtle hover:bg-surface border border-theme text-theme-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      {testStatus === 'testing' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
                          <span>{t.connTestingBtn}</span>
                        </>
                      ) : testStatus === 'success' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400">{t.connSuccessBtn}</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>{t.connDefaultBtn}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* VISUAL WORDPRESS ADMIN SIMULATOR & WALKTHROUGH */}
              <div className="glass-panel rounded-2xl border border-theme overflow-hidden shadow-card">
                {/* Visual Guide Header & Method Switcher */}
                <div className="bg-surface-subtle p-4 sm:p-5 border-b border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Monitor className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <div>
                      <h3 className="text-sm font-bold text-theme-primary">{t.guideTitle}</h3>
                      <p className="text-[11px] text-theme-muted">{t.guideSubtitle}</p>
                    </div>
                  </div>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-bold flex items-center gap-1.5 self-start sm:self-auto">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3 {selectedLang === 'sr' ? 'brza koraka' : selectedLang === 'mk' ? 'брзи чекори' : 'Quick Steps'}</span>
                  </span>
                </div>

                {/* Potvrdio Plugin Settings Page Walkthrough */}
                <div className="p-5 sm:p-6 space-y-6">
                  {/* Interactive Walkthrough Helper Prompt */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-500/15 via-surface-subtle to-teal-500/10 border-2 border-teal-500/30 flex items-center justify-between flex-wrap gap-2 text-xs shadow-xs">
                    <div className="flex items-center gap-2 text-theme-primary">
                      <Sparkles className="w-4 h-4 text-teal-500 shrink-0" />
                      <span className="font-semibold text-theme-primary">
                        {t.guideInteractiveHint}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-500/20 px-2.5 py-1 rounded-lg border border-teal-500/30 shrink-0 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {activeStepHighlight === 1 ? `1. ${t.step1Title}` : activeStepHighlight === 2 ? `2. ${t.step2Title}` : activeStepHighlight === 3 ? `3. ${t.step3Title}` : t.selectStepPrompt}
                    </span>
                  </div>

                  {/* Step-by-Step Instruction Cards with Connecting Arrows */}
                  <div className="flex flex-col lg:flex-row items-stretch gap-3 lg:gap-2">
                    {/* Step 1 Card */}
                    <div className="flex-1 flex flex-col">
                      <button
                        type="button"
                        onClick={() => toggleStepHighlight(1)}
                        className={`w-full h-full text-left p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative group flex flex-col justify-between ${
                          activeStepHighlight === 1
                            ? 'bg-teal-500/15 border-2 border-teal-500 ring-2 ring-teal-500/40 shadow-lg scale-[1.01]'
                            : activeStepHighlight === null
                            ? 'bg-surface-subtle border-teal-500/40 ring-2 ring-teal-500/20 hover:border-teal-500 hover:bg-surface shadow-xs'
                            : 'bg-surface-subtle border-theme hover:border-teal-500/50 hover:bg-surface'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                                activeStepHighlight === 1
                                  ? 'bg-teal-500 text-white ring-4 ring-teal-300 animate-pulse shadow'
                                  : 'bg-teal-500/20 text-teal-600 dark:text-teal-400 group-hover:scale-110'
                              }`}>
                                1
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                activeStepHighlight === 1
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-surface border border-theme text-theme-muted'
                              }`}>
                                {t.step1Badge}
                              </span>
                            </div>

                            {/* When default unselected, emphasize starting at Step 1 */}
                            {activeStepHighlight === null && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-600 text-white animate-pulse shadow flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>{t.startHereBadge}</span>
                              </span>
                            )}
                          </div>
                          <h5 className="font-bold text-xs text-theme-primary">{t.step1Title}</h5>
                          <p className="text-[11px] text-theme-secondary leading-relaxed">
                            {t.step1Desc}
                          </p>
                        </div>

                        {/* Interactive Action Button inside the card */}
                        <div className={`mt-2 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          activeStepHighlight === 1
                            ? 'bg-teal-600 text-white shadow-sm'
                            : activeStepHighlight === null
                            ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/40 group-hover:bg-teal-600 group-hover:text-white'
                            : 'bg-surface border border-theme text-theme-muted group-hover:bg-teal-500/10 group-hover:text-teal-600 group-hover:border-teal-500/40'
                        }`}>
                          {activeStepHighlight === 1 ? (
                            <>
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>{t.stepActiveBadge}</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 shrink-0" />
                              <span>{t.clickToLocate}</span>
                            </>
                          )}
                        </div>

                        {/* Downward indicator on active card pointing to preview below */}
                        {activeStepHighlight === 1 && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg z-20 flex items-center gap-1 border-2 border-white dark:border-slate-800 animate-bounce">
                            <span>{t.previewBadge}</span>
                            <ArrowDown className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Connecting Arrow: Step 1 -> Step 2 */}
                    <div className="flex items-center justify-center py-1 lg:py-0 text-teal-600/70 dark:text-teal-400/70 shrink-0 self-center">
                      <div className="p-1.5 rounded-full bg-surface-subtle border border-theme shadow-xs">
                        <ArrowRight className="w-4 h-4 hidden lg:block" />
                        <ArrowDown className="w-4 h-4 lg:hidden" />
                      </div>
                    </div>

                    {/* Step 2 Card */}
                    <div className="flex-1 flex flex-col">
                      <button
                        type="button"
                        onClick={() => toggleStepHighlight(2)}
                        className={`w-full h-full text-left p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative group flex flex-col justify-between ${
                          activeStepHighlight === 2
                            ? 'bg-emerald-500/15 border-2 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg scale-[1.01]'
                            : 'bg-surface-subtle border-theme hover:border-emerald-500/50 hover:bg-surface'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                                activeStepHighlight === 2
                                  ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 animate-pulse shadow'
                                  : 'bg-teal-500/20 text-teal-600 dark:text-teal-400 group-hover:scale-110'
                              }`}>
                                2
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                activeStepHighlight === 2
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-surface border border-theme text-theme-muted'
                              }`}>
                                {t.step2Badge}
                              </span>
                            </div>
                          </div>
                          <h5 className="font-bold text-xs text-theme-primary">{t.step2Title}</h5>
                          <p className="text-[11px] text-theme-secondary leading-relaxed">
                            {t.step2Desc}
                          </p>
                        </div>

                        {/* Interactive Action Button inside the card */}
                        <div className={`mt-2 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          activeStepHighlight === 2
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-surface border border-theme text-theme-muted group-hover:bg-emerald-500/10 group-hover:text-emerald-600 group-hover:border-emerald-500/40'
                        }`}>
                          {activeStepHighlight === 2 ? (
                            <>
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>{t.stepActiveBadge}</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 shrink-0" />
                              <span>{t.clickToLocate}</span>
                            </>
                          )}
                        </div>

                        {/* Downward indicator on active card pointing to preview below */}
                        {activeStepHighlight === 2 && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg z-20 flex items-center gap-1 border-2 border-white dark:border-slate-800 animate-bounce">
                            <span>{t.previewBadge}</span>
                            <ArrowDown className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Connecting Arrow: Step 2 -> Step 3 */}
                    <div className="flex items-center justify-center py-1 lg:py-0 text-teal-600/70 dark:text-teal-400/70 shrink-0 self-center">
                      <div className="p-1.5 rounded-full bg-surface-subtle border border-theme shadow-xs">
                        <ArrowRight className="w-4 h-4 hidden lg:block" />
                        <ArrowDown className="w-4 h-4 lg:hidden" />
                      </div>
                    </div>

                    {/* Step 3 Card */}
                    <div className="flex-1 flex flex-col">
                      <button
                        type="button"
                        onClick={() => toggleStepHighlight(3)}
                        className={`w-full h-full text-left p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative group flex flex-col justify-between ${
                          activeStepHighlight === 3
                            ? 'bg-blue-500/15 border-2 border-blue-500 ring-2 ring-blue-500/40 shadow-lg scale-[1.01]'
                            : 'bg-surface-subtle border-theme hover:border-blue-500/50 hover:bg-surface'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                                activeStepHighlight === 3
                                  ? 'bg-blue-600 text-white ring-4 ring-blue-300 animate-pulse shadow'
                                  : 'bg-teal-500/20 text-teal-600 dark:text-teal-400 group-hover:scale-110'
                              }`}>
                                3
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                activeStepHighlight === 3
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-surface border border-theme text-theme-muted'
                              }`}>
                                {t.step3Badge}
                              </span>
                            </div>
                          </div>
                          <h5 className="font-bold text-xs text-theme-primary">{t.step3Title}</h5>
                          <p className="text-[11px] text-theme-secondary leading-relaxed">
                            {t.step3Desc}
                          </p>
                        </div>

                        {/* Interactive Action Button inside the card */}
                        <div className={`mt-2 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          activeStepHighlight === 3
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-surface border border-theme text-theme-muted group-hover:bg-blue-500/10 group-hover:text-blue-600 group-hover:border-blue-500/40'
                        }`}>
                          {activeStepHighlight === 3 ? (
                            <>
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>{t.stepActiveBadge}</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 shrink-0" />
                              <span>{t.clickToLocate}</span>
                            </>
                          )}
                        </div>

                        {/* Downward indicator on active card pointing to preview below */}
                        {activeStepHighlight === 3 && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg z-20 flex items-center gap-1 border-2 border-white dark:border-slate-800 animate-bounce">
                            <span>{t.previewBadge}</span>
                            <ArrowDown className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Breadcrumbs Banner & Realistic WordPress UI Mockup (Only visible when a step is clicked) */}
                  {activeStepHighlight !== null && (
                    <div 
                      ref={walkthroughPreviewRef} 
                      className="scroll-mt-24 space-y-6 animate-in fade-in duration-300"
                    >
                      <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300 flex flex-wrap items-center gap-2 select-none cursor-default">
                        <span className="font-bold uppercase text-[10px] tracking-wider bg-teal-500/20 px-2 py-0.5 rounded">{t.breadcrumbMenuPath}:</span>
                        <span className="font-semibold text-theme-primary">WordPress Admin</span>
                        <ChevronRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span className="font-semibold text-theme-primary">Settings</span>
                        <ChevronRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span className="font-bold text-teal-700 dark:text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded">Potvrdio Viber COD</span>
                      </div>

                      {/* Realistic WordPress UI Mockup (Non-interactive Screenshot Simulation) */}
                      <div className="relative rounded-2xl border-2 border-slate-700/80 light:border-slate-300 overflow-hidden bg-[#1E1E1E] text-slate-200 text-xs shadow-2xl font-sans select-none cursor-default">
                    {/* Mockup Header: Clear indication that this is a static visual screenshot reference */}
                    <div className="bg-slate-900/95 text-slate-400 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] select-none cursor-default">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="font-semibold text-slate-300 truncate">
                          WordPress Admin · /wp-admin/options-general.php?page=potvrdio-viber-cod
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-slate-800 text-[10px] text-teal-300 font-mono font-bold border border-teal-500/30 shrink-0 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-teal-400" />
                        <span>{t.mockupStaticBadge}</span>
                      </span>
                    </div>

                    {/* WP Top Bar Mockup */}
                    <div className="bg-[#1D2327] text-slate-300 px-4 py-2 border-b border-black flex items-center justify-between text-[11px] pointer-events-none select-none cursor-default">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">W</span>
                          {activeMerchant.storeName}
                        </span>
                        <span className="text-slate-500 hidden sm:inline">|</span>
                        <span className="text-slate-400 hidden sm:inline">Comments (0)</span>
                        <span className="text-slate-400 hidden sm:inline">+ New</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">admin</span>
                    </div>

                    {/* WP Split Layout: Sidebar + Main Content (Non-interactive / Image-like cursor) */}
                    <div className="flex flex-col md:flex-row min-h-[380px] pointer-events-none select-none cursor-default">
                      {/* WP Sidebar Mockup */}
                      <div className="w-full md:w-56 bg-[#1D2327] text-slate-300 p-2 text-xs border-r border-slate-800 shrink-0 space-y-0.5 select-none cursor-default">
                        <div className="px-3 py-2 text-slate-400 flex items-center gap-2 select-none cursor-default">
                          <BarChart2 className="w-3.5 h-3.5" /> Dashboard
                        </div>
                        <div className="px-3 py-2 text-slate-400 flex items-center gap-2 select-none cursor-default">
                          <Layers className="w-3.5 h-3.5" /> Posts
                        </div>
                        <div className="px-3 py-2 text-slate-400 flex items-center gap-2 select-none cursor-default">
                          <Zap className="w-3.5 h-3.5" /> WooCommerce
                        </div>
                        <div className="px-3 py-2 text-slate-400 flex items-center gap-2 select-none cursor-default">
                          <CreditCard className="w-3.5 h-3.5" /> Products
                        </div>
                        <div className="px-3 py-2 text-slate-400 flex items-center gap-2 select-none cursor-default">
                          <Key className="w-3.5 h-3.5" /> Plugins
                        </div>
                        
                        {/* HIGHLIGHTED SETTINGS MENU */}
                        <div className="bg-[#2271B1] text-white rounded-t font-semibold px-3 py-2 flex items-center gap-2 shadow-sm select-none cursor-default">
                          <Settings className="w-3.5 h-3.5" /> Settings
                        </div>
                        <div className="bg-[#2C3338] rounded-b py-1 pl-6 pr-2 space-y-1 text-[11px] select-none cursor-default">
                          <div className="py-1 text-slate-400">General</div>
                          <div className="py-1 text-slate-400">Writing</div>
                          <div className="py-1 text-slate-400">Reading</div>
                          
                          {/* ACTIVE HIGHLIGHTED PLUGIN SUBMENU (STEP 1 TARGET) */}
                          <div className={`py-1.5 px-2 rounded font-extrabold flex items-center justify-between shadow-md transition-all duration-300 select-none cursor-default ${
                            activeStepHighlight === 1
                              ? 'bg-teal-400 text-black ring-4 ring-teal-300 ring-offset-2 ring-offset-[#1D2327] scale-105 shadow-xl shadow-teal-500/50 animate-pulse'
                              : 'bg-teal-500 text-black animate-pulse'
                          }`}>
                            <span className="flex items-center gap-1.5">
                              {activeStepHighlight === 1 ? (
                                <span className="w-5 h-5 rounded-full bg-black text-teal-300 flex items-center justify-center font-black text-xs shadow-lg animate-bounce shrink-0">
                                  1
                                </span>
                              ) : (
                                <ShieldCheck className="w-3.5 h-3.5" />
                              )}
                              Potvrdio Viber COD
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                              activeStepHighlight === 1 ? 'bg-black text-white animate-pulse' : 'bg-black text-white'
                            }`}>
                              {activeStepHighlight === 1 ? '① CLICK' : 'CLICK'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* WP Main Settings Content Form Mockup */}
                      <div className="flex-1 bg-[#F0F0F1] text-slate-800 p-5 sm:p-7 space-y-4 select-none cursor-default">
                        <div className="border-b border-slate-300 pb-3 select-none cursor-default">
                          <h4 className="text-base font-bold text-[#1D2327]">Potvrdio - Viber COD & Cart Recovery Settings</h4>
                          <p className="text-[11px] text-slate-600 mt-0.5">{t.storeSubtitle}</p>
                        </div>

                        {/* STEP 2 TARGET: Form Inputs Container */}
                        <div className={`space-y-4 bg-white p-5 rounded-lg border shadow-sm max-w-xl transition-all duration-300 relative select-none cursor-default ${
                          activeStepHighlight === 2
                            ? 'border-2 border-emerald-500 ring-4 ring-emerald-400 ring-offset-4 ring-offset-[#F0F0F1] shadow-2xl shadow-emerald-500/30'
                            : 'border-slate-300'
                        }`}>
                          {activeStepHighlight === 2 && (
                            <div className="absolute -top-3.5 right-4 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-xl flex items-center gap-1.5 animate-bounce z-10 border-2 border-white select-none">
                              <span className="w-4 h-4 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[10px] font-black">2</span>
                              <span>{t.step2Title}</span>
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-bold text-[#1D2327] mb-1 select-none">
                              {t.labelEndpoint}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                tabIndex={-1}
                                value="https://api.potvrdio.online/api/v1"
                                className={`w-full rounded px-3 py-1.5 text-xs font-mono transition-all select-none cursor-default pointer-events-none ${
                                  activeStepHighlight === 2
                                    ? 'border-2 border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300/60 text-slate-900 font-bold'
                                    : 'bg-[#F6F7F7] border border-[#8C8F94] text-slate-700'
                                }`}
                              />
                              <span className={`text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap flex items-center gap-1 transition-all select-none ${
                                activeStepHighlight === 2
                                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-lg animate-pulse font-black scale-105'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {activeStepHighlight === 2 && (
                                  <span className="w-3.5 h-3.5 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[9px] font-black animate-bounce">2</span>
                                )}
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{t.pasteHereBadge}</span>
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1D2327] mb-1 select-none">
                              {t.labelApiKey}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                tabIndex={-1}
                                value={activeMerchant.apiKey}
                                className={`w-full rounded px-3 py-1.5 text-xs font-mono transition-all select-none cursor-default pointer-events-none ${
                                  activeStepHighlight === 2
                                    ? 'border-2 border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300/60 text-slate-900 font-bold'
                                    : 'bg-[#F6F7F7] border border-[#8C8F94] text-slate-700'
                                }`}
                              />
                              <span className={`text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap flex items-center gap-1 transition-all select-none ${
                                activeStepHighlight === 2
                                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-lg animate-pulse font-black scale-105'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {activeStepHighlight === 2 && (
                                  <span className="w-3.5 h-3.5 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[9px] font-black animate-bounce">2</span>
                                )}
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{t.pasteHereBadge}</span>
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#1D2327] mb-1 select-none">
                              {t.labelApiSecret}
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type={isSecretVisible ? "text" : "password"}
                                readOnly
                                tabIndex={-1}
                                value={isSecretVisible ? merchantSecret : "••••••••••••••••••••••••"}
                                className={`w-full rounded px-3 py-1.5 text-xs font-mono transition-all select-none cursor-default pointer-events-none ${
                                  activeStepHighlight === 2
                                    ? 'border-2 border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300/60 text-slate-900 font-bold'
                                    : 'bg-[#F6F7F7] border border-[#8C8F94] text-slate-700'
                                }`}
                              />
                              <span className={`text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap flex items-center gap-1 transition-all select-none ${
                                activeStepHighlight === 2
                                  ? 'bg-emerald-600 text-white border border-emerald-400 shadow-lg animate-pulse font-black scale-105'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {activeStepHighlight === 2 && (
                                  <span className="w-3.5 h-3.5 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[9px] font-black animate-bounce">2</span>
                                )}
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{t.pasteHereBadge}</span>
                              </span>
                            </div>
                          </div>

                          {/* STEP 3 TARGET: Save Changes Button */}
                          <div className="pt-2 flex items-center gap-3 select-none">
                            <div className={`inline-flex items-center gap-2 bg-[#2271B1] text-white px-4 py-2 rounded font-bold text-xs shadow transition-all select-none cursor-default pointer-events-none relative ${
                              activeStepHighlight === 3
                                ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-white scale-110 shadow-2xl shadow-amber-500/40 animate-pulse bg-blue-700'
                                : ''
                            }`}>
                              {activeStepHighlight === 3 && (
                                <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-black animate-bounce shadow">
                                  3
                                </span>
                              )}
                              <span>{t.saveChangesBtn}</span>
                              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-normal">{t.finalStepBadge}</span>
                            </div>
                            {activeStepHighlight === 3 && (
                              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-200 border border-amber-400 px-3 py-1.5 rounded-full animate-bounce shadow-md select-none">
                                <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">3</span>
                                <span>{t.step3Title}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STORE LOGISTICS & PRIMARY COURIER PARTNER CARD */}
              <div className="glass-panel rounded-2xl p-6 border border-theme space-y-6 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-theme gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-theme-primary flex items-center gap-2">
                      <Package className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      {t.logisticsTitle}
                    </h3>
                    <p className="text-[11px] text-theme-muted mt-0.5">
                      {t.logisticsSub}
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {t.logisticsEstimateBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Courier selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-theme-secondary flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{t.labelCourier}</span>
                    </label>
                    <select
                      value={selectedCourier}
                      onChange={(e) => setSelectedCourier(e.target.value)}
                      className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 text-xs text-theme-primary focus:outline-none focus:border-teal-500 cursor-pointer font-medium"
                    >
                      <option value="post-express">{t.courierPostExpress}</option>
                      <option value="bex">{t.courierBex}</option>
                      <option value="d-express">{t.courierDExpress}</option>
                      <option value="city-express">{t.courierCityExpress}</option>
                      <option value="cargo-mk">{t.courierCargoMk}</option>
                      <option value="via-courier">{t.courierOther}</option>
                    </select>
                    <p className="text-[11px] text-theme-muted">
                      {selectedLang === 'sr' ? 'Format broja za praćenje i SMS šabloni biće prilagođeni izabranom kuriru.' : selectedLang === 'mk' ? 'Форматот на пратката и SMS пораките ќе бидат прилагодени на избраниот курир.' : 'Tracking link templates and delivery format will align with this courier.'}
                    </p>
                  </div>

                  {/* Volume selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-theme-secondary flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{t.labelVolume}</span>
                    </label>
                    <select
                      value={selectedVolume}
                      onChange={(e) => setSelectedVolume(e.target.value)}
                      className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 text-xs text-theme-primary focus:outline-none focus:border-teal-500 cursor-pointer font-medium"
                    >
                      <option value="<100">{t.volUnder100}</option>
                      <option value="100-300">{t.vol100to300}</option>
                      <option value="300-1000">{t.vol300to1000}</option>
                      <option value="1000+">{t.vol1000plus}</option>
                    </select>
                    <p className="text-[11px] text-theme-muted">
                      {selectedLang === 'sr' ? 'Pomaže u preporuci optimalnog paketa i tačnom obračunu uštede na povratima.' : selectedLang === 'mk' ? 'Помага во препорака на најдобар пакет и точна пресметка на заштедите.' : 'Helps calculate estimated cost savings and recommended credit balance.'}
                    </p>
                  </div>
                </div>

                {/* Smart Projection & Action */}
                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-theme-secondary leading-relaxed">
                    <span className="font-bold text-teal-700 dark:text-teal-300 inline-flex items-center gap-1.5 mr-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {selectedLang === 'sr' ? 'Procenjena ušteda:' : selectedLang === 'mk' ? 'Проceneта заштеда:' : 'Projected Savings:'}
                    </span>{' '}
                    {selectedVolume === '<100'
                      ? (selectedLang === 'sr' ? 'Do ~€60 mesečno sačuvanog novca na nepreuzetim paketima.' : selectedLang === 'mk' ? 'До ~€60 месечно заштедени средства од непреземени пратки.' : 'Up to ~€60/mo saved on uncollected packages.')
                      : selectedVolume === '100-300'
                      ? (selectedLang === 'sr' ? 'Do ~€180 mesečno sačuvanog novca na nepreuzetim paketima.' : selectedLang === 'mk' ? 'До ~€180 месечно заштедени средства од непреземени пратки.' : 'Up to ~€180/mo saved on uncollected packages.')
                      : selectedVolume === '300-1000'
                      ? (selectedLang === 'sr' ? 'Do ~€450 mesečno sačuvanog novca na nepreuzetim paketima.' : selectedLang === 'mk' ? 'До ~€450 meseчно заштедени средства од непреземени пратки.' : 'Up to ~€450/mo saved on uncollected packages.')
                      : (selectedLang === 'sr' ? 'Preko ~€1,200 mesečno sačuvanog novca (Enterprise SLA).' : selectedLang === 'mk' ? 'Над ~€1,200 месечно заштедени средства (Enterprise SLA).' : 'Over ~€1,200/mo saved on return shipping (Enterprise SLA).')}
                  </div>

                  <button
                    onClick={() => handleSaveLogistics(selectedCourier, selectedVolume)}
                    className="shrink-0 px-4 py-2.5 rounded-xl btn-brand-cta text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>{logisticsToast ? t.logisticsSavedToast : t.saveLogisticsBtn}</span>
                  </button>
                </div>
              </div>
            </div>
      )}
        </main>
      </div>

      {/* Official B2B Predračun & NBS IPS QR Code Payment Modal */}
      <IpsPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPaymentPlan}
        lang={selectedLang}
        onPaymentSuccess={handlePaymentSuccess}
        onSelectPlan={(newPlan) => setSelectedPaymentPlan(newPlan)}
      />

      {/* Add New Store Modal */}
      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        userEmail={session.email}
        selectedLang={selectedLang}
        onStoreAdded={(newStore) => {
          const createdStore: ActiveMerchant = {
            ...newStore,
            isDemo: false,
          };
          setSession((prev) => {
            if (!prev) return null;
            const updated = {
              ...prev,
              isDemo: false,
              activeStoreId: createdStore.id,
              stores: [...prev.stores, createdStore],
            };
            try { localStorage.setItem('potvrdio_session', JSON.stringify(updated)); } catch {}
            return updated;
          });
        }}
      />
    </div>
  );
}
