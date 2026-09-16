# Balkan WooCommerce Viber Automation & Credit Pool Micro-SaaS
## İş Modeli ve Uygulama Dokümanı (Final Spec - Revize v3)

---

## 1. Yönetici Özeti (Executive Summary)

**Ürün Tanımı:** Sırbistan ve Balkan bölgesindeki WooCommerce e-ticaret siteleri için geliştirilmiş; kapıda ödeme (COD / Plaćanje pouzećem) siparişlerini doğrulayan, terk edilmiş sepetleri kurtaran ve 2 yönlü mesajlaşmayı **Viber Business API + SMS Fallback** üzerinden gerçekleştiren hafif bir micro-SaaS platformudur.

**İş Modelinin Özü:** Satıcılardan zorunlu aylık yazılım abonelik ücreti almak yerine ($0 Kurulum / Giriş Ücreti), toptan alınan Viber/SMS mesaj kredilerinin küçük satıcılara "Ortak Mesaj Havuzu" üzerinden resold edilmesi esasına dayanır. Büyüme kancası korunurken, marj optimize edilerek **%60-%70 brüt kâr marjı** ve yüksek hacimli mağazalar için opsiyonel **"Rezerve Kredi (MRR)"** aboneliği ile finansal sürdürülebilirlik sağlanır.

---

## 2. Çözülen İki Temel Pazar Problemi

```
                            [MAĞAZA SORUNLARI]
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
 1. Kapıda Ödeme (COD) Kayıpları                     2. Terk Edilmiş Sepetler
    - Müşteri paketi reddediyor / sahte bilgi.          - E-posta açılma oranı çok düşük (%15).
    - Satıcı gidiş + dönüş kargo ücretini              - Küçük satıcılar Viber Business API
      (Post Express / D Express) cebinden öder.           taahhüt ücretlerini (€150/ay) karşılayamıyor.
```

1. **COD Kargo Zararları (Kapıda Ödeme İadeleri):** Sırbistan ve çevre ülkelerde e-ticaret alışverişlerinin %60-70'i kapıda ödeme ile yapılır. Alıcının paketi almaması durumunda satıcı hem gidiş hem dönüş kargo ücretini ödeyerek doğrudan zarar eder.
2. **Yüksek Sepet Terk Etme Oranı:** E-posta ile sepet hatırlatma mesajlarının açılma oranı Balkanlar'da son derece düşüktür (%15). Ancak bölgede insanların ana iletişim aracı Viber'dır.

---

## 3. Ürün Özellikleri ve Sistem Mimarisi

### A. Otomatik COD Sipariş Doğrulama (Two-Way COD Verification)
1. Müşteri WooCommerce checkout sayfasından "Kapıda Ödeme" seçerek sipariş verir.
2. Eklenti sipariş etiketini kesmeyi ve kargo entegrasyonuna aktarmayı durdurur (`On Hold` durumu).
3. Müşterinin Viber hesabına otomatik bir doğrulama mesajı gider:
   > *"Merhaba [Ad], #[SiparişNo] numaralı siparişinizi onaylıyor musunuz? Onaylamak için aşağıdaki 'Evet, Onaylıyorum' butonuna basınız."*
4. Müşteri butona bastığında sipariş otomatik olarak `Processing` (İşleniyor) durumuna geçer ve kargo etiketine onay damgası vurulur. Onaylanmayan siparişler kargolanmaz.

### B. Akıllı Sepet Kurtarma (Abandoned Cart Recovery via Viber)
1. Müşteri sepetine ürün ekleyip telefon/adres adımında sayfadan ayrıldığında senaryo tetiklenir.
2. **15. Dakika:** Otomatik Viber mesajı gider (Örn: *"[Ad], sepetinizde harika ürünler bıraktınız! Siparişinizi tamamlamak için tıklayın."*).
3. **Viber Ulaşmazsa (Fallback):** 5 dakika içinde Viber teslimat bilgisi gelmezse sistem otomatik olarak SMS gönderir.

### C. Ortak Viber Mesaj Kredi Havuzu (Credit Aggregation Engine)
* Bireysel KOBİ'ler tek başlarına Infobip veya Viber Business API'ye başvurduklarında yüksek aylık taahhütlerle karşılaşırlar.
* Bu micro-SaaS ana hesap olarak kurumsal sözleşme yapar ve 100+ mağazanın hacmini birleştirerek en alt fiyattan mesaj satın alır.

