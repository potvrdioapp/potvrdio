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
| **1** | **[animalmarket.rs](https://animalmarket.rs)** | Pet Shop & Hayvan Yemi | **`shop@animalmarket.rs`**<br>Tel: +381 63 824 66 89 | **Gönderildi (13 Ekim, 10:06).** Sitede açıkça sipariş sonrası mesajla teyit yapıldığı yazıyor. Kanca: Onay ve adres kontrolünü otomatikleştirme. |
| **2** | **[fashionstore.rs](https://fashionstore.rs)** | Kadın Giyim & Butik *(Čačak)* | **`info@fashionstore.rs`**<br>Tel: 064/307-19-52 | **Gönderildi (14 Ekim).** Čačak'ta fiziksel butik + online. Kanca: 2 yönlü kargo maliyeti ve ürünün raftan düşüp başkasına satılamaması. |
| **3** | **[sifonjer.rs](https://sifonjer.rs)** | Polovna Firmirana Garderoba | **`podrska@sifonjer.rs`** | **Gönderildi (14 Ekim).** İkinci el / tekil ürünler. Kanca: Her parça tek olduğu için iade sürecinde başkasına satılamayan ürün kaybı. |
| **4** | **[fermini.rs](https://fermini.rs)** | Giyim & Tekstil | **`info@fermini.rs`**<br>Tel: +381 64 032 3362 | **Gönderildi (14 Ekim).** Geniş giyim/tekstil kataloğu. Kanca: Kurye çıktıktan sonra fark edilen yanlış adres ve çift yönlü kargo maliyeti. |
| **5** | **[comfortino.rs](https://comfortino.rs)** | Anatomik & Medikal Ayakkabı | **`obuca.comfortino@gmail.com`**<br>Tel: 063 351 060 | **Gönderildi (15 Ekim, 11:00).** AKS kurye + ayakkabı kutusu desi ve çift yönlü iade navlunu kancası. 25 sipariş / 30 gün kapalı beta teklifi iletildi. |
| **6** | **[petzooshop.rs](https://petzooshop.rs)** | Pet Shop & Mama | **`info@petzooshop.rs`**<br>Tel: +381 63 455 955 | **BEX Kurye + 14-15 kg Mama Çuvalları:** Pro Plan ve Dog Chow 14-15 kg çuvalları BEX ile kapıda ödemeli gidiyor. Ağır çuvallarda nepreuzet paket navlunu en yüksek kargo grubudur. |
| **7** | **[perbipharm.rs](https://perbipharm.rs)** | Veteriner Eczane & Pet Hrana | **`office@perbipharm.rs`**<br>Tel: +381 63 692 229 | **AKS Kurye + Veteriner İlaç/Besin:** AS Iberian ve klinik mama ürünleri. Hassas veteriner ürünlerinin kuryede günlerce beklemesini ve adresteki hatayı önleme. |
| **8** | **[lekiko.rs](https://lekiko.rs)** | Pet Shop *(Kragujevac)* | **`info@lekiko.rs`**<br>Tel: +381 63 224 490 | **Kragujevac Bölgesel Pet Shop:** Kragujevac'tan Sırbistan geneline kapıda ödeme. Manuel telefonla arama/mesajla teyit yerine tek tıkla otomatik SMS teyidi. |
| **9** | **[prodajaparfema.rs](https://prodajaparfema.rs)** | Parfüm | **`info@prodajaparfema.rs`**<br>Tel: 069/100-1996 | **4.000 RSD Üzeri Ücretsiz Kargo + Orijinal Parfüm:** Yüksek sepet tutarı. Kapıda ödemede sahte/ciddiyetsiz alıcı filtresi ve yüksek değerli parfümlerin kuryede hasar/kayıp görmesini önleme. |
| **10** | **[fitaky.rs](https://fitaky.rs)** | Doğal Bebek & Aile Kozmetiği | **`kontakt@fitaky.rs`**<br>Tel: +381 60 700 4033 | **3.500 RSD Ücretsiz Kargo + Bebek/Anne Kozmetiği:** Bebekli annelerde uyku saati, bozuk interfon veya eksik kapı no nedeniyle kuryenin teslim yapamaması ve paketin geri dönmesi riski. |
| **11** | **[eridan.rs](https://eridan.rs)** | Cilt Bakımı *(Eridan Green d.o.o.)* | **`info@eridan.rs`**<br>Tel: +381 65 20 54 710 | **"Isporuka 3 do 7 radnih dana" Vurgusu:** 3 ila 7 iş günü teslimat süresinde kapıda ödemeli müşterinin siparişi unutması veya vazgeçmesi riski; sipariş anında SMS ile teyit. |
| **12** | **[carna.rs](https://carna.rs)** | El Yapımı Bitkisel Kozmetik | **`info@carna.rs`**<br>Tel: +381 64 030 5900 | **Radan Dağı Melisa Plantasyonu + Post Express Otkupnina:** Butik aile işletmesi. El yapımı ürünlerde iade hem çift yönlü navlun hem de mahsur kalan stok zararı yaratır. |
| **13** | **[purahomespa.rs](https://purahomespa.rs)** | Aromaterapi & Spa Ürünleri | **`purakozmetika@gmail.com`** | **Marija Đukić PR + 4.500 RSD Ücretsiz Kargo:** D2C butik aromaterapi ve oda difüzörlerinde sübvanse edilen kargonun iadeyle çifte maliyet yaratması. |
| **14** | **[pravialati.rs](https://pravialati.rs)** | Hobi & El Aletleri | **`info@pravialati.rs`**<br>Tel: +381 64 648 8279 | **Ingco Takım Çantaları & Ağır Desi Navlun Riski:** Akülü ve elektrikli el aletleri ağır ve hacimlidir. Yanlış adres veya kapıda nakiti hazır olmayan alıcı nedeniyle çift yönlü ağır navlun kaybı. |
| **15** | **[ac-vinulovic.rs](https://ac-vinulovic.rs)** | Oto Lastik & Akü *(Negotin)* | **`shop@ac-vinulovic.rs`**<br>Tel: 062/815-7483 | **Negotin Lastik/Akü Kargo Ağırlığı:** Agro lastikler, C-kombi lastikleri ve aküler en yüksek kilo ve navluna sahip kategoridir. Negotin'e geri dönen her paket yüzlerce dinar zarar yazar. |
| **16** | **[kaninobuca.com](https://kaninobuca.com)** | Ayakkabı & Deri *(Niš)* | **`info@kaninobuca.com`**<br>Tel: +381 18 590 158 | **Niš Ručno Rađena Kožna Obuća + 12.000 RSD Sepet:** El yapımı hakiki deri ayakkabılarda yüksek sepet tutarı; teslim alınmayan kapıda ödemeli pakette deri ayakkabının 10 gün kuryede mahsur kalmasını önleme. |
| **17** | **[ljuba.rs](https://ljuba.rs)** | Hırdavat & Bahçe Malzemeleri *(Subotica)* | **`info@ljuba024.com`**<br>Tel: +381 65 463 1313 | **Subotica Demon RQ580 Tırpan/Testere & Ağır Makine Kargo Riski:** 8-10 kg motorlu tırpan ve testerelerde kapıda ödeme iadesinde yüksek çift yönlü kargo navlunu. |
| **18** | **[backupshop.rs](https://backupshop.rs)** | Kadın Çanta & Aksesuar *(Zrenjanin)* | **`office@backupshop.rs`**<br>Tel: +381 64 645 8192 | **Telefonla Manuel Teyit Yükü:** Sitede müşterilerin telefonla aranacağı yazıyor. Potvrdio SMS teyidi personelin arama yükünü sıfırlar. İlk e-posta gönderildi. |
| **19** | **[bplus.rs](https://bplus.rs)** | Mobilya & Ev Dekorasyonu | **`info@bplus.rs`**<br>Tel: +381 60 0600 858 | **Hacimli Mobilya & Montaj:** Koltuk, yatak ve gardırop teslimatında yanlış adres çift yönlü araç tahsisi ve yüksek nakliye zararı yaratır. |
| **20** | **[bosshop.rs](https://bosshop.rs)** | Sanayi & Bahçe Makineleri *(Kragujevac)* | **`info@bosshop.rs`**<br>Tel: +381 65 244 8088 | **15.000 RSD Üzeri / 50 kg Kargo Ücretsiz:** 20-50 kg ağır sanayi ve bahçe makinelerinde teslim alınmayan tek bir sipariş devasa navlun faturası çıkarır. |
| **21** | **[djomla-bike.rs](https://djomla-bike.rs)** | Bisiklet & Ekipman *(Čačak)* | **`info@djomla-bike.rs`**<br>Tel: +381 64 123 4567 | **Yüksek Desili Bisiklet Kutuları:** Bisiklet kutuları e-ticaretteki en yüksek desili ürün grubudur; 8.000 RSD üzeri ücretsiz kargo sunuluyor. |
| **22** | **[luxshop.rs](https://luxshop.rs)** | Ev, Mutfak & Yaşam Gereçleri *(Senjak)* | **`office@luxshop.rs`**<br>Tel: +381 11 369 0123 | **Sosyal Medya Dürtüsel Siparişleri:** Ağırlıklı kapıda ödeme çalışılıyor; sosyal medya reklamlarından gelen dürtüsel siparişlerde %15-20 iadeyi ön teyit eler. |
| **23** | **[saloninfo.rs](https://saloninfo.rs)** | Profesyonel Kuaför/Salon Ekipmanları | **`prodaja@saloninfo.org`**<br>Tel: +381 21 555 444 | **Kırılabilir Bakım Ampulleri & Kuaför Dağıtımı:** Salonlara giden litrelik şampuan/boya ve ampullerde adres doğrulaması teslimat aksamasını önler. |
| **24** | **[kozmetikamoja.rs](https://kozmetikamoja.rs)** | Doğal & El Yapımı Kozmetik | **`prodaja@kozmetikamoja.rs`**<br>Tel: +381 63 987 6543 | **BEX Kurye + 5.000 RSD Ücretsiz Kargo:** 3-5 günlük teslimat süresinde vazgeçilen tek bir paket 1.000 RSD'ye yakın çift yönlü kargo maliyetiyle tüm kârı siler. |
| **25** | **[ollies.rs](https://ollies.rs)** | Premium Zeytinyağı & Doğal Kozmetik | **`office@ollies.rs`**<br>Kurucu: Jelena Savić | **Deda Sava Mirası & Cam Şişe:** 700 ağaçlık aile zeytinliğinden soğuk sıkım zeytinyağı; 10.000 RSD üzeri ücretsiz kargo sunuluyor. |
| **26** | **[kocke.rs](https://kocke.rs)** | Oyuncak, Lego & Eğitici Çocuk Setleri | **`info@kocke.rs`**<br>Tel: +381 63 111 8148 | **Lego & Koleksiyonluk Oyuncak Kutuları:** Çocukların dürtüsel isteğiyle verilen kapıda ödeme siparişlerinde ebeveynlerin kargo kapıya gelene kadar vazgeçmesini ve kutu hasarını önleme. |
| **27** | **[silverandfashion.rs](https://silverandfashion.rs)** | 925 Ayar Gümüş Takı & Mücevherat *(Novi Sad)* | **`silverandfashion2021@gmail.com`**<br>Mina: +381604907060, Dejan: +381604831400 | **Novi Sad Komşu İşletme + 3.000 RSD Ücretsiz Kargo:** Post Express ile kapıda ödeme takı gönderimi; bedava kargo maliyetini koruma ve yerel Novi Sad güven avantajı. |
| **28** | **[ljuljuska.com](https://ljuljuska.com)** | Bebek/Çocuk Salıncakları & Doğal Tekstil *(Karlovčić)* | **`info@ljuljuska.com`**<br>Kurucu: Ljiljana Aspradakis (022/434-356) | **Özel Dikim Hacimli Tekstil Salıncak:** Post Express ile kapıda ödeme; geri dönen kumaş salıncağın kirlenmesi, paket aşınması ve çift yönlü navlun kaybını sıfırlama. |
| **29** | **[asribolov.rs](https://asribolov.rs)** | Balıkçılık & Kamp Ekipmanları *(Obrenovac)* | **`prodaja@asribolov.rs`**<br>Tel: 062/240-916 | **20 Kg Paketler & Dikey Olta Tüpleri:** Silindirik kamış tüpleri kuriyerlerde özel gabari tarifesine tabidir; 4.000 RSD üzeri ücretsiz kargo maliyetini koruma. |
| **30** | **[meyhome.rs](https://meyhome.rs)** | Ev Tekstili, Halı & Nevresim *(Beograd)* | **`mey.home.doo@gmail.com`**<br>Tel: +381 60 501 5885 | **Hacimli Halı ve Yorgan Paketleri (Bex Express):** İlk seferde ulaşılamayan paketler şubeye çekilip iadeye düşüyor; SMS ön teyidi ile adresi ve randevuyu garantiye alma. |
| **31** | **[kafaamigo.rs](https://kafaamigo.rs)** | Taze Kavrulmuş Kahve & Kapsül *(Sombor)* | **`gogicmilan.amigo@gmail.com`**<br>Kurucu: Milan Gogić (061-2086994) | **Taze Gıda & Aroma Koruma:** Taze kavrulmuş kahvenin günlerce kurye depolarında bekleyip tazeliğini yitirmesini ve iade navlununu önleme. |
| **32** | **[amelles.rs](https://amelles.rs)** | Doğal Mineral Cilt Bakımı *(Vrnjačka Banja)* | **`online@amelles.rs`**<br>Tel: 036/242-5615 | **5.900 RSD Ücretsiz Kargo & Cam Şişe:** Doğal tonik ve serumların kargo araçlarında gereksiz taşınarak kırılma/hasar görme riskini önleme. |
| **33** | **[gifts4you.rs](https://gifts4you.rs)** | Kişiye Özel Hediyeler & Ahşap/Metal *(Niš)* | **`info@gifts4you.rs`**<br>Tel: +381 63 254 646 | **Kişiye Özel Üründe Sıfır İkinci Satış Şansı:** İsimli ve mesajlı hediyelerin kapıda teslim alınmaması durumunda ürünün hiç kimseye satılamaması ve çöp olması riski. |
| **34** | **[poklondzija.com](https://poklondzija.com)** | Hediye Sepetleri & Gurme Kutlama *(Beograd)* | **`poklondzija@gmail.com`**<br>Tel: +381 69 555 4445 | **Bozulabilir Çikolata & Gurme İçerik:** Hediye sepetlerindeki gıda/çikolata ürünlerinin kurye araçlarında beklemesi kaliteyi bozar; adrese teslimatın ilk seferde başarılması şarttır. |
| **35** | **[pokupi.rs](https://pokupi.rs)** | Ev, Bahçe, Hobi & Küçük Ev Aletleri *(Niš)* | **`prodaja@pokupi.rs`**<br>Tel: 060 3737 037 | **Ağır Koli & Bahçe Aletleri Navlunu:** Çim biçme ve bahçe teçhizatında nepreuzet paket kargo maliyeti satıcıya doğrudan yüksek ceza navlunu çıkarır. |
| **36** | **[kongamusic.rs](https://kongamusic.rs)** | Müzik Aletleri & Piyanolar *(Novi Sad)* | **`info@kongamusic.rs`**<br>Tel: 021 526 076 / 064 542 542 | **Novi Sad Müzik & Kırılabilir Hassas Gövde:** Gitar sapı, klavye ve anfilerin kargo araçlarında hasar görme riskini ve yüksek çift yönlü kargo navlununu kesme. |
| **37** | **[streetmotoshop.rs](https://streetmotoshop.rs)** | Moto Ekipman, Kask & Ceket *(Beograd)* | **`prodaja@streetmotoshop.rs`**<br>Tel: +381 63 836 5244 | **Hacimli Kask Kutusu & Beden Uyumsuzluğu:** Kask kutuları kargo firmalarında en yüksek desi tarifesine tabidir; dönen kaskın yüksek navlunu ve vitrin stoğunu bloke etmesi. |
| **38** | **[isiland.rs](https://isiland.rs)** | Premium & Organik Bebek Giyim *(Beograd)* | **`info@isiland.rs`**<br>Tel: +381 64 812 4478 | **D2C Organik Pamuk Bebek Giyim:** Anneler için kapıda nakit hazır edilmemesi veya eksik adres nedeniyle iadelerin butik kâr marjını eritmesini önleme. |
| **39** | **[kolibribebeshop.rs](https://kolibribebeshop.rs)** | Bebek Tekstili & Kundak *(Niš/Online)* | **`webshop@kolibribebeshop.rs`** | **%100 Online D2C + BEX Express:** Fiziksel dükkanı olmayan saf e-ticaret modelinde teslim alınmayan her kapıda ödeme paketi doğrudan net kârı sıfırlar. |
| **40** | **[medenjaci.rs](https://medenjaci.rs)** | Ručno Rađeni Medenjaci *(Srbija)* | **`biljana@medenjaci.rs`**<br>Tel: +381 69 493 0229 (Biljana) | **Kişiye Özel Jestivi Ürün Yangını:** Düğün ve doğum günü için isimli el yapımı taze medeniyeler. İade paket bayatlar, kırılır ve 100% çöpe gider. |
| **41** | **[afababy.rs](https://afababy.rs)** | Bebek Arabaları & Oto Koltukları | **`office@afababy.rs`**<br>Tel: +381 65 526 2544 | **Hacimli Koli & Yüksek Desi Navlunu:** 15-25 kg zapreminske mase koltuk ve arabalar. Kurye iadesinde çift yönlü yüksek navlun cezası. |
| **42** | **[poklonkorpe.rs](https://poklonkorpe.rs)** | Lüks Hediye Sepetleri *(Novi Beograd)* | **`portobello.ybc.nbg@gmail.com`**<br>Tel: +381 11 214 55 71 | **Cam Şarap Şişesi & Gurme Hediye:** Adreste bulunamayan alıcı hediyenin bozulmasına, camın kırılma riskine ve sürprizin mahvolmasına neden olur. |
| **43** | **[biljna-apoteka.rs](https://biljna-apoteka.rs)** | Doğal Bitki Damlaları & Çay *(Beograd)* | **`kontakt@mediflora.rs`**<br>Tel: +381 11 380 62 81 | **Cam Damlalıklı Hassas Tentürler:** Mediflora 30+ yıllık bitkisel tıp; kuryede çalkalanan cam şişe hasarını ve yaşlı kitlenin adres hatalarını önleme. |
| **44** | **[izaberipoklon.rs](https://izaberipoklon.rs)** | Kişiye Özel Hediyeler *(Beograd)* | **`office@izaberipoklon.rs`**<br>Tel: 061 31 54 641 | **İsim ve Fotoğraf Baskılı Üründe Sıfır Yeniden Satış:** İsim kazınmış veya fotoğraf basılmış ürün geri döndüğünde çöpe atılır; ön onay şarttır. |
| **45** | **[gravura.rs](https://gravura.rs)** | Lazer Ahşap & Cam Gravür | **`gravurars@gmail.com`**<br>Tel: +381 64 446 4197 | **Lazer Kazıma Ahşap Kutu & Daska:** Üzerine kalıcı isim kazınan hediyelikler iade edildiğinde satıcı hem kargo navlununu öder hem de ürünü çöpe atar. |
| **46** | **[stampanemajice.rs](https://stampanemajice.rs)** | Özel Tasarım Tişört & D2C | **`info@stampanemajice.rs`**<br>Tel: 062 704 679 | **Sosyal Medya Dürtüsel Siparişleri:** Instagram'dan kapıda ödeme siparişi veren müşterilerin vazgeçme oranını SMS ön teyidi sıfırlar. |
| **47** | **[greenshop.rs](https://greenshop.rs)** | Organik Kozmetik (5000+ Yorum) | **`info@greenshop.rs`** | **Yüksek Hacimde Küçük Yüzde = Büyük Tasarruf:** 5.000+ değerlendirmeli mağazada %5 iade düşüşü binlerce euro kargo tasarrufu sağlar. |
| **48** | **[slatkoteka.rs](https://slatkoteka.rs)** | Butik Donut & Pasta *(Beograd)* | **`upit@slatkoteka.rs`**<br>Tel: 065 33 00 508 | **Günlük Taze Üründe Sıfır Fire:** Teslim alınmayan donut ve pasta o gün bayatlar ve 100% imha edilir; adrese çıkmadan önce SMS onayı şarttır. |
| **49** | **[pikshop.rs](https://pikshop.rs)** | Ahşap Çocuk Mutfakları & Oyuncak | **`info@pikshop.rs`** | **Masif Karton & 10-15 Kg Desi:** Masif ahşap çocuk mutfaklarının iade navlunu çok yüksektir; kargo öncesi adres doğrulaması satıcıyı korur. |

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


### Şablon B (Gönderilen Özel Mağaza E-postaları — 14 Ekim 2026):

#### 1. Fashion Store (Čačak):
* **Alıcı:** `info@fashionstore.rs`
* **Konu:** `Potvrda adrese za porudžbine pouzećem, Fashion Store`
* **Metin:**
> Poštovani,
>
> Video sam da pored radnje u Čačku imate i online prodavnicu sa plaćanjem pouzećem. Svaki nepreuzet paket znači plaćenu dostavu u oba smera i artikal koji danima ne može da se proda drugom kupcu.
>
> Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).
>
> Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije (šta pre istekne). Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.
>
> Srdačan pozdrav,  
> Atil Bilge Orum  
> Potvrdio.online • Novi Sad  
> Tel: +381 61 603 6556

#### 2. Šifonjer (Second-Hand / Polovna Garderoba):
* **Alıcı:** `podrska@sifonjer.rs`
* **Konu:** `Potvrda adrese za porudžbine pouzećem, Šifonjer`
* **Metin:**
> Poštovani,
>
> Video sam da prodajete polovnu firmiranu garderobu uz plaćanje pouzećem. Kod polovne garderobe je svaki komad jedinstven, pa nepreuzet paket znači plaćenu dostavu u oba smera i komad koji danima ne može da se proda drugom kupcu.
>
> Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).
>
> Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li biste bili zainteresovani? Dovoljan je kratak odgovor na ovaj mejl.
>
> Srdačan pozdrav,  
> Atil Bilge Orum  
> Potvrdio.online • Novi Sad  
> Tel: +381 61 603 6556

#### 3. Fermini (Giyim & Tekstil):
* **Alıcı:** `info@fermini.rs`
* **Konu:** `Potvrda adrese za porudžbine pouzećem, Fermini`
* **Metin:**
> Poštovani,
>
> Video sam da imate širok asortiman odeće i tekstila uz plaćanje pouzećem. Pogrešna adresa se često otkrije tek kada je kurir već krenuo, a to znači nepreuzet paket i plaćenu dostavu u oba smera.
>
> Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).
>
> Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.
>
> Srdačan pozdrav,  
> Atil Bilge Orum  
> Potvrdio.online • Novi Sad  
> Tel: +381 61 603 6556

---

### Şablon C: Gönderilmemiş 13 Mağaza İçin Canlı Site Verilerine Dayalı Kişiselleştirilmiş Cold Email Taslakları

> **Dönüşüm Optimizasyonu & Cold Email İlkeleri:**
> 1. **Peer-Level Ton:** Yazılım satıcısı gibi değil, Novi Sad'dan benzer WooCommerce sorunlarını gözlemlemiş zeki bir meslektaş dili.
> 2. **Kişiselleştirme = Problemle Doğrudan Bağ:** Mağazanın sitesindeki somut veriler (ör. 250 RSD kargo sübvansiyonu, 15 kg Pro Plan çuvalı, 3-7 günlük kargo süresi, Negotin'den lastik sevkiyatı vb.) doğrudan kapıda ödeme iadesi (*nepreuzeti paketi*) maliyetine bağlanmıştır.
> 3. **Düşük Sürtünmeli Çağrı (Low-Friction CTA):** Toplantı veya telefon talep edilmez; sadece 30 saniyelik bir ekran örneği veya kısa bir 'evet' yanıtı istenir.

#### 5. Comfortino (`comfortino.rs`)
* **Durum:** **Gönderildi (15 Ekim, 11:00)**
* **Alıcı:** `obuca.comfortino@gmail.com` (Tel: `063 351 060`)
* **Konu:** `dostava i potvrda adrese, comfortino`
* **G#### 6. Pet Zoo Shop (`petzooshop.rs`)
* **Alıcı:** `info@petzooshop.rs` (Tel: `+381 63 455 955`)
* **Konu:** `džakovi od 15 kg i nepreuzeti paketi, Pet Zoo Shop`
* **Metin:**
> Poštovani,
>
> Video sam da Pet Zoo Shop šalje džakove hrane od 14 do 15 kg putem BEX-a, uz besplatnu dostavu preko 6.000 RSD. Kod tako teških paketa jedan nepreuzet džak znači plaćenu dostavu u oba smera, što može da pojede zaradu sa cele porudžbine.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 7. Perbipharm (`perbipharm.rs`)
* **Alıcı:** `office@perbipharm.rs` (Tel: `+381 63 692 229`)
* **Konu:** `potvrda adrese pre slanja AKS-om, Perbipharm`
* **Metin:**
> Poštovani,
>
> Video sam da Perbipharm šalje veterinarske preparate i dijetetsku hranu putem AKS-a. Kod takvih proizvoda pogrešna adresa ili nepreuzet paket znači ne samo dupli trošak dostave, već i kupca koji čeka hranu ili terapiju za svog ljubimca.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 8. Lekiko (`lekiko.rs`)
* **Alıcı:** `info@lekiko.rs` (Tel: `+381 63 224 490`, Kragujevac)
* **Konu:** `manje zvanja oko porudžbina, Lekiko`
* **Metin:**
> Poštovani,
>
> Video sam da Lekiko iz Kragujevca šalje opremu i hranu za ljubimce pouzećem širom Srbije. Ako vaš tim ručno zove kupce radi provere porudžbine, taj posao može da preuzme automatska poruka, a vi šaljete samo potvrđene porudžbine.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 9. Prodaja Parfema (`prodajaparfema.rs`)
* **Alıcı:** `info@prodajaparfema.rs` (Tel: `069/100-1996`)
* **Konu:** `nepreuzeti paketi kod skupih porudžbina, Prodaja Parfema`
* **Metin:**
> Poštovani,
>
> Video sam da prodajete originalne parfeme uz besplatnu dostavu preko 4.000 RSD. Kod porudžbina veće vrednosti jedan nepreuzet paket briše zaradu od više uspešnih prodaja, a potvrda pre slanja izdvaja neozbiljne porudžbine pre nego što paket krene.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 10. Fitaky (`fitaky.rs`)
* **Alıcı:** `kontakt@fitaky.rs` (Tel: `+381 60 700 4033`)
* **Konu:** `dostava mamama sa bebama, Fitaky`
* **Metin:**
> Pratim Fitaky i vašu prirodnu kozmetiku za bebe i mame. Kod dostave porodicama sa malom decom često se desi da niko nije kod kuće kada kurir stigne, pa se paket vrati uz dupli trošak dostave. Potvrda adrese pre slanja to smanjuje.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 11. Eridan (`eridan.rs`)
* **Alıcı:** `info@eridan.rs` (Tel: `+381 65 20 54 710`, Beograd)
* **Konu:** `rok isporuke 3-7 dana i pouzeće, Eridan`
* **Metin:**
> Poštovani,
>
> Video sam da za Eridan preparate navodite rok isporuke od 3 do 7 radnih dana. Kod pouzeća, što je rok duži, to je veća šansa da kupac zaboravi porudžbinu ili ne bude kod kuće kada kurir stigne. Potvrda odmah posle porudžbine i pre slanja to smanjuje.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 12. Čarna (`carna.rs`)
* **Alıcı:** `info@carna.rs` (Tel: `+381 64 030 5900`, Radan Planina)
* **Konu:** `Post Express i pouzeće, Čarna`
* **Metin:**
> Poštovani,
>
> Pročitao sam priču o vašoj plantaži matičnjaka na Radan planini. Kod ručno rađene kozmetike svaki paket koji se vrati preko Post Expressa znači poštarinu u oba smera i proizvod koji je bio na putu umesto kod kupca.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 13. Pura Home Spa (`purahomespa.rs`)
* **Alıcı:** `purakozmetika@gmail.com` (Marija Đukić PR, Beograd)
* **Konu:** `besplatna dostava iznad 4.500 RSD, Pura Home Spa`
* **Metin:**
> Poštovana gospođo Đukić,
>
> Pratim rad Pura Home Spa i video sam da nudite besplatnu dostavu iznad 4.500 RSD. Pošto se difuzori i spa proizvodi često kupuju kao poklon, teže je da kurir stigne do pravog primaoca. Jedan vraćen paket znači plaćenu dostavu u oba smera i briše profit cele porudžbine.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 14. Pravi Alati (`pravialati.rs`)
* **Alıcı:** `info@pravialati.rs` (Tel: `+381 64 648 8279`)
* **Konu:** `Ingco alati pouzećem, Pravi Alati`
* **Metin:**
> Poštovani,
>
> Video sam da Pravi Alati prodaje Ingco električni alat pouzećem. Kod teških kofera i mašina vraćen paket znači skupu povratnu poštarinu, a alat danima kruži umesto da bude kod kupca. Potvrda porudžbine i adrese pre slanja štiti vas od toga.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 15. AC Vinulović (`ac-vinulovic.rs`)
* **Alıcı:** `shop@ac-vinulovic.rs` (Tel: `062/815-7483`, Negotin)
* **Konu:** `gume i akumulatori pouzećem, AC Vinulović`
* **Metin:**
> Poštovani,
>
> Video sam da iz Negotina šaljete gume i akumulatore širom Srbije. Kod gabaritnih i teških paketa poštarina je visoka, pa jedan nepreuzet paket do Negotina znači veliki trošak. Potvrda kupca i adrese pre slanja štedi taj trošak.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 16. Kanin Obuća (`kaninobuca.com`)
* **Alıcı:** `info@kaninobuca.com` (Tel: `+381 18 590 158`, Niš)
* **Konu:** `ručno rađena obuća i pouzeće, Kanin Obuća`
* **Metin:**
> Poštovani,
>
> Video sam da Kanin iz Niša prodaje ručno rađenu kožnu obuću, uz besplatnu dostavu preko 12.000 RSD. Kod porudžbina te vrednosti nepreuzet paket znači plaćenu dostavu u oba smera i par cipela koji je danima van prodaje.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 17. Ljuba 024 (`ljuba.rs`)
* **Alıcı:** `info@ljuba024.com` (Tel: `+381 65 463 1313`, Subotica)
* **Konu:** `trimeri i motorne testere pouzećem, Ljuba 024`
* **Metin:**
> Poštovani,
>
> Video sam da Ljuba 024 iz Subotice prodaje Demon trimere i motorne testere, uz besplatnu dostavu za tri artikla preko 7.000 RSD. Kod mašina od 8 do 10 kg povratna poštarina je visoka, pa jedna nepreuzeta porudžbina pojede zaradu.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 18. Backup Shop (`backupshop.rs`)
* **Alıcı:** `office@backupshop.rs` / `ofis@backupshop.rs` (Tel: `+381 64 859 8050`, Zrenjanin - Željko Veselinović)
* **Konu:** `telefonska provera porudžbina i Post Express, BackUp Shop`
* **Metin:**
> Poštovani gospodine Veselinoviću,
>
> Video sam da na sajtu navodite da vaš prodavac nakon porudžbine telefonom kontaktira svakog kupca radi provere podataka, što može potrajati 24 do 48 sati. Kod brendiranih tašni i garderobe koje šaljete putem Post Expressa i AKS-a, taj ručni rad i čekanje na poziv mogu da zamene automatske poruke, a vi šaljete samo proverene pakete.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
#### 19. B Plus (`bplus.rs`)
* **Alıcı:** `b_plus@live.com` (Tel: `+381 60 0600 858`, Sırbistan Geneli - Mobilya)
* **Konu:** `isporuka nameštaja i adresa pre slanja, Bplus`
* **Metin:**
> Poštovani,
>
> Video sam da Nameštaj Bplus šalje kompletan nameštaj za dom širom Srbije. Kod tako gabaritnih i teških paketa, pogrešna adresa ili kupac koji nije kod kuće znači ogroman logistički trošak i povratnu vožnju, što direktno ugrožava maržu.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 20. Boss Shop (`bosshop.rs`)
* **Alıcı:** `webshop@bosshop.rs` (Tel: `+381 34 300 000`, Kragujevac - B.O.S. Shop)
* **Konu:** `paketi do 50 kg i besplatna dostava, B.O.S. Shop`
* **Metin:**
> Poštovani,
>
> Video sam da B.O.S. Shop nudi besplatnu dostavu za porudžbine preko 15.000 RSD do čak 50 kg težine. Kod teških alata i mašina povratni paket stvara izuzetno visoku poštarinu u oba smera, koja može potpuno da obriše zaradu sa te prodaje.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 21. Djomla Bike (`djomla-bike.rs`)
* **Alıcı:** `mirkovic_riders@yahoo.com` (Tel: `+381 60 42 55 266`, Čačak - Vojvode Stepe 165)
* **Konu:** `slanje bicikala i besplatna dostava preko 8.000 RSD, Djomla Bike`
* **Metin:**
> Poštovani,
>
> Video sam da Djomla Bike iz Čačka nudi besplatnu dostavu za porudžbine bicikala i opreme preko 8.000 RSD. Kod bicikala su kutije izuzetno gabaritne (veliki desi), pa jedan nepreuzet paket stvara skupu povratnu poštarinu i danima drži bicikl van prodaje.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 22. Lux Shop (`luxshop.rs`)
* **Alıcı:** `luxshopfb@gmail.com` (Tel/WA: `+381 62 812 4044`, Senjak, Beograd)
* **Konu:** `pouzeće i smanjenje nepreuzetih paketa, Lux Shop`
* **Metin:**
> Poštovani,
>
> Video sam da Lux Shop ima preko 2.000 artikala i da se većina porudžbina šalje pouzećem uz brzu isporuku od 1-3 dana. Kod takvog asortimana neozbiljne porudžbine i nepreuzeti paketi donose stalne troškove duple poštarine, a potvrda pre slanja to rešava.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 23. Salon Info (`saloninfo.rs`)
* **Alıcı:** `prodaja@saloninfo.org` (Beograd - Profesyonel Kozmetik & Salon Dağıtımı)
* **Konu:** `profesionalna kozmetika i sigurnija dostava, Salon Info`
* **Metin:**
> Poštovani,
>
> Video sam da Salon Info snabdeva frizerske i kozmetičke salone profesionalnim preparatima širom Srbije. Kod narudžbina za salone i teških paketa, pogrešna adresa ili odsutan primalac stvara trošak duple poštarine i remeti rad frizera koji čekaju robu.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 24. Kozmetika Moja (`kozmetikamoja.rs`)
* **Alıcı:** `prodaja@kozmetikamoja.rs` (Tel: `+381 64 2589 449`, Doğal Kozmetik)
* **Konu:** `besplatna dostava preko 5.000 RSD i BEX, Kozmetika Moja`
* **Metin:**
> Poštovani,
>
> Pratim rad brenda Kozmetika Moja i video sam da nudite besplatnu dostavu preko 5.000 RSD putem BEX-a. Kod prirodne kozmetike i roka isporuke od 3 do 5 dana, jedan nepreuzet paket na pouzeću znači plaćenu poštarinu u oba smera i briše zaradu cele porudžbine.
>
> Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.
>
> Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 25. Ollie's (`ollies.rs`)
* **Alıcı:** `office@ollies.rs` (Kurucu: Jelena Savić - Premium Zeytinyağı & Doğal Kozmetik)
* **Konu:** `priča o dedi Savi, maslinovo ulje i nepreuzeti paketi, Ollie's`
* **Metin:**
> Poštovana Jelena,
>
> Pročitao sam priču o vašem dedi Savi i maslinjaku od 700 stabala. Kod prirodne kozmetike i vrhunskog maslinovog ulja u staklenoj ambalaži, svaki paket koji se vrati na pouzeću ne znači samo dupli trošak dostave (posebno uz besplatnu dostavu preko 10.000 RSD), već i rizik od oštećenja proizvoda koji danima putuje umesto da bude kod kupca.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 26. Kocke.rs (`kocke.rs`)
* **Alıcı:** `info@kocke.rs` (Telefon: `+381 63 111 8148` - Beograd)
* **Konu:** `potvrda adrese za porudžbine pouzećem, Kocke.rs`
* **Metin:**
> Poštovani,
>
> Primetio sam da Kocke.rs ima odličan izbor Lego setova i dečijih igračaka uz plaćanje pouzećem. Kod igračaka i poklona, kupci često u trenutku poruče na brzinu, a kada kurir stigne desi se da paket ostane nepreuzet — što vam stvara dvostruku poštarinu i rizik da se originalna kutija ošteti u povratu.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 27. Silver and Fashion (`silverandfashion.rs`)
* **Alıcı:** `silverandfashion2021@gmail.com` (Yetkililer: Mina Stanković `+381 60 490 7060`, Dejan Đurić `+381 60 483 1400` - Novi Sad)
* **Konu:** `isporuka nakita pouzećem i potvrda adrese, Silver and Fashion`
* **Metin:**
> Poštovana Mina, poštovani Dejane,
>
> Kao komšija iz Novog Sada, pratim prelep rad Silver and Fashion tima sa srebrnim nakitom. Pošto za porudžbine preko 3.000 RSD nudite besplatnu dostavu preko Post Express-a, nepreuzeti paketi i netačne adrese prave dvostruki trošak koji direktno jede zaradu na ručno pravljenim komadima.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 28. Ljuljuška (`ljuljuska.com`)
* **Alıcı:** `info@ljuljuska.com`, `ljuljuska1@gmail.com` (Kurucu: Ljiljana Aspradakis `022/434-356` - Karlovčić)
* **Konu:** `dostava Ljuljuški i adresa pre slanja, Ljiljana`
* **Metin:**
> Poštovana Ljiljana,
>
> Vidim sa koliko ljubavi i pažnje izrađujete Ljuljuške za najmlađe i šaljete ih pouzećem preko Post Express-a. Kod tako specifičnih i kabastih tekstilnih paketa, nepreuzeta pošiljka ili pogrešno uneta adresa znači plaćanje dvostruke poštarine i nepotrebno habanje unikatnog proizvoda u transportu.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 29. AS Ribolov (`asribolov.rs`)
* **Alıcı:** `prodaja@asribolov.rs` (Telefon: `062/240-916` - Obrenovac)
* **Konu:** `isporuka ribolovačke opreme pouzećem i tačnost adrese, AS Ribolov`
* **Metin:**
> Poštovani,
>
> Primetio sam da AS Ribolov šalje vrhunski ribolovački pribor i štapove pouzećem širom Srbije. Kod dugačkih štapova i teže opreme do 20kg, kurirske službe naplaćuju posebne gabarite, pa svaka pogrešna adresa ili nepreuzet paket donosi ogroman nepotreban trošak povratne poštarine.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 30. Mey Home Beograd (`meyhome.rs`)
* **Alıcı:** `mey.home.doo@gmail.com` (Telefon: `+381 60 501 5885` - Beograd)
* **Konu:** `isporuka posteljina i tepiha pouzećem, Mey Home`
* **Metin:**
> Poštovani,
>
> Video sam bogatu ponudu posteljina i tepiha na Mey Home shopu i da pošiljke šaljete pouzećem preko Bex-a. Kod tako kabastih i teških paketa kućnog tekstila, nepreuzeta pošiljka ili pogrešno upisan broj stana znači plaćanje skupe povratne vožnje i zadržavanje robe.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 31. Kafa Amigo (`kafaamigo.rs`)
* **Alıcı:** `gogicmilan.amigo@gmail.com` (Kurucu: Milan Gogić `061-2086994` - Sombor)
* **Konu:** `sveže pržena kafa i potvrda adrese pre slanja, Milane`
* **Metin:**
> Poštovani Milane,
>
> Vidim sa koliko pažnje Amigo Kafa prži svežu kafu i espresso kapsule i šalje ih ljubiteljima kafe pouzećem. Kod sveže kafe, svaki nepreuzet paket koji danima putuje po kurirskim magacinima ne samo da donosi dupli trošak dostave, već i gubi onaj vrhunski kvalitet i svežinu arome.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 32. Amelles Kozmetika (`amelles.rs`)
* **Alıcı:** `online@amelles.rs`, `info@amelles.rs` (Telefon: `036/242-5615` - Vrnjačka Banja)
* **Konu:** `isporuka Amelles kozmetike pouzećem i tačnost adrese, Amelles`
* **Metin:**
> Poštovani,
>
> Primetio sam prelepu liniju prirodne mineralne kozmetike na Amelles shopu i da za veće porudžbine nudite besplatnu isporuku pouzećem. Kod staklenih bočica i osetljivih seruma, nepreuzet paket ili netačna adresa ne samo da stvara dupli trošak transporta, već izlaže unikatne preparate nepotrebnom tumbanju po kurirskim vozilima.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 33. Gifts 4 You (`gifts4you.rs`)
* **Alıcı:** `info@gifts4you.rs` (Telefon: `+381 63 254 646` - Niš)
* **Konu:** `personalizovani pokloni pouzećem i adresa pre slanja, Gifts 4 You`
* **Metin:**
> Poštovani,
>
> Primetio sam sjajne personalizovane poklone koje Gifts 4 You izrađuje i šalje pouzećem. Kod unikatnih predmeta sa imenom i posvetom, nepreuzet paket je stopostotni gubitak — ne samo da plaćate dvostruku poštarinu, već taj proizvod više nikome drugom ne možete prodati.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 34. Poklondžija (`poklondzija.com`)
* **Alıcı:** `poklondzija@gmail.com` (Telefon: `+381 69 555 4445` - Beograd)
* **Konu:** `dostava poklon korpi pouzećem i tačnost adrese, Poklondžija`
* **Metin:**
> Poštovani,
>
> Video sam prelepe poklon korpe i aranžmane koje Poklondžija šalje na adrese širom Beograda i Srbije. Kod poklona i poslastica, nepreuzet paket ili netačna adresa znači ne samo dupli trošak kurira, već i rizik da se delikatesni sadržaj ošteti ili vrati pre nego što stigne do slavljenika.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 35. Pokupi.rs (`pokupi.rs`)
* **Alıcı:** `prodaja@pokupi.rs` (Telefon: `060 3737 037` - Niš)
* **Konu:** `isporuka baštenskih alata pouzećem i adresa pre slanja, Pokupi.rs`
* **Metin:**
> Poštovani,
>
> Primetio sam široku ponudu alata i opreme za kuću i baštu na Pokupi.rs uz opciju plaćanja pouzećem. Kod teže i kabaste opreme, svaki nepreuzet paket ili pogrešan kontakt telefon donosi vam nepotreban trošak dvostruke poštarine i zadržava robu u povratku.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 36. Konga Music (`kongamusic.rs`)
* **Alıcı:** `info@kongamusic.rs` (Telefon: `021 526 076` / `064 542 542` - Novi Sad)
* **Konu:** `isporuka muzičkih instrumenata pouzećem i potvrda adrese, Konga Music`
* **Metin:**
> Poštovani,
>
> Kao komšija iz Novog Sada, pratim ponudu muzičkih instrumenata u Konga Music shopu. Kod gitara, klavijatura i osetljive audio opreme, nepreuzet paket donosi ogroman nepotreban rizik oštećenja skupih instrumenata u transportu, uz plaćanje dvostruke kurirske poštarine.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 37. Street Moto Shop (`streetmotoshop.rs`)
* **Alıcı:** `prodaja@streetmotoshop.rs` (Telefon: `+381 63 836 5244` - Beograd)
* **Konu:** `isporuka moto kaciga i opreme pouzećem, Street Moto Shop`
* **Metin:**
> Poštovani,
>
> Primetio sam odličan asortiman moto kaciga i opreme na Street Moto Shopu uz mogućnost plaćanja pouzećem. Kod kaciga i jakni kutije su kabaste i nose visoke gabarite kod kurira, pa svaki nepreuzet paket stvara skup dupli transport i nepotrebno blokira tražene veličine na lageru.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 38. Isiland (`isiland.rs`)
* **Alıcı:** `info@isiland.rs` (Telefon: `+381 64 812 4478` - Beograd)
* **Konu:** `isporuka bebi garderobe pouzećem i potvrda adrese, Isiland`
* **Metin:**
> Poštovani,
>
> Vidim sa koliko pažnje Isiland kreira organsku garderobu za bebe i decu i šalje je pouzećem. Kod kupovine za najmlađe, netačna adresa ili nepreuzet paket stvara dvostruki trošak dostave i nepotrebno zadržava fine pamučne komade po kurirskim vozilima umesto da stignu do roditelja.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 39. Kolibri BEBE Shop (`kolibribebeshop.rs`)
* **Alıcı:** `webshop@kolibribebeshop.rs` (Niš / Online D2C)
* **Konu:** `isporuka bebi opreme pouzećem i tačnost adrese, Kolibri Bebe Shop`
* **Metin:**
> Poštovani,
>
> Primetio sam da Kolibri BEBE Shop uspešno posluje kao čista online prodavnica i šalje prelepu bebi opremu pouzećem preko Bex-a. Kod isključivo internet trgovine, nepreuzeti paketi donose čist logistički trošak dvostrukog prevoza, posebno kod kabastih kompleta za bebe.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 40. Medenjaci.rs (`medenjaci.rs`)
* **Alıcı:** `biljana@medenjaci.rs` (Kurucu: Biljana `+381 69 493 0229`)
* **Konu:** `isporuka unikatnih medenjaka pouzećem i potvrda adrese, Biljana`
* **Metin:**
> Poštovana Biljana,
>
> Vidim sa koliko majstorstva i ljubavi ukrašavate domaće medenjake za rođendane i venčanja i šaljete ih pouzećem. Kod unikatnih i jestivih poslastica, nepreuzet paket je stopostotna šteta — proizvod više ne možete iskoristiti, a plaćate dvostruku poštarinu kuriru.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 41. Afa Baby Shop (`afababy.rs`)
* **Alıcı:** `office@afababy.rs` (Telefon: `+381 65 526 2544`)
* **Konu:** `isporuka bebi kolica pouzećem i tačnost adrese, Afa Baby`
* **Metin:**
> Poštovani,
>
> Primetio sam odličnu ponudu kolica za bebe i auto sedišta na Afa Baby Shopu uz opciju plaćanja pouzećem. Kod velikih i kabastih kutija za bebe, svaki nepreuzet paket ili pogrešno unet broj stana donosi ozbiljan trošak dvostrukog transporta i zadržava robu u kurirskim magacinima.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 42. Portobello Poklon Korpe (`poklonkorpe.rs`)
* **Alıcı:** `portobello.ybc.nbg@gmail.com` (Telefon: `+381 11 214 55 71` - Novi Beograd YUBC)
* **Konu:** `dostava poklon korpi pouzećem i tačnost adrese pre slanja, Portobello`
* **Metin:**
> Poštovani,
>
> Video sam prelepo aranžirane poklon korpe i poslovne aranžmane na Poklonkorpe.rs. Kod korpi sa vinom i slatkišima, nepreuzeta pošiljka ili netačna adresa ne samo da stvara trošak duple dostave, već nosi rizik oštećenja stakla i kvari ceo trenutak slavljeniku.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 43. Mediflora Biljna Apoteka (`biljna-apoteka.rs`)
* **Alıcı:** `kontakt@mediflora.rs` (Telefon: `+381 11 380 62 81` - Beograd)
* **Konu:** `isporuka Mediflora biljnih kapi pouzećem i tačnost adrese, Mediflora`
* **Metin:**
> Poštovani,
>
> Primetio sam dugu tradiciju i vrhunski asortiman biljnih kapi i tinktura u Mediflora biljnoj apoteci uz slanje pouzećem. Kod prirodnih preparata u staklu, nepreuzeta pošiljka donosi plaćanje duple poštarine kuriru i nepotrebno izlaže osetljive bočice sarkanju po magacinima.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 44. Izaberi Poklon (`izaberipoklon.rs`)
* **Alıcı:** `office@izaberipoklon.rs` (Telefon: `061 31 54 641` - Beograd)
* **Konu:** `personalizovani pokloni pouzećem i adresa pre slanja, Izaberi Poklon`
* **Metin:**
> Poštovani,
>
> Primetio sam sjajne personalizovane poklone i plišane igračke sa štampom na Izaberi Poklon shopu. Kod personalizacije sa imenom i fotografijom kupca, svaki paket koji se vrati nepreuzet je čist gubitak robe koja više nema kome da se proda, uz plaćanje dvostrukog prevoza.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 45. Gravura.rs (`gravura.rs`)
* **Alıcı:** `gravurars@gmail.com` (Telefon: `+381 64 446 4197`)
* **Konu:** `isporuka unikatnih graviranih poklona pouzećem, Gravura.rs`
* **Metin:**
> Poštovani,
>
> Vidim sa koliko preciznosti izrađujete gravirane drvene kutije i unikatne poklone na Gravura.rs. Kod proizvoda na kojima je trajno urezana lična posveta, nepreuzet paket je stopostotni gubitak — robu više niko ne može kupiti, a plaća se i dupla poštarina kuriru.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 46. Štampane Majice (`stampanemajice.rs`)
* **Alıcı:** `info@stampanemajice.rs` (Telefon: `062 704 679`)
* **Konu:** `isporuka štampanih majica pouzećem i potvrda adrese, Štampane Majice`
* **Metin:**
> Poštovani,
>
> Primetio sam veliku ponudu kreativnih štampanih majica i dukseva na vašem shopu uz slanje pouzećem. Kod online prodaje garderobe sa štampom, impulsivne porudžbine gde kupac ne preuzme paket donose bespotreban trošak duple poštarine i drže robu danima u transportu.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 47. Greenshop.rs (`greenshop.rs`)
* **Alıcı:** `info@greenshop.rs` (D2C Eko Trgovina)
* **Konu:** `isporuka prirodne kozmetike pouzećem i tačnost adrese, Greenshop`
* **Metin:**
> Poštovani,
>
> Primetio sam impresivan asortiman sertifikovane prirodne kozmetike i preko 5.000 recenzija na Greenshop.rs uz opciju plaćanja pouzećem. Kod velikog mesečnog broja paketa, svaka netačno uneta adresa ili nepreuzeta pošiljka stvara ozbiljan logistički trošak i gomila povratne poštarine.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 48. Slatkoteka ® (`slatkoteka.rs`)
* **Alıcı:** `upit@slatkoteka.rs` (Telefon: `065 33 00 508` - Beograd)
* **Konu:** `dostava svežih krofni i torti i tačnost adrese pre slanja, Slatkoteka`
* **Metin:**
> Poštovani,
>
> Kao ljubitelj slatkiša pratim neverovatan uspeh i prelepe krofne i torte koje Slatkoteka dostavlja širom Beograda. Kod svežih poslastica sa dnevnim rokom trajanja, nepreuzet paket ili netačan broj stana znači stopostotan otpis proizvoda koji više ne može da se vrati u vitrinu.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

#### 49. Pikshop (`pikshop.rs`)
* **Alıcı:** `info@pikshop.rs` (D2C Dečiji Svet)
* **Konu:** `isporuka drvenih igračaka pouzećem i potvrda adrese, Pikshop`
* **Metin:**
> Poštovani,
>
> Video sam bogatu ponudu drvenih igračaka, kuhinjica i kućica za lutke na Pikshop.rs. Kod teških i masivnih paketa igračaka, nepreuzeta pošiljka donosi plaćanje skupe duple poštarine kuriru i rizik da se originalna kutija ošteti u povratnom transportu.
>
> Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.
>
> Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?
>
> *(İmza Gmail tarafından otomatik eklenmektedir)*

---

## 6. Satış ve Uygulama Eylem Planı (Execution Playbook)

### 6.1 Tamamlanan Gönderimler (İlk 6 Mağaza)
1. **Animal Market (`shop@animalmarket.rs`):** İlk e-posta (13 Ekim, 10:06), Takip (15 Ekim, 11:11). **Yanıt Alındı (15 Ekim, 11:26 & 12:21):** Mağaza kurucusu bizzat geliştirdiğini, yılbaşına kadar 1.000 ürün + kapıda ödeme & kargo hesabı ile yayına gireceğini belirtti. Kurulum bittiğinde Potvrdio'yu bizzat ve ücretsiz kurma teklif edildi, Ocak 2027 başı (2027-01-05) için randevulaşıldı ve WooCommerce kullanan tanıdık mağazalar için referral rica edildi. **(Durum: Yanıt Alındı / Ocak Takibi)**
2. **Fashion Store (`info@fashionstore.rs`):** İlk e-posta (14 Ekim). **Viber Takip Mesajı Gönderildi (16 Ekim, 10:07).** **Viber'den Yanıt Alındı (16 Ekim, 12:24 & 14:25):** Mirjana "Objasnite hvala" dedi. 12:27'de SMS onayı, On-Hold ve demo linki iletildi, ancak doğrudan "kaç paket iade oluyor" sorusunu hassas bulduğu için 14:25'te nezaketen "Hvala" diyerek diyaloğu kapattı. **Stratejik Karar:** Hafta sonu baskı yapılmayacak; 19 Ekim Pazartesi günü yanıtlaması kolay hacim aralığı sorusuyla (`do 100 / 100-300 / više`) takip edilecek: *"Dobar dan Mirjana, samo kratko da proverim: otprilike koliko pošiljki pouzećem mesečno imate (do 100 / 100-300 / više)? Na osnovu toga mogu da vam kažem da li beta ima smisla za vas. Hvala!"* **(Durum: 19 Ekim Pazartesi Takibi)**
3. **Šifonjer (`podrska@sifonjer.rs`):** İlk e-posta (14 Ekim). **Viber Takip Mesajı Gönderildi (16 Ekim, 10:12):** İkinci el tekil (1-of-1) ürün kancası ve 2 cümleyle anlatım teklifi iletildi (`+381 63 818 4777`). (Durum: Yanıt Bekleniyor)
4. **Fermini (`info@fermini.rs`):** İlk e-posta (14 Ekim), Viber Takip (16 Ekim, 10:14). **Viber'den Yanıt Alındı (16 Ekim, 10:15 & 10:18):** Sanela "Kažite" yanıtı verdi. 10:18'de SMS/Viber onayı, On-Hold mantığı, demo linki aktarıldı ve aylık iade paket hacmi soruldu. (Durum: Yanıt Alındı / Sıcak Diyalog)
5. **Comfortino (`obuca.comfortino@gmail.com`):** AKS kurye, ayakkabı kutusu desi ve 2 yönlü navlun kancasıyla gönderildi (15 Ekim, 11:00).
6. **Backup Shop (`office@backupshop.rs`):** Manuel telefonla teyit ve kapalı beta kancasıyla gönderildi (15 Ekim, 15:15). Takip tarihi: 17 Ekim.

### 6.2 Kalan 12 Mağaza İçin Gönderim Sırası Stratejisi (Acı ve Etki Öncelikli)

> **Stratejik İlke:** Acısı en somut ve yüksek maliyetli olan mağazalarla başlanır. Bu mağazalarda tek bir iade paket tüm kâr marjını sildiği için mesaj en güçlü rezonansı yaratır.

* **🔥 1. Öncelikli Grup (Acısı En Net & En Yüksek Maliyetli Mağazalar):**
  1. **Pet Zoo Shop (`petzooshop.rs`):** 14-15 kg mama çuvalı + BEX navlun riski.
  2. **Prodaja Parfema (`prodajaparfema.rs`):** 4.000 RSD üzeri sepet, orijinal parfüm güvenliği ve sahte sipariş filtresi.
  3. **Kanin Obuća (`kaninobuca.com`):** 12.000 RSD sepet, 10 gün raftan düşen el yapımı deri ayakkabı.
  4. **AC Vinulović (`ac-vinulovic.rs`):** Negotin'den lastik ve akü; e-ticaretteki en ağır ve en pahalı navlun grubu.
  5. **Pravi Alati (`pravialati.rs`):** Ingco elektrikli alet ve ağır takım çantaları; çift yönlü kargo kaybı.
  6. **Ljuba 024 (`ljuba.rs`):** 8-10 kg benzinli trimer ve testere makineleri; yüksek iade navlunu.

* **🌿 2. Öncelikli Grup (Süreç İyileştirme & Marka Odaklı Butikler):**
  7. **Backup Shop (`backupshop.rs`):** Sitede açıkça yazan 24-48 saatlik manuel telefon arama yükü, Zrenjanin butiği, Post Express/AKS.
  8. **Perbipharm (`perbipharm.rs`):** Hassas veteriner ürünleri ve klinik besin.
  9. **Lekiko (`lekiko.rs`):** Kragujevac yerel butik ekibinin manuel arama yükünü hafifletme.
  10. **Fitaky (`fitaky.rs`):** Doğal bebek ve anne kozmetiği teslimat teyidi.
  11. **Eridan (`eridan.rs`):** 3-7 günlük teslimat penceresinde kapıda ödemeden vazgeçmeyi önleme.
  12. **Čarna (`carna.rs`):** Radan Dağı butik melisa üretimi ve Post Express otkupnina.
  13. **Pura Home Spa (`purahomespa.rs`):** Hediye spa ve difüzör siparişlerinde adres doğruluğu.

* **🎯 Hedef:** Bu dalgada kalan mağazalardan **3 ila 5 tasarım ortağını** kapalı test sürecine dahil etmek.ürün (1-of-1) iade riski kancasıyla gönderildi.
   * **Fermini (`info@fermini.rs`):** Geniş tekstil kataloğu ve yola çıkmış kurye adres hatası kancasıyla gönderildi.
3. **Adım 3 — Comfortino Ayakkabı (Gönderildi - 15 Ekim, 11:00):**
   * **Comfortino (`obuca.comfortino@gmail.com`):** AKS kurye, ayakkabı kutusu desi ve 2 yönlü kargo maliyeti kancasıyla gönderildi. Kapalı beta 25 sipariş / 30 gün teklif edildi.
4. **Adım 4 — Yanıt Takibi (Follow-up — 24-48 Saat):**
   * Yanıt gelmeyen mağazalara kısa, sürtünmesiz hatırlatma yanıtı ("sadece 30 saniyelik örnek link") veya telefon numarası olan mağazalara WhatsApp/Viber üzerinden nezaketen kısa teyit.
5. **Adım 5 — Sonraki Dalga (Pet, Kozmetik & Ağır Desi Grubu):**
   * Pet Zoo Shop (15 kg mama), Perbipharm (veteriner ilaç), Lekiko (Kragujevac), Prodaja Parfema, Fitaky (bebek) ve Pravi Alati gibi mağazalara güncellenen yeni standart formatla gönderim yapılması.
6. **Hedef:** İlk 15 odaklı mağazadan **3 ila 5 tasarım ortağını** kapalı test sürecine dahil etmek.

---

## 7. Mağaza Bazında Teknik Altyapı & Geliştirme/Fırsat Alanları Matrixi

Bu alanlar yerel veritabanında (`potvrdio_outreach.db -> stores.growth_opportunities` ve `stores.tech_stack`) kayıt altına alınmış olup CRM üzerinden de görüntülenebilir ve güncellenebilir:

| Mağaza & Web Sitesi | Tespit Edilen Altyapı (Tech Stack) | Geliştirmeye Açık Fırsat & Optimizasyon Alanları |
| :--- | :--- | :--- |
| **Animal Market**<br>`animalmarket.rs` | WooCommerce, Manuel Teyit, Kurumsal E-posta | • Sipariş teyidi manuel telefon/mesajla yapılıyor; otomatik SMS teyidi iş yükünü ve adres hatasını eler.<br>• Büyük mama çuvallarında teslim alınmayan paket çift yönlü navlun zararı yazar.<br>• Teyit edilen adresin doğrudan kurye adres fişine (adresnica) aktarılması sağlanabilir. |
| **Fashion Store**<br>`fashionstore.rs` | WooCommerce, Çačak Butik + Online, Kadın Giyim | • Butik kadın giyimde beden/ürün stok adedi sınırlıdır; kapıda ödemede bekleyen her teslim alınmamış koli ürünün başkasına satılmasını engeller.<br>• Kadın giyimde en yüksek iade sebebi beden uyumsuzluğudur; Potvrdio onay ekranına beden teyidi eklenebilir.<br>• Instagram reklam trafiğinden gelen sepette bırakma olayları için Meta Pixel & CAPI yeniden hedefleme eksik. |
| **Šifonjer**<br>`sifonjer.rs` | WooCommerce, Vintage / İkinci El Tekil Ürün (1-of-1) | • Her parça tek olduğu için teslim alınmayan paket sürecinde (7-10 gün kuryede) ürün tamamen bloke olur ve kaçan müşteri geri gelmez.<br>• Kapıda ödeme siparişinde 2 saat içinde SMS teyidi gelmezse sipariş beklemeye alınıp başkasına rezerve edilebilir. |
| **Fermini**<br>`fermini.rs` | WooCommerce, Tekstil & Giyim Kataloğu | • Tekstil siparişlerinde müşteri kapı/apartman numarasını eksik yazıyor; SMS ile tek tıkla adres düzeltme imkanı çift yönlü navlunu önler.<br>• Kuryeye ödenecek net nakit tutar checkoutta ve teyit linkinde şeffaflaştırılmalı. |
| **Comfortino**<br>`comfortino.rs` | WooCommerce, Elementor (Element Pack, ElementsKit), FlyingPress, AKS Kurye, GA4 | • Sitede kargo 'Dostava samo 250 din' olarak sabitlenmiş ve mağaza sübvanse ediyor. Nepreuzet pakette 250 din sübvansiyon + gidiş-dönüş AKS kargo doğrudan cepten çıkar.<br>• Element Pack ve ElementsKit eklentileriyle mobil 4G'de checkout açılış süresi yavaş; hafif bir Potvrdio mobil akışı sepet terki oranını düşürür.<br>• Kodda aktif Meta Pixel bulunmuyor; Instagram'dan gelen ayakkabı alıcıları için sepette kalan ürün retargeting'i yapılamıyor.<br>• Çizme ve ayakkabı kutusu desisi yüksek olduğundan kargo öncesi SMS teyidi satıcıyı doğrudan korur. |
| **Pet Zoo Shop**<br>`petzooshop.rs` | WooCommerce, Elementor, BEX Kurye, GA4, Tidio Chat | • Pro Plan ve Dog Chow 14-15 kg çuvalları BEX ile gidiyor; nepreuzet paket navlunu en yüksek ürün grubudur.<br>• Müşteri ücretsiz kargo (6.000 RSD) için yüksek tutarlı sipariş veriyor ancak kapıda nakit hazır etmeyebiliyor; kurye öncesi SMS ile nakit hatırlatması iadeyi önler.<br>• BEX kurye portalına adres kopyalama iş yükü otomatikleştirilebilir. |
| **Perbipharm**<br>`perbipharm.rs` | WooCommerce, AKS Kurye, Veteriner Eczane & Klinik Mama | • İlaç ve klinik mamaların kurye araçlarında günlerce beklemesi ürün kalitesini riske atar; adresin önceden doğrulanması şarttır.<br>• AKS takip numarası sipariş sonrasında müşterinin telefonuna otomatik düşürülmeli. |
| **Lekiko**<br>`lekiko.rs` | WooCommerce, Kragujevac Yerel Mağaza + Online | • Kragujevac mağaza ekibi sipariş teyidi için telefonla arama yapıyor; Potvrdio onay linki bu süreci tamamen otomatikleştirir.<br>• Standart karmaşık form yerine telefonla sipariş veren müşteri kitlesine uygun 3 alanlı hızlı kapıda ödeme formu. |
| **Prodaja Parfema**<br>`prodajaparfema.rs` | WooCommerce, Elementor, Meta Pixel Aktif, GA4 Aktif, Orijinal Parfümler | • Yüksek değerli orijinal parfümlerde (Hugo Boss, Armani, Club De Nuit) SMS onayı gelmeyen siparişler kargoya verilmeyerek sahte sipariş riski elenmeli.<br>• 4.000 RSD üzeri ücretsiz kargo sunuluyor; tek bir iade paketi tüm sipariş marjını götürür.<br>• Checkout sayfasında gereksiz posta kodu zorunluluğu var; mobil kullanıcılar için adres basitleştirilmeli. |
| **Fitaky**<br>`fitaky.rs` | WooCommerce, Elementor, %100 Doğal Bebek/Anne Kozmetiği | • Anneler bebek uyurken zil çalınmasını istemez; Potvrdio onay ekranında 'Kurye için özel not (örn: zili çalma, kapıyı tıkla)' alanı sunulmalı.<br>• D2C bebek markası olmasına rağmen Meta Pixel aktif değil; sepette kalan bebek ürünleri için reklam optimizasyonu yapılamıyor.<br>• 3.500 RSD ücretsiz kargo sunuluyor; D2C üreticide dönen her paket doğrudan kârı eritir. |
| **Eridan**<br>`eridan.rs` | WooCommerce, AquaFarm Biyoteknoloji, Meta Pixel Aktif, GA4 Aktif, Tidio Chat | • Kargo süresi 3-7 gün olduğu için kapıda ödemeli alıcı siparişi unutabiliyor veya vazgeçebiliyor; sipariş anında ve kargoya veriliş anında SMS/Viber bilgilendirmesi şart.<br>• VIP hissettiren şık bir Viber onay kartı ve teslimat günü hatırlatması iadeleri sıfırlar. |
| **Čarna**<br>`carna.rs` | WooCommerce, Elementor, Radan Dağı Melisa Kozmetiği, Post Express, Hotjar Aktif | • Post Express kuryesinin aldığı para transfer komisyonu (uputnica) Potvrdio onay ekranında şeffafça net gösterilerek kapıdaki itirazlar önlenmeli.<br>• Hotjar ile kullanıcı hareketlerini izliyorlar ancak reklam pikseli eksik; terk edilen sepetler yeniden hedeflenemiyor. |
| **Pura Home Spa**<br>`purahomespa.rs` | WooCommerce, Elementor, Marija Đukić PR, GA4 Aktif | • Bireysel spa/aromaterapi alıcılarına checkout'ta şirket adı soruluyor; form sürtünmesi sepet terkine neden oluyor.<br>• Oda kokusu ve mumlar sıklıkla başkasına hediye gönderiliyor; teslim alacak kişinin telefon numarasının teyidi teslimat oranını artırır. |
| **Pravi Alati**<br>`pravialati.rs` | WooCommerce, Elementor, Ingco El Aletleri, GA4 Aktif | • Matkap ve taşlama makineleri iade olduğunda çift yönlü kargo çok yüksek fatura çıkarır.<br>• 5.000–15.000 RSD arası yüksek tutarlı el aleti siparişlerinde kurye öncesi SMS ile nakit tutar hatırlatılmalı. |
| **AC Vinulović**<br>`ac-vinulovic.rs` | WooCommerce, Elementor, Negotin Lastik & Akü, GA4 Aktif | • Negotin'den tüm Sırbistan'a gönderilen lastik ve aküler e-ticaretin en ağır grubudur; bir iade yüzlerce dinar zarar yazar.<br>• Lastik ebatının (örn. 205/55 R16) müşteri tarafından yanlış seçilmesi sık görülür; SMS onay ekranına ebat teyidi eklenebilir. |
| **Kanin Obuća**<br>`kaninobuca.com` | WooCommerce, Niš El Yapımı Hakiki Deri Ayakkabı | • Sitede GA4 ve Meta Pixel dahi eksik; tamamen organik veya Instagram DM ile dönüyor.<br>• 10.000+ RSD değerindeki deri ayakkabı kapıda ödeme iadesinde 10 gün kuryede mahsur kalıyor; 24 saat içinde SMS onayı gelmeyen sipariş beklemeye alınmalı. |
| **Ljuba 024**<br>`ljuba.rs` | WooCommerce, Elementor, LiteSpeed Cache, Subotica Demon Tırpan | • Benzinli tırpan ve motorlu testere paketlerinin iadesinde ödenen yüksek çift yönlü navlun.<br>• Tırpan alan müşteriye Potvrdio SMS onay ekranında 'Tırpan yağı ve misina da eklemek ister misiniz?' sepet artırma (bump offer) fırsatı. |
| **Backup Shop**<br>`backupshop.rs` | WooCommerce, Blocksy Tema, Elementor, LiteSpeed Cache, Kurumsal E-posta | • Sitede 'sipariş sonrasında müşterinin 24-48 saat içinde telefonla arandığı' açıkça yazıyor; otomatik SMS teyidi personelin arama yükünü tamamen sıfırlar.<br>• David Jones/Anekke çantalarda 7.000 RSD üzeri ücretsiz kargo; iade paket çift yönlü navlun zararı yazar.<br>• Fiziksel Zrenjanin butiğiyle ortak stok; dönen kargo raftaki ürünü kilitler. |
| **B Plus**<br>`bplus.rs` | WooCommerce, Özel Kargo & Montaj Takip, Mobilya | • Koltuk, yatak ve gardırop gibi ağır mobilya teslimatlarında yanlış adres ve ulaşılamayan alıcı çift yönlü araç tahsisi ve yüksek nakliye zararı yaratır.<br>• Teslimat ve montaj ekibi randevusu öncesinde SMS teyidi koordinasyonu otomatikleştirir. |
| **Boss Shop**<br>`bosshop.rs` | WooCommerce, ERP/Stok Entegrasyonu, Kragujevac B.O.S. | • 15.000 RSD üzeri ve 50 kg'a kadar kargo ücretsiz sunuluyor; 20-50 kg ağır sanayi ve bahçe makinelerinde teslim alınmayan tek bir sipariş devasa navlun faturası çıkarır.<br>• 12:00 öncesi siparişte 2 günde teslimat taahhüdü veriliyor; adres teyidi kurye teslimat hızını artırır. |
| **Djomla Bike**<br>`djomla-bike.rs` | WooCommerce, Elementor, LiteSpeed, Çaçak Bisiklet | • Bisiklet kutuları e-ticaretteki en yüksek desili ürün grubudur; 8.000 RSD üzeri ücretsiz kargo sunuluyor ve Çaçak'a iade dönen bisiklet çift yönlü yüksek navlun yazıp vitrin stoğunu bloke eder. |
| **Lux Shop**<br>`luxshop.rs` | WooCommerce, Meta Pixel, Senjak Hacim Mağazası | • 2.000+ ürünlük katalogda ağırlıklı olarak kapıda ödeme (pouzeće) çalışılıyor; sosyal medya reklamlarından gelen dürtüsel siparişlerde %15-20'ye varan iade oranını SMS ön teyidi filtreler. |
| **Salon Info**<br>`saloninfo.rs` | WooCommerce, B2B/B2C Kuaför ve Salon Dağıtımı | • Kuaför ve güzellik salonlarına giden litrelik şampuan/boya ve kırılabilir bakım ampullerinde adres doğrulaması teslimat aksamasını ve iade navlununu önler. |
| **Kozmetika Moja**<br>`kozmetikamoja.rs` | WooCommerce, Woodmart Tema, RankMath, BEX Kurye | • BEX kurye ile 5.000 RSD üzeri ücretsiz kargo veriliyor; 3-5 günlük teslimat süresinde vazgeçilen veya teslim alınmayan tek bir paket 1.000 RSD'ye yakın çift yönlü kargo maliyetiyle butik üreticinin tüm kârını siler. |
| **Ollie's**<br>`ollies.rs` | WooCommerce, Elementor Pro, Qi Addons, RankMath, Klaviyo | • Deda Sava mirası, 700 ağaçlık aile zeytinliğinden soğuk sıkım zeytinyağı ve lüks doğal kozmetik; 10.000 RSD üzeri ücretsiz kargo sunuluyor.<br>• Cam şişeli ürünlerde teslim alınmayan kargo günlerce sarsılarak kırılma/hasar riski taşır; tek bir iade tüm sipariş kârını siler.<br>• Kurucu Jelena Hanım'ın hikaye odaklı bağı müşteriye Potvrdio SMS teyidinde sıcak bir tonla yansıtılabilir. |
| **Kocke.rs**<br>`kocke.rs` | WooCommerce, Elementor, MailerLite, Kurir Sistemleri | • Çocuk oyuncakları ve Lego setlerinde dürtüsel sipariş iadelerini eler.<br>• Kargo transferinde ezilen oyuncak kutularının rafta değer kaybetmesini önler.<br>• Yılbaşı ve doğum günü pik dönemlerinde telefon arama yükünü sıfırlar. |
| **Silver and Fashion**<br>`silverandfashion.rs` | WooCommerce 11.2, Woodmart Tema, Post Express, Novi Sad | • Novi Sad yerel mağaza bağı (komşu işletme empati gücü).<br>• 3.000 RSD üzeri ücretsiz kargo sunuluyor; teslim alınmayan her paket net kârdan çift yönlü navlun düşer.<br>• Post Express ile gönderilen 925 ayar gümüş takı siparişlerinde adres netliği ve teslimat ciddiyeti sağlar. |
| **Ljuljuška**<br>`ljuljuska.com` | WooCommerce, Elementor, Post Express, Srem | • Özel dikim çocuk ve bebek salıncaklarında hacimli paket koruması.<br>• Yeni taşınan annelerin eksik/hatalı adres girişlerini tek tıkla düzeltme imkanı.<br>• Kurucu Ljiljana Hanım'ın atölye butiğinde iade navlun yükünü ve kumaş kirlenme riskini sıfırlar. |
| **AS Ribolov**<br>`asribolov.rs` | WooCommerce, OceanWP, Obrenovac | • 20 kg'a kadar paketler ve silindirik olta tüpleri kargo şirketlerinde özel gabari tarifesine tabidir; nepreuzeti paket en pahalı iade grubundadır.<br>• 4.000 RSD üzeri ücretsiz kargo sunuluyor; tek bir iade tüm sepet kârını götürür.<br>• Hafta sonu avı için aceleyle sipariş verip adreste bulunamayan alıcıları eler. |
| **Mey Home Beograd**<br>`meyhome.rs` | WooCommerce, Elementor, Bex Express, Beograd | • Halı, yorgan ve nevresim takımları hacimli/metreküp olarak çok yer kaplar; çift yönlü Bex navlunu zararı büyüktür.<br>• Bex Express ilk seferde ulaşılamayan paketleri şubeye çekip iadeye düşürür; ön SMS onayı teslim oranını %95+ yapar.<br>• Apartman ve kat numarası eksikliklerini onay ekranında tamamlatır. |
| **Kafa Amigo**<br>`kafaamigo.rs` | WooCommerce, Sombor, Kafa Amigo PR | • Taze kavrulmuş kahve çekirdeği ve kapsüllerde bekleme süresine duyarlılık; günlerce kuryede gezen kahve aromasını yitirir.<br>• Kurucu Milan Gogić ile doğrudan hızlı iletişim.<br>• 1-of-1 kavrum tazeliği sadece kesin alıcılara kargolanır. |
| **Amelles Kozmetika**<br>`amelles.rs` | WooCommerce, Elementor, Vrnjačka Banja | • Doğal mineral cilt bakım serisi; 5.900 RSD üzeri ücretsiz kargo sunuluyor.<br>• Cam kavanoz ve hassas serum şişelerinin kargo araçlarında gereksiz taşınarak kırılma/hasar riskini önler.<br>• Kurumsal SMS onay ekranı butik doğal marka prestijini pekiştirir. |
| **Gifts 4 You**<br>`gifts4you.rs` | WooCommerce, Niš, Kişiye Özel Ahşap/Metal | • İsim, tarih ve fotoğraf kazınmış ürünlerde nepreuzet paket = %100 sermaye kaybı.<br>• İade edilen hediyelik ürün başka hiç kimseye satılamaz.<br>• Potvrdio SMS onayı gelmeden üretime/kargoya başlanmayarak fire sıfırlanır. |
| **Poklondžija**<br>`poklondzija.com` | WooCommerce, Beograd, Hediye Sepetleri & Gurme | • Çikolata, gurme peynir ve şarap içeren sepetlerde kurye araçlarında bekleme ürün kalitesini bozar.<br>• Alıcı adresi ve teslim tarihi randevusunun kargo öncesi SMS ile netleştirilmesi.<br>• Sürpriz hediye alıcısının adreste hazır bulunmasını sağlama. |
| **Pokupi.rs**<br>`pokupi.rs` | WooCommerce, Niš, Ev & Bahçe Aletleri | • Çim biçme, elektrikli testere ve ağır takım çantalarında nepreuzet paket çift yönlü yüksek navlun cezası çıkarır.<br>• Kapıda nakit ödeme tutarının SMS ile alıcıya hatırlatılması. |
| **Konga Music**<br>`kongamusic.rs` | WooCommerce, Novi Sad, Müzik Aletleri | • Gitar sapı, klavye ve amfilerin kargo aktarmalarında hasar görme riskini ve yüksek çift yönlü kargo navlununu kesme.<br>• Yerel Novi Sad komşu bağı ile güvenli kapıda ödeme. |
| **Street Moto Shop**<br>`streetmotoshop.rs` | WooCommerce, Beograd, Moto Ekipman & Kask | • Kask kutuları kuriyerlerde en yüksek desi tarifesine tabidir; dönen kaskın yüksek navlunu ve vitrin stoğunu bloke etmesi.<br>• Kask bedeninin (S, M, L, XL) SMS ekranında teyit ettirilerek beden iadelerinin önlenmesi. |
| **Isiland**<br>`isiland.rs` | WooCommerce, Beograd, Organik Bebek Giyim | • D2C organik bebek kıyafetlerinde kapıda nakit hazır edilmemesi veya eksik apartman/kat no nedeniyle iadelerin butik kâr marjını eritmesini önleme. |
| **Kolibri BEBE Shop**<br>`kolibribebeshop.rs` | WooCommerce, LiteSpeed, BEX Express, Niš | • Fiziksel mağazası olmayan, tamamen online çalışan D2C bebek tekstili.<br>• BEX Express teslim edemediği paketi şubeye çeker ve satıcıya çift yönlü navlun yazar; ön SMS teyidi iadeleri keser. |
| **Medenjaci.rs**<br>`medenjaci.rs` | WooCommerce, LiteSpeed, Domaći Medenjaci Biljana | • Düğün ve kutlamalar için isimli el yapımı taze medeniyeler kişiye özel ve jestividir; iade paket bayatlar, kırılır ve 100% çöpe gider.<br>• SMS teyidinde kutlama tarihinden önce teslimat güvencesi sunularak alıcı ciddiyeti sağlanır. |
| **Afa Baby Shop**<br>`afababy.rs` | WooCommerce, Elementor, Bebek Arabaları & Koltuklar | • Bebek arabası ve oto koltuğu kutuları 15-25 kg desi tutar; çift yönlü kargo faturası doğrudan kârı siler.<br>• Yeni anne-babaların eksik adres girişlerini Potvrdio onay ekranında tek tıkla düzeltme. |
| **Portobello Poklon Korpe**<br>`poklonkorpe.rs` | WooCommerce, GTM4WP, Novi Beograd YUBC | • Şarap şişesi ve ithal çikolata içeren sepetlerde kurye öncesi kesin teyit.<br>• Hediye sürprizi yapılan üçüncü şahsın telefon ve teslimat randevusunu garantiye alma. |
| **Mediflora Biljna Apoteka**<br>`biljna-apoteka.rs` | WooCommerce, Beograd Čelopečka, Bitkisel Tıp | • 30+ yıllık bitkisel eczane; cam damlalıklı şişelerin kurye araçlarında çalkalanarak kırılma riskini önleme.<br>• Telefon ve webden sipariş veren yaşlı kitlenin adres hatalarını SMS ile netleştirme. |
| **Izaberi Poklon**<br>`izaberipoklon.rs` | WooCommerce, Beograd, D2C Kişiye Özel Ürünler | • İsim, tarih ve fotoğraf baskılı peluş oyuncak, sihirli kupa ve taş baskılarda iade = %100 sermaye kaybı.<br>• Sosyal medya dürtüsel siparişlerini filtreleyerek sahte siparişleri engelleme. |
| **Gravura.rs**<br>`gravura.rs` | WooCommerce, D2C Lazer Atölyesi, Ahşap Gravür | • Lazer ile isim ve logo kazınan ahşap kutu ve kesme tahtaları geri döndüğünde hurdaya ayrılır.<br>• Ön SMS onayı ile müşteri sipariş ciddiyeti pekiştirilir. |
| **Štampane Majice**<br>`stampanemajice.rs` | WooCommerce, D2C Tekstil & Özel Baskı | • Sosyal medyadan gelen dürtüsel siparişlerdeki %15 vazgeçme oranını SMS ön teyidi sıfırlar.<br>• Teyit ekranında beden (S, M, L, XL) doğrulaması yapılarak beden kaynaklı iadeler önlenir. |
| **Greenshop.rs**<br>`greenshop.rs` | WooCommerce, GTM4WP, GA4, Eko & Doğal Kozmetik | • 5.000+ recenziye sahip yüksek hacimli mağazada %5lik iade düşüşü bile doğrudan binlerce euro tasarruf sağlar.<br>• Apartman ve bina giriş kodu eksikliklerini Potvrdio ekranında tek tıkla tamamlama. |
| **Slatkoteka ®**<br>`slatkoteka.rs` | WooCommerce, Beograd, Butik Donut & Pasta | • Günlük taze pasta ve donut teslimatında teslim alınmayan sipariş doğrudan çöpe atılır; ön SMS onayı sıfır fire sağlar.<br>• Alıcı adresi apartman/daire no detaylarının onay ekranında kesinleştirilmesi. |
| **Pikshop**<br>`pikshop.rs` | WooCommerce, Ahşap Oyuncak & Çocuk Dünyası | • Ahşap mutfak setleri ve bebek evleri masif ağır desili ürünlerdir; çift yönlü kargo kaybını önleme.<br>• Çocuk doğum günü öncesi teslimat teyidi ile alıcının adreste hazır olmasını sağlama. |


