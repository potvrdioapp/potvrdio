# Potvrdio (potvrdio.online)
## WooCommerce Viber COD Verification & Cart Recovery SaaS
### Ürün Kapsam ve Teknik Gereksinim Dokümanı (PRD / Technical Scope Document)

**Marka / Ürün Adı:** Potvrdio  
**Resmi Domain:** `potvrdio.online`  
**Doküman Sürümü:** v2.0 (Production Blueprint)  
**Tarih:** Eylül 2026  
**Hedef Kitle:** Yazılım Geliştirme Ekibi / Proje Yöneticisi  

---

## 1. Proje Özeti ve Amaç

**Projenin Amacı:** Sırbistan ve Balkan bölgesindeki WooCommerce e-ticaret siteleri için kapıda ödeme (COD / Plaćanje pouzećem) siparişlerinin iade ve kargo zararlarını sıfırlayan, terk edilmiş sepetleri kurtaran ve adres doğrulamasını **Potvrdio** platformu üzerinden gerçekleştiren bir micro-SaaS ürünüdür.

**Temel Çalışma Mantığı:**
1. Mağazadaki kapıda ödeme siparişi dondurulur (`On Hold`).
2. Müşterinin Viber hesabına 2 butonlu doğrulama ve adres kontrol mesajı gönderilir.
3. Müşteri onaylarsa veya tek tıkla adresini `potvrdio.online` üzerindeki hafif mobil sayfadan düzeltirse sipariş serbest bırakılır (`Processing`) ve WooCommerce panelinde adres güncellenir.

---

## 2. Sistem Bileşenleri Mimarisi (Potvrdio Monorepo)

```
┌───────────────────────────┐      ┌───────────────────────────┐
│ 1. WooCommerce Plugin     │ ◄──► │ 2. Potvrdio Central API   │
│    (potvrdio-plugin PHP)  │      │    (Node.js / Python)     │
└───────────────────────────┘      └─────────────┬─────────────┘
                                                 │
                                   ┌─────────────┴─────────────┐
                                   ▼                           ▼
                     ┌───────────────────────────┐ ┌───────────────────────────┐
                     │ 3. Viber Gateway API      │ │ 4. Mobile Address Form    │
                     │    (Infobip / BulkGate)   │ │    (potvrdio.online/edit) │
                     └───────────────────────────┘ └───────────────────────────┘
```

---

## 3. Detaylı Fonksiyonel Gereksinimler (Functional Requirements)

### 3.1 WooCommerce Eklentisi (Potvrdio Client Plugin - PHP)
* **FR-1.1 (Order Interception):** Müşteri "Kapıda Ödeme" ödeme yöntemini seçtiğinde, eklenti sipariş durumunu otomatik olarak `On Hold` (Beklemede) yapar ve kargo etiket basımını engeller.
* **FR-1.2 (Payload Transmission):** Sipariş oluktuktan hemen sonra (Ad, Soyad, Telefon, Adres, Şehir, Sipariş Tutarı, Ürün Özetleri) verilerini Potvrdio Central Server'a REST API (POST) ile iletir.
* **FR-1.3 (Order State Update):** Central Server'dan gelen `APPROVED` veya `UPDATED_ADDRESS` webhook bildirimine göre sipariş durumunu `Processing` (İşleniyor) yapar ve gerekiyorsa teslimat adresini günceller.
* **FR-1.4 (Selective Verification Rules):** Satıcının paneldeki ayarlarına göre mesaj tetikler:
  * *Kural A:* Sadece kapıda ödemelerde çalış.
  * *Kural B:* Daha önce kayıtlı/güvenli müşterileri muaf tut.
  * *Kural C:* Kartla yapılan ödemelerde asla çalışma.

### 3.2 Potvrdio Merkezi Sunucu (Central Server Backend - Node.js / Python)
* **FR-2.1 (API Gateway & Authentication):** Eklentilerden gelen istekleri `API Key` / `Secret` ile doğrular.
* **FR-2.2 (Credit Engine):** Satıcının ön ödemeli bakiye hesabını kontrol eder. Bakiye yetersizse e-posta ile bakiye yükleme uyarısı atar.
* **FR-2.3 (Messaging Queue & Rate Limit):** Mesaj isteklerini Celery / BullMQ ile kuyruğa alır. Viber API teslimat durumunu (Sent, Delivered, Read, Failed) takip eder.
* **FR-2.4 (SMS Fallback Automation):** Viber mesajı gönderildikten sonra **5 dakika içinde** `Delivered` veya `Read` bilgisi gelmezse, sistemi otomatik olarak ucuz SMS gateway'ine düşürür.

### 3.3 Viber Mesajı ve İnteraktif Butonlar
* **FR-3.1 (Dynamic Message Template):** Mesaj içeriği dinamik değişkenler içerir:
  > *"Zdravo [Ad]! Siparişiniz #[SiparişNo] alındı (Tutar: [Tutar] RSD).*  
  > **Adresiniz:** [Sokak/Bina/Daire, Şehir]  
  > *Siparişinizi kargolamamız için onaylayın:"*
* **FR-3.2 (Button 1 - One-Click Approve):** `[ EVET, ADRES DOĞRU VE ONAYLIYORUM ]`
  * Tıklandığında Viber içinden Potvrdio sunucusuna `ACTION_APPROVE` sinyali atar. Sipariş serbest kalır.
* **FR-3.3 (Button 2 - Edit Address Link):** `[ ADRESİMİ DÜZELT ]`
  * Tıklandığında müşteriyi `https://potvrdio.online/edit/...` adresine yönlendirir.