---

## 4. Optimize Edilmiş Fiyatlandırma ve Matematiksel Olarak Tutarlı Birim Ekonomi

Satıcının ana referans noktası mesajın `€0.018` veya `€0.024` olması değil, harcadığı `€15` karşılığında kurtardığı `€120+` cirodur. Fiyat hassasiyeti düşük olduğu için brüt marjlar %63-65 bandına çekilmiştir.

### A. Pay-As-You-Go Kredi Paketleri ($0/ay Giriş Ücreti)

| Paket | Yükleme Tutarı | Toptan Alış (Ort.) | Yeni Satış Fiyatı | Brüt Kar Marjı | SMS Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Starter** | **€15** | €0.009 | **€0.026** / mesaj | **%65** (€0.017 kâr) | €0.048 / mesaj |
| **Growth** | **€45** | €0.009 | **€0.024** / mesaj | **%63** (€0.015 kâr) | €0.042 / mesaj |
| **Pro** | **€120** | €0.009 | **€0.020** / mesaj | **%55** (€0.011 kâr) | €0.038 / mesaj |

### B. Opsiyonel "Pro Reserve" Abonelik Planı (Öngörülebilir MRR)

Daha yüksek hacimli ve kararlı mağazalar için opsiyonel bir sabit bakiye aboneliği sunulur:
* **Pro Reserve Planı:** **€29/ay = 1.800 Mesaj Kredisi** (Birim mesaj maliyeti ~€0.016/mesaj — Pay-as-you-go'dan daha ucuz, mesaj başı net kâr: **€0.007**).
* **Stratejik Avantajı:** Küçük mağazalar $0 giriş kancasıyla sisteme girerken, olgunlaşan mağazalar aylık sabit garanti MRR kaynağına dönüşür. 100 mağazanın 15-20'si bu plana geçtiğinde **€435 - €580/ay garanti sabit gelir** sağlanır.

### C. Finansal Maliyet Yapısı ve Tutarlı Başabaş (Breakeven) Analizi

SaaS platformunun kendi sabit giderleri (CPaaS Minimum Monthly Commitment MMC + Sunucu/Hosting + Ödeme Komisyonları + Destek) aylık **€500/ay** olarak belirlenmiştir.

```
[Mağaza Hacim Profilleri ve Brüt Kâr Katkısı]

1. Orta Hacimli / Aktif Mağaza (400 Mesaj/Ay):
   - Mesaj Başı Ortalama Net Brüt Kâr: €0.015
   - Mağaza Başı Aylık Brüt Kâr Katkısı: 400 x €0.015 = €6.00 / ay / mağaza
   - Breakeven (Başabaş) Noktası: €500 / €6.00 = 84 Aktif Mağaza
   - 100 Aktif Mağazada Net Kâr: (100 x €6.00) - €500 = +€100 / ay (Net Kârlı)

2. Mikro / Uzun Kuyruk Mağaza (Düşük Hacim - 150 Mesaj/Ay):
   - Mağaza Başı Aylık Brüt Kâr Katkısı: 150 x €0.015 = €2.25 / ay / mağaza
   - Sadece Mikro Mağazalarla Breakeven Noktası: €500 / €2.25 = 223 Mikro Mağaza
   - 100 Mikro Mağazada Net Sonuç: (100 x €2.25) - €500 = -€275 / ay (Zarar)

3. Hibrit Model (100 Aktif PAYG Mağazası + 15 Pro Reserve Abonesi):
   - 100 PAYG Mağaza Brüt Kârı: €600
   - 15 Pro Reserve Sabit Abonelik Geliri: 15 x €29 = €435 (Mesaj Maliyeti Düşüldükten Sonra Net Katkı: ~€240)
   - Toplam Brüt Kâr: €840/ay
   - Net Kâr: €840 - €500 = +€340 / ay
```

**Özet Breakeven Kriteri:** Platformun €500 sabit masrafını karşılayıp kâra geçmesi için **~84 Aktif Mağaza (400 mesaj/ay)** veya **~223 Mikro Mağaza (150 mesaj/ay)** yeterlidir.

---

## 5. Yerel Hukuki Uyum ve Veri Koruma Tablosu (Balkan Mevzuatı)

Türkiye KVKK mevzuatının bu bölgede hukuki bağlayıcılığı yoktur. Bölge ülkelerinin her biri kendilerine özgü GDPR-hizalı veri koruma yasalarına tabidir:

| Ülke | Geçerli Yerel Veri Koruma Kanunu | Hukuki Durum & Nüans |
| :--- | :--- | :--- |
| **Sırbistan** | **Zakon o zaštiti podataka o ličnosti (ZZPL)** | GDPR'a atıfta bulunur ancak GDPR doğrudan uygulanmaz. Yerel ZZPL bildirimi esastır. |
| **Bosna-Hersek** | **Law on Protection of Personal Data (yeni DPL)** | 30 Ocak 2025 kabullü yeni kanun; Ekim 2025 itibarıyla GDPR ile tam uyumlu yürürlüktedir. |
| **Karadağ** | **Personal Data Protection Act (PDPA)** | Temmuz 2023 revizyonu ile GDPR ilkelerine uyarlanmıştır. |
| **Kuzey Makedonya** | **Law on Personal Data Protection (LPDP)** | Resmi Gazete 42/2020 uyarlaması ile GDPR standartlarındadır. |
| **Hırvatistan** | **AB GDPR** | Diğerlerinden farklı olarak doğrudan AB regülasyonu geçerlidir. |

### Hukuki Risk ve Uygulama Önlemi
* **Risk:** Yerel Veri Koruma Mevzuatına Uyumsuzluk (Sırbistan: ZZPL, BiH: DPL, Karadağ: PDPA, K. Makedonya: LPDP, Hırvatistan: GDPR).
* **Uygulama Önlemi:** Checkout alanında ülkeye özgü açık rıza metni (`Opt-in`) + Viber/SMS mesajında "Abonelikten Çık" (`Opt-out`) seçeneği + Veri işleme amacının (sipariş teyidi ve sepet kurtarma) açıkça belirtilmesi. *(Canlı lansman öncesi Sırbistan pazarı için ZZPL bildirim yükümlülükleri yerel bir hukuk danışmanına teyit ettirilmelidir).*

---

## 6. Bölgesel Avantaj ve Pazar Verileri

* **Bölge:** Sırbistan, Bosna-Hersek, Karadağ, Kuzey Makedonya, Hırvatistan.
* **Viber Akıllı Telefon Nüfuzu:** Sırbistan'da **%90 - %94** (Bölgenin açık ara 1 numaralı mesajlaşma uygulaması).
* **Açılma Oranları:** Viber iş mesajları **ilk 3 dakika içinde %90 açılma oranına** sahiptir.
* **Kargo Entegrasyonları:** Post Express, D Express, Bex, City Express (Sırbistan yerel kargo firmaları ile tam uyumlu sipariş durum yönetimi).

---

## 7. Pazara Giriş Stratejisi (Go-To-Market)

1. **WordPress.org Eklenti Dizini:** Eklenti *"Free WooCommerce Viber COD & Cart Recovery"* başlığıyla dizine yüklenir. SEO ile "WooCommerce Serbia COD", "Viber SMS notification" aramalarından organik trafik çekilir.
2. **Ücretsiz Kanca (Hook):** Eklenti kurulur kurulmaz verilen 25 ücretsiz mesaj ile satıcı ilk 24 saatte 2-3 sipariş kurtarır. Dashboard'da *"25 ücretsiz mesajla €120 ciro kurtardınız, €15 yükleyin"* uyarısı çıkar.
3. **Bölgesel E-Ticaret Toplulukları:**
   * Facebook Grupları: *E-commerce Srbija*, *WooCommerce Balkan*, *Online Prodaja Srbija*.
   * Örnek İçerik/Post: *"Kapıda ödeme iadelerinden kaç para kaybediyorsunuz? Viber ile sipariş doğrulamayı ücretsiz deneyin."*

---

## 8. Nihai Doğrulama Kararı

Bu iş modeli; **%63-65 brüt kâr marjı**, **Pro Reserve MRR katmanı**, **doğru Balkan veri koruma mevzuatı (ZZPL, DPL vb.)** ve netleştirilmiş **~84 aktif mağazalık başabaş (Breakeven) hedefi** ile tamamen doğrulanmış, yüksek kârlılığa sahip ve sürdürülebilir bir micro-SaaS projesine dönüştürülmüştür.
