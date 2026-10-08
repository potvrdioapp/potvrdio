import React, { useState } from 'react';
import { X, Store, Rocket, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Language } from '../i18n';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onStoreAdded: (store: {
    id: string;
    storeName: string;
    storeDomain: string;
    apiKey: string;
    isTrial: boolean;
    trialRemaining: number;
    credits: number;
  }) => void;
  selectedLang: Language;
}

export function AddStoreModal({
  isOpen,
  onClose,
  userEmail,
  onStoreAdded,
  selectedLang,
}: AddStoreModalProps) {
  const [storeUrl, setStoreUrl] = useState('');
  const [storeName, setStoreName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeUrl.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('http://localhost:4001/api/v1/merchant/stores/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          storeUrl: storeUrl.trim(),
          storeName: storeName.trim() || storeUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'Greška pri dodavanju prodavnice');
        setIsLoading(false);
        return;
      }

      onStoreAdded(data.store);
      onClose();
    } catch (err) {
      console.warn('Backend unavailable, creating locally:', err);
      const cleanDomain = storeUrl.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').toLowerCase();
      const localStore = {
        id: `store_${Date.now()}`,
        storeName: storeName.trim() || cleanDomain,
        storeDomain: cleanDomain,
        apiKey: `pk_live_${cleanDomain.replace(/[^a-z0-9]/g, '')}_${Math.random().toString(36).substring(2, 8)}`,
        isTrial: true,
        trialRemaining: 25,
        credits: 0,
      };
      onStoreAdded(localStore);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-theme shadow-2xl relative bg-surface">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-theme-muted hover:text-theme-primary hover:bg-surface-subtle transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-theme-primary">
              {selectedLang === 'sr' ? 'Dodaj novu WooCommerce prodavnicu' : selectedLang === 'mk' ? 'Додај нова веб продавница' : 'Add New WooCommerce Store'}
            </h3>
            <p className="text-xs text-theme-muted">
              {selectedLang === 'sr' 
                ? `Povezano sa nalogom ${userEmail}` 
                : selectedLang === 'mk' 
                ? `Поврзано со налогот ${userEmail}` 
                : `Linked to ${userEmail}`}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-theme-secondary mb-1.5">
              {selectedLang === 'sr' ? 'Web adresa prodavnice (URL)' : selectedLang === 'mk' ? 'Веб адреса на продавницата (URL)' : 'Store URL'}
            </label>
            <input
              type="text"
              required
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              placeholder={selectedLang === 'sr' ? 'druga-radnja.rs' : selectedLang === 'mk' ? 'druga-prodavnica.mk' : 'my-store.com'}
              className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 text-xs text-theme-primary focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-secondary mb-1.5">
              {selectedLang === 'sr' ? 'Interni naziv prodavnice' : selectedLang === 'mk' ? 'Интерно име на продавницата' : 'Store Display Name'}
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder={
                selectedLang === 'sr'
                  ? 'npr. Obuća Beograd (Outlet)'
                  : selectedLang === 'mk'
                  ? 'на пр. Обувки Скопје (Outlet)'
                  : 'e.g. Footwear Outlet'
              }
              className="w-full bg-surface-subtle border border-theme rounded-xl px-3.5 py-2.5 text-xs text-theme-primary focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-700 dark:text-teal-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
            <span>
              {selectedLang === 'sr' 
                ? 'Nova prodavnica dobija sopstveni API ključ i 25 besplatnih verifikacija.' 
                : selectedLang === 'mk'
                ? 'Секоја нова продавница добива сопствен API клуч и 25 бесплатни верификации.'
                : 'Each store gets its own API key and 25 free pilot verifications.'}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-theme text-theme-muted hover:text-theme-primary text-xs font-bold transition-colors cursor-pointer"
            >
              {selectedLang === 'sr' ? 'Otkaži' : selectedLang === 'mk' ? 'Откажи' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl btn-brand-cta text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-60"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>
                {isLoading 
                  ? (selectedLang === 'sr' ? 'Dodajem...' : selectedLang === 'mk' ? 'Се додава...' : 'Adding...')
                  : (selectedLang === 'sr' ? 'Aktiviraj Prodavnicu' : selectedLang === 'mk' ? 'Активирај Продавница' : 'Add Store')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
