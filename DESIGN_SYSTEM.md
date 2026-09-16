# Potvrdio (potvrdio.online) Design System Specification
> **Doküman Sürümü:** v2.1 (Production & Logistics Tracking Standard)  
> **Tasarım Standartları:** `premium-saas-design` + `ponytail` (YAGNI & Maksimum Performans)  
> **Kapsam:** `landing-web`, `merchant-dashboard`, `mobile-address-app`, `woocommerce-plugin`

---

## 1. Mimarî Vizyon ve Çift Tema (Dual-Theme) Stratejisi

Potvrdio platformu, iki farklı kullanıcı kitlesinin zıt psikolojik ve teknik ihtiyaçlarına yanıt vermek üzere **Çift Tema Mimarisi (Dual-Theme Architecture)** üzerine inşa edilmiştir.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            POTVRDIO DESIGN SYSTEM                           │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 1. DARK OBSIDIAN TEMA                │ 2. LIGHT LOGISTICS TEMA              │
│ Target: Merchant Dashboard & Landing │ Target: Mobile Address App           │
│ Style: Glassmorphism, Dark Void,     │ Style: Yüksek Kontrast, Düz Beyaz,   │
│ Vibrant Accents, Deep Analytics      │ 1s Altı Açılış, Kargo Adım Takibi    │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### 1.1 Dark Obsidian Tema (Dashboard & Landing)
* **Kullanıcı:** E-ticaret satıcıları, operasyon ekipleri ve potansiyel müşteriler.
* **Görsel Dil:** Modern SaaS estetiği, koyu arka plan (`#070A13`), yarı saydam cam kartlar (`backdrop-filter: blur(16px)`), mor ve teal ışıma efektleri (glow).
* **Amaç:** Prestij hissi uyandırmak, analitik verileri gözü yormadan sunmak ve $5k+ SaaS algısı yaratmak.

### 1.2 Light Logistics Tema (Mobile Address App: `potvrdio.online/edit`)
* **Kullanıcı:** Viber mesajındaki linke tıklayan kapıda ödeme (COD) alıcısı (teknik olmayan, yaşlı veya mobil cihazını dış mekanda kullanan tüketiciler).
* **Görsel Dil:** Temiz, yüksek kontrastlı açık tema (`#FFFFFF` arka plan, `#F8FAFC` kartlar, `#0F172A` koyu metinler).
* **Performans Kararı:** Düşük konfigürasyonlu Android cihazlarda ve Viber içi webview (in-app browser) içinde gecikmeyi sıfırlamak için `backdrop-filter: blur()` ve heavy CSS efektleri **kullanılmaz**. Düz net gölgeler ve 1s altında render garanti edilir.

---

## 2. Renk Paleti ve Tasarım Token'ları

