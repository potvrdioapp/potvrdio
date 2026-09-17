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
* **Performans Kararı:** Düşük konfigürasyonlu Android cihazlarda ve Viber içi webview (in-app browser) içinde gecikmeyi sıfırlamak için `backdrop-filter: blur()`, harita SDK'ları ve heavy CSS efektleri **kesinlikle kullanılmaz**. Düz net kenarlıklar, hafif gölgeler ve sub-1s render garanti edilir.

### 1.3 Sıfır Emoji Standartı ve İkonografi Kuralı (Zero-Emoji Architecture Decision)
* **Kural:** Proje genelinde (kod tabanı, Viber mesaj şablonları, mobil webview, dashboard, butonlar ve dokümantasyon dahil) hiçbir Unicode emojisi (`✅`, `✏️`, `📦`, `📍`, `🔒`, `🔘`, `⏱` vb.) **kesinlikle kullanılmaz**.
* **Gerekçe:**
  1. Emojiler Android, iOS, Windows ve in-app browser webview'lerinde farklı boyut, renk, glif ve dikey hizalama ile render edilir (layout shift ve görsel tutarsızlık yaratır).
  2. B2B / micro-SaaS ve resmi sipariş doğrulama bağlamında emojiler spam veya gayriciddi algı yaratabilir.
* **Standart:** Görsel gösterim gereken tüm alanlarda yalnızca **tek tip, vektörel ve semantik SVG ikonları** (`Lucide Icons` veya saf satır içi SVG) kullanılır.

---

## 2. Renk Paleti ve Tasarım Token'ları

### 2.1 Marka Kimliği & Resmi Logo Standardı
* **Potvrdio Resmi Logo Renkleri:**
  - **Brand Deep Indigo/Purple (`#361F6F`):** Konuşma balonu çerçevesi ve tipografi ana rengi (Açık tema).
  - **Brand Verification Green (`#22AF75`):** Doğrulama onay tiki (Checkmark). Hem açık hem koyu temada değişmeyen temel aksan.
  - **Dark Mode Uyarlaması:** Koyu arka planda (`#070A13` / `#0D121F`) yüksek kontrast sağlamak amacıyla konuşma balonu ve yazı rengi beyaz (`#FFFFFF`), checkmark ise canlı yeşil (`#22AF75`) olarak render edilir.
* **Resmi Logo Varlıkları (`shared/assets/` ve `/public` dizinleri):**
  - `logo-icon-light.png` / `logo-icon-dark.png`: İkon rozeti (konuşma balonu + yeşil onay işareti).
  - `logo-horizontal-light.png` / `logo-horizontal-dark.png`: Yatay kurumsal logo (ikon + potvrdio.online).
  - `logo-stacked-light.png` / `logo-stacked-dark.png`: Orijinal dikey yerleşimli logo (üstte ikon, altta potvrdio).
  - `logo-icon-light.svg` / `logo-icon-dark.svg`: Vektörel SVG ikonlar.
  - `favicon.svg`, `favicon-32.png`, `favicon-64.png`, `favicon-192.png`: Tarayıcı ve mobil ikonları.
