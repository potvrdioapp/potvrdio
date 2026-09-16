# Potvrdio (potvrdio.online) — Balkan E-Ticaret ve COD Doğrulama Çözümü

Potvrdio, Sırbistan, Bosna-Hersek, Karadağ, Hırvatistan ve Kuzey Makedonya gibi Balkan pazarlarında faaliyet gösteren WooCommerce e-ticaret satıcıları için geliştirilmiş kapıda ödeme (COD) iade önleme, adres doğrulama ve sepet kurtarma SaaS platformudur.

---

## Proje Dokümantasyonu

Projenin tüm kapsam, iş modeli ve tasarım şartnameleri kök dizinde ve `/docs` klasöründe yer almaktadır:

1. **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** — Çift Temalı (Dual-Theme v2.1) Tasarım Sistemi ve Görsel Şartname.
2. **[docs/balkan_viber_saas_prd.md](docs/balkan_viber_saas_prd.md)** — Ürün Kapsamı ve Teknik Gereksinim Dokümanı (PRD).
3. **[docs/balkan_woocommerce_viber_saas_plan.md](docs/balkan_woocommerce_viber_saas_plan.md)** — İş Modeli, Marjlar, Birim Ekonomi ve Yerel Hukuki Uyum (ZZPL / GDPR) Dokümanı.

---

## Monorepo Proje Yapısı

```
/potvrdio-monorepo
  ├── /landing-web        (Pazarlama & Lansman Sitesi - React / Vite / Tailwind CSS)
  ├── /merchant-dashboard (Satıcı Bakiye & Analitik Paneli - React / Vite / Tailwind CSS)
  ├── /mobile-address-app (Müşteri Mobil Adres Formu & Kargo Takibi - potvrdio.online/edit)
  ├── /central-backend    (Central Server API & Viber Mesaj Kuyruğu - Node.js / Express / TS)
  ├── /woocommerce-plugin (WooCommerce Client Eklentisi - PHP)
  └── /shared             (Paylaşımlı Tasarım Token'ları - design-tokens.css)
```

---

## Hızlı Başlangıç

### Central Backend API
```bash
cd central-backend
npm install
npm run dev
```

### Mobile Address App (`potvrdio.online/edit`)
```bash
cd mobile-address-app
npm install
npm run dev
```

### Merchant Dashboard
```bash
cd merchant-dashboard
npm install
npm run dev
```

### Landing Web Site
```bash
cd landing-web
npm install
npm run dev
```

---

## Hukuki Uyum ve Lisans
Sırbistan (ZZPL), Bosna-Hersek (DPL) ve AB GDPR kişisel verilerin korunması mevzuatlarına uygun olarak geliştirilmiştir.
