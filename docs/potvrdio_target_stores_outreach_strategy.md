# Potvrdio (potvrdio.online) · Sırbistan WooCommerce Kapalı Beta Outreach Stratejisi

> **Doküman Türü:** Saha Analizi, Öncelikli Çalışma Listesi ve Kapalı Beta Stratejisi  
> **Konum:** Novi Sad, Sırbistan  
> **Ürün Fazı:** Kapalı Beta (Closed Beta / Tasarım Ortaklığı)  
> **Pilot Teknolojisi:** WooCommerce Eklentisi + SMS (Tek Kullanımlık Onay/Düzeltme Linki)  
> **Tarih:** Ekim 2026  

---

## 1. Stratejik Konumlandırma ve Temel İlkeler

### 1.1 Dürüst Konumlandırma: "Yazılım Satışı" Değil, "3–5 Mağaza ile Kapalı Test"
* Potvrdio erken aşamadadır (Early Stage). Piyasaya *"yüzlerce mağazada çalışan SaaS"* diliyle çıkmak güveni zedeler.
* Mağazalara yaklaşım: **"Novi Sad'da WooCommerce için sipariş doğrulama eklentisi geliştiriyorum. İlk kapalı test için 3 ila 5 mağaza arıyorum."**
* Mağaza sahibi bir müşteri değil, ürünün ilk kullanıcı geri bildirimini veren bir **Tasarım Ortağı**dır.

### 1.2 Hipotezler ve Gerçekçi Kapsam
* **Piyasa Durumu:** Sırbistan'da e-ticaret teslimatlarında kapıda nakit ödeme (*plaćanje pouzećem*) ağırlıklı yöntemdir.
* **Hipotez 1 (İade Oranı):** Müşteri kargoya çıkmadan önce SMS ile bilgilendirilip adresini teyit ettiğinde, teslim alınmayan paket (*nepreuzeti paketi*) oranının düşürülebileceği hedeflenmektedir.
* **Hipotez 2 (Manuel İş Yükü):** Sipariş sonrasında müşteriye mesaj atarak teyit yapan mağazalarda **onay ve adres düzeltme kısmı** otomatikleşir.  
  *(Not: Teslimat süresi bilgisi veya stok teyidi eklentinin kapsamında değildir; Potvrdio yalnızca sipariş teyidi ve adres doğrulamasını otomatikleştirir).*

### 1.3 Asgari Sipariş Hacmi Kriteri (Ölçülebilirlik Şartı)
* 2 haftalık bir kapalı test sürecinde ölçülebilir ve anlamlı veri elde edebilmek için aday mağazanın **ayda en az 50–100 kapıda ödeme siparişi** alması gerekir.
* Ayda 5–10 sipariş alan çok küçük butikler 2 haftada istatistiksel sonuç üretmez.

---

## 2. Mesajlaşma Mimarisi (Pilot Fazı)

* **Birincil Kanal (Pilot):** SMS Metin Mesajı.
  * *İçerik:* Sipariş tutarı, teslimat adresi özeti ve tek kullanımlık dinamik onay/düzeltme linki (`https://potvrdio.online/edit?...`).
  * *İşleyiş:* Müşteri linke tıkladığında açılan hafif mobil sayfada adresi onaylar veya günceller.
  * *Sipariş Durumu:* Müşteri onaylayana kadar sipariş WooCommerce panelinde `On-Hold` (Beklemede) kalır.
* **Gelecek Faz (Viber Entegrasyonu):** Viber Business API entegrasyonu tamamlandığında sistem Viber-öncelikli, SMS-fallback mimarisine geçirilecektir. Pilot aşaması doğrudan SMS ile yürütülmektedir.

---

## 3. Öncelikli Çalışma Listesi (15 Doğrulanmış Mağaza)

> **Kabul Kriterleri:**
> 1. WooCommerce altyapısı canlı ve teyitli.
> 2. Kapıda nakit ödeme (*plaćanje pouzećem*) seçeneği aktif.
> 3. Sitede kamuya açık, taranarak doğrulanmış **gerçek kurumsal e-posta adresi** mevcut.
> 4. Ağır kurumsal holding veya distribütör değil; hızlı karar alabilecek bağımsız e-ticaret işletmesi.
> 5. Yeterli sipariş hacmi potansiyeli olan aktif ürün kataloğu.