### 3.4 Mobil Adres Düzeltme Sayfası (Mobile Web App - potvrdio.online)
* **FR-4.1 (Passwordless Token URL):** Müşteri linke tıkladığında şifre/giriş istemeden, sadece o siparişe özel şifrelenmiş geçici token URL ile açılır (Örn: `https://potvrdio.online/edit-address?token=xyz123`).
* **FR-4.2 (Mobile Form UI):** Formda mevcut adres alanları (Şehir, Sokak & Bina No, Daire/Kat, Sipariş Notu) önceden dolu olarak gelir.
* **FR-4.3 (Update & Release Flow):** Müşteri adresi güncelleyip **[ Güncelle ve Siparişi Onayla ]** butonuna bastığı an:
  1. Potvrdio Central Server siparişi `APPROVED` olarak işaretler.
  2. Eklentiye webhook atarak WooCommerce'deki teslimat adresini günceller ve durumu `Processing` yapar.

### 3.5 Sepet Terk Etme Takipçisi (Cart Recovery Engine)
* **FR-5.1 (Cart Capture):** Checkout sayfasında telefon/adres doldurulduğu an eklenti taslak sepeti (Draft Cart) kaydeder.
* **FR-5.2 (Timed Sequence):** Sipariş 15 dakika içinde tamamlanmazsa otomatik Viber kurtarma mesajı atar (*"[Ad], sepetinizde harika ürünler bıraktınız! Siparişinizi tamamlamak için tıklayın."*).

---

## 4. Veri Akışı ve Senaryo Şeması (Sequence Diagram)

```
[Müşteri]        [WooCommerce]         [Potvrdio SaaS]       [Viber Gateway]
    │                  │                      │                     │
    │── 1. COD Sipariş ──►                    │                     │
    │                  │── 2. Order Hold & ──►│                     │
    │                  │   Payload Data       │── 3. Viber Send ───►│
    │                  │                      │   Message Request   │
    │                  │                      │                     │── 4. Viber Msg ──► [Müşteri]
    │                  │                      │                     │                    │
    ├──────────────────┼──────────────────────┼─────────────────────┼────────────────────┤
    │                  │                      │                     │                    │
    │ [SENARYO A: Tek Tıkla Onay]             │                     │                    │
    │── 5a. [Onayla] Butonuna Tıklar ─────────┼────────────────────►│                    │
    │                  │                      │◄─ 6a. Webhook ──────┘                    │
    │                  │◄── 7a. Approve & ────│   (Approved)                           │
    │                  │    Set Processing    │                                          │
    │                  │                      │                                          │
    ├──────────────────┼──────────────────────┼─────────────────────┼────────────────────┤
    │                  │                      │                     │                    │
    │ [SENARYO B: Adres Düzeltme]             │                     │                    │
    │── 5b. [Adresi Düzelt] Tıklar ───────────► [potvrdio.online Mobil Form]             │
    │── 6b. Adresi Düzenler & Kaydeder ──────►│                                          │
    │                  │◄── 7b. Update Address│                                          │
    │                  │    & Set Processing  │                                          │
```

---

## 5. Önerilen Teknoloji Yığını (Tech Stack)

| Katman | Teknoloji Seçeneği | Açıklama / Gerekçe |
| :--- | :--- | :--- |
| **Potvrdio Plugin** | PHP 7.4+ / WordPress REST API | Hafif, bağımsız WooCommerce eklentisi. |
| **Potvrdio Central Backend** | Node.js (TypeScript) veya Python (FastAPI) | Yüksek eşzamanlı HTTP ve kuyruk yönetimi. |
| **Veri Tabanı** | PostgreSQL + Redis | PostgreSQL (Müşteri/Bakiye verisi), Redis (BullMQ kuyruk ve token yönetimi). |
| **Mobil Form & Dashboard** | React / Next.js / Tailwind CSS | `potvrdio.online` üzerinde açılan 1s altında hızlı web app. |
| **Viber / SMS Gateway** | Infobip API / BulkGate API | Viber Business API sağlayıcıları (SMS Fallback destekli). |

---

## 6. Veri Güvenliği ve Yerel Mevzuat Uyum Matrisi

Balkan bölgesindeki veri koruma yasalarına tam uyum sağlanacaktır:

* **Sırbistan (ZZPL):** Müşteri verileri 30 gün içinde anonimleştirilir / silinir.
* **Bosna-Hersek (DPL) / Karadağ (PDPA) / Kuzey Makedonya (LPDP) / Hırvatistan (GDPR):**
  * Checkout alanına açık rıza onay seçeneği eklenir.
  * Viber mesajlarının altına tek tıkla abonelikten çıkma (`Opt-out`) bağlantısı koyulur.
  * Mobil form linkleri 24 saat geçerli (veya ilk tıklandıktan sonra 30 dakika aktif oturum sağlayan) tek kullanımlık (Single-Use Token) olarak üretilir. Form submit edildiğinde token otomatik tüketilir.

---

## 7. Geliştirme Fazları (Milestones)

* **Faz 1 (MVP - 3 Hafta):**
  * PHP WooCommerce Potvrdio eklentisi (Sipariş dondurma & payload gönderme).
  * Node.js/Python backend ve Infobip/BulkGate Viber entegrasyonu.
  * Tek tıkla Viber doğrulama mesajı düğümü.
* **Faz 2 (Adres Düzeltme & Mobil Form - 2 Hafta):**
  * Token tabanlı hafif `potvrdio.online` adres düzenleme formu.
  * Adres güncelleme webhook döngüsü ve WooCommerce adres senkronizasyonu.
* **Faz 3 (Sepet Terk Etme & Dashboard - 2 Hafta):**
  * Terk edilen sepetleri yakalama ve otomatik senaryo dizisi.
  * Satıcı Kredi yükleme (Paddle / Lemon Squeezy / Stripe) paneli ve analitik ekranı.