### 2.1 Marka Kimliği & Üçüncü Taraf Ayrıştırması
* **Potvrdio Marka Rengi:** **Brand Teal (`#14B8A6`)** — Logo, ana CTA butonları ve marka vurgularında kullanılır.
* **Viber Resmi Rengi:** **Viber Purple (`#7360F2`)** — **SADECE** Viber Business API ile doğrudan ilişkili UI elemanlarında (Viber mesaj simülatörü header'ı ve Viber aksiyon butonlarında) kullanılır. Kullanıcının ürünü "Viber'ın resmi yazılımı" sanmasını önlemek için marka kimliğinden kesin hatlarla ayrılmıştır.

### 2.2 Primary & Brand Tokens
| Token | Value / Hex | Açıklama / Kullanım |
| :--- | :--- | :--- |
| `--color-brand-teal` | `#14B8A6` | Ana marka rengi, logo, primary CTA başlangıcı |
| `--color-brand-indigo` | `#6366F1` | Gradient geçişi, sekonder aksanlar |
| `--color-brand-pink` | `#EC4899` | Grafik aksanları ve rozet vurguları |
| `--color-viber-purple` | `#7360F2` | **Yalnızca** Viber mesaj UI elemanları |

### 2.3 Dark Surface Tokens (Merchant Dashboard & Landing)
| Token | Value / Hex | Kullanım |
| :--- | :--- | :--- |
| `--bg-dark-void` | `#070A13` | Ana koyu arka plan |
| `--bg-dark-elevated` | `#0D121F` | Navbar, sidebar, panel kartları |
| `--bg-dark-glass` | `rgba(19, 26, 43, 0.75)` | Blur destekli cam kartlar |
| `--border-dark-subtle` | `rgba(255, 255, 255, 0.08)` | Kart sınır çizgisi |
| `--border-dark-accent` | `rgba(20, 184, 166, 0.30)` | Aktif odaklanmış sınır çizgisi |

### 2.4 Light Surface Tokens (Mobile Address App)
| Token | Value / Hex | Kullanım |
| :--- | :--- | :--- |
| `--bg-light-base` | `#FFFFFF` | Form ana arka planı |
| `--bg-light-card` | `#F8FAFC` | Form alanı ve kart zemini |
| `--border-light` | `#E2E8F0` | Input ve kart kenarlıkları |
| `--text-light-primary` | `#0F172A` | Yüksek kontrastlı ana metin (WCAG AA compliant) |
| `--text-light-secondary` | `#475569` | Açıklama ve ikincil metinler |

### 2.5 Semantik ve Durum Renkleri
| Token | Value / Hex | Kullanım |
| :--- | :--- | :--- |
| `--status-success` | `#10B981` (Emerald) | `APPROVED` / `DELIVERED` durumu |
| `--status-info` | `#3B82F6` (Blue) | `EDITED_ADDRESS` / `IN_TRANSIT` durumu |
| `--status-warning` | `#F59E0B` (Amber) | `SMS_FALLBACK` / `PENDING` durumu |
| `--status-danger` | `#EF4444` (Red) | Token süresi doldu / `ERROR` durumları |

---

## 3. Tipografi ve Aralık (Spacing) Sistemi

### 3.1 Font Ailesi
- **Primary Font:** `Plus Jakarta Sans`, sans-serif (Google Fonts)
- **Monospace Font:** `JetBrains Mono` / `Fira Code` (API Key ve Log verileri için)

### 3.2 Tipografi Ölçeği

#### Masaüstü Ölçeği (Dashboard & Landing)
* `text-display`: `3.5rem` (56px) | `line-height: 1.1` | `font-weight: 900`
* `text-h2`: `2.25rem` (36px) | `line-height: 1.2` | `font-weight: 800`
* `text-h3`: `1.25rem` (20px) | `line-height: 1.3` | `font-weight: 700`
* `text-body`: `0.875rem` (14px) | `line-height: 1.5` | `font-weight: 400`
* `text-caption`: `0.75rem` (12px) | `line-height: 1.4` | `font-weight: 600`

#### Mobil Ölçeği (`mobile-address-app`)
*Mobil cihazlarda güneş altında okunabilirliği sağlamak ve iOS otomatik font büyütme zoom hatasını engellemek için input alanları minimum 16px yapılır.*
* `text-mobile-h2`: `1.375rem` (22px) | `line-height: 1.3` | `font-weight: 800`
* `text-mobile-label`: `0.9375rem` (15px) | `line-height: 1.4` | `font-weight: 700`
* `text-mobile-input`: `1.00rem` (16px) | `line-height: 1.5` | `font-weight: 500`
* `text-mobile-caption`: `0.8125rem` (13px) | `line-height: 1.5` | `font-weight: 400`

### 3.3 Spacing Scale (Grid Sistemi)
- `--space-xs`: `4px`
- `--space-sm`: `8px`
- `--space-md`: `12px`
- `--space-lg`: `16px`
- `--space-xl`: `24px`
- `--space-2xl`: `32px`
- `--space-3xl`: `48px`

---

## 4. WCAG 2.1 AA Erişilebilirlik ve Kontrast Standardı

Tüm metin ve arka plan kombinasyonlarında **minimum 4.5:1 kontrast oranı** zorunludur:
- Koyu temada metin rengi: `#FFFFFF` ve `#CBD5E1` (Koyu arka plan üzerinde minimum 7:1 kontrast).
- Açık temada metin rengi: `#0F172A` (Beyaz arka plan üzerinde 15:1 kontrast).
- Dokunmatik eleman boyutları (Touch Targets): Mobilde tüm buton ve input yükseklikleri **minimum 48px - 52px** olarak yapılandırılır.

---

## 5. Bileşen Standartları (Component Specs)

### 5.1 Primary Call-To-Action (CTA) Butonu
- **Masaüstü Gradient:** `linear-gradient(135deg, #14B8A6 0%, #6366F1 100%)`
- **Hover/Active:** Scale `1.02`, glow intensity artışı.
- **Yükleniyor (Loading State):** Buton genişliğini sabit tutan (layout shift önleyici) dahili spinner ikonu.
- **Engelli (Disabled State):** `opacity: 0.4; cursor: not-allowed; box-shadow: none;`

### 5.2 Viber Mesaj Simülatörü (Hero Widget)
- **Header:** Viber Purple (`#7360F2`) zeminli resmi görünüm.
- **Buton 1 (Onay):** Emerald Yeşil (`#10B981`) solid buton (`✅ DA, ADRESA JE TAČNA`).
- **Buton 2 (Izmeni Adresu):** Dark glass border buton (`✏️ IZMENI ADRESU`).
- **Doğrulama Rozeti:** Viber resmi ticari markasını ihlal etmemek adına markadan bağımsız nötr "Doğrulanmış Gönderi" ibaresi kullanılır.

### 5.3 Mobil Kargo Süreç Takipçisi & Harita Kartı (`mobile-address-app` — YENİ)
Müşteri Viber linkine tıkladığında resmi bir kargo doğrulama sayfasında olduğunu hissettirmek amacıyla formun üst kısmına 3 adımlı bir süreç takipçisi ve dinamik konum haritası eklenir:
1. **Adım 1:** `Porudžbina Primljena` (Sipariş Alındı — Tamamlandı)
2. **Adım 2:** `Potvrda Adrese` (Adres Doğrulama — Aktif Adım)
3. **Adım 3:** `Spremljeno za Kargo` (Kargoya Hazır — Beklemede)

### 5.4 Mobil Form Elemanları (`potvrdio.online/edit`)
- **Card Container:** `#FFFFFF` zemin, `border: 1px solid #E2E8F0`, `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05)`.
- **Input Focus State:** `border-color: #14B8A6`, `box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15)`.
- **Hukuki Metin:** Formun altında yer alan zorunlu ZZPL gizlilik metni.

### 5.5 Merchant Dashboard Log Tablosu ve Boş Durum (Empty State)
- **`APPROVED` Rozeti:** Arka plan `rgba(16, 185, 129, 0.1)`, Metin `#34D399`, Sınır `rgba(16, 185, 129, 0.2)`.
- **`EDITED_ADDRESS` Rozeti:** Arka plan `rgba(59, 130, 246, 0.1)`, Metin `#60A5FA`, Sınır `rgba(59, 130, 246, 0.2)`.
- **`SMS_FALLBACK` Rozeti:** Arka plan `rgba(245, 158, 11, 0.1)`, Metin `#FBBF24`, Sınır `rgba(245, 158, 11, 0.2)`.
- **Boş Durum (Empty State):** Henüz doğrulama yoksa açıklayıcı bir ikon ve "Henüz verifikasyon yapılmadı" yönlendirme uyarısı.

---

## 6. Bölgesel Dil ve Hukuki Uyum Standartları

* **Dil:** Sırpça / Hırvatça (`sr-RS`) Latin Alfabesi.
* **Onay Metni:** `"Sačuvaj i Potvrdi Pošiljku"`
* **Adres Başlığı:** `"Proveri i Izmeni Adresu Dostave"`
* **Mobil Gizlilik Metni (ZZPL / GDPR):** `"Vaši podaci se koriste isključivo za potvrdu ove porudžbine."`
* **Para Birimleri:** `RSD` (Sırp Dinarı), `EUR` (€), `BAM` (Bosna Markı).