| Sıra | Mağaza & Web Sitesi | Sektör / Niş | Doğrulanmış İletişim | Sahadaki Durum ve İnceleme Notu |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **[animalmarket.rs](https://animalmarket.rs)** | Pet Shop & Hayvan Yemi | **`shop@animalmarket.rs`**<br>Tel: +381 63 824 66 89 | **Sitede Açık Bilgi:** Sipariş sonrası ekibin mesajla (*putem poruke*) teyit ettiği yazıyor. Ödeme şu an sadece kapıda. Kanca: **Mesajla yapılan onay ve adres kontrolü kısmını otomatikleştirelim.** |
| **2** | **[fashionstore.rs](https://fashionstore.rs)** | Kadın Giyim & Butik *(Čačak)* | **`info@fashionstore.rs`**<br>Tel: 064/307-19-52 | **Fiziksel Butik + Online:** Čačak'ta mağazası ve aktif WooCommerce sepeti var. Sitedeki hat doğrudan 064/307-19-52. [Hipotez: Giyimde beden tereddüdü kaynaklı iadeler önlenebilir]. |
| **3** | **[sifonjer.rs](https://sifonjer.rs)** | Polovna Firmirana Garderoba | **`podrska@sifonjer.rs`** | **Aktif İkinci El / Moda:** Aktif WooCommerce sepeti ve kapıda ödeme. [Hipotez: Tekil ürün stoklarında paket iadesi doğrudan satış kaybıdır]. |
| **4** | **[fermini.rs](https://fermini.rs)** | Giyim & Tekstil | **`info@fermini.rs`**<br>Tel: +381 64 032 3362 | **Giyim Kataloğu:** Geniş ürün gamı, aktif WooCommerce sepeti ve kapıda nakit ödeme. |
| **5** | **[comfortino.rs](https://comfortino.rs)** | Anatomik & Medikal Ayakkabı | **`obuca.comfortino@gmail.com`** | **Niş Ayakkabı:** Aktif WooCommerce mağazası. [Hipotez: Ayakkabı kutularının kargo desisi yüksek olduğundan teslimat onayı satıcıyı korur]. |
| **6** | **[petzooshop.rs](https://petzooshop.rs)** | Pet Shop & Mama | **`info@petzooshop.rs`**<br>Tel: +381 63 455 955 | **Pet Ürünleri:** Aktif WooCommerce sepeti ve kapıda ödeme. [Hipotez: Ağır mama çuvallarının gidiş-dönüş kargo maliyeti yüksektir]. |
| **7** | **[perbipharm.rs](https://perbipharm.rs)** | Veteriner Eczane & Pet Hrana | **`office@perbipharm.rs`**<br>Tel: +381 63 692 229 | **Veteriner Ürünleri:** Aktif WooCommerce e-ticaret akışı ve kapıda nakit ödeme. |
| **8** | **[lekiko.rs](https://lekiko.rs)** | Pet Shop *(Kragujevac)* | **`info@lekiko.rs`**<br>Tel: +381 63 224 490 | **Bölgesel Pet Shop:** Kragujevac merkezli, Sırbistan geneline kapıda ödeme ile gönderim yapan aktif mağaza. |
| **9** | **[prodajaparfema.rs](https://prodajaparfema.rs)** | Parfüm | **`info@prodajaparfema.rs`**<br>Tel: 069/100-1996 | **Parfüm E-Ticaret:** Aktif WooCommerce sepeti. [Hipotez: Yüksek sepet tutarlı siparişlerde sahte alıcı filtresi sağlar]. |
| **10** | **[fitaky.rs](https://fitaky.rs)** | Doğal Bebek & Aile Kozmetiği | **`kontakt@fitaky.rs`**<br>Tel: +381 60 700 4033 | **D2C Doğal Kozmetik:** Temiz WooCommerce sepeti ve kapıda nakit ödeme. Anne-bebek odaklı yerel üretici. |
| **11** | **[eridan.rs](https://eridan.rs)** | Cilt Bakımı *(Eridan Green d.o.o.)* | **`info@eridan.rs`**<br>Tel: +381 65 20 54 710 | **D2C Kozmetik:** Patrijarha Varnave 48, Beograd adresli kayıtlı şirket. Aktif WooCommerce 11.2 sepeti ve kapıda ödeme. |
| **12** | **[carna.rs](https://carna.rs)** | El Yapımı Bitkisel Kozmetik | **`info@carna.rs`**<br>Tel: +381 64 030 5900 | **Butik Kozmetik:** Aktif WooCommerce mağazası. Sitede Post Express otkupnina şartları açıkça belirtilmiş. |
| **13** | **[purahomespa.rs](https://purahomespa.rs)** | Aromaterapi & Spa Ürünleri | **`purakozmetika@gmail.com`** | **Butik D2C:** Aktif WooCommerce sepeti ve kapıda nakit ödeme seçeneği. |
| **14** | **[pravialati.rs](https://pravialati.rs)** | Hobi & El Aletleri | **`info@pravialati.rs`**<br>Tel: +381 64 648 8279 | **Teknik Ekipman:** Aktif WooCommerce sepeti ve kapıda ödeme. Hırdavat ve el aletleri satışı. |
| **15** | **[ac-vinulovic.rs](https://ac-vinulovic.rs)** | Oto Lastik & Akü *(Negotin)* | **`shop@ac-vinulovic.rs`**<br>Tel: 062/815-7483 | **Oto Donanım:** Aktif WooCommerce sepeti. Ağır desi ürünlerde kapıda nakit ödeme sunuyor. |

---

### Özel Doğrulama Notları (Açıklığa Kavuşturulan Mağazalar)

* **Kanin Obuća (`kanin.rs` -> `kaninobuca.com`):**
  * Sitenin `/kontakt` sayfasındaki resmi adresi: *Miodraga Petrovića Čkalje 2, 18000 Niš*. Telefon: `+381 18 590 158`. E-posta: `info@kaninobuca.com`.
  * *(Önceki dokümandaki `+381 18 523 092` numarası firmanın TC Kalča'daki eski perakende dükkanına aitti; güncel merkez iletişim numarası 590 158'dir).*
* **Ljuba (`ljuba.rs`):**
  * Sitedeki e-posta `info@ljuba024.com`'dur. Neden alan adı uyuşmuyor: Şirketin Subotica'daki tescilli ticari unvanı **Ljuba 024 d.o.o.**dur (Subotica alan kodu 024'tür).

---

## 4. İkincil / Doğrulanmamış Havuz (Ayrı Takip)

Bu listedeki mağazalar öncelikli pilot çalışma listesine **alınmamıştır**. Gerekçeler:
1. **Açık E-posta Bulunmayanlar (Sadece Web Form / Telefon):** `backupshop.rs`, `jatfashion.rs`, `ollies.rs`, `bplus.rs`, `bosshop.rs`, `djomla-bike.rs`, `luxshop.rs`, `saloninfo.rs`, `kozmetikamoja.rs`.
2. **Kapalı Betaya Uygun Olmayan Distribütör / Büyük Şirketler:**
   * **`fagor.rs`:** Apejron d.o.o. (Coral Electric) 30 yıllık geçmişi, kendi servis ağı ve showroom'u olan büyük bir distribütördür. Erken aşama pilot için uygun değildir.
   * **`cfmotodelovi.rs`:** CFMOTO resmi parça operasyonu (Guevara d.o.o.) bünyesindedir; bağımsız küçük mağaza değildir.
   * **`pcgroup.rs`:** Peugeot/Citroen yedek parça distribütör yapısındadır.

---

## 5. Sahaya Dayalı Sırpça Kapalı Beta Outreach Şablonları

### Şablon A (Animal Market İçin — Gönderilen Gerçek E-posta):
**Alıcı:** `shop@animalmarket.rs`  
**Tarih / Saat:** 13 Ekim Salı, 10:06  
**Konu:** Automatizacija provere adrese i potvrde za Animal Market (WooCommerce)  

> Poštovani,
>
> Na vašem sajtu piše da vaš tim nakon porudžbine kontaktira kupce radi potvrde porudžbine i isporuke. Kod plaćanja pouzećem to je ručni posao za svaku porudžbinu, a pogrešna adresa se često otkrije tek kada je kurir već krenuo.
>
> Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji taj korak radi automatski: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).
>
> Tražim 3 do 5 prodavnica za zatvoreni beta test: dve nedelje, besplatno, na stvarnim porudžbinama. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl, pa vam šaljem detalje.
>
> Srdačan pozdrav,  
> **Atıl Bilge Örüm**  
> Potvrdio.online • Novi Sad  
> Tel: +381 61 603 6556  

#### Şablon A Takip Mesajı (Follow-up — 24-48 Saat Sonra Reply):
**Konu:** Re: Automatizacija provere adrese i potvrde za Animal Market (WooCommerce)  

> Poštovani,  
>
> Znam da vam je radno vreme puno pakovanja i obrade porudžbina, pa ću biti sasvim kratak.  
>
> Testiranje ne zahteva nikakve izmene na vašem sajtu niti tehničke rizike. Ako vas zanima samo da vidite kratak primer (30 sekundi) kako to izgleda na telefonu kupca pre nego što kurir uopšte preuzme paket, mogu vam poslati link?  
>
> Pozdrav,  
> Atıl

---


### Şablon B (Genel WooCommerce Mağazaları İçin):
**Alıcı:** `info@fashionstore.rs`, `info@prodajaparfema.rs`, `kontakt@fitaky.rs`, `podrska@sifonjer.rs`, `info@petzooshop.rs` vb.  
**Konu:** Potvrda adrese i smanjenje povrata paketa za [Ime Prodavnice] (WooCommerce test)

> Poštovani,
>
> Pratim [Ime Prodavnice] i vidim da uspešno vodite online prodaju na WooCommerce platformi uz opciju plaćanja pouzećem.
>
> Razvijam **Potvrdio** (potvrdio.online) — lagan WooCommerce dodatak namenjen smanjenju nepreuzetih paketa:
> 1. Kada kupac izabere plaćanje pouzećem, porudžbina ostaje na čekanju (*On-Hold*).
> 2. Kupac automatski dobija SMS poruku sa linkom gde jednim klikom proverava i potvrđuje adresu ili ispravlja broj stana i sprat.
> 3. Tek nakon potvrde, porudžbina prelazi u pripremu za slanje.
>
> Trenutno tražim 3 do 5 domaćih WooCommerce prodavnica za zatvoreno testiranje i zajedničko merenje rezultata.
>
> Da li biste bili otvoreni za kratak razgovor od 10 minuta da vam pokažem kako sistem funkcioniše u praksi?
>
> Srdačan pozdrav,  
> **Atıl Bilge Örüm**  
> Potvrdio.online • Novi Sad  
> Tel: +381 61 603 6556  
> podrska@potvrdio.online

---

## 6. Satış ve Uygulama Eylem Planı (Execution Playbook)

1. **Adım 1 — Animal Market Teması:** Şablon A ile `shop@animalmarket.rs` adresine ilk e-posta gönderildi (13 Ekim, 10:06).
2. **Adım 2 — Animal Market Takibi (Follow-up):** Gönderimden 24–48 saat sonra yanıt gelmediğinde:
   - **E-posta Yanıtı (Re:):** Şablon A altındaki sıfır sürtünmeli ("sadece 30 saniyelik link") takip mesajı atılır.
   - **Telefon Araması (En Etkili Yol):** Sitedeki iletişim numarasından aranarak yetkiliye bağlanılır: *"Dobar dan, Atil ovde iz Novog Sada. Poslao sam juče kratak mejl u vezi sa WooCommerce porudžbinama i telefonskom proverom adresa kupaca. Video sam da ručno zovete kupce za potvrdu adrese pre slanja paketa, pa sam samo hteo da pitam sa kim bih mogao ukratko popričati oko automatizacije tog koraka?"*
3. **Adım 3 — Öncelikli 14 Mağazaya Ulaşım:** Çalışma listesindeki (Kategori 3) doğrulanmış e-postası olan bağımsız mağazalara Şablon B ile kişiselleştirilmiş (mağaza adı ve sektörü eklenerek) e-postalar gönderilir.
4. **Adım 4 — Hacim Filtresi:** Yanıt veren mağazalarla görüşmede ilk soru: *"Ayda ortalama kaç kapıda ödeme siparişi alıyorsunuz?"* olmalıdır. Ayda en az 50 sipariş almayan mağazalar test sürecinde istatistiksel sonuç vermeyeceği için kibarca elenir.
5. **Hedef:** 15 odaklı mağazadan **3 ila 5 tasarım ortağını** kapalı test sürecine dahil etmek.

