# Potvrdio (potvrdio.online) Monorepo

> **Balkan WooCommerce Viber COD Verification & Cart Recovery Micro-SaaS Platform**

Potvrdio, Sırbistan ve Balkan bölgesindeki (Bosna-Hersek, Karadağ, Hırvatistan, K. Makedonya) WooCommerce e-ticaret mağazaları için kapıda ödeme (COD) siparişlerini Viber üzerinden doğrulayan, tek tıkla `potvrdio.online` adresinde adres düzelttiren ve terk edilen sepetleri kurtaran platformdur.

---

## 📚 Dokümantasyon ve Mimari Dokümanlar

Projenin tüm kapsam, iş modeli ve tasarım şartnameleri kök dizinde ve `/docs` klasöründe yer almaktadır:

1. 🎨 **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** — Çift Temalı (Dual-Theme v2.1) Tasarım Sistemi ve Görsel Şartname.
2. 📋 **[docs/balkan_viber_saas_prd.md](docs/balkan_viber_saas_prd.md)** — Ürün Kapsamı ve Teknik Gereksinim Dokümanı (PRD).
3. 💼 **[docs/balkan_woocommerce_viber_saas_plan.md](docs/balkan_woocommerce_viber_saas_plan.md)** — İş Modeli, Marjlar, Birim Ekonomi ve Yerel Hukuki Uyum (ZZPL / GDPR) Dokümanı.

---

## 🏗️ Monorepo Proje Yapısı

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

## 🚀 Hızlı Başlangıç

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

## 🛡️ Hukuki Uyum ve Lisans
Sırbistan (ZZPL), Bosna-Hersek (DPL) ve AB GDPR kişisel verilerin korunması mevzuatlarına uygun olarak geliştirilmiştir.
