# Potvrdio Outreach CRM · Tam Veritabanı Dökümü

> **Dışa Aktarma Tarihi:** 2026-10-21 07:45:23  
> **Kaynak Veritabanı:** `outreach-crm/data/potvrdio_outreach.db` (SQLite)  
> **Kapsam:** 53 Mağaza, 42 İletişim Kaydı, 52 Outreach Şablonu  

---

## 1. Veritabanı Özet İstatistikleri

| Metrik | Sayı | Açıklama |
| :--- | :---: | :--- |
| **Toplam Mağaza Sayısı** | 53 | Sistemde kayıtlı toplam e-ticaret işletmesi |
| **P1 Doğrulanmış Mağazalar** | 49 | WooCommerce + Kapıda Ödeme + Canlı E-posta teyitli odak liste |
| **P2 İkincil Havuz** | 1 | Açık e-postası bulunmayan veya ikinci aşamaya bırakılanlar |
| **Diskalifiye / Uygun Değil** | 3 | Çok büyük holding/distribütör formatındaki elenenler |
| **Temas Kurulan Mağazalar** | 25 | İlk e-postası gönderilmiş mağazalar |
| **Kayıtlı İletişim / Etkileşim** | 42 | Giden e-posta ve takip kayıtları |
| **Outreach Şablonları** | 52 | Mağazaya özel ve genel Sırpça soğuk satış şablonları |

---

## 2. Mağazalar Genel Tablosu (Stores Master List)

