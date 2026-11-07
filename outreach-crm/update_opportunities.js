const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Populating store growth opportunities and tech stack in SQLite DB...');

const storeOpportunities = [
  {
    website: 'https://animalmarket.rs',
    tech_stack: 'WooCommerce, Manuel Sipariş Teyidi, Kurumsal E-posta, Pet Kategori',
    growth_opportunities: `• Manuel Arama/Viber Yükü: Sipariş teyidi manuel telefon/mesajla yapılıyor; otomatik SMS teyidi ile adres hatası ve iş yükü elenebilir.
• Ağır Desi Navlunu: Büyük mama çuvallarında teslim alınmayan paket çift yönlü navlun zararı yazar.
• Kurye Entegrasyonu: Teyit edilen adresin doğrudan kurye adres fişine (adresnica) aktarılması sağlanabilir.`
  },
  {
    website: 'https://fashionstore.rs',
    tech_stack: 'WooCommerce, Fiziksel Butik + Online (Čačak), Kadın Giyim & Ayakkabı',
    growth_opportunities: `• Rafta Bekleme / Stok Kilitlenmesi: Butik kadın giyimde beden/ürün stok adedi sınırlıdır; kapıda ödemede bekleyen her teslim alınmamış koli ürünün başkasına satılmasını engeller.
• Beden/Numara Teyidi: Kadın giyimde en yüksek iade sebebi beden uyumsuzluğudur; Potvrdio onay ekranına 'Seçilen Beden: M - Beden Teyidi' seçeneği eklenebilir.
• Meta Pixel & CAPI İyileştirmesi: Instagram reklam trafiğinden gelen sepette bırakma olayları için dinamik yeniden hedefleme eksik.`
  },
  {
    website: 'https://sifonjer.rs',
    tech_stack: 'WooCommerce, Vintage / İkinci El Firmirana Garderoba, Tekil Ürün (1-of-1)',
    growth_opportunities: `• 1-of-1 Stok Riski: Her parça tek olduğu için teslim alınmayan paket sürecinde (7-10 gün kuryede) ürün tamamen bloke olur ve kaçan müşteri geri gelmez.
• 2 Saatlik Hızlı Rezervasyon/Onay: Kapıda ödeme siparişinde 2 saat içinde SMS teyidi gelmezse sipariş beklemeye alınıp başkasına rezerve edilebilir.`
  },
  {
    website: 'https://fermini.rs',
    tech_stack: 'WooCommerce, Tekstil & Giyim Kataloğu, Sırbistan Geneli Kargo',
    growth_opportunities: `• Kurye Çıkışı Sonrası Adres Hatası: Tekstil katalog siparişlerinde müşteri kapı/apartman numarasını eksik yazıyor; SMS ile tek tıkla adres düzeltme imkanı çift yönlü navlunu önler.
• Kargo Şeffaflığı: Kuryeye ödenecek net nakit tutar checkoutta ve teyit linkinde şeffaflaştırılmalı.`
  },
  {
    website: 'https://comfortino.rs',
    tech_stack: 'WooCommerce, Elementor (Element Pack, ElementsKit), FlyingPress, AKS Kurye, GA4, Canlı Destek Widget',
    growth_opportunities: `• Sübvanse Kargo Kaybı: Sitede kargo 'Dostava samo 250 din' olarak sabitlenmiş ve mağaza sübvanse ediyor. Nepreuzet pakette 250 din sübvansiyon + gidiş-dönüş AKS kargo doğrudan cepten çıkar.
• Elementor & Mobil Yük: Element Pack ve ElementsKit eklentileriyle mobil 4G'de checkout açılış süresi yavaş; hafif bir Potvrdio mobil akışı sepet terki oranını düşürür.
• Meta Pixel Eksikliği: Kodda aktif Meta Pixel bulunmuyor; Instagram'dan gelen ayakkabı alıcıları için sepette kalan ürün retargeting'i yapılamıyor.
• Hacimli Kutu Desisi: Çizme ve ayakkabı kutusu desisi yüksek olduğundan kargo öncesi SMS teyidi satıcıyı doğrudan korur.`
  },
  {
    website: 'https://petzooshop.rs',
    tech_stack: 'WooCommerce, Elementor, BEX Kurye, GA4, Tidio Chat, 6.000 RSD Ücretsiz Kargo',
    growth_opportunities: `• 14-15 kg Mama Çuvalı Navlunu: Pro Plan ve Dog Chow 14-15 kg çuvalları BEX ile gidiyor; nepreuzet paket navlunu en yüksek ürün grubudur.
• 6.000 RSD Nakit Hazırlığı: Müşteri ücretsiz kargo için yüksek tutarlı sipariş veriyor ancak kapıda nakit hazır etmeyebiliyor; kurye öncesi SMS ile nakit hatırlatması iadeyi önler.
• Kurye Adresnica Otomasyonu: BEX kurye portalına adres kopyalama iş yükü otomatikleştirilebilir.`
  },
  {
    website: 'https://perbipharm.rs',
    tech_stack: 'WooCommerce, AKS Kurye, Veteriner Eczane & Diyet Pet Mamaları',
    growth_opportunities: `• Hassas Veteriner Ürünleri: İlaç ve klinik mamaların kurye araçlarında günlerce beklemesi ürün kalitesini riske atar; adresin önceden doğrulanması şarttır.
• Sipariş Sonrası Viber/SMS Kargo Takibi: AKS takip numarası sipariş sonrasında müşterinin telefonuna otomatik düşürülmeli.`
  },
  {
    website: 'https://lekiko.rs',
    tech_stack: 'WooCommerce, Kragujevac Yerel Mağaza + Online, Telefonla Sipariş',
    growth_opportunities: `• Mağaza İçi Manuel Arama Yükü: Kragujevac mağaza ekibi sipariş teyidi için telefonla arama yapıyor; Potvrdio onay linki bu süreci tamamen otomatikleştirir.
• Checkout Sadeleştirme: Standart karmaşık form yerine telefonla sipariş veren müşteri kitlesine uygun 3 alanlı hızlı kapıda ödeme formu.`
  },
  {
    website: 'https://prodajaparfema.rs',
    tech_stack: 'WooCommerce, Elementor, 4.000 RSD Ücretsiz Kargo, Meta Pixel Aktif, GA4 Aktif, Orijinal Parfümler',
    growth_opportunities: `• Sahte/Ciddiyetsiz Alıcı Filtresi: Yüksek değerli orijinal parfümlerde (Hugo Boss, Armani, Club De Nuit) SMS onayı gelmeyen siparişler kargoya verilmeyerek sahte sipariş riski elenmeli.
• Yüksek Sepet Riski: 4.000 RSD üzeri ücretsiz kargo sunuluyor; tek bir iade paketi tüm sipariş marjını götürür.
• Form Optimizasyonu: Checkout sayfasında gereksiz posta kodu zorunluluğu var; mobil kullanıcılar için adres basitleştirilmeli.`
  },
  {
    website: 'https://fitaky.rs',
    tech_stack: 'WooCommerce, Elementor, %100 Doğal Bebek/Anne Kozmetiği, 3.500 RSD Ücretsiz Kargo',
    growth_opportunities: `• Anne-Bebek Teslimat Notu: Anneler bebek uyurken zil çalınmasını istemez; Potvrdio onay ekranında 'Kurye için özel not (örn: zili çalma, kapıyı tıkla)' alanı sunulmalı.
• Meta Pixel Eksikliği: D2C bebek markası olmasına rağmen Meta Pixel aktif değil; sepette kalan bebek ürünleri için reklam optimizasyonu yapılamıyor.
• 3.500 RSD Ücretsiz Kargo: D2C üreticide dönen her paket doğrudan kârı eritir.`
  },
  {
    website: 'https://eridan.rs',
    tech_stack: 'WooCommerce, AquaFarm Biyoteknoloji, "Isporuka 3 do 7 radnih dana", Meta Pixel Aktif, GA4 Aktif, Tidio Chat',
    growth_opportunities: `• Uzun Teslimat Penceresi (3-7 Gün): Kargo süresi 3-7 gün olduğu için kapıda ödemeli alıcı siparişi unutabiliyor veya vazgeçebiliyor; sipariş anında ve kargoya veriliş anında SMS/Viber bilgilendirmesi şart.
• Lüks D2C Deneyimi: VIP hissettiren şık bir Viber onay kartı ve teslimat günü hatırlatması iadeleri sıfırlar.`
  },
  {
    website: 'https://carna.rs',
    tech_stack: 'WooCommerce, Elementor, Radan Dağı Melisa Kozmetiği, Post Express Otkupnina, Hotjar/Clarity Aktif',
    growth_opportunities: `• Post Express Otkupnina Şeffaflığı: Post Express kuryesinin aldığı para transfer komisyonu (uputnica) Potvrdio onay ekranında şeffafça net gösterilerek kapıdaki itirazlar önlenmeli.
• Meta Pixel Eksikliği: Hotjar ile kullanıcı hareketlerini izliyorlar ancak reklam pikseli eksik; terk edilen sepetler yeniden hedeflenemiyor.`
  },
  {
    website: 'https://purahomespa.rs',
    tech_stack: 'WooCommerce, Elementor, Marija Đukić PR Beograd, 4.500 RSD Ücretsiz Kargo, GA4 Aktif, Canlı Destek',
    growth_opportunities: `• Gereksiz Şirket Alanı: Bireysel spa/aromaterapi alıcılarına checkout'ta şirket adı soruluyor; form sürtünmesi sepet terkine neden oluyor.
• Hediye Siparişlerinde Adres Teyidi: Oda kokusu ve mumlar sıklıkla başkasına hediye gönderiliyor; teslim alacak kişinin telefon numarasının teyidi teslimat oranını artırır.`
  },
  {
    website: 'https://pravialati.rs',
    tech_stack: 'WooCommerce, Elementor, Ingco Akülü/Elektrikli El Aletleri, Ağır Takım Çantaları, GA4 Aktif',
    growth_opportunities: `• Ağır Koli Desi Navlunu: Matkap ve taşlama makineleri iade olduğunda çift yönlü kargo çok yüksek fatura çıkarır.
• Nakit Hazırlığı Hatırlatması: 5.000–15.000 RSD arası yüksek tutarlı el aleti siparişlerinde kurye öncesi SMS ile nakit tutar hatırlatılmalı.`
  },
  {
    website: 'https://ac-vinulovic.rs',
    tech_stack: 'WooCommerce, Elementor, Negotin, Agro/Traktör Lastikleri, C-Kombi Lastikleri, Aküler, GA4 Aktif',
    growth_opportunities: `• En Yüksek Desi & Mesafe Maliyeti: Negotin'den tüm Sırbistan'a gönderilen lastik ve aküler e-ticaretin en ağır grubudur; bir iade yüzlerce dinar zarar yazar.
• Ebat ve Uyumluluk Teyidi: Lastik ebatının (örn. 205/55 R16) müşteri tarafından yanlış seçilmesi sık görülür; SMS onay ekranına ebat teyidi eklenebilir.`
  },
  {
    website: 'https://kaninobuca.com',
    tech_stack: 'WooCommerce, Niš El Yapımı Hakiki Deri Ayakkabı, 12.000 RSD Ücretsiz Kargo',
    growth_opportunities: `• Piksel & Analitik Eksikliği: Sitede GA4 ve Meta Pixel dahi eksik; tamamen organik veya Instagram DM ile dönüyor.
• 10 Günlük Stok Kilitlenmesi: 10.000+ RSD değerindeki deri ayakkabı kapıda ödeme iadesinde 10 gün kuryede mahsur kalıyor; 24 saat içinde SMS onayı gelmeyen sipariş beklemeye alınmalı.`
  },
  {
    website: 'https://ljuba.rs',
    tech_stack: 'WooCommerce, Elementor, LiteSpeed Cache, Subotica (Ljuba 024 d.o.o.), Demon Tırpan & Testere',
    growth_opportunities: `• 8-10 kg Motorlu Makine İade Navlunu: Benzinli tırpan ve motorlu testere paketlerinin iadesinde ödenen yüksek çift yönlü navlun.
• Çapraz Satış (Cross-sell): Tırpan alan müşteriye Potvrdio SMS onay ekranında 'Tırpan yağı ve misina da eklemek ister misiniz?' sepet artırma fırsatı.`
  }
];

const updateStmt = db.prepare(`
  UPDATE stores SET
    tech_stack = ?,
    growth_opportunities = ?,
    updated_at = CURRENT_TIMESTAMP
  WHERE website = ?
`);

for (const item of storeOpportunities) {
  updateStmt.run(item.tech_stack, item.growth_opportunities, item.website);
  console.log(`✅ Stored opportunities for: ${item.website}`);
}

console.log('🎉 All store-specific growth opportunities successfully recorded!');