* **Viber Resmi Rengi:** **Viber Purple (`#7360F2`)** — **SADECE** Viber Business API ile doğrudan ilişkili UI elemanlarında (Viber mesaj simülatörü header'ı ve Viber aksiyon butonlarında) kullanılır. Kullanıcının ürünü "Viber'ın resmi yazılımı" sanmasını önlemek için marka kimliğinden kesin hatlarla ayrılmıştır.
* **Kargo & Taşıyıcı Bağımsızlığı İlkesi:** Sayfa tasarımı; D Express, Post Express, Bex gibi yerel kargo firmalarının tescilli renk ve logolarını taklit etmez. Güven taklidi (brand impersonation) veya tüketiciyi yanıltma riskini sıfırlamak adına tamamen nötr, şeffaf ve mağaza odaklı bir "Sipariş Teslimat Doğrulama" dili kullanılır.

### 2.2 Primary & Brand Tokens
| Token | Value / Hex | Açıklama / Kullanım |
| :--- | :--- | :--- |
| `--color-brand-purple` | `#361F6F` | Resmi logo ana rengi, tipografi ve konuşma balonu (Light) |
| `--color-brand-green` | `#22AF75` | Resmi logo onay işareti (Checkmark) ve doğrulama aksanı |
| `--color-brand-teal` | `#14B8A6` | Web platformu sekonder marka rengi, primary CTA başlangıcı |
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
| `--status-danger` | `#EF4444` (Red) | Token süresi doldu (24 saat / oturum aşımı) / `ERROR` durumları |

---

## 3. Tipografi ve Aralık (Spacing) Sistemi

### 3.1 Font Ailesi
- **Primary Font:** `Inter`, sans-serif (Google Fonts) — Tüm Balkan dillerini, tam Latin ve yerel Kiril karakter setini (Makedonca'ya özgü `ѓ, ќ, ѕ, џ, љ, њ` dahil olmak üzere) eksiksiz ve yerel glif formlarıyla destekler. *(Alternatif Geometrik Font: `Manrope`)*.
- **Tipografi Notu:** `Plus Jakarta Sans` Google Fonts üzerinde temel Kiril (`U+0400-U+045F`) bloğunu barındırmadığından ve Makedonca metinlerde sistem fontuna (fallback) düştüğünden ana font listesinden çıkarılmıştır.
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
- Dokunmatik eleman boyutları (Touch Targets): Mobilde tüm buton ve input yükseklikleri **minimum 48px - 52px** olarak yapılandırılır (özellikle yaşlı ve tek elle kullanan alıcılar için ergonomik standard).

---

## 5. Bileşen Standartları (Component Specs)

### 5.1 Primary Call-To-Action (CTA) Butonu
- **Masaüstü Gradient:** `linear-gradient(135deg, #14B8A6 0%, #6366F1 100%)`
- **Hover/Active:** Scale `1.02`, glow intensity artışı.
- **Yükleniyor (Loading State):** Buton genişliğini sabit tutan (layout shift önleyici) dahili spinner ikonu.
- **Engelli (Disabled State):** `opacity: 0.4; cursor: not-allowed; box-shadow: none;`

### 5.2 Viber Mesaj Simülatörü (Hero Widget)
- **Header:** Viber Purple (`#7360F2`) zeminli simülasyon görünümü.
- **Buton 1 (Onay):** Emerald Yeşil (`#10B981`) solid buton (`DA, ADRESA JE TAČNA`).
- **Buton 2 (Izmeni Adresu):** Dark glass border buton (`IZMENI ADRESU`).
- **Doğrulama Rozeti:** Viber resmi ticari markasını ihlal etmemek adına markadan bağımsız nötr "Doğrulanmış Gönderi" ibaresi kullanılır.

### 5.3 Mobil Teslimat Doğrulama Başlığı & Adres Özeti (`mobile-address-app`)
> **Performans & Kapsam Kuralı (YAGNI):** Harita bileşeni (harita SDK'sı, tile sunucusu, geolocation) **kapsam dışıdır**. Düşük donanımlı Android ve Viber içi webview'de sıfır gecikme (sub-1s render) sağlamak amacıyla harita kartı yerine hafif ve salt CSS bir "Sipariş & Adres Bilgi Kartı" kullanılır. Hiçbir kargo firmasının (Post Express/D Express) görsel kimliği taklit edilmez.

- **Sade Durum Başlığı:** Mağaza adı ve sipariş numarası (`#[SiparişNo] - Adres Doğrulama`).
- **Hafif Adres Özet Kutusu:** Müşterinin WooCommerce siparişinde verdiği mevcut adres salt metin olarak gösterilir; altına tek tıkla "Adresim Doğru" veya formu düzenleme seçeneği sunulur.
- **Token Geçerlilik Süresi:** Token'lar aceleye yer bırakmayacak şekilde **24 saat** geçerli (veya tıklandıktan sonra 30 dakika aktif oturum sağlayan) tek kullanımlık bağlantılardır. Form submit edildiğinde token otomatik tüketilir.

### 5.4 Mobil Form Elemanları (`potvrdio.online/edit`)
- **Card Container:** `#FFFFFF` zemin, `border: 1px solid #E2E8F0`, `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05)`.
- **Input Focus State:** `border-color: #14B8A6`, `box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15)`.
- **Input Boyutları:** 16px font (iOS auto-zoom bug önleyici), 48px-52px yükseklik (erişilebilirlik garantisi).
- **Hukuki Metin:** Formun altında yer alan zorunlu yerel veri koruma (ZZPL / GDPR / LPDP) gizlilik metni.

### 5.5 Merchant Dashboard Log Tablosu ve Boş Durum (Empty State)
- **`APPROVED` Rozeti:** Arka plan `rgba(16, 185, 129, 0.1)`, Metin `#34D399`, Sınır `rgba(16, 185, 129, 0.2)`.
- **`EDITED_ADDRESS` Rozeti:** Arka plan `rgba(59, 130, 246, 0.1)`, Metin `#60A5FA`, Sınır `rgba(59, 130, 246, 0.2)`.
- **`SMS_FALLBACK` Rozeti:** Arka plan `rgba(245, 158, 11, 0.1)`, Metin `#FBBF24`, Sınır `rgba(245, 158, 11, 0.2)`.
- **Boş Durum (Empty State):** Henüz doğrulama yoksa açıklayıcı bir ikon ve "Henüz verifikasyon yapılmadı" yönlendirme uyarısı.

---

## 6. Bölgesel Dil, Alfabe ve Para Birimi Standartları

Balkan pazarındaki 5 hedef ülke için iki temel alfabe ve yerel para birimleri desteklenir:

### 6.1 Dil ve Alfabe Matrisi
| Bölge / Pazar | Resmi Dil & Kod | Alfabe | Veri Koruma Mevzuatı |
| :--- | :--- | :--- | :--- |
| **Sırbistan** | Sırpça (`sr-RS`) | Latin | ZZPL (GDPR hizalı) |
| **Bosna-Hersek** | Boşnakça / Hırvatça / Sırpça (`bs-BA`) | Latin | DPL (2025 revizyonu) |
| **Hırvatistan** | Hırvatça (`hr-HR`) | Latin | AB GDPR |
| **Karadağ** | Karadağca (`me-ME`) | Latin | PDPA |
| **Kuzey Makedonya** | Makedonca (`mk-MK`) | **Kiril (Cyrillic)** | LPDP |
| **Uluslararası / Expats** | İngilizce (`en-US`) | Latin | GDPR |
| **Yönetim & Satıcı Destek** | Türkçe (`tr-TR`) | Latin | KVKK / GDPR |

### 6.2 UI Metin Kopyaları (Microcopy)

#### A. Sırpça / Hırvatça / Boşnakça (Latin):
* **Onay Butonu:** `"Sačuvaj i Potvrdi Pošiljku"`
* **Adres Başlığı:** `"Proveri i Izmeni Adresu Dostave"`
* **Adres Doğru Butonu:** `"Adresa je Tačna"`
* **Mobil Gizlilik Metni (ZZPL / GDPR):** `"Vaši podaci se koriste isključivo za potvrdu ove porudžbine."`

#### B. Makedonca (Kiril — Kuzey Makedonya):
* **Onay Butonu:** `"Зачувај и потврди нарачка"`
* **Adres Başlığı:** `"Провери и промени адреса за достава"`
* **Adres Doğru Butonu:** `"Адресата е точна"`
* **Mobil Gizlilik Metni (LPDP):** `"Вашите податоци се користат исклучиво за потврда на оваа нарачка."`

#### C. İngilizce (English — Uluslararası):
* **Onay Butonu:** `"Save & Confirm Order"`
* **Adres Başlığı:** `"Review & Edit Delivery Address"`
* **Adres Doğru Butonu:** `"Address is Correct"`
* **Mobil Gizlilik Metni (GDPR):** `"Your data is strictly processed to verify and fulfill this delivery."`

#### D. Türkçe (Turkish — Operasyon & Satıcı Dili):
* **Onay Butonu:** `"Güncelle ve Siparişi Onayla"`
* **Adres Başlığı:** `"Teslimat Adresini İncele ve Düzenle"`
* **Adres Doğru Butonu:** `"Adres Doğru, Gönderin"`
* **Mobil Gizlilik Metni (KVKK / GDPR):** `"Kişisel verileriniz yalnızca bu siparişin doğrulanması ve teslimatı amacıyla işlenir."`

### 6.3 Desteklenen Para Birimleri
* `RSD` (Sırp Dinarı — din. / RSD)
* `EUR` (€ — Karadağ & Hırvatistan)
* `BAM` (Bosna Hersek Değiştirilebilir Markı — KM)
* `MKD` (Makedon Dinarı — ден / MKD)
* `TRY` (Türk Lirası — ₺)
* `USD` ($)

> **Fazlandırma Notu:** Faz 1 ve 2 lansmanı öncelikli olarak en büyük COD hacmine sahip Sırbistan, Bosna-Hersek ve Karadağ/Hırvatistan (Latin) pazarında başlatılacak; Kuzey Makedonya (Kiril + MKD) altyapı hazırlığı tamamlanmış olarak bölgesel genişleme fazında devreye alınacaktır.