| ID | Mağaza Adı | Web Sitesi | Sektör | Şehir | E-posta | Telefon | Öncelik | Durum |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- | :-: | :--- |
| 1 | **Animal Market** | [animalmarket.rs](https://animalmarket.rs) | Pet Shop & Hayvan Yemi | Sırbistan Geneli | `shop@animalmarket.rs` | `+381 63 824 66 89` | `p1_verified` | `replied` |
| 2 | **Fashion Store** | [fashionstore.rs](https://fashionstore.rs) | Kadın Giyim & Butik | Čačak | `info@fashionstore.rs` | `064/307-19-52` | `p1_verified` | `waiting_reply` |
| 3 | **Šifonjer** | [sifonjer.rs](https://sifonjer.rs) | Polovna Firmirana Garderoba | Sırbistan Geneli | `podrska@sifonjer.rs` | `+381 63 818 4777` | `p1_verified` | `waiting_reply` |
| 4 | **Fermini** | [fermini.rs](https://fermini.rs) | Giyim & Tekstil | Sırbistan Geneli | `info@fermini.rs` | `+381 64 032 3362` | `p1_verified` | `replied` |
| 5 | **Comfortino** | [comfortino.rs](https://comfortino.rs) | Anatomik & Medikal Ayakkabı | Sırbistan Geneli | `obuca.comfortino@gmail.com` | `063 351 060` | `p1_verified` | `waiting_reply` |
| 6 | **Pet Zoo Shop** | [petzooshop.rs](https://petzooshop.rs) | Pet Shop & Mama | Sırbistan Geneli | `info@petzooshop.rs` | `+381 63 455 955` | `p1_verified` | `email_sent` |
| 7 | **Perbipharm** | [perbipharm.rs](https://perbipharm.rs) | Veteriner Eczane & Pet Hrana | Sırbistan Geneli | `office@perbipharm.rs` | `+381 63 692 229` | `p1_verified` | `email_sent` |
| 8 | **Lekiko** | [lekiko.rs](https://lekiko.rs) | Pet Shop | Kragujevac | `info@lekiko.rs` | `+381 63 224 490` | `p1_verified` | `email_sent` |
| 9 | **Prodaja Parfema** | [prodajaparfema.rs](https://prodajaparfema.rs) | Orijinal Parfüm & Kozmetik | Beograd | `info@prodajaparfema.rs` | `+381 11 405 3838` | `p1_verified` | `not_contacted` |
| 10 | **Fitaky** | [fitaky.rs](https://fitaky.rs) | Doğal Bebek & Aile Kozmetiği | Sırbistan Geneli | `kontakt@fitaky.rs` | `+381 60 700 4033` | `p1_verified` | `email_sent` |
| 11 | **Eridan** | [eridan.rs](https://eridan.rs) | Cilt Bakımı & Kozmetik | Beograd | `info@eridan.rs` | `+381 65 20 54 710` | `p1_verified` | `email_sent` |
| 12 | **Čarna** | [carna.rs](https://carna.rs) | El Yapımı Bitkisel Kozmetik | Sırbistan Geneli | `info@carna.rs` | `+381 64 030 5900` | `p1_verified` | `email_sent` |
| 13 | **Pura Home Spa** | [purahomespa.rs](https://purahomespa.rs) | Aromaterapi & Spa Ürünleri | Sırbistan Geneli | `purakozmetika@gmail.com` | *(Yok)* | `p1_verified` | `email_sent` |
| 14 | **Pravi Alati** | [pravialati.rs](https://pravialati.rs) | Hobi & El Aletleri | Sırbistan Geneli | `info@pravialati.rs` | `+381 64 648 8279` | `p1_verified` | `email_sent` |
| 15 | **AC Vinulović** | [ac-vinulovic.rs](https://ac-vinulovic.rs) | Oto Lastik & Akü | Negotin | `shop@ac-vinulovic.rs` | `062/815-7483` | `p1_verified` | `email_sent` |
| 16 | **Kanin Obuća** | [kaninobuca.com](https://kaninobuca.com) | Ayakkabı & Deri | Niš | `info@kaninobuca.com` | `+381 18 590 158` | `p1_verified` | `email_sent` |
| 17 | **Ljuba 024** | [ljuba.rs](https://ljuba.rs) | Hırdavat & Bahçe Malzemeleri | Subotica | `info@ljuba024.com` | `+381 65 463 1313` | `p1_verified` | `email_sent` |
| 18 | **Backup Shop** | [backupshop.rs](https://backupshop.rs) | Giyim, Çanta & Deri Aksesuar (David Jones, Anekke, Doca) | Zrenjanin | `office@backupshop.rs` | `+381 64 859 8050` | `p1_verified` | `email_sent` |
| 19 | **JAT Fashion** | [jatfashion.rs](https://jatfashion.rs) | Moda & Giyim | Sırbistan | `shop@jatfashion.rs` | *(Yok)* | `p2_unverified` | `email_sent` |
| 20 | **Ollie's** | [ollies.rs](https://ollies.rs) | Premium Maslinovo Ulje & Prirodna Kozmetika | Sırbistan | `office@ollies.rs` | *(Yok)* | `p1_verified` | `email_sent` |
| 21 | **B Plus** | [bplus.rs](https://bplus.rs) | Mobilya & Ev Dekorasyonu (Nameštaj) | Sırbistan Geneli | `b_plus@live.com` | `+381 60 0600 858` | `p1_verified` | `email_sent` |
| 22 | **Boss Shop** | [bosshop.rs](https://bosshop.rs) | Elektrikli El Aletleri & Bahçe Makineleri | Kragujevac | `webshop@bosshop.rs` | `+381 34 300 000` | `p1_verified` | `email_sent` |
| 23 | **Djomla Bike** | [djomla-bike.rs](https://djomla-bike.rs) | Bisiklet, E-Bike & Ekipman | Čačak (Vojvode Stepe 165) | `mirkovic_riders@yahoo.com` | `+381 60 42 55 266` | `p1_verified` | `email_sent` |
| 24 | **Lux Shop** | [luxshop.rs](https://luxshop.rs) | Genel E-Ticaret, Küçük Ev Aletleri & Oto Aksesuar | Senjak, Beograd | `luxshopfb@gmail.com` | `+381 62 812 4044` | `p1_verified` | `email_sent` |
| 25 | **Salon Info** | [saloninfo.rs](https://saloninfo.rs) | Profesyonel Kozmetik & Kuaför/Salon Ekipmanları | Beograd | `prodaja@saloninfo.org` | `+381 11 000 000` | `p1_verified` | `email_sent` |
| 26 | **Kozmetika Moja** | [kozmetikamoja.rs](https://kozmetikamoja.rs) | Doğal & El Yapımı Kozmetik | Sırbistan Geneli | `prodaja@kozmetikamoja.rs` | `+381 64 2589 449` | `p1_verified` | `email_sent` |
| 27 | **Fagor** | [fagor.rs](https://fagor.rs) | Ev Aletleri & Beyaz Eşya | Beograd | `info@fagor.rs` | *(Yok)* | `disqualified` | `rejected` |
| 28 | **CF Moto Delovi** | [cfmotodelovi.rs](https://cfmotodelovi.rs) | Motosiklet Yedek Parça | Beograd | `info@cfmotodelovi.rs` | *(Yok)* | `disqualified` | `rejected` |
| 29 | **PC Group** | [pcgroup.rs](https://pcgroup.rs) | Oto Yedek Parça | Sırbistan | `office@pcgroup.rs` | *(Yok)* | `disqualified` | `rejected` |
| 30 | **Kocke.rs** | [kocke.rs](https://kocke.rs) | Oyuncak, Lego & Eğitici Çocuk Setleri | Beograd | `info@kocke.rs` | `+381 63 111 8148` | `p1_verified` | `not_contacted` |
| 31 | **Silver and Fashion** | [silverandfashion.rs](https://silverandfashion.rs) | 925 Ayar Gümüş Takı & Mücevherat | Novi Sad | `silverandfashion2021@gmail.com` | `+381 60 490 7060` | `p1_verified` | `not_contacted` |
| 32 | **Ljuljuška** | [ljuljuska.com](https://ljuljuska.com) | Bebek & Çocuk Salıncakları & Doğal Tekstil | Karlovčić (Srem) | `info@ljuljuska.com` | `+381 22 434 356` | `p1_verified` | `not_contacted` |
| 33 | **AS Ribolov** | [asribolov.rs](https://asribolov.rs) | Balıkçılık & Kamp Ekipmanları | Obrenovac | `prodaja@asribolov.rs` | `+381 62 240 916` | `p1_verified` | `not_contacted` |
| 34 | **Mey Home Beograd** | [meyhome.rs](https://meyhome.rs) | Ev Tekstili, Nevresim, Halı & Yatak Örtüsü | Beograd | `mey.home.doo@gmail.com` | `+381 60 501 5885` | `p1_verified` | `not_contacted` |
| 35 | **Kafa Amigo** | [kafaamigo.rs](https://kafaamigo.rs) | Taze Kavrulmuş Kahve & Espresso Kapsülleri | Sombor | `gogicmilan.amigo@gmail.com` | `+381 61 208 6994` | `p1_verified` | `not_contacted` |
| 36 | **Amelles Kozmetika** | [amelles.rs](https://amelles.rs) | Doğal Mineral Kozmetik & Cilt Bakımı | Vrnjačka Banja | `online@amelles.rs` | `+381 36 242 5615` | `p1_verified` | `not_contacted` |
| 37 | **Gifts 4 You** | [gifts4you.rs](https://gifts4you.rs) | Kişiye Özel Hediyeler & Ahşap/Metal Tasarım | Niš | `info@gifts4you.rs` | `+381 63 254 646` | `p1_verified` | `not_contacted` |
| 38 | **Poklondžija** | [poklondzija.com](https://poklondzija.com) | Hediye Sepetleri, Çiçek & Lüks Kutlama | Beograd | `poklondzija@gmail.com` | `+381 69 555 4445` | `p1_verified` | `not_contacted` |
| 39 | **Pokupi.rs** | [pokupi.rs](https://pokupi.rs) | Ev, Bahçe, Hobi & Küçük Ev Aletleri | Niš | `prodaja@pokupi.rs` | `+381 60 3737 037` | `p1_verified` | `not_contacted` |
| 40 | **Konga Music** | [kongamusic.rs](https://kongamusic.rs) | Müzik Aletleri, Gitarlar & Dijital Piyanolar | Novi Sad | `info@kongamusic.rs` | `+381 21 526 076` | `p1_verified` | `not_contacted` |
| 41 | **Street Moto Shop** | [streetmotoshop.rs](https://streetmotoshop.rs) | Motosiklet Ekipmanları, Kasklar & Ceketler | Beograd | `prodaja@streetmotoshop.rs` | `+381 63 836 5244` | `p1_verified` | `not_contacted` |
| 42 | **Isiland** | [isiland.rs](https://isiland.rs) | Premium & Organik Bebek ve Çocuk Giyim | Beograd | `info@isiland.rs` | `+381 64 812 4478` | `p1_verified` | `not_contacted` |
| 43 | **Kolibri BEBE Shop** | [kolibribebeshop.rs](https://kolibribebeshop.rs) | Bebek Tekstili, Tulumlar, Kundak & Bebek Odası | Niš | `webshop@kolibribebeshop.rs` | `+381 18 555 666` | `p1_verified` | `not_contacted` |
| 44 | **Medenjaci.rs** | [medenjaci.rs](https://medenjaci.rs) | Ručno Dekorirani Medenjaci, Svadbene & Dečije Poslastice | Srbija | `biljana@medenjaci.rs` | `+381 69 493 0229` | `p1_verified` | `not_contacted` |
| 45 | **Afa Baby Shop** | [afababy.rs](https://afababy.rs) | Bebek Arabaları, Oto Koltukları, Mama Sandalyeleri & Bebek Odası | Srbija | `office@afababy.rs` | `+381 65 526 2544` | `p1_verified` | `not_contacted` |
| 46 | **Portobello Poklon Korpe** | [poklonkorpe.rs](https://poklonkorpe.rs) | Lüks Hediye Sepetleri, İş Hediyeleri, Şarap & Çikolata Gurme Kutuları | Novi Beograd | `portobello.ybc.nbg@gmail.com` | `+381 11 214 55 71` | `p1_verified` | `not_contacted` |
| 47 | **Mediflora Biljna Apoteka** | [biljna-apoteka.rs](https://biljna-apoteka.rs) | Doğal Bitkisel İlaçlar, Bitki Damlaları, Çaylar ve Manastır Tentürleri | Beograd | `kontakt@mediflora.rs` | `+381 11 380 62 81` | `p1_verified` | `not_contacted` |
| 48 | **Izaberi Poklon** | [izaberipoklon.rs](https://izaberipoklon.rs) | Kişiye Özel Baskılı Hediyeler, Peluş Oyuncak, Sihirli Kupa, Foto-Kamen | Beograd | `office@izaberipoklon.rs` | `061 31 54 641` | `p1_verified` | `not_contacted` |
| 49 | **Gravura.rs** | [gravura.rs](https://gravura.rs) | Lazer Ahşap & Cam Gravür, Kişiye Özel Ahşap Şişe Kutuları ve Kesme Tahtaları | Srbija | `gravurars@gmail.com` | `+381 64 446 4197` | `p1_verified` | `not_contacted` |
| 50 | **Štampane Majice** | [stampanemajice.rs](https://stampanemajice.rs) | D2C Özel Tasarım Baskılı Tişört ve Sweatshirt Modası | Srbija | `info@stampanemajice.rs` | `062 704 679` | `p1_verified` | `not_contacted` |
| 51 | **Greenshop.rs** | [greenshop.rs](https://greenshop.rs) | Sertifikalı Doğal Kozmetik, Eko Bakım & Organik Ürünler (5000+ Recenzija) | Srbija | `info@greenshop.rs` | *(Yok)* | `p1_verified` | `not_contacted` |
| 52 | **Slatkoteka ®** | [slatkoteka.rs](https://slatkoteka.rs) | Butik Donut, Pasta, Tatlı Hediyeleri & Gurme Çikolata (Slatkoteka Markası) | Beograd | `upit@slatkoteka.rs` | `065 33 00 508` | `p1_verified` | `not_contacted` |
| 53 | **Pikshop** | [pikshop.rs](https://pikshop.rs) | Ahşap Çocuk Mutfakları, Bebek Evleri, Montessori Eğitici Oyuncaklar | Srbija | `info@pikshop.rs` | *(Yok)* | `p1_verified` | `not_contacted` |

---

## 3. Mağaza Detay Dosyaları ve Fırsat Analizleri

### 1. Animal Market (https://animalmarket.rs)

- **Web Sitesi:** [https://animalmarket.rs](https://animalmarket.rs)
- **Sektör / Kategori:** Pet Shop & Hayvan Yemi
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Animal Market
- **Doğrulanmış E-posta:** `shop@animalmarket.rs`
- **Doğrulanmış Telefon:** `+381 63 824 66 89`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `replied`
- **Altyapı & Tech Stack:** WooCommerce, Manuel Sipariş Teyidi, Kurumsal E-posta, Pet Kategori

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Sitede açıkça sipariş sonrası mesajla teyit yapıldığı yazıyor. Kanca: Onay ve adres kontrolünü otomatikleştirme.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Manuel Arama/Viber Yükü: Sipariş teyidi manuel telefon/mesajla yapılıyor; otomatik SMS teyidi ile adres hatası ve iş yükü elenebilir.
> • Ağır Desi Navlunu: Büyük mama çuvallarında teslim alınmayan paket çift yönlü navlun zararı yazar.
> • Kurye Entegrasyonu: Teyit edilen adresin doğrudan kurye adres fişine (adresnica) aktarılması sağlanabilir.

**Dahili Ekip Notu:** Mağaza kurucusu bizzat geliştiriyor. Yılbaşına kadar (Aralık 2026 sonu) 1.000 ürün daha ekleyip, kapıda ödeme ve kargo/yol ücreti hesaplama modülünü tamamlayarak yayına almayı hedefliyor. Kurulum bittiğinde Potvrdio'yu zahmetsizce ve ücretsiz kurma teklifi yapıldı. Takip tarihi Ocak 2027 başı (2027-01-05) olarak belirlendi. Ayrıca WooCommerce & kapıda ödeme kullanan tanıdık mağazalar için tavsiye (referral) istendi.

**İletişim Geçmişi (6 Kayıt):**
- **[2026-10-15 12:28:00]** (EMAIL / outbound) - *Re: Potvrda adrese za porudžbine pouzećem, Animal Market*
- **[2026-10-15 12:21:00]** (EMAIL / inbound) - *Re: Potvrda adrese za porudžbine pouzećem, Animal Market*
- **[2026-10-15 12:16:00]** (EMAIL / outbound) - *Re: Potvrda adrese za porudžbine pouzećem, Animal Market*
- **[2026-10-15 11:26:00]** (EMAIL / inbound) - *Re: Potvrda adrese za porudžbine pouzećem, Animal Market*
- **[2026-10-15 11:11:00]** (EMAIL / outbound) - *RE: Potvrda adrese za porudžbine pouzećem, Animal Market*
- **[2026-10-13 10:06:00]** (EMAIL / outbound) - *Automatizacija provere adrese i potvrde za Animal Market (WooCommerce)*

---

### 2. Fashion Store (https://fashionstore.rs)

- **Web Sitesi:** [https://fashionstore.rs](https://fashionstore.rs)
- **Sektör / Kategori:** Kadın Giyim & Butik
- **Şehir / Konum:** Čačak
- **Tüzel Kişilik / Not:** Fashion Store Čačak
- **Doğrulanmış E-posta:** `info@fashionstore.rs`
- **Doğrulanmış Telefon:** `064/307-19-52`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `waiting_reply`
- **Altyapı & Tech Stack:** WooCommerce, Fiziksel Butik + Online (Čačak), Kadın Giyim & Ayakkabı

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Čačak’ta fiziksel butik + online satış. Kanca: 2 yönlü kargo maliyeti ve iade sürecinde ürünün raftan düşüp başkasına satılamaması.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Rafta Bekleme / Stok Kilitlenmesi: Butik kadın giyimde beden/ürün stok adedi sınırlıdır; kapıda ödemede bekleyen her teslim alınmamış koli ürünün başkasına satılmasını engeller.
> • Beden/Numara Teyidi: Kadın giyimde en yüksek iade sebebi beden uyumsuzluğudur; Potvrdio onay ekranına 'Seçilen Beden: M - Beden Teyidi' seçeneği eklenebilir.
> • Meta Pixel & CAPI İyileştirmesi: Instagram reklam trafiğinden gelen sepette bırakma olayları için dinamik yeniden hedefleme eksik.

**Dahili Ekip Notu:** 16 Ekim Viber: Mirjana nezaketen Hvala ile kapattı. İade sayısı sorulunca çekinme oluştu. Takip 19 Ekim Pazartesi yapılacak (hacim aralığı sorusuyla kalifiye edilecek: do 100 / 100-300 / više).

**İletişim Geçmişi (5 Kayıt):**
- **[2026-10-16 14:25:00]** (VIBER / inbound) - *Viber Teşekkür (Mirjana)*
- **[2026-10-16 12:27:00]** (VIBER / outbound) - *Viber Açıklama & Demo Linki*
- **[2026-10-16 12:24:00]** (VIBER / inbound) - *Viber Yanıtı (Mirjana)*
- **[2026-10-16 10:07:00]** (VIBER / outbound) - *Viber Takip Hatırlatması: E-posta Sonrası Kısa Bilgilendirme*
- **[2026-10-14 11:30:00]** (EMAIL / outbound) - *Potvrda adrese za porudžbine pouzećem, Fashion Store*

---

### 3. Šifonjer (https://sifonjer.rs)

- **Web Sitesi:** [https://sifonjer.rs](https://sifonjer.rs)
- **Sektör / Kategori:** Polovna Firmirana Garderoba
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Šifonjer
- **Doğrulanmış E-posta:** `podrska@sifonjer.rs`
- **Doğrulanmış Telefon:** `+381 63 818 4777`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `waiting_reply`
- **Altyapı & Tech Stack:** WooCommerce, Vintage / İkinci El Firmirana Garderoba, Tekil Ürün (1-of-1)

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> İkinci el / vintage tekil ürünler. Kanca: Her parça 1-of-1 (tek) olduğu için iade sürecinde başkasına satılamayan ürün kaybı riski yüksek.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • 1-of-1 Stok Riski: Her parça tek olduğu için teslim alınmayan paket sürecinde (7-10 gün kuryede) ürün tamamen bloke olur ve kaçan müşteri geri gelmez.
> • 2 Saatlik Hızlı Rezervasyon/Onay: Kapıda ödeme siparişinde 2 saat içinde SMS teyidi gelmezse sipariş beklemeye alınıp başkasına rezerve edilebilir.

**Dahili Ekip Notu:** 14 Ekim’de Şablon B2 gönderildi. | 16 Ekim 10:12 Viber mesajı atıldı (+381638184777). Yanıt bekleniyor.

**İletişim Geçmişi (2 Kayıt):**
- **[2026-10-16 10:12:00]** (VIBER / outbound) - *Viber Takip Hatırlatması: Tekil 1-of-1 İkinci El Ürün Kancası*
- **[2026-10-14 11:45:00]** (EMAIL / outbound) - *Potvrda adrese za porudžbine pouzećem, Šifonjer*

---

### 4. Fermini (https://fermini.rs)

- **Web Sitesi:** [https://fermini.rs](https://fermini.rs)
- **Sektör / Kategori:** Giyim & Tekstil
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Fermini
- **Doğrulanmış E-posta:** `info@fermini.rs`
- **Doğrulanmış Telefon:** `+381 64 032 3362`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `replied`
- **Altyapı & Tech Stack:** WooCommerce, Tekstil & Giyim Kataloğu, Sırbistan Geneli Kargo

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Geniş giyim/tekstil kataloğu. Kanca: Kurye yola çıktıktan sonra fark edilen yanlış adres ve çift yönlü kargo maliyeti.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Kurye Çıkışı Sonrası Adres Hatası: Tekstil katalog siparişlerinde müşteri kapı/apartman numarasını eksik yazıyor; SMS ile tek tıkla adres düzeltme imkanı çift yönlü navlunu önler.
> • Kargo Şeffaflığı: Kuryeye ödenecek net nakit tutar checkoutta ve teyit linkinde şeffaflaştırılmalı.

**Dahili Ekip Notu:** 14 Ekim’de Şablon B3 gönderildi. | 16 Ekim 10:14 Viber mesajı atıldı (+381 64 032 3362). Yanıt bekleniyor. | 16 Ekim 10:15 Sanela Viber üzerinden "Kažite" yanıtı verdi. 10:18 demo linki ve aylık iade hacmi sorusu iletildi. | 19 Ekim 17:00 Viber takibi yapıldı (hafta sonu sonrası demo inceleme ve 25 siparişlik ücretsiz kurulum hatırlatıldı).

**İletişim Geçmişi (5 Kayıt):**
- **[2026-10-19 17:00:00]** (VIBER / outbound) - *Viber Takip: Hafta Sonu Sonrası Demo & 25 Siparişlik Ücretsiz Kurulum Hatırlatması*
- **[2026-10-16 10:18:00]** (VIBER / outbound) - *Viber Açıklama & Demo Linki*
- **[2026-10-16 10:15:00]** (VIBER / inbound) - *Viber Yanıtı: Sanela (Kažite)*
- **[2026-10-16 10:14:00]** (VIBER / outbound) - *Viber Takip Hatırlatması: E-posta Sonrası Kısa Bilgilendirme*
- **[2026-10-14 12:00:00]** (EMAIL / outbound) - *Potvrda adrese za porudžbine pouzećem, Fermini*

---

### 5. Comfortino (https://comfortino.rs)

- **Web Sitesi:** [https://comfortino.rs](https://comfortino.rs)
- **Sektör / Kategori:** Anatomik & Medikal Ayakkabı
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Comfortino Obuća
- **Doğrulanmış E-posta:** `obuca.comfortino@gmail.com`
- **Doğrulanmış Telefon:** `063 351 060`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `waiting_reply`
- **Altyapı & Tech Stack:** WooCommerce, Elementor (Element Pack, ElementsKit), FlyingPress, AKS Kurye, GA4, Canlı Destek Widget

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Dostava samo 250 din sübvansiyonu + AKS kurye. Ayakkabı kutuları desisi yüksek; alıcı paketi almazsa 250 din sübvansiyon + gidiş-dönüş çift kargo mağazanın tüm marjını siliyor.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Sübvanse Kargo Kaybı: Sitede kargo 'Dostava samo 250 din' olarak sabitlenmiş ve mağaza sübvanse ediyor. Nepreuzet pakette 250 din sübvansiyon + gidiş-dönüş AKS kargo doğrudan cepten çıkar.
> • Elementor & Mobil Yük: Element Pack ve ElementsKit eklentileriyle mobil 4G'de checkout açılış süresi yavaş; hafif bir Potvrdio mobil akışı sepet terki oranını düşürür.
> • Meta Pixel Eksikliği: Kodda aktif Meta Pixel bulunmuyor; Instagram'dan gelen ayakkabı alıcıları için sepette kalan ürün retargeting'i yapılamıyor.
> • Hacimli Kutu Desisi: Çizme ve ayakkabı kutusu desisi yüksek olduğundan kargo öncesi SMS teyidi satıcıyı doğrudan korur.

**Dahili Ekip Notu:** Sonraki dalga hedefi (Ayakkabı / Yüksek desi kategorisi). | 19 Ekim 11:44 Viber & WhatsApp takip mesajı gönderildi (kako-funkcionise video linki paylaşıldı). Yanıt bekleniyor.

**İletişim Geçmişi (2 Kayıt):**
- **[2026-10-19 11:44:00]** (VIBER / outbound) - *Viber & WhatsApp Takip: 15 Ekim E-posta Hatırlatması & How-it-Works Linki*
- **[2026-10-15 11:00:00]** (EMAIL / outbound) - *dostava i potvrda adrese, comfortino*

---

### 6. Pet Zoo Shop (https://petzooshop.rs)

- **Web Sitesi:** [https://petzooshop.rs](https://petzooshop.rs)
- **Sektör / Kategori:** Pet Shop & Mama
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Pet Zoo Shop
- **Doğrulanmış E-posta:** `info@petzooshop.rs`
- **Doğrulanmış Telefon:** `+381 63 455 955`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Elementor, BEX Kurye, GA4, Tidio Chat, 6.000 RSD Ücretsiz Kargo

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> BEX kurye + 6.000 RSD üzeri ücretsiz kargo. 14–15 kg büyük mama çuvalları (Pro Plan, Dog Chow, Cat Chow). Ağır desi yükü; teslim alınmayan 15 kg çuvalın 2 yönlü kargo maliyeti tüm kâr marjını siliyor.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • 14-15 kg Mama Çuvalı Navlunu: Pro Plan ve Dog Chow 14-15 kg çuvalları BEX ile gidiyor; nepreuzet paket navlunu en yüksek ürün grubudur.
> • 6.000 RSD Nakit Hazırlığı: Müşteri ücretsiz kargo için yüksek tutarlı sipariş veriyor ancak kapıda nakit hazır etmeyebiliyor; kurye öncesi SMS ile nakit hatırlatması iadeyi önler.
> • Kurye Adresnica Otomasyonu: BEX kurye portalına adres kopyalama iş yükü otomatikleştirilebilir.

**Dahili Ekip Notu:** Sonraki dalga hedefi (Ağır mama çuvalı kargo riski).

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 09:51:47]** (EMAIL / outbound) - *džakovi od 15 kg i nepreuzeti paketi, Pet Zoo Shop*

---

### 7. Perbipharm (https://perbipharm.rs)

- **Web Sitesi:** [https://perbipharm.rs](https://perbipharm.rs)
- **Sektör / Kategori:** Veteriner Eczane & Pet Hrana
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Perbipharm
- **Doğrulanmış E-posta:** `office@perbipharm.rs`
- **Doğrulanmış Telefon:** `+381 63 692 229`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, AKS Kurye, Veteriner Eczane & Diyet Pet Mamaları

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Veterinar apoteka & pet hrana (AS Iberian, Cane Cuccioli) + AKS kurye. Hassas veteriner ürünlerinin ve mamaların kuryede günlerce beklemesi ve nepreuzet paket riski.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Hassas Veteriner Ürünleri: İlaç ve klinik mamaların kurye araçlarında günlerce beklemesi ürün kalitesini riske atar; adresin önceden doğrulanması şarttır.
> • Sipariş Sonrası Viber/SMS Kargo Takibi: AKS takip numarası sipariş sonrasında müşterinin telefonuna otomatik düşürülmeli.

**Dahili Ekip Notu:** Klinik & mama karması; güven ve teyit önemli.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 09:53:11]** (EMAIL / outbound) - *potvrda adrese pre slanja AKS-om, Perbipharm*

---

### 8. Lekiko (https://lekiko.rs)

- **Web Sitesi:** [https://lekiko.rs](https://lekiko.rs)
- **Sektör / Kategori:** Pet Shop
- **Şehir / Konum:** Kragujevac
- **Tüzel Kişilik / Not:** Lekiko Pet Shop Kragujevac
- **Doğrulanmış E-posta:** `info@lekiko.rs`
- **Doğrulanmış Telefon:** `+381 63 224 490`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Kragujevac Yerel Mağaza + Online, Telefonla Sipariş

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Kragujevac yerel butik Pet/Vet Shop. Sırbistan geneline kapıda ödeme. Manuel telefonla arama veya mesajla teyit yükünü SMS linkiyle sıfırlama.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Mağaza İçi Manuel Arama Yükü: Kragujevac mağaza ekibi sipariş teyidi için telefonla arama yapıyor; Potvrdio onay linki bu süreci tamamen otomatikleştirir.
> • Checkout Sadeleştirme: Standart karmaşık form yerine telefonla sipariş veren müşteri kitlesine uygun 3 alanlı hızlı kapıda ödeme formu.

**Dahili Ekip Notu:** Kragujevac yerel butik e-ticaret örneği.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 09:54:29]** (EMAIL / outbound) - *manje zvanja oko porudžbina, Lekiko*

---

### 9. Prodaja Parfema (https://prodajaparfema.rs)

- **Web Sitesi:** [https://prodajaparfema.rs](https://prodajaparfema.rs)
- **Sektör / Kategori:** Orijinal Parfüm & Kozmetik
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Prodaja Parfema Srbija
- **Doğrulanmış E-posta:** `info@prodajaparfema.rs`
- **Doğrulanmış Telefon:** `+381 11 405 3838`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, WPForms Pro, Post Express, Yandex Delivery, Banca Intesa

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Parfüm ve kozmetik satışı. 4.000 RSD üzeri ücretsiz kargo, Post Express ve Belgrad içi Yandex Delivery ile aynı gün teslimat. Parfüm sektöründe kapıda ödeme siparişleri Sırbistan'da en yüksek iade oranına sahiptir (%15-20); kurye kapıya gittiğinde paranın olmaması veya alıcının vazgeçmesi günlük ciddi zarar yaratır.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Sırbistan Parfüm Pazarında Yüksek İade Acısı: Parfüm siparişlerinde impulsif alımlar çok yaygındır; Potvrdio gönderilmeden önce SMS onayı alarak ciddiyetsiz siparişleri depodan çıkmadan eler.
> • Yandex Same-Day ve Post Express Tasarrufu: Belgrad içi acil teslimatlarda yanlış adres veya ulaşılamayan alıcı kurye maliyetini anında yakar; ön doğrulama bunu engeller.
> • 4.000 RSD Ücretsiz Kargo Sınırı Koruması: Bedava kargo maliyeti mağazaya ait olduğundan her geri dönen paket doğrudan kârdan çift yönlü navlun düşürür.

**Dahili Ekip Notu:** Yüksek sepet ortalaması nedeniyle sahte sipariş önleme değeri çok net.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 12:25:58]** (EMAIL / outbound) - *nepreuzeti paketi kod skupih porudžbina, Prodaja Parfema*

---

### 10. Fitaky (https://fitaky.rs)

- **Web Sitesi:** [https://fitaky.rs](https://fitaky.rs)
- **Sektör / Kategori:** Doğal Bebek & Aile Kozmetiği
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Fitaky Beauty & Baby
- **Doğrulanmış E-posta:** `kontakt@fitaky.rs`
- **Doğrulanmış Telefon:** `+381 60 700 4033`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Elementor, %100 Doğal Bebek/Anne Kozmetiği, 3.500 RSD Ücretsiz Kargo

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Bebek & anne doğal kozmetiği + 3.500 RSD üzeri ücretsiz kargo. Bebekli annelerde uyku saati, bozuk interfon veya eksik kapı no nedeniyle kuryenin teslim yapamaması ve paketin geri dönmesi riski.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Anne-Bebek Teslimat Notu: Anneler bebek uyurken zil çalınmasını istemez; Potvrdio onay ekranında 'Kurye için özel not (örn: zili çalma, kapıyı tıkla)' alanı sunulmalı.
> • Meta Pixel Eksikliği: D2C bebek markası olmasına rağmen Meta Pixel aktif değil; sepette kalan bebek ürünleri için reklam optimizasyonu yapılamıyor.
> • 3.500 RSD Ücretsiz Kargo: D2C üreticide dönen her paket doğrudan kârı eritir.

**Dahili Ekip Notu:** D2C butik yerel üretici, marka değeri ve müşteri memnuniyetine önem veriyor.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 12:26:48]** (EMAIL / outbound) - *dostava mamama sa bebama, Fitaky*

---

### 11. Eridan (https://eridan.rs)

- **Web Sitesi:** [https://eridan.rs](https://eridan.rs)
- **Sektör / Kategori:** Cilt Bakımı & Kozmetik
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Eridan Green d.o.o. (Patrijarha Varnave 48, Beograd)
- **Doğrulanmış E-posta:** `info@eridan.rs`
- **Doğrulanmış Telefon:** `+381 65 20 54 710`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, AquaFarm Biyoteknoloji, "Isporuka 3 do 7 radnih dana", Meta Pixel Aktif, GA4 Aktif, Tidio Chat

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> AquaFarm biyoteknolojik cilt bakımı + "Isporuka 3 do 7 radnih dana". 3-7 gün teslimat süresinde kapıda ödemeli müşterinin siparişi unutması veya vazgeçmesi riski; sipariş anında SMS ile teyit.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Uzun Teslimat Penceresi (3-7 Gün): Kargo süresi 3-7 gün olduğu için kapıda ödemeli alıcı siparişi unutabiliyor veya vazgeçebiliyor; sipariş anında ve kargoya veriliş anında SMS/Viber bilgilendirmesi şart.
> • Lüks D2C Deneyimi: VIP hissettiren şık bir Viber onay kartı ve teslimat günü hatırlatması iadeleri sıfırlar.

**Dahili Ekip Notu:** Kurumsal yapısı sağlam D2C cilt bakım markası.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 12:27:47]** (EMAIL / outbound) - *rok isporuke 3-7 dana i pouzeće, Eridan*

---

### 12. Čarna (https://carna.rs)

- **Web Sitesi:** [https://carna.rs](https://carna.rs)
- **Sektör / Kategori:** El Yapımı Bitkisel Kozmetik
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Čarna Kozmetika
- **Doğrulanmış E-posta:** `info@carna.rs`
- **Doğrulanmış Telefon:** `+381 64 030 5900`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Elementor, Radan Dağı Melisa Kozmetiği, Post Express Otkupnina, Hotjar/Clarity Aktif

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Radan Dağı melisa (matičnjak) plantasyonu butik doğal kozmetik + Post Express otkupnina. Butik üretimde her iade paket hem çift yönlü kargo maliyeti hem de emeğin rafta beklemesi demek.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Post Express Otkupnina Şeffaflığı: Post Express kuryesinin aldığı para transfer komisyonu (uputnica) Potvrdio onay ekranında şeffafça net gösterilerek kapıdaki itirazlar önlenmeli.
> • Meta Pixel Eksikliği: Hotjar ile kullanıcı hareketlerini izliyorlar ancak reklam pikseli eksik; terk edilen sepetler yeniden hedeflenemiyor.

**Dahili Ekip Notu:** Post Express teslimat kurallarını sitede özel olarak vurgulamışlar.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 12:33:57]** (EMAIL / outbound) - *Post Express i pouzeće, Čarna*

---

### 13. Pura Home Spa (https://purahomespa.rs)

- **Web Sitesi:** [https://purahomespa.rs](https://purahomespa.rs)
- **Sektör / Kategori:** Aromaterapi & Spa Ürünleri
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Pura Home Spa
- **Doğrulanmış E-posta:** `purakozmetika@gmail.com`
- **Doğrulanmış Telefon:** *(Telefon yok)*
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Elementor, Marija Đukić PR Beograd, 4.500 RSD Ücretsiz Kargo, GA4 Aktif, Canlı Destek

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Marija Đukić PR Pura Kozmetika (Beograd) + 4.500 RSD üzeri ücretsiz kargo. Butik esansiyel yağlar, lip food ve oda difüzörlerinde sübvanse edilen kargonun iadeyle çifte maliyet yaratması.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Gereksiz Şirket Alanı: Bireysel spa/aromaterapi alıcılarına checkout'ta şirket adı soruluyor; form sürtünmesi sepet terkine neden oluyor.
> • Hediye Siparişlerinde Adres Teyidi: Oda kokusu ve mumlar sıklıkla başkasına hediye gönderiliyor; teslim alacak kişinin telefon numarasının teyidi teslimat oranını artırır.

**Dahili Ekip Notu:** Doğal mum, oda kokusu ve spa ürünleri.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 12:34:48]** (EMAIL / outbound) - *besplatna dostava iznad 4.500 RSD, Pura Home Spa*

---

### 14. Pravi Alati (https://pravialati.rs)

- **Web Sitesi:** [https://pravialati.rs](https://pravialati.rs)
- **Sektör / Kategori:** Hobi & El Aletleri
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Pravi Alati
- **Doğrulanmış E-posta:** `info@pravialati.rs`
- **Doğrulanmış Telefon:** `+381 64 648 8279`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Elementor, Ingco Akülü/Elektrikli El Aletleri, Ağır Takım Çantaları, GA4 Aktif

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Akülü ve elektrikli el aletleri (Ingco buşilica/brusilica). Ağır ve hacimli kutularda yanlış adres veya kapıda nakiti hazır olmayan alıcı nedeniyle çift yönlü ağır desi navlun kaybı.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Ağır Koli Desi Navlunu: Matkap ve taşlama makineleri iade olduğunda çift yönlü kargo çok yüksek fatura çıkarır.
> • Nakit Hazırlığı Hatırlatması: 5.000–15.000 RSD arası yüksek tutarlı el aleti siparişlerinde kurye öncesi SMS ile nakit tutar hatırlatılmalı.

**Dahili Ekip Notu:** Ağır el aleti kutuları ve yüksek sepet tutarları.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 12:37:04]** (EMAIL / outbound) - *Ingco alati pouzećem, Pravi Alati*

---

### 15. AC Vinulović (https://ac-vinulovic.rs)

- **Web Sitesi:** [https://ac-vinulovic.rs](https://ac-vinulovic.rs)
- **Sektör / Kategori:** Oto Lastik & Akü
- **Şehir / Konum:** Negotin
- **Tüzel Kişilik / Not:** AC Vinulović Negotin
- **Doğrulanmış E-posta:** `shop@ac-vinulovic.rs`
- **Doğrulanmış Telefon:** `062/815-7483`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Elementor, Negotin, Agro/Traktör Lastikleri, C-Kombi Lastikleri, Aküler, GA4 Aktif

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Negotin merkezli traktör/agro lastikleri, C-kombi lastikleri ve aküler. E-ticaretteki en ağır ve en pahalı kargo kategorisi; teslim alınmayan lastik veya akü Negotin'e döndüğünde yüzlerce dinar zarar.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • En Yüksek Desi & Mesafe Maliyeti: Negotin'den tüm Sırbistan'a gönderilen lastik ve aküler e-ticaretin en ağır grubudur; bir iade yüzlerce dinar zarar yazar.
> • Ebat ve Uyumluluk Teyidi: Lastik ebatının (örn. 205/55 R16) müşteri tarafından yanlış seçilmesi sık görülür; SMS onay ekranına ebat teyidi eklenebilir.

**Dahili Ekip Notu:** En yüksek kargo desi maliyetine sahip kategorilerden biri.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 12:37:52]** (EMAIL / outbound) - *gume i akumulatori pouzećem, AC Vinulović*

---

### 16. Kanin Obuća (https://kaninobuca.com)

- **Web Sitesi:** [https://kaninobuca.com](https://kaninobuca.com)
- **Sektör / Kategori:** Ayakkabı & Deri
- **Şehir / Konum:** Niš
- **Tüzel Kişilik / Not:** Kanin Obuća (Miodraga Petrovića Čkalje 2, 18000 Niš)
- **Doğrulanmış E-posta:** `info@kaninobuca.com`
- **Doğrulanmış Telefon:** `+381 18 590 158`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Niš El Yapımı Hakiki Deri Ayakkabı, 12.000 RSD Ücretsiz Kargo

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Niş el yapımı hakiki deri ayakkabı + 12.000 RSD üzeri ücretsiz kargo. Yüksek sepet tutarı; kapıda ödemede teslim alınmayan pakette deri ayakkabının 10 gün kuryede mahsur kalmasını önleme.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Piksel & Analitik Eksikliği: Sitede GA4 ve Meta Pixel dahi eksik; tamamen organik veya Instagram DM ile dönüyor.
> • 10 Günlük Stok Kilitlenmesi: 10.000+ RSD değerindeki deri ayakkabı kapıda ödeme iadesinde 10 gün kuryede mahsur kalıyor; 24 saat içinde SMS onayı gelmeyen sipariş beklemeye alınmalı.

**Dahili Ekip Notu:** Eski kanin.rs domaini kaninobuca.com adresine yönleniyor.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 12:38:46]** (EMAIL / outbound) - *ručno rađena obuća i pouzeće, Kanin Obuća*

---

### 17. Ljuba 024 (https://ljuba.rs)

- **Web Sitesi:** [https://ljuba.rs](https://ljuba.rs)
- **Sektör / Kategori:** Hırdavat & Bahçe Malzemeleri
- **Şehir / Konum:** Subotica
- **Tüzel Kişilik / Not:** Ljuba 024 d.o.o. Subotica
- **Doğrulanmış E-posta:** `info@ljuba024.com`
- **Doğrulanmış Telefon:** `+381 65 463 1313`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Elementor, LiteSpeed Cache, Subotica (Ljuba 024 d.o.o.), Demon Tırpan & Testere

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Subotica Ljuba 024 d.o.o. Demon RQ580 motorlu tırpan ve testereler + 3 ürün > 7.000 RSD ücretsiz kargo. 8-10 kg motorlu makinelerde kapıda ödeme iadesinde yüksek çift yönlü kargo navlunu.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • 8-10 kg Motorlu Makine İade Navlunu: Benzinli tırpan ve motorlu testere paketlerinin iadesinde ödenen yüksek çift yönlü navlun.
> • Çapraz Satış (Cross-sell): Tırpan alan müşteriye Potvrdio SMS onay ekranında 'Tırpan yağı ve misina da eklemek ister misiniz?' sepet artırma fırsatı.

**Dahili Ekip Notu:** Yerel ve güvenilir ticaret firması.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 12:55:22]** (EMAIL / outbound) - *trimeri i motorne testere pouzećem, Ljuba 024*

---

### 18. Backup Shop (https://backupshop.rs)

- **Web Sitesi:** [https://backupshop.rs](https://backupshop.rs)
- **Sektör / Kategori:** Giyim, Çanta & Deri Aksesuar (David Jones, Anekke, Doca)
- **Şehir / Konum:** Zrenjanin
- **Tüzel Kişilik / Not:** Željko Veselinović PR Trgovina na malo tekstilom i predmetima od kože Back Up Zrenjanin
- **Doğrulanmış E-posta:** `office@backupshop.rs`
- **Doğrulanmış Telefon:** `+381 64 859 8050`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce (WordPress), Blocksy Tema, Elementor, LiteSpeed Cache, Variation Swatches, Kurumsal E-posta (Cloudflare korumalı)

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Sitede uslovi-isporuke sayfasında siparişten sonra 24-48 saat içinde her müşterinin telefonla teyit için arandığı açıkça yazıyor. Kanca: 24-48 saatlik manuel arama yükünü tek tıkla otomatik SMS onayına dönüştürme.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Manuel Telefon Teyidi (24-48 Saat): Sitede sipariş sonrasında satıcının müşteriyi 24-48 saat içinde (hafta sonu siparişlerinde Pazartesi) arayarak verileri ve siparişi teyit ettiği açıkça belirtiliyor. Otomatik SMS teyidi bu manuel iş yükünü ve günlerce arama bekleme süresini sıfırlar.
> • Butik Stok Kilitlenmesi: Sitede "stokların fiziksel mağaza ile paylaşıldığı ve tükenmiş olabileceği" uyarısı var. Teyitsiz kargo kuryede günlerce dolaşıp iade dönerse vitrin ürünü raftan düşer.
> • 7.000 RSD Üzeri Çift Yönlü Navlun Riski: Post Express ve AKS ile gönderiliyor, 7.000 RSD üzeri ücretsiz kargo veriliyor. İade dönen paket çift yönlü navlun zararı yazıyor.

**Dahili Ekip Notu:** PIB: 101166628, MB: 62272147. Zrenjanin merkezli, 1996’dan beri faaliyet gösteren 30 yıllık butik. Sahibi Željko Veselinović. Doğrulanmış e-posta: office@backupshop.rs (kullanıcı ofis@backupshop.rs olarak da belirtti). | 15 Ekim 15:15 Şablon A ile ilk e-posta gönderildi. Takip tarihi: 17 Ekim.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-15 15:15:00]** (EMAIL / outbound) - *Automatizacija provere adrese i potvrde za BackUp Shop (WooCommerce)*

---

### 19. JAT Fashion (https://jatfashion.rs)

- **Web Sitesi:** [https://jatfashion.rs](https://jatfashion.rs)
- **Sektör / Kategori:** Moda & Giyim
- **Şehir / Konum:** Sırbistan
- **Tüzel Kişilik / Not:** JAT Fashion
- **Doğrulanmış E-posta:** `shop@jatfashion.rs`
- **Doğrulanmış Telefon:** *(Telefon yok)*
- **Öncelik Seviyesi:** `p2_unverified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce Standart

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Açık e-posta yok (Web form / Telefon).

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> Standart WooCommerce optimizasyon adımları geçerlidir.

**Dahili Ekip Notu:** İkincil havuz.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-16 08:31:51]** (EMAIL / outbound) - *Automatizacija provere adrese i potvrde za JAT Fashion (WooCommerce)*

---

### 20. Ollie's (https://ollies.rs)

- **Web Sitesi:** [https://ollies.rs](https://ollies.rs)
- **Sektör / Kategori:** Premium Maslinovo Ulje & Prirodna Kozmetika
- **Şehir / Konum:** Sırbistan
- **Tüzel Kişilik / Not:** Ollies
- **Doğrulanmış E-posta:** `office@ollies.rs`
- **Doğrulanmış Telefon:** *(Telefon yok)*
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Elementor Pro, Qi Addons, RankMath SEO, Klaviyo Entegrasyonu

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Deda Sava aile mirası, 700 zeytin ağacı, cam şişeli sızma zeytinyağı ve doğal kozmetik. 10.000 RSD üzeri ücretsiz teslimat. Cam ambalaj kırılma riski ve çift yönlü navlun kaybı.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Cam Şişe & Hassas Sıvı Taşınması: Cam şişedeki soğuk sıkım zeytinyağı ve kremlerin iade sürecinde kurye araçlarında günlerce dolaşması kırılma ve akma riski yaratır; kargo çıkışı öncesi SMS teyidi bunu önler.
> • 10.000 RSD Üzeri Yüksek Sepet & Çift Yönlü Navlun: 10.000 RSD üzeri ücretsiz kargo sunuluyor; tek bir teslim alınmayan koli tüm sipariş kârını siler.
> • Aile Mirası & Hikaye Odaklı İletişim: Jelena Hanım markayı Dede Sava mirasıyla kurduğu için teyit SMS/Viber mesajında butik, kişisel bir ton kullanılması müşteri sadakatini ve teslim alma oranını artırır.

**Dahili Ekip Notu:** İkincil havuz. | Jelena Savić (kurucu), Deda Sava 700 zeytin ağacı hikayesi. 10.000 RSD üzeri ücretsiz kargo.

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-16 08:40:23]** (EMAIL / outbound) - *priča o dedi Savi, maslinovo ulje i nepreuzeti paketi, Ollie's*

---

### 21. B Plus (https://bplus.rs)

- **Web Sitesi:** [https://bplus.rs](https://bplus.rs)
- **Sektör / Kategori:** Mobilya & Ev Dekorasyonu (Nameštaj)
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** B Plus
- **Doğrulanmış E-posta:** `b_plus@live.com`
- **Doğrulanmış Telefon:** `+381 60 0600 858`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, Özel Kargo & Montaj Takip, Kurumsal E-posta

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Ağır ev mobilyası ve Cilek çocuk odası satışı. Hacimli mobilya teslimatında alıcıya ulaşılamaması çift yönlü yüksek navlun ve montaj ekibi maliyeti yaratıyor.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Hacimli Navlun & Lojistik Riski: Koltuk, yatak ve gardırop gibi ağır mobilyaların kargolanmasında teslim alınmayan tek bir sipariş, çift yönlü araç tahsisi ve yüksek nakliye zararı yazar.
> • Teslimat & Montaj Randevusu: Müşterinin adreste bulunmaması montaj ekiplerinin planını bozar; SMS ile adres ve uygunluk teyidi lojistik koordinasyonunu otomatikleştirir.
> • Kaparo & Bakiye Tahsilatı: %30 avans sonrası kalan bakiyenin teslimatta sorunsuz ödenmesi için ön teyit güvence sağlar.

**Dahili Ekip Notu:** İkincil havuz. | Doğrulanan e-posta: b_plus@live.com (ikincil: zaposlenje@bplus.rs)

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-16 08:21:07]** (EMAIL / outbound) - *isporuka nameštaja i adresa pre slanja, Bplus*

---

### 22. Boss Shop (https://bosshop.rs)

- **Web Sitesi:** [https://bosshop.rs](https://bosshop.rs)
- **Sektör / Kategori:** Elektrikli El Aletleri & Bahçe Makineleri
- **Şehir / Konum:** Kragujevac
- **Tüzel Kişilik / Not:** Boss Shop
- **Doğrulanmış E-posta:** `webshop@bosshop.rs`
- **Doğrulanmış Telefon:** `+381 34 300 000`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, ERP/Stok Entegrasyonu, Çoklu Şube Yönetimi, LiteSpeed

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> 15.000 RSD üzeri ve 50 kg’a kadar ücretsiz kargo. Bosch, Makita ve ağır bahçe makinelerinde iade dönen 20-50 kg ağır kolilerde çift yönlü navlun kaybı.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • 50 kg Ağır Navlun Sübvansiyonu: 15.000 RSD üzeri 50 kg’a kadar kargo ücretsiz sunuluyor; teslim alınmayan ağır sanayi tipi makineler çift yönlü ağır navlun faturası çıkarır.
> • Yetkili Servis & Garanti Güveni: Profesyonel ustalara giden aletlerde yanlış adres iş kaybı yaratır.
> • İki İş Gününde Teslim: 12:00 öncesi siparişlerde 2 günde teslimat taahhüdü veriliyor, ön teyit hızlandırır.

**Dahili Ekip Notu:** İkincil havuz. | Doğrulanan e-posta: webshop@bosshop.rs (yönetim: dusan.tomic@bosshop.rs, ana.milosevic@bosshop.rs)

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-16 08:22:33]** (EMAIL / outbound) - *paketi do 50 kg i besplatna dostava, B.O.S. Shop*

---

### 23. Djomla Bike (https://djomla-bike.rs)

- **Web Sitesi:** [https://djomla-bike.rs](https://djomla-bike.rs)
- **Sektör / Kategori:** Bisiklet, E-Bike & Ekipman
- **Şehir / Konum:** Čačak (Vojvode Stepe 165)
- **Tüzel Kişilik / Not:** Djomla Bike
- **Doğrulanmış E-posta:** `mirkovic_riders@yahoo.com`
- **Doğrulanmış Telefon:** `+381 60 42 55 266`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Elementor, LiteSpeed Cache, Kurumsal E-posta

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> 8.000 RSD üzeri ücretsiz kargo ve kapıda ödeme. Bisiklet kolilerinin devasa desi hacmi nedeniyle geri dönen bisiklet yüksek navlun zararı yazar ve vitrin stoğunu kilitler.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Devasa Desi / Hacim Riski: Bisiklet kutuları e-ticaretteki en yüksek desili ürünlerdendir; Çaçak’tan gönderilen ve teslim alınmayan bir bisikletin çift yönlü navlunu çok pahalıdır.
> • Sezonluk Butik Stok: E-bike ve özel dağ bisikletleri tekil stoklarla çalışır; kargoda günlerce gezen bisiklet mağazada başka bir müşteriye satılamaz.
> • 8.000 RSD Üzeri Kargo Maliyeti: Ücretsiz kargo eşiği aşıldığında nakliye mağaza tarafından karşılandığı için iadeler doğrudan kârı eritir.

**Dahili Ekip Notu:** İkincil havuz. | Doğrulanan e-posta: mirkovic_riders@yahoo.com, Tel: 060 42 55 266

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-16 08:23:26]** (EMAIL / outbound) - *Automatizacija provere adrese i potvrde za Djomla Bike (WooCommerce)*

---

### 24. Lux Shop (https://luxshop.rs)

- **Web Sitesi:** [https://luxshop.rs](https://luxshop.rs)
- **Sektör / Kategori:** Genel E-Ticaret, Küçük Ev Aletleri & Oto Aksesuar
- **Şehir / Konum:** Senjak, Beograd
- **Tüzel Kişilik / Not:** Lux Shop
- **Doğrulanmış E-posta:** `luxshopfb@gmail.com`
- **Doğrulanmış Telefon:** `+381 62 812 4044`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, Meta Pixel, 10% Bundle Discount Plugin, Fast Checkout

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Tamamen kapıda ödeme (pouzeće) odaklı 2.000+ ürünlük katalog. İmpulsif alışverişte teslim alınmayan paket oranının yüksekliği ve gereksiz kargo maliyetleri.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • İmpulsif Kapıda Ödeme Riski: Sosyal medya reklamlarından gelen dürtüsel siparişlerde vazgeçme ve teslim almayan müşteri oranı %15-20’lere çıkabilir; SMS ile ön onay ciddiyetsiz alıcıları eler.
> • 3+ Ürüne %10 İndirim Paketi: Çoklu sepetlerde sepet tutarı yükseldikçe teslimatsızlık riski ve taşıma maliyeti artar.
> • 1-3 Günlük Hızlı Sevkiyat: Kargoya çıkmadan önce SMS ile onay alınması kurye çıkışında adreste bulunamama sorununu çözer.

**Dahili Ekip Notu:** İkincil havuz. | Doğrulanan e-posta: luxshopfb@gmail.com, Tel/WA: 062 812 4044

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-16 08:26:08]** (EMAIL / outbound) - *pouzeće i smanjenje nepreuzetih paketa, Lux Shop*

---

### 25. Salon Info (https://saloninfo.rs)

- **Web Sitesi:** [https://saloninfo.rs](https://saloninfo.rs)
- **Sektör / Kategori:** Profesyonel Kozmetik & Kuaför/Salon Ekipmanları
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Salon Info
- **Doğrulanmış E-posta:** `prodaja@saloninfo.org`
- **Doğrulanmış Telefon:** `+381 11 000 000`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, B2B/B2C Katalog, Profesyonel Salon Dağıtım Ağı

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Kuaför ve güzellik salonlarına litrelik profesyonel ürün sevkiyatı. Yüksek sepet tutarı ve salona teslimatta adres eksiklikleri.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • B2B Salon Randevu & Saat Uyumsuzluğu: Kuaför ve güzellik salonları yoğun çalıştığı için kurye geldiğinde yetkili bulunamayabiliyor; ön onay teslimat başarısını artırır.
> • Ağır Sıvı / Litrelik Şampuan ve Boya Paketleri: Ağır ve dökülme riski olan kargolarda iade navlunu hem pahalıdır hem de ambalaj yıpranmasına yol açar.
> • Profesyonel Müşteri Sadakati: Randevulu çalışan salonlara zamanında ve teyitli teslimat B2B tekrar sipariş oranını yükseltir.

**Dahili Ekip Notu:** İkincil havuz. | Doğrulanan e-posta: prodaja@saloninfo.org

**İletişim Geçmişi (2 Kayıt):**
- **[2026-10-16 08:30:14]** (EMAIL / outbound) - *profesionalna kozmetika i sigurnija dostava, Salon Info*
- **[2026-10-16 08:28:20]** (EMAIL / outbound) - *profesionalna kozmetika i sigurnija dostava, Salon Info*

---

### 26. Kozmetika Moja (https://kozmetikamoja.rs)

- **Web Sitesi:** [https://kozmetikamoja.rs](https://kozmetikamoja.rs)
- **Sektör / Kategori:** Doğal & El Yapımı Kozmetik
- **Şehir / Konum:** Sırbistan Geneli
- **Tüzel Kişilik / Not:** Kozmetika Moja
- **Doğrulanmış E-posta:** `prodaja@kozmetikamoja.rs`
- **Doğrulanmış Telefon:** `+381 64 2589 449`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `email_sent`
- **Altyapı & Tech Stack:** WooCommerce, RankMath SEO, Elementor, Woodmart Tema, BEX Kurye

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> BEX ile gönderim, 5.000 RSD üzeri ücretsiz kargo, 490 RSD sabit teslimat. 3-5 günlük bekleme süresinde kapıda ödemeden cayma riski.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • 5.000 RSD Üzeri Çift Yönlü Navlun Zararı: Mağaza 5.000 RSD üzeri siparişlerde 490 RSD kargoyu karşılıyor; iade dönen paket yaklaşık 1.000 RSD navlun zararı yazıp küçük butiğin tüm kârını siler.
> • 3-5 İş Günü Teslimat Penceresi: Butik üretim nedeniyle süre 3-5 güne uzadığında müşterinin siparişi unutma veya evde olmama ihtimali artar.
> • BEX Kurye Adres Doğrulaması: Alıcının sokak/daire numarasını SMS ile tek tıkla düzeltmesi BEX kuryelerinin adresi bulamama sorununu önler.

**Dahili Ekip Notu:** İkincil havuz. | Doğrulanan e-posta: prodaja@kozmetikamoja.rs

**İletişim Geçmişi (1 Kayıt):**
- **[2026-10-16 08:24:57]** (EMAIL / outbound) - *besplatna dostava preko 5.000 RSD i BEX, Kozmetika Moja*

---

### 27. Fagor (https://fagor.rs)

- **Web Sitesi:** [https://fagor.rs](https://fagor.rs)
- **Sektör / Kategori:** Ev Aletleri & Beyaz Eşya
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Apejron d.o.o. (Coral Electric)
- **Doğrulanmış E-posta:** `info@fagor.rs`
- **Doğrulanmış Telefon:** *(Telefon yok)*
- **Öncelik Seviyesi:** `disqualified` | **Güncel Durum:** `rejected`
- **Altyapı & Tech Stack:** WooCommerce Standart

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Apejron d.o.o. 30 yıllık geçmişi, showroom ve servis ağı olan büyük distribütör.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> Standart WooCommerce optimizasyon adımları geçerlidir.

**Dahili Ekip Notu:** Erken aşama kapalı beta için uygun değil (Çok büyük kurumsal yapı).

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 28. CF Moto Delovi (https://cfmotodelovi.rs)

- **Web Sitesi:** [https://cfmotodelovi.rs](https://cfmotodelovi.rs)
- **Sektör / Kategori:** Motosiklet Yedek Parça
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Guevara d.o.o.
- **Doğrulanmış E-posta:** `info@cfmotodelovi.rs`
- **Doğrulanmış Telefon:** *(Telefon yok)*
- **Öncelik Seviyesi:** `disqualified` | **Güncel Durum:** `rejected`
- **Altyapı & Tech Stack:** WooCommerce Standart

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> CFMOTO resmi distribütör yapısı.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> Standart WooCommerce optimizasyon adımları geçerlidir.

**Dahili Ekip Notu:** Bağımsız mağaza değil, resmi holding distribütör parçası.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 29. PC Group (https://pcgroup.rs)

- **Web Sitesi:** [https://pcgroup.rs](https://pcgroup.rs)
- **Sektör / Kategori:** Oto Yedek Parça
- **Şehir / Konum:** Sırbistan
- **Tüzel Kişilik / Not:** PC Group d.o.o.
- **Doğrulanmış E-posta:** `office@pcgroup.rs`
- **Doğrulanmış Telefon:** *(Telefon yok)*
- **Öncelik Seviyesi:** `disqualified` | **Güncel Durum:** `rejected`
- **Altyapı & Tech Stack:** WooCommerce Standart

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Peugeot / Citroen yedek parça distribütörü.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> Standart WooCommerce optimizasyon adımları geçerlidir.

**Dahili Ekip Notu:** Büyük toptan/distribütör formatı.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 30. Kocke.rs (https://kocke.rs)

- **Web Sitesi:** [https://kocke.rs](https://kocke.rs)
- **Sektör / Kategori:** Oyuncak, Lego & Eğitici Çocuk Setleri
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Kocke.rs Online Shop
- **Doğrulanmış E-posta:** `info@kocke.rs`
- **Doğrulanmış Telefon:** `+381 63 111 8148`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, Elementor, MailerLite, Kurir Sistemleri

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Çocuk oyuncakları, Lego ve eğitici yapboz setleri satışı. Çocukların dürtüsel isteğiyle verilen kapıda ödeme siparişlerinde ebeveynlerin kargo kapıya gelene kadar vazgeçmesi veya kutunun hasar görüp rafta değer kaybetmesi riski çok yüksek.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Dürtüsel Çocuk Siparişi İptalleri: Çocukların isteğiyle aceleyle verilen kapıda ödeme siparişlerinde ebeveyn teslimat anında ödemekten kaçınabiliyor; anlık SMS onayı ebeveyn ciddiyetini teyit eder.
> • Kutu ve Ambalaj Koruma: Lego ve koleksiyonluk oyuncak kutularının kargo transfer merkezlerinde ezilmeden doğrudan alıcısına ulaşması sağlanır.
> • Okul ve Hediye Dönemi Zirveleri: Doğum günleri ve yılbaşı pik dönemlerinde telefonla arama yükünü sıfırlar.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 31. Silver and Fashion (https://silverandfashion.rs)

- **Web Sitesi:** [https://silverandfashion.rs](https://silverandfashion.rs)
- **Sektör / Kategori:** 925 Ayar Gümüş Takı & Mücevherat
- **Şehir / Konum:** Novi Sad
- **Tüzel Kişilik / Not:** Silver and Fashion (Mina Stanković PR)
- **Doğrulanmış E-posta:** `silverandfashion2021@gmail.com`
- **Doğrulanmış Telefon:** `+381 60 490 7060`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce 11.2, WordPress, Woodmart Theme, Post Express Entegrasyonu

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Novi Sad merkezli 925 ayar gümüş takı (küpe, kolye, yüzük) üreticisi ve satıcısı. 3.000 RSD üzeri ücretsiz kargo sunuyorlar. Takıda kapıda ödeme iadeleri küçük paket olmasına rağmen kargo ve sigorta kaybı yaratır. Aynı şehirde olmamız (Novi Sad) doğrudan sıcak güven avantajı sağlar.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Lokal Novi Sad Güveni: Atıl da Novi Sad merkezli olduğundan yerel empati ve komşu işletme bağı çok kuvvetlidir.
> • 3.000 RSD Üzeri Ücretsiz Kargo Koruma: Kargo maliyetini mağaza üstlendiği için teslim alınmayan her paket doğrudan net kârdan iki kat kargo ücreti eksiltir.
> • Yüzük Ölçüsü & Adres Netliği: Teslimat öncesi gönderilen onay linki alıcının ciddiyetini ve adresin doğruluğunu garanti altına alır.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 32. Ljuljuška (https://ljuljuska.com)

- **Web Sitesi:** [https://ljuljuska.com](https://ljuljuska.com)
- **Sektör / Kategori:** Bebek & Çocuk Salıncakları & Doğal Tekstil
- **Şehir / Konum:** Karlovčić (Srem)
- **Tüzel Kişilik / Not:** Ljiljana Aspradakis PR Ljuljuška (MB: 65429608, PIB: 111464302)
- **Doğrulanmış E-posta:** `info@ljuljuska.com`
- **Doğrulanmış Telefon:** `+381 22 434 356`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, Elementor, Post Express, Banca Intesa

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Bebek ve küçük çocuklar için özel tasarım kumaş salıncak atölyesi. Post Express ile kapıda ödeme gönderiyorlar. Hacimli ve özenle dikilmiş tekstil ürünlerinde geri dönen paket kumaşın kirlenmesi, paket aşınması ve yüksek kargo maliyeti riski taşır.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Hacimli Tekstil Salıncak Koruması: Salıncaklar hem hacimli hem de el emeği ürünlerdir; geri dönen paket Post Express gidiş-dönüş navlunu yükler.
> • Anne-Bebek Hedef Kitlesinde Adres Netliği: Yeni doğum yapmış veya taşınmış anneler kargo adresinde kapı zili veya kat numarasını eksik girebilir; tek tıkla adres düzeltme teslimat başarısını artırır.
> • Atölye Butik Güveni: Kurucu Ljiljana Hanım doğrudan butiğin başında olduğu için kişiselleştirilmiş yaklaşım dönüş oranını yükseltir.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 33. AS Ribolov (https://asribolov.rs)

- **Web Sitesi:** [https://asribolov.rs](https://asribolov.rs)
- **Sektör / Kategori:** Balıkçılık & Kamp Ekipmanları
- **Şehir / Konum:** Obrenovac
- **Tüzel Kişilik / Not:** TR AS NO 1 SA PROIZVODNJOM (PIB: 105041751, MB: 60720053)
- **Doğrulanmış E-posta:** `prodaja@asribolov.rs`
- **Doğrulanmış Telefon:** `+381 62 240 916`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, OceanWP, Özel Kurir Takip

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Balıkçılık takımları, olta kamışları, makineler ve kamp teçhizatı. 4.000 RSD üzeri ücretsiz kargo, 20 kg'a kadar paket gönderimi. Olta kamışları uzun silindirik tüplerde taşındığından kuriyerlerde özel gabari/desi tarifesine tabidir; geri dönen paket çok yüksek kargo faturası çıkarır.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Silindirik Olta Tüpleri ve Ağır Kargo Navlunu: Olta kamışları uzun ve kırılabilir olduğundan kuriyer firmaları ek desi ücreti alır; nepreuzeti paketler en pahalı iade kategorisindedir.
> • 20 Kg'a Varan Ağır Paket Koruması: Yem çuvalları ve ağır kamp malzemelerinde teslim alınmayan sipariş iki kat navlun yükler.
> • Hafta Sonu Balık Avı Siparişleri: Cuma günleri aceleyle "hafta sonuna yetişsin" diye sipariş veren ama sonra adreste bulunamayan alıcılar filtrelenir.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 34. Mey Home Beograd (https://meyhome.rs)

- **Web Sitesi:** [https://meyhome.rs](https://meyhome.rs)
- **Sektör / Kategori:** Ev Tekstili, Nevresim, Halı & Yatak Örtüsü
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Mey Home DOO
- **Doğrulanmış E-posta:** `mey.home.doo@gmail.com`
- **Doğrulanmış Telefon:** `+381 60 501 5885`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, Elementor, Bex Express

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Posteljine, jorgani, tepisi, prekrivači ve yolluk satışı. Bex Express ile kapıda ödeme gönderiyorlar. Halı ve nevresimler hacimli (yüksek desi) paketlerdir; adreste bulunamayan veya telefonunu açmayan alıcılar yüzünden Bex kargoyu geri getirdiğinde mağaza ağır nakliye bedeli öder.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Ağır ve Hacimli Ev Tekstili Paketleri: Halı ve yorganlar metreküp olarak çok yer kaplar; iade navlunu küçük bir zarfa kıyasla 3-4 kat daha pahalıdır.
> • Bex Express İkinci Dağıtım Sorunu: Alıcıya ilk seferde ulaşılamazsa paket şubeye çekilir ve genellikle iadeye düşer; önceden SMS onayı teslim alma oranını %95+ seviyesine çıkarır.
> • Yeni Ev/Taşınma Adresleri: Müşteriler yeni taşındıkları dairenin adresini veya kapı numarasını eksik yazabilir; onay linkindeki adres düzeltme özelliği bunu çözer.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 35. Kafa Amigo (https://kafaamigo.rs)

- **Web Sitesi:** [https://kafaamigo.rs](https://kafaamigo.rs)
- **Sektör / Kategori:** Taze Kavrulmuş Kahve & Espresso Kapsülleri
- **Şehir / Konum:** Sombor
- **Tüzel Kişilik / Not:** Kafa Amigo (Milan Gogić PR)
- **Doğrulanmış E-posta:** `gogicmilan.amigo@gmail.com`
- **Doğrulanmış Telefon:** `+381 61 208 6994`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, Post Express / DExpress

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Sombor merkezli taze çekirdek kahve kavurucusu ve Nespresso uyumlu kapsül üreticisi. Kurucusu Milan Gogić. Taze kavrulmuş kahve bekleme süresine duyarlıdır; kuryede günlerce gezip geri dönen kahve tazeliğini yitirir ve satıcıya çift yönlü kargo masrafı çıkarır.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Taze Gıda Tazelik Kaybı: Kavrulmuş kahvenin 10-15 gün kargo deposunda ve kurye aracında beklemesi aromasını bozar; ön onay sadece teslim alacak gerçek kahveseverlere gönderim yapılmasını sağlar.
> • Kurucu Milan Bey İle Doğrudan İletişim: Butik kahve kavurucularında kurucu lojistiğe bizzat bakar; hızlı ve net değer önerisi dikkat çeker.
> • Ofis ve Ev Abonelikleri: Düzenli kahve siparişi veren müşterilerde adres doğrulaması süreci hızlandırır.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 36. Amelles Kozmetika (https://amelles.rs)

- **Web Sitesi:** [https://amelles.rs](https://amelles.rs)
- **Sektör / Kategori:** Doğal Mineral Kozmetik & Cilt Bakımı
- **Şehir / Konum:** Vrnjačka Banja
- **Tüzel Kişilik / Not:** PR AMELLES
- **Doğrulanmış E-posta:** `online@amelles.rs`
- **Doğrulanmış Telefon:** `+381 36 242 5615`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, Elementor, SSL Enkripsiyon, Kargo Entegrasyonu

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Vrnjačka Banja kaynaklı mineral ve doğal cilt bakım kozmetikleri. 5.900 RSD üzeri ücretsiz kargo, kapıda ödeme kabul ediyorlar. Cam kavanoz ve hassas serum şişeleri kargo transferinde risklidir; geri dönen her paket hem kargo bedeli hem de kırılma riski demektir.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Cam Şişe ve Hassas Serum Koruması: Doğal tonikler ve cam kavanoz kremler kargo transfer merkezlerinde tekrar tekrar el değiştirdikçe kırılma ve akma riski artar; doğrudan alıcıya ulaşması elzemdir.
> • 5.900 RSD Yüksek Ücretsiz Kargo Eşiği: Mağaza yüksek sepetli siparişlerde kargoyu üstlendiğinden teslim alınmayan tek bir paket 1.000+ RSD net kargo zararı yazar.
> • Butik Doğal Marka Prestiji: Alıcıya kargo çıkmadan önce gelen kurumsal Viber/SMS onay ekranı mağazanın profesyonel algısını güçlendirir.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 37. Gifts 4 You (https://gifts4you.rs)

- **Web Sitesi:** [https://gifts4you.rs](https://gifts4you.rs)
- **Sektör / Kategori:** Kişiye Özel Hediyeler & Ahşap/Metal Tasarım
- **Şehir / Konum:** Niš
- **Tüzel Kişilik / Not:** Gifts 4 You Niš
- **Doğrulanmış E-posta:** `info@gifts4you.rs`
- **Doğrulanmış Telefon:** `+381 63 254 646`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, Kurir Sistemleri

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> İsimli, fotoğraflı ve özel mesajlı kişiselleştirilmiş hediyeler. Kapıda ödemede teslim alınmayan kişiye özel ürün başkasına satılamaz, hem hammadde hem çift yönlü kargo %100 doğrudan zarar yazar.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Kişiye Özel Üründe Sıfır İkinci Satış Şansı: Üzerinde isim ve özel tarih yazılı ürün iade geldiğinde çöpe gider; gönderim öncesi SMS teyidi alıcının ciddiyetini garantiye alır.
> • Doğum Günü & Yıl Dönümü Zaman Baskısı: Tarihli hediyelerde adres hatası yüzünden geciken kargo müşteriyi öfkelendirir; tek tıkla adres düzeltme teslimatı hızlandırır.
> • Telefonla Manuel Arama Yükü: Özel tasarım teyidi için harcanan zamanı otomatikleştirir.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 38. Poklondžija (https://poklondzija.com)

- **Web Sitesi:** [https://poklondzija.com](https://poklondzija.com)
- **Sektör / Kategori:** Hediye Sepetleri, Çiçek & Lüks Kutlama
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Poklondžija Beograd
- **Doğrulanmış E-posta:** `poklondzija@gmail.com`
- **Doğrulanmış Telefon:** `+381 69 555 4445`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, Elementor, Kurirska Dostava Beograd

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Özel hediye sepetleri, çikolatalar, şarap ve çiçek aranjmanları. Gıda içerikli sepetlerin kuryede günlerce beklemesi bozulma riski taşır; sürpriz siparişlerde alıcının kapıda nakit ödemeden kaçınmasını önleme.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Bozulabilir Çikolata & Gurme İçerik: Hediye sepetlerindeki taze ürünlerin kurye transferinde beklemesi kaliteyi bozar; adrese teslimatın ilk seferde başarılması şarttır.
> • Sürpriz ve Hediye Gönderimlerinde Adres Riski: Alıcının evde bulunmaması durumunda hediye sürprizi bozulur; önceden zaman ve adres teyidi teslimatı garanti eder.
> • Belgrad İçi Hızlı Kurye Maliyet Koruması: Teslim edilmeyen kurye seferi iki kat servis masrafı yaratır.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 39. Pokupi.rs (https://pokupi.rs)

- **Web Sitesi:** [https://pokupi.rs](https://pokupi.rs)
- **Sektör / Kategori:** Ev, Bahçe, Hobi & Küçük Ev Aletleri
- **Şehir / Konum:** Niš
- **Tüzel Kişilik / Not:** Pokupi.rs Online Shop
- **Doğrulanmış E-posta:** `prodaja@pokupi.rs`
- **Doğrulanmış Telefon:** `+381 60 3737 037`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, Özel Kargo Entegrasyonu

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Dış mekan, bahçe aletleri, elektrikli süpürgeler ve hırdavat. Koli boyutları ve ağırlıkları yüksektir; kurye firmalarının teslim alınmayan paketlerde kestiği çift yönlü nakliye bedeli marjı sıfırlar.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Hacimli Koli & Bahçe Aletleri Navlunu: Çim biçme, su pompası ve bahçe aletleri ağır desili ürünlerdir; nepreuzet paket kargo maliyeti satıcıya ciddi zarar yazar.
> • Kapıda Nakit Hazırlama Hatırlatması: Yüksek sepet tutarlarında kurye kapıya gittiğinde nakit bulunmaması teslimatı aksatır; SMS onayıyla tutar netleştirilir.
> • 1-3 Günlük Hızlı Teslimat Güvencesi: Sipariş anında adresi doğrulayarak kargo çıkışını hızlandırır.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 40. Konga Music (https://kongamusic.rs)

- **Web Sitesi:** [https://kongamusic.rs](https://kongamusic.rs)
- **Sektör / Kategori:** Müzik Aletleri, Gitarlar & Dijital Piyanolar
- **Şehir / Konum:** Novi Sad
- **Tüzel Kişilik / Not:** Konga Music Shop Novi Sad
- **Doğrulanmış E-posta:** `info@kongamusic.rs`
- **Doğrulanmış Telefon:** `+381 21 526 076`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, WordPress, Post Express / Daily Express / BEX

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Novi Sad merkezli müzik aletleri mağazası (klavyeler, akustik/elektro gitarlar, ses kartları). Enstrümanlar kırılabilir ve hassastır; kurye araçlarında gereksiz el değiştirip geri dönen gitarlar hem hasar riski taşır hem yüksek çift yönlü navlun yazar.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Novi Sad Yerel Güven Bağı: Aynı şehirde faaliyet göstermek sıcak diyalog kurmayı kolaylaştırır.
> • Kırılabilir Enstrüman Koruması: Gitar sapı, klavye tuşları ve ahşap rezonans gövdeleri kargo transferinde sarsıntıya maruz kalır; sadece kesin alıcılara kargo çıkışı yapılmalıdır.
> • Yüksek Sepet Değeri (15.000–60.000 RSD): Yüksek tutarlı müzik siparişlerinde kapıda nakit hazırlığı için SMS teyidi iadeyi sıfırlar.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 41. Street Moto Shop (https://streetmotoshop.rs)

- **Web Sitesi:** [https://streetmotoshop.rs](https://streetmotoshop.rs)
- **Sektör / Kategori:** Motosiklet Ekipmanları, Kasklar & Ceketler
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Street Moto Shop Beograd
- **Doğrulanmış E-posta:** `prodaja@streetmotoshop.rs`
- **Doğrulanmış Telefon:** `+381 63 836 5244`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, Woodmart Theme, WordPress, Intesa, Kurirska Služba

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Kasklar, moto ceketleri, eldivenler ve pantolonlar. Kask kutuları yüksek hacimli/desili paketlerdir; beden uyumsuzluğu ve dürtüsel siparişlerde dönen kaskın çift yönlü yüksek navlun zararı ve vitrin stoğunu bloke etmesi.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Hacimli Kask Kutusu Desi Maliyeti: Kasklar e-ticaretteki en geniş kutularda sevk edilir; iade durumunda kuriyer yüksek desi ücreti keser.
> • Beden Teyidi & Kask Ölçüsü: Alıcılar kafa çevresini yanlış ölçüp kapıda iade edebiliyor; SMS onay linki beden ve adres netliği sağlar.
> • Sezonluk Moto Trafiği: Bahar ve yaz aylarında artan kapıda ödeme hacminde personelin telefonla arama iş yükünü sıfırlar.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 42. Isiland (https://isiland.rs)

- **Web Sitesi:** [https://isiland.rs](https://isiland.rs)
- **Sektör / Kategori:** Premium & Organik Bebek ve Çocuk Giyim
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Isiland Beograd
- **Doğrulanmış E-posta:** `info@isiland.rs`
- **Doğrulanmış Telefon:** `+381 64 812 4478`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce 11.1, Divi Theme, PixelYourSite, WordPress, Kurirska Dostava

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> GOTS sertifikalı organik pamuk bebek tulumları, kıyafetleri ve hediyelik setler. D2C butik bebek markası. Annelerde eksik adres veya kapıda nakit hazır edilmemesi nedeniyle dönen kargolar butik kârlılığını zedeler.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • D2C Organik Marka Koruması: Butik üretimde kargo iadesi kâr marjını anında tüketir; SMS ile adresi ve kapı zilini teyit etmek teslimat başarısını %95 üzerine taşır.
> • Bebekli Aileler İçin Kurye Notu: Anneler bebek uyurken zil çalınmasını istemez; onay ekranında özel kurye teslimat notu iletilir.
> • Hediye Siparişlerinde Alıcı Teyidi: Bebeğe hediye gönderenlerin adres hatalarını önler.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 43. Kolibri BEBE Shop (https://kolibribebeshop.rs)

- **Web Sitesi:** [https://kolibribebeshop.rs](https://kolibribebeshop.rs)
- **Sektör / Kategori:** Bebek Tekstili, Tulumlar, Kundak & Bebek Odası
- **Şehir / Konum:** Niš
- **Tüzel Kişilik / Not:** Kolibri BEBE Shop Niš (Online D2C)
- **Doğrulanmış E-posta:** `webshop@kolibribebeshop.rs`
- **Doğrulanmış Telefon:** `+381 18 555 666`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, LiteSpeed Cache, BEX Express Entegrasyonu

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Fiziksel mağazası olmayan, tamamen online çalışan D2C bebek tekstil mağazası. BEX ile tüm Sırbistan'a kapıda ödeme gönderiyorlar. BEX teslim alamadığı paketi şubeye çeker ve satıcıya çift yönlü navlun faturası çıkar; SMS ön teyidi bu kaybı keser.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • %100 Online D2C Modelinde İade Acısı: Fiziksel vitrini olmayan saf e-ticaret modellerinde kargo iadesi doğrudan kârı sıfırlar.
> • BEX Express İade Oranı Azaltma: BEX şubesine çekilen ve alınmayan paketlerin önüne geçer.
> • Bebek Yatağı ve Kundak Desisi: Hacimli bebek tekstili ürünlerinde kargo navlunu korunur.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 44. Medenjaci.rs (https://medenjaci.rs)

- **Web Sitesi:** [https://medenjaci.rs](https://medenjaci.rs)
- **Sektör / Kategori:** Ručno Dekorirani Medenjaci, Svadbene & Dečije Poslastice
- **Şehir / Konum:** Srbija
- **Tüzel Kişilik / Not:** Domaći Medenjaci Biljana
- **Doğrulanmış E-posta:** `biljana@medenjaci.rs`
- **Doğrulanmış Telefon:** `+381 69 493 0229`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, LiteSpeed Cache, Post Express / Kurye Sistemleri

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Unikatni ručno rađeni medenjaci za svadbe i rođendane su personalizovani i jestivi proizvodi sa rokom trajanja. Nepreuzet paket koji danima putuje po kurirskim vozilima se suši, lomi i predstavlja 100% gubitak robe i dvostrukog prevoza.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Kişiye Özel Jestivi Ürün Yangını: Medenjaci doğrudan sipariş sahibinin ismiyle üretilir; iade edilen ürün başkasına satılamaz ve 100% çöpe gider.
> • Etkinlik Tarihi Güvencesi: SMS teyidinde müşteriye kutlama tarihinden önce teslimat teyidi iletilir.
> • Kapıda Nakit Hazırlama Hatırlatması: Düğün/kutlama telaşında nakit unutulmasını önler.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 45. Afa Baby Shop (https://afababy.rs)

- **Web Sitesi:** [https://afababy.rs](https://afababy.rs)
- **Sektör / Kategori:** Bebek Arabaları, Oto Koltukları, Mama Sandalyeleri & Bebek Odası
- **Şehir / Konum:** Srbija
- **Tüzel Kişilik / Not:** Afa Baby Shop Online
- **Doğrulanmış E-posta:** `office@afababy.rs`
- **Doğrulanmış Telefon:** `+381 65 526 2544`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, Elementor, Pouzeće, Kurye Dağıtım Ağı

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Bebek arabası ve oto koltukları e-ticaretin en hacimli ve yüksek desili ürünleridir (10-25 kg zapreminske mase). Kurye iadesinde çift yönlü devasa navlun faturası çıkar.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Yüksek Hacim & Desi Koruması: 15-20 kg hacimli koli iadesinde satıcı yüzlerce dinar gidiş-dönüş kargo bedeli öder.
> • Yeni Anne-Babalara Adres Teyidi: Yeni taşınan ailelerin eksik kapı/apartman no girişlerini SMS ekranında düzeltme.
> • Garanti ve Montaj Güveni: Onay ekranında güven tazeleyerek sepet terkini önleme.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 46. Portobello Poklon Korpe (https://poklonkorpe.rs)

- **Web Sitesi:** [https://poklonkorpe.rs](https://poklonkorpe.rs)
- **Sektör / Kategori:** Lüks Hediye Sepetleri, İş Hediyeleri, Şarap & Çikolata Gurme Kutuları
- **Şehir / Konum:** Novi Beograd
- **Tüzel Kişilik / Not:** Portobello YUBC Novi Beograd
- **Doğrulanmış E-posta:** `portobello.ybc.nbg@gmail.com`
- **Doğrulanmış Telefon:** `+381 11 214 55 71`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, GTM4WP, Google Tag Manager, Kurir Dostava

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Hediye sepetleri şarap, ithal çikolata ve delikates içerir. Teslimat gününde alıcıya ulaşılamazsa cam şişelerin kırılma riski doğar, kurye geri döner ve sürpriz bozulur.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Alıcı Teyidi / Hediye Sürprizi Koruması: Başkasına hediye gönderildiğinde alıcının telefon ve gün teyidi şarttır.
> • Cam ve Hassas Gıda Güvenliği: Kurye araçlarında günlerce çalkalanmayı engeller.
> • Kurumsal ve VIP Müşteri İmajı: SMS/Viber onay kartı hediye deneyimini prestijli kılar.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 47. Mediflora Biljna Apoteka (https://biljna-apoteka.rs)

- **Web Sitesi:** [https://biljna-apoteka.rs](https://biljna-apoteka.rs)
- **Sektör / Kategori:** Doğal Bitkisel İlaçlar, Bitki Damlaları, Çaylar ve Manastır Tentürleri
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Mediflora Biljna Apoteka Beograd
- **Doğrulanmış E-posta:** `kontakt@mediflora.rs`
- **Doğrulanmış Telefon:** `+381 11 380 62 81`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, Beograd Čelopečka, Pouzeće, Kurye Ağı

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Cam damlalıklı şişelerde sunulan doğal bitki tentürleri ve şuruplar kargo aktarmalarında sarsılma ve kırılma riski taşır. Teslim alınmayan paket çift yönlü navlun ve ürün yıpranması yaratır.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Yaşlı ve Telefonla Sipariş Veren Kitleye SMS Kolaylığı: Karmaşık web formları yerine telefon onay linki.
> • Hassas Cam Şişe Güvenliği: Kuryeye sadece adresi kesinleşmiş ve onaylanmış paketler verilir.
> • Kapıda Ödenecek Tutarın Netleştirilmesi: Kurye komisyonu itirazlarını engeller.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 48. Izaberi Poklon (https://izaberipoklon.rs)

- **Web Sitesi:** [https://izaberipoklon.rs](https://izaberipoklon.rs)
- **Sektör / Kategori:** Kişiye Özel Baskılı Hediyeler, Peluş Oyuncak, Sihirli Kupa, Foto-Kamen
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Izaberi Poklon Beograd
- **Doğrulanmış E-posta:** `office@izaberipoklon.rs`
- **Doğrulanmış Telefon:** `061 31 54 641`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, Pouzeće, Beograd D2C, Custom Product Designer

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Üzerine isim, fotoğraf veya tarih basılan kişiye özel ürünler nepreuzet paket durumunda tekrar satılamaz; doğrudan %100 sermaye kaybıdır.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Kişiye Özel Ürün Yangınını Kesme: İsim baskılı ürünler geri döndüğünde çöpe atılır; ön onay şarttır.
> • Sosyal Medya Dürtüsel Sipariş Filtresi: Instagram'dan sipariş verip unutanları eler.
> • Kargo Öncesi Adres Netleştirme: Kurye teslimat başarısını %97'ye çıkarır.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 49. Gravura.rs (https://gravura.rs)

- **Web Sitesi:** [https://gravura.rs](https://gravura.rs)
- **Sektör / Kategori:** Lazer Ahşap & Cam Gravür, Kişiye Özel Ahşap Şişe Kutuları ve Kesme Tahtaları
- **Şehir / Konum:** Srbija
- **Tüzel Kişilik / Not:** Gravura.rs Radionica
- **Doğrulanmış E-posta:** `gravurars@gmail.com`
- **Doğrulanmış Telefon:** `+381 64 446 4197`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, D2C Lazer Atölyesi, Pouzeće

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Ahşap veya cam üzerine kalıcı lazer kazıma ile isim veya logo işlenir. Müşteri kapıda paketi almazsa satıcı hem çift yönlü kargo parasını öder hem de kazınmış ürünü hurdaya ayırır.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • %100 Fire Riski: Kalıcı kazınmış unikat ürünler başkasına satılamaz.
> • Hediye Siparişlerinde Alıcı Teyidi: Kutlama hediyelerinde teslimat günü kesinliği.
> • SMS Doğrulaması ile Ciddiyet: Sipariş ciddiyetini artırarak kapıda vazgeçmeleri keser.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 50. Štampane Majice (https://stampanemajice.rs)

- **Web Sitesi:** [https://stampanemajice.rs](https://stampanemajice.rs)
- **Sektör / Kategori:** D2C Özel Tasarım Baskılı Tişört ve Sweatshirt Modası
- **Şehir / Konum:** Srbija
- **Tüzel Kişilik / Not:** Štampane Majice Online Shop
- **Doğrulanmış E-posta:** `info@stampanemajice.rs`
- **Doğrulanmış Telefon:** `062 704 679`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, D2C Tekstil Baskı, Pouzeće

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Sosyal medyadan gelen dürtüsel siparişlerde kapıda ödemeden vazgeçme oranı yüksektir. Özel basılan tişört geri döndüğünde stokta eritilemez.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Dürtüsel Sipariş İadelerini Önleme: Sosyal medya dürtüsel siparişlerinde %15 iade oranını SMS teyidi sıfırlar.
> • Beden Doğrulaması: SMS teyit ekranında beden teyidi alarak yanlış beden iadesini önleme.
> • Sadece Onaylı Siparişleri Basma: Mağaza personeli tişörtü basmadan önce SMS onayını bekler.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 51. Greenshop.rs (https://greenshop.rs)

- **Web Sitesi:** [https://greenshop.rs](https://greenshop.rs)
- **Sektör / Kategori:** Sertifikalı Doğal Kozmetik, Eko Bakım & Organik Ürünler (5000+ Recenzija)
- **Şehir / Konum:** Srbija
- **Tüzel Kişilik / Not:** Greenshop.rs Eko Trgovina
- **Doğrulanmış E-posta:** `info@greenshop.rs`
- **Doğrulanmış Telefon:** *(Telefon yok)*
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, GTM4WP, Google Tag Manager, Google Analytics 4, Pouzeće

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Yüksek hacimli D2C doğal kozmetik operasyonu; kapıda ödemede %10 iade bile aylık yüzlerce kargo faturası ve lojistik maliyeti yaratır.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Yüksek Hacimde Küçük Yüzde = Büyük Kâr: 5.000+ yorumluk devasa katalogda %5 iade düşüşü binlerce euro kargo tasarrufu sağlar.
> • Adres Eksikliklerini Giderme: Apartman no ve bina girişi eksikliklerini Potvrdio ekranında tek tıkla tamamlama.
> • Hassas Doğal Kremlerin Korunması: Aşırı sıcak/soğukta kurye araçlarında günlerce beklemeyi önleme.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 52. Slatkoteka ® (https://slatkoteka.rs)

- **Web Sitesi:** [https://slatkoteka.rs](https://slatkoteka.rs)
- **Sektör / Kategori:** Butik Donut, Pasta, Tatlı Hediyeleri & Gurme Çikolata (Slatkoteka Markası)
- **Şehir / Konum:** Beograd
- **Tüzel Kişilik / Not:** Slatkoteka Beograd
- **Doğrulanmış E-posta:** `upit@slatkoteka.rs`
- **Doğrulanmış Telefon:** `065 33 00 508`
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, Beograd Lokasyonları, Pouzeće, Fresh Delivery Ekibi

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Donut ve pastalar günlük taze unlu mamullerdir. Alıcı kapıda bulunamazsa o gün bayatlar ve 100% imha edilir. Ön teyit fireyi sıfırlar.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Günlük Taze Üründe Sıfır Fire: Teslim alınmayan pasta ve donut doğrudan çöpe atılır; SMS ön teyidi bu kaybı tamamen engeller.
> • Daire ve Zil No Detaylarının Alınması: Kuryenin kapıda beklemesini ve alıcıya ulaşamama sorununu ortadan kaldırır.
> • VIP Marka İmajı: SMS ve Viber onay akışı lüks pastane marka imajını güçlendirir.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

### 53. Pikshop (https://pikshop.rs)

- **Web Sitesi:** [https://pikshop.rs](https://pikshop.rs)
- **Sektör / Kategori:** Ahşap Çocuk Mutfakları, Bebek Evleri, Montessori Eğitici Oyuncaklar
- **Şehir / Konum:** Srbija
- **Tüzel Kişilik / Not:** Pikshop D2C Igračke
- **Doğrulanmış E-posta:** `info@pikshop.rs`
- **Doğrulanmış Telefon:** *(Telefon yok)*
- **Öncelik Seviyesi:** `p1_verified` | **Güncel Durum:** `not_contacted`
- **Altyapı & Tech Stack:** WooCommerce, Pouzeće, Ağır Karton Lojistiği

#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)
> Ahşap çocuk mutfakları ve bebek evleri 8 ila 15 kg masif kartonlarda gönderilir. Nepreuzet paket yüksek desi tarifesiyle çift yönlü kargo faturası çıkarır.

#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)
> • Masif Desi Koruması: 10-15 kg ahşap mutfak kolisi iadesinde çift yönlü yüksek kargo kaybını önleme.
> • Doğum Günü Teslimat Teyidi: Çocuğun doğum günü öncesinde alıcının adreste hazır olmasını sağlama.
> • Orijinal Kutu Hasarını Önleme: Kurye araçlarında haftalarca dolaşıp kutunun ezilmesini engelleme.

*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*

---

## 4. İletişim ve Etkileşim Geçmişi (All Communications Log)

### Kayıt #42 · Fermini (2026-10-19 17:00:00)

- **Mağaza:** Fermini (ID: 4)
- **Kanal:** `viber` | **Yön:** `outbound`
- **Konu Başlığı:** `Viber Takip: Hafta Sonu Sonrası Demo & 25 Siparişlik Ücretsiz Kurulum Hatırlatması`
- **Gönderim Zamanı:** `2026-10-19 17:00:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-22`

**Mesaj / E-posta İçeriği:**

```text
Dobar dan Sanela, nadam se da ste lepo odmorili za vikend!

Samo kratko da se javim,  da li ste stigli da bacite pogled na prikaz?

Ako vam zvuči korisno za smanjenje vraćenih paketa, možemo besplatno podesiti proveru adrese za prvih 25 porudžbina (bez ikakvih obaveza i troškova za vas), pa da vidite kako funkcioniše u praksi.

Pozdrav, Atil
```

---

### Kayıt #41 · Comfortino (2026-10-19 11:44:00)

- **Mağaza:** Comfortino (ID: 5)
- **Kanal:** `viber` | **Yön:** `outbound`
- **Konu Başlığı:** `Viber & WhatsApp Takip: 15 Ekim E-posta Hatırlatması & How-it-Works Linki`
- **Gönderim Zamanı:** `2026-10-19 11:44:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-21`

**Mesaj / E-posta İçeriği:**

```text
Dobar dan, ovde Atil iz Novog Sada. Pisao sam vam mejlom 15. oktobra o nepreuzetim paketima kod AKS dostave. Kod obuće svaki vraćeni paket znači plaćenu dostavu u oba smera. Ovde je kratko objašnjenje (2 minuta): https://potvrdio.online/kako-funkcionise?&c=comfortino
Beta je besplatna za prvih 25 porudžbina pouzećem.
```

---

### Kayıt #40 · Fashion Store (2026-10-16 14:25:00)

- **Mağaza:** Fashion Store (ID: 2)
- **Kanal:** `viber` | **Yön:** `inbound`
- **Konu Başlığı:** `Viber Teşekkür (Mirjana)`
- **Gönderim Zamanı:** `2026-10-16 14:25:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-19`

**Mesaj / E-posta İçeriği:**

```text
Hvala
```

---

### Kayıt #39 · Fashion Store (2026-10-16 12:27:00)

- **Mağaza:** Fashion Store (ID: 2)
- **Kanal:** `viber` | **Yön:** `outbound`
- **Konu Başlığı:** `Viber Açıklama & Demo Linki`
- **Gönderim Zamanı:** `2026-10-16 12:27:00`
- **Takip Tarihi (Follow-up Due):** `Yok`

**Mesaj / E-posta İçeriği:**

```text
Hvala na odgovoru!
Kada kupac poruči pouzećem, Potvrdio mu šalje SMS ili Viber poruku sa linkom: jednim klikom potvrdi porudžbinu ili ispravi adresu.

Porudžbina do tada stoji na čekanju (On-Hold), pa kuriru šaljete samo potvrđene pakete.

Beta je besplatna i bez obaveza. Otprilike koliko paketa pouzećem vam se mesečno vrati?

Ako vam je lakše da vidite nego da čitate, ovde je kratak prikaz kako radi: https://potvrdio.online/kako-funkcionise
```

---

### Kayıt #38 · Fashion Store (2026-10-16 12:24:00)

- **Mağaza:** Fashion Store (ID: 2)
- **Kanal:** `viber` | **Yön:** `inbound`
- **Konu Başlığı:** `Viber Yanıtı (Mirjana)`
- **Gönderim Zamanı:** `2026-10-16 12:24:00`
- **Takip Tarihi (Follow-up Due):** `Yok`

**Mesaj / E-posta İçeriği:**

```text
Objasnite hvala
```

---

### Kayıt #35 · Fermini (2026-10-16 10:18:00)

- **Mağaza:** Fermini (ID: 4)
- **Kanal:** `viber` | **Yön:** `outbound`
- **Konu Başlığı:** `Viber Açıklama & Demo Linki`
- **Gönderim Zamanı:** `2026-10-16 10:18:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Hvala na odgovoru! 
Kada kupac poruči pouzećem, Potvrdio mu šalje SMS ili Viber poruku sa linkom: jednim klikom potvrdi porudžbinu ili ispravi adresu. 

Porudžbina do tada stoji na čekanju (On-Hold), pa kuriru šaljete samo potvrđene pakete. 

Beta je besplatna i bez obaveza. Otprilike koliko paketa pouzećem vam se mesečno vrati?
Ako vam je lakše da vidite nego da čitate, ovde je kratak prikaz kako radi: https://potvrdio.online/kako-funkcionise
```

---

### Kayıt #34 · Fermini (2026-10-16 10:15:00)

- **Mağaza:** Fermini (ID: 4)
- **Kanal:** `viber` | **Yön:** `inbound`
- **Konu Başlığı:** `Viber Yanıtı: Sanela (Kažite)`
- **Gönderim Zamanı:** `2026-10-16 10:15:00`
- **Takip Tarihi (Follow-up Due):** `Yok`

**Mesaj / E-posta İçeriği:**

```text
Kažite
```

---

### Kayıt #26 · Fermini (2026-10-16 10:14:00)

- **Mağaza:** Fermini (ID: 4)
- **Kanal:** `viber` | **Yön:** `outbound`
- **Konu Başlığı:** `Viber Takip Hatırlatması: E-posta Sonrası Kısa Bilgilendirme`
- **Gönderim Zamanı:** `2026-10-16 10:14:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Dobar dan, ovde Atil iz Novog Sada. Pre dva dana sam poslao mejl na info@fermini.rs o Potvrdiu, WooCommerce dodatku koji pre slanja kuriru proverava adresu kupca kod porudžbina pouzećem. Tražim 3 do 5 prodavnica za besplatan beta test (prvih 25 porudžbina pouzećem ili 30 dana, šta pre istekne). Ako želite, u dve rečenice mogu da objasnim kako radi. Hvala!
```

---

### Kayıt #25 · Šifonjer (2026-10-16 10:12:00)

- **Mağaza:** Šifonjer (ID: 3)
- **Kanal:** `viber` | **Yön:** `outbound`
- **Konu Başlığı:** `Viber Takip Hatırlatması: Tekil 1-of-1 İkinci El Ürün Kancası`
- **Gönderim Zamanı:** `2026-10-16 10:12:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Dobar dan, ovde Atil iz Novog Sada. Pre dva dana sam poslao mejl na podrska@sifonjer.rs o Potvrdiu, WooCommerce dodatku koji pre slanja kuriru proverava adresu kupca kod porudžbina pouzećem. Kod polovne garderobe, gde je svaki komad jedinstven, nepreuzet paket posebno boli. Tražim 3 do 5 prodavnica za besplatan beta test (prvih 25 porudžbina pouzećem ili 30 dana, šta pre istekne). Ako želite, u dve rečenice mogu da objasnim kako radi. Hvala!
```

---

### Kayıt #24 · Fashion Store (2026-10-16 10:07:00)

- **Mağaza:** Fashion Store (ID: 2)
- **Kanal:** `viber` | **Yön:** `outbound`
- **Konu Başlığı:** `Viber Takip Hatırlatması: E-posta Sonrası Kısa Bilgilendirme`
- **Gönderim Zamanı:** `2026-10-16 10:07:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Dobar dan, ovde Atil iz Novog Sada. Pre dva dana sam poslao mejl na info@fashionstore.rs o Potvrdiu, dodatku za WooCommerce koji pre slanja kuriru proverava adresu kupca kod porudžbina pouzećem. Tražim samo 3 do 5 prodavnica za besplatan beta test. Ako vam je lakše, u dve rečenice mogu da objasnim kako radi. Hvala!
```

---

### Kayıt #37 · Ollie's (2026-10-16 08:40:23)

- **Mağaza:** Ollie's (ID: 20)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `priča o dedi Savi, maslinovo ulje i nepreuzeti paketi, Ollie's`
- **Gönderim Zamanı:** `2026-10-16 08:40:23`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Poštovana Jelena,

Pročitao sam priču o vašem dedi Savi i maslinjaku od 700 stabala. Kod prirodne kozmetike i vrhunskog maslinovog ulja u staklenoj ambalaži, svaki paket koji se vrati na pouzeću ne znači samo dupli trošak dostave (posebno uz besplatnu dostavu preko 10.000 RSD), već i rizik od oštećenja proizvoda koji danima putuje umesto da bude kod kupca.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #36 · JAT Fashion (2026-10-16 08:31:51)

- **Mağaza:** JAT Fashion (ID: 19)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Automatizacija provere adrese i potvrde za JAT Fashion (WooCommerce)`
- **Gönderim Zamanı:** `2026-10-16 08:31:51`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Na vašem sajtu piše da vaš tim nakon porudžbine kontaktira kupce radi potvrde porudžbine i isporuke. Kod plaćanja pouzećem to je ručni posao za svaku porudžbinu, a pogrešna adresa se često otkrije tek kada je kurir već krenuo.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji taj korak radi automatski: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: dve nedelje, besplatno, na stvarnim porudžbinama. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl, pa vam šaljem detalje.

Srdačan pozdrav,
Atıl Bilge Örüm
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556
```

---

### Kayıt #33 · Salon Info (2026-10-16 08:30:14)

- **Mağaza:** Salon Info (ID: 25)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `profesionalna kozmetika i sigurnija dostava, Salon Info`
- **Gönderim Zamanı:** `2026-10-16 08:30:14`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Salon Info snabdeva frizerske i kozmetičke salone profesionalnim preparatima širom Srbije. Kod narudžbina za salone i teških paketa, pogrešna adresa ili odsutan primalac stvara trošak duple poštarine i remeti rad frizera koji čekaju robu.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #32 · Salon Info (2026-10-16 08:28:20)

- **Mağaza:** Salon Info (ID: 25)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `profesionalna kozmetika i sigurnija dostava, Salon Info`
- **Gönderim Zamanı:** `2026-10-16 08:28:20`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Salon Info snabdeva frizerske i kozmetičke salone profesionalnim preparatima širom Srbije. Kod narudžbina za salone i teških paketa, pogrešna adresa ili odsutan primalac stvara trošak duple poštarine i remeti rad frizera koji čekaju robu.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #31 · Lux Shop (2026-10-16 08:26:08)

- **Mağaza:** Lux Shop (ID: 24)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `pouzeće i smanjenje nepreuzetih paketa, Lux Shop`
- **Gönderim Zamanı:** `2026-10-16 08:26:08`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Lux Shop ima preko 2.000 artikala i da se većina porudžbina šalje pouzećem uz brzu isporuku od 1-3 dana. Kod takvog asortimana neozbiljne porudžbine i nepreuzeti paketi donose stalne troškove duple poštarine, a potvrda pre slanja to rešava.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #30 · Kozmetika Moja (2026-10-16 08:24:57)

- **Mağaza:** Kozmetika Moja (ID: 26)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `besplatna dostava preko 5.000 RSD i BEX, Kozmetika Moja`
- **Gönderim Zamanı:** `2026-10-16 08:24:57`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Pratim rad brenda Kozmetika Moja i video sam da nudite besplatnu dostavu preko 5.000 RSD putem BEX-a. Kod prirodne kozmetike i roka isporuke od 3 do 5 dana, jedan nepreuzet paket na pouzeću znači plaćenu poštarinu u oba smera i briše zaradu cele porudžbine.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #29 · Djomla Bike (2026-10-16 08:23:26)

- **Mağaza:** Djomla Bike (ID: 23)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Automatizacija provere adrese i potvrde za Djomla Bike (WooCommerce)`
- **Gönderim Zamanı:** `2026-10-16 08:23:26`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Na vašem sajtu piše da vaš tim nakon porudžbine kontaktira kupce radi potvrde porudžbine i isporuke. Kod plaćanja pouzećem to je ručni posao za svaku porudžbinu, a pogrešna adresa se često otkrije tek kada je kurir već krenuo.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji taj korak radi automatski: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: dve nedelje, besplatno, na stvarnim porudžbinama. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl, pa vam šaljem detalje.

Srdačan pozdrav,
Atıl Bilge Örüm
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556
```

---

### Kayıt #28 · Boss Shop (2026-10-16 08:22:33)

- **Mağaza:** Boss Shop (ID: 22)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `paketi do 50 kg i besplatna dostava, B.O.S. Shop`
- **Gönderim Zamanı:** `2026-10-16 08:22:33`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da B.O.S. Shop nudi besplatnu dostavu za porudžbine preko 15.000 RSD do čak 50 kg težine. Kod teških alata i mašina povratni paket stvara izuzetno visoku poštarinu u oba smera, koja može potpuno da obriše zaradu sa te prodaje.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #27 · B Plus (2026-10-16 08:21:07)

- **Mağaza:** B Plus (ID: 21)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `isporuka nameštaja i adresa pre slanja, Bplus`
- **Gönderim Zamanı:** `2026-10-16 08:21:07`
- **Takip Tarihi (Follow-up Due):** `2026-10-18`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Nameštaj Bplus šalje kompletan nameštaj za dom širom Srbije. Kod tako gabaritnih i teških paketa, pogrešna adresa ili kupac koji nije kod kuće znači ogroman logistički trošak i povratnu vožnju, što direktno ugrožava maržu.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #23 · Backup Shop (2026-10-15 15:15:00)

- **Mağaza:** Backup Shop (ID: 18)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Automatizacija provere adrese i potvrde za BackUp Shop (WooCommerce)`
- **Gönderim Zamanı:** `2026-10-15 15:15:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Na vašem sajtu piše da vaš tim nakon porudžbine kontaktira kupce radi potvrde porudžbine i isporuke. Kod plaćanja pouzećem to je ručni posao za svaku porudžbinu, a pogrešna adresa se često otkrije tek kada je kurir već krenuo.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji taj korak radi automatski: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: dve nedelje, besplatno, na stvarnim porudžbinama. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl, pa vam šaljem detalje.
```

---

### Kayıt #22 · Ljuba 024 (2026-10-15 12:55:22)

- **Mağaza:** Ljuba 024 (ID: 17)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `trimeri i motorne testere pouzećem, Ljuba 024`
- **Gönderim Zamanı:** `2026-10-15 12:55:22`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Ljuba 024 iz Subotice prodaje Demon trimere i motorne testere, uz besplatnu dostavu za tri artikla preko 7.000 RSD. Kod mašina od 8 do 10 kg povratna poštarina je visoka, pa jedna nepreuzeta porudžbina pojede zaradu.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #21 · Kanin Obuća (2026-10-15 12:38:46)

- **Mağaza:** Kanin Obuća (ID: 16)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `ručno rađena obuća i pouzeće, Kanin Obuća`
- **Gönderim Zamanı:** `2026-10-15 12:38:46`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Kanin iz Niša prodaje ručno rađenu kožnu obuću, uz besplatnu dostavu preko 12.000 RSD. Kod porudžbina te vrednosti nepreuzet paket znači plaćenu dostavu u oba smera i par cipela koji je danima van prodaje.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #20 · AC Vinulović (2026-10-15 12:37:52)

- **Mağaza:** AC Vinulović (ID: 15)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `gume i akumulatori pouzećem, AC Vinulović`
- **Gönderim Zamanı:** `2026-10-15 12:37:52`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da iz Negotina šaljete gume i akumulatore širom Srbije. Kod gabaritnih i teških paketa poštarina je visoka, pa jedan nepreuzet paket do Negotina znači veliki trošak. Potvrda kupca i adrese pre slanja štedi taj trošak.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #19 · Pravi Alati (2026-10-15 12:37:04)

- **Mağaza:** Pravi Alati (ID: 14)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Ingco alati pouzećem, Pravi Alati`
- **Gönderim Zamanı:** `2026-10-15 12:37:04`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Pravi Alati prodaje Ingco električni alat pouzećem. Kod teških kofera i mašina vraćen paket znači skupu povratnu poštarinu, a alat danima kruži umesto da bude kod kupca. Potvrda porudžbine i adrese pre slanja štiti vas od toga.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #18 · Pura Home Spa (2026-10-15 12:34:48)

- **Mağaza:** Pura Home Spa (ID: 13)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `besplatna dostava iznad 4.500 RSD, Pura Home Spa`
- **Gönderim Zamanı:** `2026-10-15 12:34:48`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovana gospođo Đukić,

Pratim rad Pura Home Spa i video sam da nudite besplatnu dostavu iznad 4.500 RSD. Pošto se difuzori i spa proizvodi često kupuju kao poklon, teže je da kurir stigne do pravog primaoca. Jedan vraćen paket znači plaćenu dostavu u oba smera i briše profit cele porudžbine.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #17 · Čarna (2026-10-15 12:33:57)

- **Mağaza:** Čarna (ID: 12)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Post Express i pouzeće, Čarna`
- **Gönderim Zamanı:** `2026-10-15 12:33:57`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Pročitao sam priču o vašoj plantaži matičnjaka na Radan planini. Kod ručno rađene kozmetike svaki paket koji se vrati preko Post Expressa znači poštarinu u oba smera i proizvod koji je bio na putu umesto kod kupca.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #13 · Animal Market (2026-10-15 12:28:00)

- **Mağaza:** Animal Market (ID: 1)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Re: Potvrda adrese za porudžbine pouzećem, Animal Market`
- **Gönderim Zamanı:** `2026-10-15 12:28:00`
- **Takip Tarihi (Follow-up Due):** `2027-01-05`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,
hvala vam na detaljnom odgovoru, potpuno razumem da je oko pokretanja shopa puno posla.
Kada budete završili osnovno podešavanje, ja ću sam instalirati i podesiti Potvrdio za vas, bez ikakvog dodatnog posla sa vaše strane. Ako vam odgovara, javiću vam se početkom januara.
Usput, ako u vašem okruženju poznajete vlasnike WooCommerce shopova koji primaju plaćanje pouzećem, bio bih vam zahvalan ako me preporučite. Rado ću im besplatno podesiti Potvrdio.
Srećno sa pripremama!
Srdačan pozdrav,
Atil Bilge Orum
```

---

### Kayıt #16 · Eridan (2026-10-15 12:27:47)

- **Mağaza:** Eridan (ID: 11)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `rok isporuke 3-7 dana i pouzeće, Eridan`
- **Gönderim Zamanı:** `2026-10-15 12:27:47`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da za Eridan preparate navodite rok isporuke od 3 do 7 radnih dana. Kod pouzeća, što je rok duži, to je veća šansa da kupac zaboravi porudžbinu ili ne bude kod kuće kada kurir stigne. Potvrda odmah posle porudžbine i pre slanja to smanjuje.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #15 · Fitaky (2026-10-15 12:26:48)

- **Mağaza:** Fitaky (ID: 10)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `dostava mamama sa bebama, Fitaky`
- **Gönderim Zamanı:** `2026-10-15 12:26:48`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Pratim Fitaky i vašu prirodnu kozmetiku za bebe i mame. Kod dostave porodicama sa malom decom često se desi da niko nije kod kuće kada kurir stigne, pa se paket vrati uz dupli trošak dostave. Potvrda adrese pre slanja to smanjuje.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #14 · Prodaja Parfema (2026-10-15 12:25:58)

- **Mağaza:** Prodaja Parfema (ID: 9)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `nepreuzeti paketi kod skupih porudžbina, Prodaja Parfema`
- **Gönderim Zamanı:** `2026-10-15 12:25:58`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da prodajete originalne parfeme uz besplatnu dostavu preko 4.000 RSD. Kod porudžbina veće vrednosti jedan nepreuzet paket briše zaradu od više uspešnih prodaja, a potvrda pre slanja izdvaja neozbiljne porudžbine pre nego što paket krene.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #12 · Animal Market (2026-10-15 12:21:00)

- **Mağaza:** Animal Market (ID: 1)
- **Kanal:** `email` | **Yön:** `inbound`
- **Konu Başlığı:** `Re: Potvrda adrese za porudžbine pouzećem, Animal Market`
- **Gönderim Zamanı:** `2026-10-15 12:21:00`
- **Takip Tarihi (Follow-up Due):** `Yok`

**Mesaj / E-posta İçeriği:**

```text
Ja licno pravim taj shop i pored toga imam posla pa ne mogu tacno da odredim, ja se nadam da cu ga do nove godine pustiti u rad jer treba jos 1k proizvoda da ubacim i izmenim razne stvari, bice i online placanje kao i placanje pouzecem takodje treba da ubacim da sabere u racun i samu putarinu... nadam se da cu to sve izvesti do nove godine
```

---

### Kayıt #11 · Animal Market (2026-10-15 12:16:00)

- **Mağaza:** Animal Market (ID: 1)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Re: Potvrda adrese za porudžbine pouzećem, Animal Market`
- **Gönderim Zamanı:** `2026-10-15 12:16:00`
- **Takip Tarihi (Follow-up Due):** `Yok`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,
hvala na odgovoru. Da li možete okvirno da mi kažete kada planirate pokretanje shopa i da li će plaćanje pouzećem biti dostupno? Javiću vam se tada, a ako vam u međuvremenu zatreba nešto vezano za potvrdu adresa, slobodno me kontaktirajte.
```

---

### Kayıt #10 · Animal Market (2026-10-15 11:26:00)

- **Mağaza:** Animal Market (ID: 1)
- **Kanal:** `email` | **Yön:** `inbound`
- **Konu Başlığı:** `Re: Potvrda adrese za porudžbine pouzećem, Animal Market`
- **Gönderim Zamanı:** `2026-10-15 11:26:00`
- **Takip Tarihi (Follow-up Due):** `Yok`

**Mesaj / E-posta İçeriği:**

```text
Postovani shop jos uvek nije pusten u rad, kada stignemo dotle kontaktiracemo vas
```

---

### Kayıt #6 · Animal Market (2026-10-15 11:11:00)

- **Mağaza:** Animal Market (ID: 1)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `RE: Potvrda adrese za porudžbine pouzećem, Animal Market`
- **Gönderim Zamanı:** `2026-10-15 11:11:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,Samo kratko da se nadovežem na prethodni mejl. Ako vam je lakše da prvo vidite kako izgleda, ovde je kratak prikaz kako funkcioniše: https://potvrdio.online/kako-funkcioniseBeta je besplatna za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, na vašoj prodavnici i bez obaveza.Ako trenutno nije aktuelno, slobodno mi samo javite.Srdačan pozdrav,
```

---

### Kayıt #5 · Comfortino (2026-10-15 11:00:00)

- **Mağaza:** Comfortino (ID: 5)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `dostava i potvrda adrese, comfortino`
- **Gönderim Zamanı:** `2026-10-15 11:00:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Comfortino isporučuje putem AKS kurira. Kod obuće svaki nepreuzet paket znači plaćenu dostavu u oba smera i par cipela koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio, dodatak za WooCommerce koji pre slanja paketa kupcu šalje poruku sa jednim klikom za potvrdu ili ispravku adrese, kako bi se smanjio broj nepreuzetih paketa. Trenutno tražim nekoliko prodavnica za zatvorenu beta verziju, besplatno za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije.

Ako vam je zanimljivo, rado ću vam poslati link sa kratkim objašnjenjem kako funkcioniše.

Srdačan pozdrav,

Atil Bilge Orum
potvrdio.online
Novi Sad
Tel: +381 61 603 6556
```

---

### Kayıt #9 · Lekiko (2026-10-15 09:54:29)

- **Mağaza:** Lekiko (ID: 8)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `manje zvanja oko porudžbina, Lekiko`
- **Gönderim Zamanı:** `2026-10-15 09:54:29`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Lekiko iz Kragujevca šalje opremu i hranu za ljubimce pouzećem širom Srbije. Ako vaš tim ručno zove kupce radi provere porudžbine, taj posao može da preuzme automatska poruka, a vi šaljete samo potvrđene porudžbine.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #8 · Perbipharm (2026-10-15 09:53:11)

- **Mağaza:** Perbipharm (ID: 7)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `potvrda adrese pre slanja AKS-om, Perbipharm`
- **Gönderim Zamanı:** `2026-10-15 09:53:11`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Perbipharm šalje veterinarske preparate i dijetetsku hranu putem AKS-a. Kod takvih proizvoda pogrešna adresa ili nepreuzet paket znači ne samo dupli trošak dostave, već i kupca koji čeka hranu ili terapiju za svog ljubimca.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #7 · Pet Zoo Shop (2026-10-15 09:51:47)

- **Mağaza:** Pet Zoo Shop (ID: 6)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `džakovi od 15 kg i nepreuzeti paketi, Pet Zoo Shop`
- **Gönderim Zamanı:** `2026-10-15 09:51:47`
- **Takip Tarihi (Follow-up Due):** `2026-10-17`

**Mesaj / E-posta İçeriği:**

```text
Poštovani,

Video sam da Pet Zoo Shop šalje džakove hrane od 14 do 15 kg putem BEX-a, uz besplatnu dostavu preko 6.000 RSD. Kod tako teških paketa jedan nepreuzet džak znači plaćenu dostavu u oba smera, što može da pojede zaradu sa cele porudžbine.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Kayıt #4 · Fermini (2026-10-14 12:00:00)

- **Mağaza:** Fermini (ID: 4)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Potvrda adrese za porudžbine pouzećem, Fermini`
- **Gönderim Zamanı:** `2026-10-14 12:00:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-16`

**Mesaj / E-posta İçeriği:**

```text
Gönderilen E-posta (14 Ekim 2026):

Poštovani,

Video sam da imate širok asortiman odeće i tekstila uz plaćanje pouzećem. Pogrešna adresa se često otkrije tek kada je kurir već krenuo, a to znači nepreuzet paket i plaćenu dostavu u oba smera.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556
```

---

### Kayıt #3 · Šifonjer (2026-10-14 11:45:00)

- **Mağaza:** Šifonjer (ID: 3)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Potvrda adrese za porudžbine pouzećem, Šifonjer`
- **Gönderim Zamanı:** `2026-10-14 11:45:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-16`

**Mesaj / E-posta İçeriği:**

```text
Gönderilen E-posta (14 Ekim 2026):

Poštovani,

Video sam da prodajete polovnu firmiranu garderobu uz plaćanje pouzećem. Kod polovne garderobe je svaki komad jedinstven, pa nepreuzet paket znači plaćenu dostavu u oba smera i komad koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li biste bili zainteresovani? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556
```

---

### Kayıt #2 · Fashion Store (2026-10-14 11:30:00)

- **Mağaza:** Fashion Store (ID: 2)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Potvrda adrese za porudžbine pouzećem, Fashion Store`
- **Gönderim Zamanı:** `2026-10-14 11:30:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-16`

**Mesaj / E-posta İçeriği:**

```text
Gönderilen E-posta (14 Ekim 2026):

Poštovani,

Video sam da pored radnje u Čačku imate i online prodavnicu sa plaćanjem pouzećem. Svaki nepreuzet paket znači plaćenu dostavu u oba smera i artikal koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije (šta pre istekne). Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556
```

---

### Kayıt #1 · Animal Market (2026-10-13 10:06:00)

- **Mağaza:** Animal Market (ID: 1)
- **Kanal:** `email` | **Yön:** `outbound`
- **Konu Başlığı:** `Automatizacija provere adrese i potvrde za Animal Market (WooCommerce)`
- **Gönderim Zamanı:** `2026-10-13 10:06:00`
- **Takip Tarihi (Follow-up Due):** `2026-10-15`

**Mesaj / E-posta İçeriği:**

```text
Gönderilen E-posta (13 Ekim Salı, 10:06):

Poštovani,

Na vašem sajtu piše da vaš tim nakon porudžbine kontaktira kupce radi potvrde porudžbine i isporuke. Kod plaćanja pouzećem to je ručni posao za svaku porudžbinu, a pogrešna adresa se često otkrije tek kada je kurir već krenuo.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji taj korak radi automatski: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: dve nedelje, besplatno, na stvarnim porudžbinama. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl, pa vam šaljem detalje.

Srdačan pozdrav,
Atıl Bilge Örüm
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556
```

---

## 5. Outreach ve Satış Şablonları Kütüphanesi (Templates)

### Şablon: Şablon A (Animal Market & Manuel Teyit Yapan Mağazalar) (`sablon-a`)

- **Kategori:** `first_touch`
- **E-posta Konusu (Subject):** `Automatizacija provere adrese i potvrde za {{STORE_NAME}} (WooCommerce)`

**Şablon Metni:**

```text
Poštovani,

Na vašem sajtu piše da vaš tim nakon porudžbine kontaktira kupce radi potvrde porudžbine i isporuke. Kod plaćanja pouzećem to je ručni posao za svaku porudžbinu, a pogrešna adresa se često otkrije tek kada je kurir već krenuo.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji taj korak radi automatski: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: dve nedelje, besplatno, na stvarnim porudžbinama. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl, pa vam šaljem detalje.

Srdačan pozdrav,
Atıl Bilge Örüm
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556
```

---

### Şablon: Şablon A Takip (24-48 Saat Hatırlatma / 30 Sn Demo) (`sablon-a-followup`)

- **Kategori:** `followup`
- **E-posta Konusu (Subject):** `Re: Automatizacija provere adrese i potvrde za {{STORE_NAME}} (WooCommerce)`

**Şablon Metni:**

```text
Poštovani,

Znam da vam je radno vreme puno pakovanja i obrade porudžbina, pa ću biti sasvim kratak.

Testiranje ne zahteva nikakve izmene na vašem sajtu niti tehničke rizike. Ako vas zanima samo da vidite kratak primer (30 sekundi) kako to izgleda na telefonu kupca pre nego što kurir uopšte preuzme paket, mogu vam poslati link?

Pozdrav,
Atıl
```

---

### Şablon: Şablon B1 (Fashion Store - Butik & Çift Yönlü Kargo Riski) (`sablon-b-fashion`)

- **Kategori:** `first_touch`
- **E-posta Konusu (Subject):** `Potvrda adrese za porudžbine pouzećem, Fashion Store`

**Şablon Metni:**

```text
Poštovani,

Video sam da pored radnje u Čačku imate i online prodavnicu sa plaćanjem pouzećem. Svaki nepreuzet paket znači plaćenu dostavu u oba smera i artikal koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije (šta pre istekne). Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556
```

---

### Şablon: Şablon B2 (Šifonjer - İkinci El / 1-of-1 Tekil Ürün Kaybı) (`sablon-b-sifonjer`)

- **Kategori:** `first_touch`
- **E-posta Konusu (Subject):** `Potvrda adrese za porudžbine pouzećem, Šifonjer`

**Şablon Metni:**

```text
Poštovani,

Video sam da prodajete polovnu firmiranu garderobu uz plaćanje pouzećem. Kod polovne garderobe je svaki komad jedinstven, pa nepreuzet paket znači plaćenu dostavu u oba smera i komad koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li biste bili zainteresovani? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556
```

---

### Şablon: Şablon B3 (Fermini - Geniş Katalog & Kurye Çıkışı Yanlış Adres) (`sablon-b-fermini`)

- **Kategori:** `first_touch`
- **E-posta Konusu (Subject):** `Potvrda adrese za porudžbine pouzećem, Fermini`

**Şablon Metni:**

```text
Poštovani,

Video sam da imate širok asortiman odeće i tekstila uz plaćanje pouzećem. Pogrešna adresa se često otkrije tek kada je kurir već krenuo, a to znači nepreuzet paket i plaćenu dostavu u oba smera.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556
```

---

### Şablon: Şablon C (Genel WooCommerce / Yüksek Desi & Kapıda Ödeme) (`sablon-general-custom`)

- **Kategori:** `first_touch`
- **E-posta Konusu (Subject):** `potvrda adrese za porudžbine pouzećem, {{STORE_NAME}}`

**Şablon Metni:**

```text
Poštovani,

Video sam da {{STORE_NAME}} ima aktivan WooCommerce sa plaćanjem pouzećem. Kod slanja pouzećem svaki nepreuzet paket znači plaćenu dostavu u oba smera i robu koja danima ne može da se proda drugom kupcu.

Razvijam Potvrdio, dodatak za WooCommerce koji pre slanja paketa kupcu šalje poruku sa jednim klikom za potvrdu ili ispravku adrese, kako bi se smanjio broj nepreuzetih paketa. Trenutno tražim nekoliko prodavnica za zatvorenu beta verziju, besplatno za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije.

Ako vam je zanimljivo, rado ću vam poslati link sa kratkim objašnjenjem kako funkcioniše.

Srdačan pozdrav,

Atil Bilge Orum
potvrdio.online
Novi Sad
Tel: +381 61 603 6556
```

---

### Şablon: Comfortino Özel: Sabit 250 RSD Kargo Sübvansiyonu & Desi Riski (`custom-comfortino`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `dostava i potvrda adrese, comfortino`

**Şablon Metni:**

```text
Poštovani,

Video sam da Comfortino isporučuje putem AKS kurira. Kod obuće svaki nepreuzet paket znači plaćenu dostavu u oba smera i par cipela koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio, dodatak za WooCommerce koji pre slanja paketa kupcu šalje poruku sa jednim klikom za potvrdu ili ispravku adrese, kako bi se smanjio broj nepreuzetih paketa. Trenutno tražim nekoliko prodavnica za zatvorenu beta verziju, besplatno za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije.

Ako vam je zanimljivo, rado ću vam poslati link sa kratkim objašnjenjem kako funkcioniše.

Srdačan pozdrav,

Atil Bilge Orum
potvrdio.online
Novi Sad
Tel: +381 61 603 6556
```

---

### Şablon: Pet Zoo Shop: 15 kg Mama Çuvalları & BEX Kargo Maliyeti (`custom-petzooshop`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `džakovi od 15 kg i nepreuzeti paketi, Pet Zoo Shop`

**Şablon Metni:**

```text
Poštovani,

Video sam da Pet Zoo Shop šalje džakove hrane od 14 do 15 kg putem BEX-a, uz besplatnu dostavu preko 6.000 RSD. Kod tako teških paketa jedan nepreuzet džak znači plaćenu dostavu u oba smera, što može da pojede zaradu sa cele porudžbine.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Perbipharm: Veteriner İlaç/Besin Hassasiyeti & AKS Kurye (`custom-perbipharm`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `potvrda adrese pre slanja AKS-om, Perbipharm`

**Şablon Metni:**

```text
Poštovani,

Video sam da Perbipharm šalje veterinarske preparate i dijetetsku hranu putem AKS-a. Kod takvih proizvoda pogrešna adresa ili nepreuzet paket znači ne samo dupli trošak dostave, već i kupca koji čeka hranu ili terapiju za svog ljubimca.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Lekiko: Kragujevac Yerel Butik & Manuel Arama Yükü (`custom-lekiko`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `manje zvanja oko porudžbina, Lekiko`

**Şablon Metni:**

```text
Poštovani,

Video sam da Lekiko iz Kragujevca šalje opremu i hranu za ljubimce pouzećem širom Srbije. Ako vaš tim ručno zove kupce radi provere porudžbine, taj posao može da preuzme automatska poruka, a vi šaljete samo potvrđene porudžbine.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Fitaky: Bebek/Anne Kozmetiği & Kurye Adres Notu (`custom-fitaky`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `dostava mamama sa bebama, Fitaky`

**Şablon Metni:**

```text
Poštovani,

Pratim Fitaky i vašu prirodnu kozmetiku za bebe i mame. Kod dostave porodicama sa malom decom često se desi da niko nije kod kuće kada kurir stigne, pa se paket vrati uz dupli trošak dostave. Potvrda adrese pre slanja to smanjuje.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Eridan: 3-7 Günlük Teslimat Süresinde Vazgeçme Riski (`custom-eridan`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `rok isporuke 3-7 dana i pouzeće, Eridan`

**Şablon Metni:**

```text
Poštovani,

Video sam da za Eridan preparate navodite rok isporuke od 3 do 7 radnih dana. Kod pouzeća, što je rok duži, to je veća šansa da kupac zaboravi porudžbinu ili ne bude kod kuće kada kurir stigne. Potvrda odmah posle porudžbine i pre slanja to smanjuje.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Čarna: Radan Dağı Melisa Butik Üretim & Post Express (`custom-carna`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `Post Express i pouzeće, Čarna`

**Şablon Metni:**

```text
Poštovani,

Pročitao sam priču o vašoj plantaži matičnjaka na Radan planini. Kod ručno rađene kozmetike svaki paket koji se vrati preko Post Expressa znači poštarinu u oba smera i proizvod koji je bio na putu umesto kod kupca.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Pura Home Spa: Marija Hanım & 4.500 RSD Ücretsiz Kargo Riski (`custom-purahomespa`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `besplatna dostava iznad 4.500 RSD, Pura Home Spa`

**Şablon Metni:**

```text
Poštovana gospođo Đukić,

Pratim rad Pura Home Spa i video sam da nudite besplatnu dostavu iznad 4.500 RSD. Pošto se difuzori i spa proizvodi često kupuju kao poklon, teže je da kurir stigne do pravog primaoca. Jedan vraćen paket znači plaćenu dostavu u oba smera i briše profit cele porudžbine.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Pravi Alati: Ingco Takım Çantaları & Ağır Desi Navlun Riski (`custom-pravialati`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `Ingco alati pouzećem, Pravi Alati`

**Şablon Metni:**

```text
Poštovani,

Video sam da Pravi Alati prodaje Ingco električni alat pouzećem. Kod teških kofera i mašina vraćen paket znači skupu povratnu poštarinu, a alat danima kruži umesto da bude kod kupca. Potvrda porudžbine i adrese pre slanja štiti vas od toga.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: AC Vinulović: Negotin Lastik/Akü Kargo Ağırlığı & Çift Yönlü İade (`custom-ac-vinulovic`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `gume i akumulatori pouzećem, AC Vinulović`

**Şablon Metni:**

```text
Poštovani,

Video sam da iz Negotina šaljete gume i akumulatore širom Srbije. Kod gabaritnih i teških paketa poštarina je visoka, pa jedan nepreuzet paket do Negotina znači veliki trošak. Potvrda kupca i adrese pre slanja štedi taj trošak.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Kanin Obuća: Niş El Yapımı Hakiki Deri & 12.000 RSD Sepet (`custom-kaninobuca`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `ručno rađena obuća i pouzeće, Kanin Obuća`

**Şablon Metni:**

```text
Poštovani,

Video sam da Kanin iz Niša prodaje ručno rađenu kožnu obuću, uz besplatnu dostavu preko 12.000 RSD. Kod porudžbina te vrednosti nepreuzet paket znači plaćenu dostavu u oba smera i par cipela koji je danima van prodaje.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Ljuba 024: Subotica Demon Tırpan/Testere & Ağır Makine Kargo Riski (`custom-ljuba`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `trimeri i motorne testere pouzećem, Ljuba 024`

**Şablon Metni:**

```text
Poštovani,

Video sam da Ljuba 024 iz Subotice prodaje Demon trimere i motorne testere, uz besplatnu dostavu za tri artikla preko 7.000 RSD. Kod mašina od 8 do 10 kg povratna poštarina je visoka, pa jedna nepreuzeta porudžbina pojede zaradu.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Backup Shop: Zrenjanin Butik, 24-48 Saat Telefon Teyidi & Post Express / AKS (`custom-backupshop`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `telefonska provera porudžbina i Post Express, BackUp Shop`

**Şablon Metni:**

```text
Poštovani gospodine Veselinoviću,

Video sam da na sajtu navodite da vaš prodavac nakon porudžbine telefonom kontaktira svakog kupca radi provere podataka, što može potrajati 24 do 48 sati. Kod brendiranih tašni i garderobe koje šaljete putem Post Expressa i AKS-a, taj ručni rad i čekanje na poziv mogu da zamene automatske poruke, a vi šaljete samo proverene pakete.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Backup Shop Takip (Follow-up): 24-48 Saat Arama Süresi & 30 Sn Demo Linki (`custom-backupshop-followup`)

- **Kategori:** `followup`
- **E-posta Konusu (Subject):** `Re: Automatizacija provere adrese i potvrde za BackUp Shop (WooCommerce)`

**Şablon Metni:**

```text
Poštovani gospodine Veselinoviću,

Samo kratko da se nadovežem na prethodni mejl. Ako vam je lakše da prvo vidite kako izgleda, ovde je kratak prikaz (30 sekundi):
https://potvrdio.online/kako-funkcionise

Za Backup Shop ovo znači da vaš prodavac ne mora ručno da zove kupce 24 do 48 sati nakon porudžbine — kupac jednim klikom potvrdi adresu na SMS-u, a vi šaljete samo proverene pakete Post Expressom i AKS-om.

Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza. Dovoljno je samo da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: B Plus (Nameštaj Bplus): Kişiselleştirilmiş Kanca & Düşük Sürtünmeli CTA (`custom-bplus`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `isporuka nameštaja i adresa pre slanja, Bplus`

**Şablon Metni:**

```text
Poštovani,

Video sam da Nameštaj Bplus šalje kompletan nameštaj za dom širom Srbije. Kod tako gabaritnih i teških paketa, pogrešna adresa ili kupac koji nije kod kuće znači ogroman logistički trošak i povratnu vožnju, što direktno ugrožava maržu.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Boss Shop (B.O.S. Shop): Kişiselleştirilmiş Kanca & Düşük Sürtünmeli CTA (`custom-bosshop`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `paketi do 50 kg i besplatna dostava, B.O.S. Shop`

**Şablon Metni:**

```text
Poštovani,

Video sam da B.O.S. Shop nudi besplatnu dostavu za porudžbine preko 15.000 RSD do čak 50 kg težine. Kod teških alata i mašina povratni paket stvara izuzetno visoku poštarinu u oba smera, koja može potpuno da obriše zaradu sa te prodaje.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Djomla Bike: Kişiselleştirilmiş Kanca & Düşük Sürtünmeli CTA (`custom-djomlabike`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `slanje bicikala i besplatna dostava preko 8.000 RSD, Djomla Bike`

**Şablon Metni:**

```text
Poštovani,

Video sam da Djomla Bike iz Čačka nudi besplatnu dostavu za porudžbine bicikala i opreme preko 8.000 RSD. Kod bicikala su kutije izuzetno gabaritne (veliki desi), pa jedan nepreuzet paket stvara skupu povratnu poštarinu i danima drži bicikl van prodaje.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Lux Shop: Kişiselleştirilmiş Kanca & Düşük Sürtünmeli CTA (`custom-luxshop`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `pouzeće i smanjenje nepreuzetih paketa, Lux Shop`

**Şablon Metni:**

```text
Poštovani,

Video sam da Lux Shop ima preko 2.000 artikala i da se većina porudžbina šalje pouzećem uz brzu isporuku od 1-3 dana. Kod takvog asortimana neozbiljne porudžbine i nepreuzeti paketi donose stalne troškove duple poštarine, a potvrda pre slanja to rešava.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Salon Info: Kişiselleştirilmiş Kanca & Düşük Sürtünmeli CTA (`custom-saloninfo`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `profesionalna kozmetika i sigurnija dostava, Salon Info`

**Şablon Metni:**

```text
Poštovani,

Video sam da Salon Info snabdeva frizerske i kozmetičke salone profesionalnim preparatima širom Srbije. Kod narudžbina za salone i teških paketa, pogrešna adresa ili odsutan primalac stvara trošak duple poštarine i remeti rad frizera koji čekaju robu.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Kozmetika Moja: Kişiselleştirilmiş Kanca & Düşük Sürtünmeli CTA (`custom-kozmetikamoja`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `besplatna dostava preko 5.000 RSD i BEX, Kozmetika Moja`

**Şablon Metni:**

```text
Poštovani,

Pratim rad brenda Kozmetika Moja i video sam da nudite besplatnu dostavu preko 5.000 RSD putem BEX-a. Kod prirodne kozmetike i roka isporuke od 3 do 5 dana, jedan nepreuzet paket na pouzeću znači plaćenu poštarinu u oba smera i briše zaradu cele porudžbine.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Ollie's: Jelena Savić, Deda Sava Mirası, Cam Şişe Zeytinyağı & 10.000 RSD Kargo (`custom-ollies`)

- **Kategori:** `custom_tailored`
- **E-posta Konusu (Subject):** `priča o dedi Savi, maslinovo ulje i nepreuzeti paketi, Ollie's`

**Şablon Metni:**

```text
Poštovana Jelena,

Pročitao sam priču o vašem dedi Savi i maslinjaku od 700 stabala. Kod prirodne kozmetike i vrhunskog maslinovog ulja u staklenoj ambalaži, svaki paket koji se vrati na pouzeću ne znači samo dupli trošak dostave (posebno uz besplatnu dostavu preko 10.000 RSD), već i rizik od oštećenja proizvoda koji danima putuje umesto da bude kod kupca.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
```

---

### Şablon: Kocke.rs Özel Şablonu (Oyuncak & Çocuk) (`custom-kocke`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `potvrda adrese za porudžbine pouzećem, Kocke.rs`

**Şablon Metni:**

```text
Primetio sam da Kocke.rs ima odličan izbor Lego setova i dečijih igračaka uz plaćanje pouzećem. Kod igračaka i poklona, kupci često u trenutku poruče na brzinu, a kada kurir stigne desi se da paket ostane nepreuzet — što vam stvara dvostruku poštarinu i rizik da se originalna kutija ošteti u povratu.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Silver and Fashion Özel Şablonu (Gümüş Takı & Novi Sad) (`custom-silverandfashion`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka nakita pouzećem i potvrda adrese, Silver and Fashion`

**Şablon Metni:**

```text
Kao komšija iz Novog Sada, pratim prelep rad Silver and Fashion tima sa srebrnim nakitom. Pošto za porudžbine preko 3.000 RSD nudite besplatnu dostavu preko Post Express-a, nepreuzeti paketi i netačne adrese prave dvostruki trošak koji direktno jede zaradu na ručno pravljenim komadima.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Ljuljuška Özel Şablonu (Bebek Salıncakları) (`custom-ljuljuska`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `dostava Ljuljuški i adresa pre slanja, Ljiljana`

**Şablon Metni:**

```text
Poštovana Ljiljana, vidim sa koliko ljubavi i pažnje izrađujete Ljuljuške za najmlađe i šaljete ih pouzećem preko Post Express-a. Kod tako specifičnih i kabastih tekstilnih paketa, nepreuzeta pošiljka ili pogrešno uneta adresa znači plaćanje dvostruke poštarine i nepotrebno habanje unikatnog proizvoda u transportu.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Prodaja Parfema Özel Şablonu (Parfüm & Kozmetik) (`custom-prodajaparfema`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `nepreuzeti paketi parfema i provera adrese pre slanja, Prodaja Parfema`

**Şablon Metni:**

```text
Video sam da na Prodaja Parfema nudite besplatnu dostavu preko 4.000 RSD i brzu isporuku pouzećem. U industriji parfema dobro je poznato koliko impulsivnih kupaca poruči pouzećem pa se predomisli dok kurir stigne, što vam stvara dupli trošak kurirske službe i nepotrebno zadržava vredan lager u kombiju.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: AS Ribolov Özel Şablonu (Balıkçılık & Kamp) (`custom-asribolov`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka ribolovačke opreme pouzećem i tačnost adrese, AS Ribolov`

**Şablon Metni:**

```text
Primetio sam da AS Ribolov šalje vrhunski ribolovački pribor i štapove pouzećem širom Srbije. Kod dugačkih štapova i teže opreme do 20kg, kurirske službe naplaćuju posebne gabarite, pa svaka pogrešna adresa ili nepreuzet paket donosi ogroman nepotreban trošak povratne poštarine.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Mey Home Özel Şablonu (Ev Tekstili & Halı) (`custom-meyhome`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka posteljina i tepiha pouzećem, Mey Home`

**Şablon Metni:**

```text
Video sam bogatu ponudu posteljina i tepiha na Mey Home shopu i da pošiljke šaljete pouzećem preko Bex-a. Kod tako kabastih i teških paketa kućnog tekstila, nepreuzeta pošiljka ili pogrešno upisan broj stana znači plaćanje skupe povratne vožnje i zadržavanje robe.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Kafa Amigo Özel Şablonu (Taze Kahve & Sombor) (`custom-kafaamigo`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `sveže pržena kafa i potvrda adrese pre slanja, Milane`

**Şablon Metni:**

```text
Poštovani Milane, vidim sa koliko pažnje Amigo Kafa prži svežu kafu i espresso kapsule i šalje ih ljubiteljima kafe pouzećem. Kod sveže kafe, svaki nepreuzet paket koji danima putuje po kurirskim magacinima ne samo da donosi dupli trošak dostave, već i gubi onaj vrhunski kvalitet i svežinu arome.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Amelles Kozmetika Özel Şablonu (Doğal Kozmetik) (`custom-amelles`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka Amelles kozmetike pouzećem i tačnost adrese, Amelles`

**Şablon Metni:**

```text
Primetio sam prelepu liniju prirodne mineralne kozmetike na Amelles shopu i da za veće porudžbine nudite besplatnu isporuku pouzećem. Kod staklenih bočica i osetljivih seruma, nepreuzet paket ili netačna adresa ne samo da stvara dupli trošak transporta, već izlaže unikatne preparate nepotrebnom tumbanju po kurirskim vozilima.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Gifts 4 You Özel Şablonu (Kişiye Özel Hediye) (`custom-gifts4you`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `personalizovani pokloni pouzećem i adresa pre slanja, Gifts 4 You`

**Şablon Metni:**

```text
Primetio sam sjajne personalizovane poklone koje Gifts 4 You izrađuje i šalje pouzećem. Kod unikatnih predmeta sa imenom i posvetom, nepreuzet paket je stopostotni gubitak — ne samo da plaćate dvostruku poštarinu, već taj proizvod više nikome drugom ne možete prodati.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Poklondžija Özel Şablonu (Hediye Sepetleri) (`custom-poklondzija`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `dostava poklon korpi pouzećem i tačnost adrese, Poklondžija`

**Şablon Metni:**

```text
Video sam prelepe poklon korpe i aranžmane koje Poklondžija šalje na adrese širom Beograda i Srbije. Kod poklona i poslastica, nepreuzet paket ili netačna adresa znači ne samo dupli trošak kurira, već i rizik da se delikatesni sadržaj ošteti ili vrati pre nego što stigne do slavljenika.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Pokupi.rs Özel Şablonu (Ev & Bahçe Aletleri) (`custom-pokupi`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka baštenskih alata pouzećem i adresa pre slanja, Pokupi.rs`

**Şablon Metni:**

```text
Primetio sam široku ponudu alata i opreme za kuću i baštu na Pokupi.rs uz opciju plaćanja pouzećem. Kod teže i kabaste opreme, svaki nepreuzet paket ili pogrešan kontakt telefon donosi vam nepotreban trošak dvostruke poštarine i zadržava robu u povratku.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Konga Music Özel Şablonu (Müzik Aletleri & Novi Sad) (`custom-kongamusic`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka muzičkih instrumenata pouzećem i potvrda adrese, Konga Music`

**Şablon Metni:**

```text
Kao komšija iz Novog Sada, pratim ponudu muzičkih instrumenata u Konga Music shopu. Kod gitara, klavijatura i osetljive audio opreme, nepreuzet paket donosi ogroman nepotreban rizik oštećenja skupih instrumenata u transportu, uz plaćanje dvostruke kurirske poštarine.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Street Moto Shop Özel Şablonu (Moto Kask & Ekipman) (`custom-streetmotoshop`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka moto kaciga i opreme pouzećem, Street Moto Shop`

**Şablon Metni:**

```text
Primetio sam odličan asortiman moto kaciga i opreme na Street Moto Shopu uz mogućnost plaćanja pouzećem. Kod kaciga i jakni kutije su kabaste i nose visoke gabarite kod kurira, pa svaki nepreuzet paket stvara skup dupli transport i nepotrebno blokira tražene veličine na lageru.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Isiland Özel Şablonu (Organik Bebek Giyim) (`custom-isiland`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka bebi garderobe pouzećem i potvrda adrese, Isiland`

**Şablon Metni:**

```text
Vidim sa koliko pažnje Isiland kreira organsku garderobu za bebe i decu i šalje je pouzećem. Kod kupovine za najmlađe, netačna adresa ili nepreuzet paket stvara dvostruki trošak dostave i nepotrebno zadržava fine pamučne komade po kurirskim vozilima umesto da stignu do roditelja.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Kolibri BEBE Shop Özel Şablonu (Bebek Tekstili) (`custom-kolibribebeshop`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka bebi opreme pouzećem i tačnost adrese, Kolibri Bebe Shop`

**Şablon Metni:**

```text
Primetio sam da Kolibri BEBE Shop uspešno posluje kao čista online prodavnica i šalje prelepu bebi opremu pouzećem preko Bex-a. Kod isključivo internet trgovine, nepreuzeti paketi donose čist logistički trošak dvostrukog prevoza, posebno kod kabastih kompleta za bebe.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Medenjaci.rs Özel Şablonu (Ručno Rađeni Medenjaci) (`custom-medenjaci`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka unikatnih medenjaka pouzećem i potvrda adrese, Biljana`

**Şablon Metni:**

```text
Vidim sa koliko majstorstva i ljubavi ukrašavate domaće medenjake za rođendane i venčanja i šaljete ih pouzećem. Kod unikatnih i jestivih poslastica, nepreuzet paket je stopostotna šteta — proizvod više ne možete iskoristiti, a plaćate dvostruku poštarinu kuriru.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Afa Baby Shop Özel Şablonu (Bebek Arabaları & Oprema) (`custom-afababy`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka bebi kolica pouzećem i tačnost adrese, Afa Baby`

**Şablon Metni:**

```text
Primetio sam odličnu ponudu kolica za bebe i auto sedišta na Afa Baby Shopu uz opciju plaćanja pouzećem. Kod velikih i kabastih kutija za bebe, svaki nepreuzet paket ili pogrešno unet broj stana donosi ozbiljan trošak dvostrukog transporta i zadržava robu u kurirskim magacinima.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Portobello Poklon Korpe Özel Şablonu (Hediye Sepetleri) (`custom-poklonkorpe`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `dostava poklon korpi pouzećem i tačnost adrese pre slanja, Portobello`

**Şablon Metni:**

```text
Video sam prelepo aranžirane poklon korpe i poslovne aranžmane na Poklonkorpe.rs. Kod korpi sa vinom i slatkišima, nepreuzeta pošiljka ili netačna adresa ne samo da stvara trošak duple dostave, već nosi rizik oštećenja stakla i kvari ceo trenutak slavljeniku.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Mediflora Biljna Apoteka Özel Şablonu (Bitkisel Damlalar) (`custom-mediflora`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka Mediflora biljnih kapi pouzećem i tačnost adrese, Mediflora`

**Şablon Metni:**

```text
Primetio sam dugu tradiciju i vrhunski asortiman biljnih kapi i tinktura u Mediflora biljnoj apoteci uz slanje pouzećem. Kod prirodnih preparata u staklu, nepreuzeta pošiljka donosi plaćanje duple poštarine kuriru i nepotrebno izlaže osetljive bočice sarkanju po magacinima.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Izaberi Poklon Özel Şablonu (Kişiye Özel Hediyeler) (`custom-izaberipoklon`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `personalizovani pokloni pouzećem i adresa pre slanja, Izaberi Poklon`

**Şablon Metni:**

```text
Primetio sam sjajne personalizovane poklone i plišane igračke sa štampom na Izaberi Poklon shopu. Kod personalizacije sa imenom i fotografijom kupca, svaki paket koji se vrati nepreuzet je čist gubitak robe koja više nema kome da se proda, uz plaćanje dvostrukog prevoza.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Gravura.rs Özel Şablonu (Lazer Ahşap Gravür) (`custom-gravura`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka unikatnih graviranih poklona pouzećem, Gravura.rs`

**Şablon Metni:**

```text
Vidim sa koliko preciznosti izrađujete gravirane drvene kutije i unikatne poklone na Gravura.rs. Kod proizvoda na kojima je trajno urezana lična posveta, nepreuzet paket je stopostotni gubitak — robu više niko ne može kupiti, a plaća se i dupla poštarina kuriru.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Štampane Majice Özel Şablonu (Özel Baskılı Tişörtler) (`custom-stampanemajice`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka štampanih majica pouzećem i potvrda adrese, Štampane Majice`

**Şablon Metni:**

```text
Primetio sam veliku ponudu kreativnih štampanih majica i dukseva na vašem shopu uz slanje pouzećem. Kod online prodaje garderobe sa štampom, impulsivne porudžbine gde kupac ne preuzme paket donose bespotreban trošak duple poštarine i drže robu danima u transportu.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Greenshop.rs Özel Şablonu (Doğal & Eko Kozmetik) (`custom-greenshop`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka prirodne kozmetike pouzećem i tačnost adrese, Greenshop`

**Şablon Metni:**

```text
Primetio sam impresivan asortiman sertifikovane prirodne kozmetike i preko 5.000 recenzija na Greenshop.rs uz opciju plaćanja pouzećem. Kod velikog mesečnog broja paketa, svaka netačno uneta adresa ili nepreuzeta pošiljka stvara ozbiljan logistički trošak i gomila povratne poštarine.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Slatkoteka ® Özel Şablonu (Günlük Taze Donut & Pastalar) (`custom-slatkoteka`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `dostava svežih krofni i torti i tačnost adrese pre slanja, Slatkoteka`

**Şablon Metni:**

```text
Kao ljubitelj slatkiša pratim neverovatan uspeh i prelepe krofne i torte koje Slatkoteka dostavlja širom Beograda. Kod svežih poslastica sa dnevnim rokom trajanja, nepreuzet paket ili netačan broj stana znači stopostotan otpis proizvoda koji više ne može da se vrati u vitrinu.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

### Şablon: Pikshop Özel Şablonu (Ahşap Oyuncaklar & Mutfaklar) (`custom-pikshop`)

- **Kategori:** `custom`
- **E-posta Konusu (Subject):** `isporuka drvenih igračaka pouzećem i potvrda adrese, Pikshop`

**Şablon Metni:**

```text
Video sam bogatu ponudu drvenih igračaka, kuhinjica i kućica za lutke na Pikshop.rs. Kod teških i masivnih paketa igračaka, nepreuzeta pošiljka donosi plaćanje skupe duple poštarine kuriru i rizik da se originalna kutija ošteti u povratnom transportu.

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
```

---

