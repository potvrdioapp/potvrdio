import React, { useState } from 'react';
import { MapPin, CheckCircle2, ShieldCheck, Truck, Sparkles, User, Phone, Info, Navigation, PackageCheck } from 'lucide-react';

interface OrderData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  totalAmount: number;
  currency: string;
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [order] = useState<OrderData>({
    orderId: '7482',
    customerName: 'Nikola Petrović',
    customerPhone: '+381 64 123 4567',
    address1: 'Knez Mihailova 42',
    address2: 'Stan 12, 3. sprat',
    city: 'Beograd',
    postcode: '11000',
    totalAmount: 4850,
    currency: 'RSD',
  });

  const [form, setForm] = useState({
    address1: order.address1,
    address2: order.address2,
    city: order.city,
    postcode: order.postcode,
    orderNote: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div class="bg-white max-w-md w-full rounded-3xl p-8 text-center border border-slate-200 shadow-xl">
          <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200">
            <CheckCircle2 class="w-10 h-10" />
          </div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Uspešno Potvrđeno!</h2>
          <p class="text-slate-600 text-base mb-6 leading-relaxed">
            Vaša adresa je ažurirana. Narudžbina <span class="text-teal-700 font-bold">#{order.orderId}</span> je spremljena za slanje.
          </p>

          {/* Completed Logistics Progress Bar */}
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6">
            <div class="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span class="text-emerald-600 flex items-center gap-1"><CheckCircle2 class="w-3.5 h-3.5" /> Primljeno</span>
              <span class="text-emerald-600 flex items-center gap-1"><CheckCircle2 class="w-3.5 h-3.5" /> Potvrđeno</span>
              <span class="text-teal-700 font-extrabold flex items-center gap-1"><Truck class="w-3.5 h-3.5" /> U pripremi</span>
            </div>
            <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
              <div class="bg-emerald-500 w-full h-full"></div>
            </div>
          </div>

          <div class="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 space-y-2 mb-6">
            <div class="text-xs text-slate-500 uppercase tracking-wider font-bold">Potvrđena Adresa Dostave:</div>
            <div class="text-slate-900 font-semibold text-base flex items-start gap-2">
              <MapPin class="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <div>{form.address1} {form.address2 && `, ${form.address2}`}</div>
                <div class="text-slate-500 text-sm">{form.city}, {form.postcode}</div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center gap-2 text-sm text-emerald-800 bg-emerald-50 py-3 px-4 rounded-xl border border-emerald-200 font-semibold">
            <Truck class="w-5 h-5 text-emerald-600" />
            <span>Kargo kurir je obavešten. Hvala vam!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between py-6 px-4 sm:px-6 font-['Plus_Jakarta_Sans',sans-serif]">
      <div class="max-w-md w-full mx-auto space-y-4">
        
        {/* Light Header with Potvrdio Brand Teal */}
        <div class="flex items-center justify-between pt-1">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-600/20">
              <Sparkles class="w-5 h-5 text-white" />
            </div>
            <div>
              <span class="font-black text-xl tracking-tight text-slate-900">Potvrdio<span class="text-teal-600">.online</span></span>
              <span class="block text-[11px] text-slate-500 font-bold tracking-wide">VERIFIKACIJA ADRESE</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-200 text-xs px-3 py-1.5 rounded-full font-bold">
            <ShieldCheck class="w-4 h-4 text-teal-600" />
            <span>Sigurna Dostava</span>
          </div>
        </div>

        {/* LOGISTICS ORDER TRACKING PROGRESS BAR (NEW UI COMPONENT) */}
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
          <div class="flex justify-between items-center text-xs font-bold">
            <span class="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5" /> 1. Primljeno
            </span>
            <span class="text-teal-700 font-extrabold flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              <Navigation class="w-3.5 h-3.5 text-teal-600 animate-pulse" /> 2. Verifikacija
            </span>
            <span class="text-slate-400 flex items-center gap-1">
              <PackageCheck class="w-3.5 h-3.5" /> 3. Kargo
            </span>
          </div>
          <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div class="bg-emerald-500 w-1/3 h-full"></div>
            <div class="bg-teal-500 w-1/3 h-full animate-pulse"></div>
            <div class="bg-slate-200 w-1/3 h-full"></div>
          </div>
        </div>

        {/* Location Map Preview Header Card (NEW UI COMPONENT) */}
        <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-md relative overflow-hidden flex items-center justify-between">
          <div class="space-y-1">
            <div class="text-[10px] text-teal-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <MapPin class="w-3 h-3 text-teal-400" /> Lokacija Dostave Paketa
            </div>
            <div class="text-sm font-extrabold truncate max-w-[220px]">{form.city}, {form.address1}</div>
            <div class="text-[11px] text-slate-300">Pouzećem: <span class="text-teal-300 font-bold">{order.totalAmount.toLocaleString()} {order.currency}</span></div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
            <Navigation class="w-6 h-6" />
          </div>
        </div>

        {/* Order Info Summary */}
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <User class="w-4 h-4 text-slate-400" />
            <span class="font-bold text-slate-800">{order.customerName}</span>
          </div>
          <div class="flex items-center gap-2">
            <Phone class="w-4 h-4 text-slate-400" />
            <span class="font-semibold text-slate-600">{order.customerPhone}</span>
          </div>
        </div>

        {/* Form Container (High Contrast Light Theme) */}
        <form onSubmit={handleSubmit} class="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-5">
          <div>
            <h3 class="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <MapPin class="w-5 h-5 text-teal-600" />
              Proveri i Izmeni Adresu Dostave
            </h3>
            <p class="text-sm text-slate-600 leading-normal">
              Proverite da li su ulica i broj tačni kako bi vam kurir dostavio paket bez odlaganja.
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-800 mb-1.5">Ulica i kućni broj *</label>
              <input
                type="text"
                required
                value={form.address1}
                onChange={(e) => setForm({ ...form, address1: e.target.value })}
                placeholder="npr. Knez Mihailova 42"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all min-h-[48px]"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-bold text-slate-800 mb-1.5">Stan / Sprat / Ulaz</label>
                <input
                  type="text"
                  value={form.address2}
                  onChange={(e) => setForm({ ...form, address2: e.target.value })}
                  placeholder="npr. Stan 12, 3. sprat"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all min-h-[48px]"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-800 mb-1.5">Grad / Mesto *</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="npr. Beograd"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all min-h-[48px]"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-800 mb-1.5">Napomena za kurira (opciono)</label>
              <textarea
                rows={2}
                value={form.orderNote}
                onChange={(e) => setForm({ ...form, orderNote: e.target.value })}
                placeholder="npr. Zvoniti na interfon 12 ili ostaviti kod komšije"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 text-base text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full min-h-[52px] bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span class="inline-block w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <CheckCircle2 class="w-5 h-5" />
                <span>Sačuvaj i Potvrdi Pošiljku</span>
              </>
            )}
          </button>
        </form>

        {/* Legal & Privacy Consent Footer */}
        <div class="bg-slate-200/60 rounded-2xl p-4 text-xs text-slate-600 space-y-2 border border-slate-300/60">
          <div class="flex items-center gap-2 font-bold text-slate-800">
            <Info class="w-4 h-4 text-teal-700 shrink-0" />
            <span>Napomena o bezbednosti i privatnosti (ZZPL / GDPR)</span>
          </div>
          <p class="leading-relaxed">
            Jednokratni sigurnosni token važi 5 minuta. Vaši podaci se koriste isključivo za potvrdu ove porudžbine.
          </p>
        </div>

      </div>
    </div>
  );
}
