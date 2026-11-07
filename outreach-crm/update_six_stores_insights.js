const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Updating in-depth insights and templates for 6 stores...');

const storesData = [
  {
    id: 21,
    slug: 'custom-bplus',
    name: 'B Plus (Nameštaj Bplus)',
    sector: 'Mobilya & Ev Dekorasyonu (Nameštaj)',
    phone: '+381 60 0600 858',
    city: 'Sırbistan Geneli',
    legal_entity: 'B Plus Nameštaj',
    tech_stack: 'WooCommerce, WordPress, Özel Kargo & Montaj Takip, Kurumsal E-posta',
    hook_note: 'Ağır ev mobilyası ve Cilek çocuk odası satışı. Hacimli mobilya teslimatında alıcıya ulaşılamaması çift yönlü yüksek navlun ve montaj ekibi maliyeti yaratıyor.',
    growth_opportunities: '• Hacimli Navlun & Lojistik Riski: Koltuk, yatak ve gardırop gibi ağır mobilyaların kargolanmasında teslim alınmayan tek bir sipariş, çift yönlü araç tahsisi ve yüksek nakliye zararı yazar.\n• Teslimat & Montaj Randevusu: Müşterinin adreste bulunmaması montaj ekiplerinin planını bozar; SMS ile adres ve uygunluk teyidi lojistik koordinasyonunu otomatikleştirir.\n• Kaparo & Bakiye Tahsilatı: %30 avans sonrası kalan bakiyenin teslimatta sorunsuz ödenmesi için ön teyit güvence sağlar.',
    subject: 'isporuka nameštaja i adresa pre slanja, Bplus',
    opening: 'Video sam da Nameštaj Bplus šalje kompletan nameštaj za dom širom Srbije. Kod tako gabaritnih i teških paketa, pogrešna adresa ili kupac koji nije kod kuće znači ogroman logistički trošak i povratnu vožnju, što direktno ugrožava maržu.'
  },
  {
    id: 22,
    slug: 'custom-bosshop',
    name: 'Boss Shop (B.O.S. Shop)',
    sector: 'Elektrikli El Aletleri & Bahçe Makineleri',
    phone: '+381 34 300 000',
    city: 'Kragujevac',
    legal_entity: 'B.O.S. Shop Kragujevac',
    tech_stack: 'WooCommerce, ERP/Stok Entegrasyonu, Çoklu Şube Yönetimi, LiteSpeed',
    hook_note: '15.000 RSD üzeri ve 50 kg’a kadar ücretsiz kargo. Bosch, Makita ve ağır bahçe makinelerinde iade dönen 20-50 kg ağır kolilerde çift yönlü navlun kaybı.',
    growth_opportunities: '• 50 kg Ağır Navlun Sübvansiyonu: 15.000 RSD üzeri 50 kg’a kadar kargo ücretsiz sunuluyor; teslim alınmayan ağır sanayi tipi makineler çift yönlü ağır navlun faturası çıkarır.\n• Yetkili Servis & Garanti Güveni: Profesyonel ustalara giden aletlerde yanlış adres iş kaybı yaratır.\n• İki İş Gününde Teslim: 12:00 öncesi siparişlerde 2 günde teslimat taahhüdü veriliyor, ön teyit hızlandırır.',
    subject: 'paketi do 50 kg i besplatna dostava, B.O.S. Shop',
    opening: 'Video sam da B.O.S. Shop nudi besplatnu dostavu za porudžbine preko 15.000 RSD do čak 50 kg težine. Kod teških alata i mašina povratni paket stvara izuzetno visoku poštarinu u oba smera, koja može potpuno da obriše zaradu sa te prodaje.'
  },
  {
    id: 23,
    slug: 'custom-djomlabike',
    name: 'Djomla Bike',
    sector: 'Bisiklet, E-Bike & Ekipman',
    phone: '+381 60 42 55 266',
    city: 'Čačak (Vojvode Stepe 165)',
    legal_entity: 'Djomla Bike Čačak',
    tech_stack: 'WooCommerce, Elementor, LiteSpeed Cache, Kurumsal E-posta',
    hook_note: '8.000 RSD üzeri ücretsiz kargo ve kapıda ödeme. Bisiklet kolilerinin devasa desi hacmi nedeniyle geri dönen bisiklet yüksek navlun zararı yazar ve vitrin stoğunu kilitler.',
    growth_opportunities: '• Devasa Desi / Hacim Riski: Bisiklet kutuları e-ticaretteki en yüksek desili ürünlerdendir; Çaçak’tan gönderilen ve teslim alınmayan bir bisikletin çift yönlü navlunu çok pahalıdır.\n• Sezonluk Butik Stok: E-bike ve özel dağ bisikletleri tekil stoklarla çalışır; kargoda günlerce gezen bisiklet mağazada başka bir müşteriye satılamaz.\n• 8.000 RSD Üzeri Kargo Maliyeti: Ücretsiz kargo eşiği aşıldığında nakliye mağaza tarafından karşılandığı için iadeler doğrudan kârı eritir.',
    subject: 'slanje bicikala i besplatna dostava preko 8.000 RSD, Djomla Bike',
    opening: 'Video sam da Djomla Bike iz Čačka nudi besplatnu dostavu za porudžbine bicikala i opreme preko 8.000 RSD. Kod bicikala su kutije izuzetno gabaritne (veliki desi), pa jedan nepreuzet paket stvara skupu povratnu poštarinu i danima drži bicikl van prodaje.'
  },
  {
    id: 24,
    slug: 'custom-luxshop',
    name: 'Lux Shop',
    sector: 'Genel E-Ticaret, Küçük Ev Aletleri & Oto Aksesuar',
    phone: '+381 62 812 4044',
    city: 'Senjak, Beograd',
    legal_entity: 'Lux Shop Online',
    tech_stack: 'WooCommerce, Meta Pixel, 10% Bundle Discount Plugin, Fast Checkout',
    hook_note: 'Tamamen kapıda ödeme (pouzeće) odaklı 2.000+ ürünlük katalog. İmpulsif alışverişte teslim alınmayan paket oranının yüksekliği ve gereksiz kargo maliyetleri.',
    growth_opportunities: '• İmpulsif Kapıda Ödeme Riski: Sosyal medya reklamlarından gelen dürtüsel siparişlerde vazgeçme ve teslim almayan müşteri oranı %15-20’lere çıkabilir; SMS ile ön onay ciddiyetsiz alıcıları eler.\n• 3+ Ürüne %10 İndirim Paketi: Çoklu sepetlerde sepet tutarı yükseldikçe teslimatsızlık riski ve taşıma maliyeti artar.\n• 1-3 Günlük Hızlı Sevkiyat: Kargoya çıkmadan önce SMS ile onay alınması kurye çıkışında adreste bulunamama sorununu çözer.',
    subject: 'pouzeće i smanjenje nepreuzetih paketa, Lux Shop',
    opening: 'Video sam da Lux Shop ima preko 2.000 artikala i da se većina porudžbina šalje pouzećem uz brzu isporuku od 1-3 dana. Kod takvog asortimana neozbiljne porudžbine i nepreuzeti paketi donose stalne troškove duple poštarine, a potvrda pre slanja to rešava.'
  },
  {
    id: 25,
    slug: 'custom-saloninfo',
    name: 'Salon Info',
    sector: 'Profesyonel Kozmetik & Kuaför/Salon Ekipmanları',
    phone: '+381 11 000 000',
    city: 'Beograd',
    legal_entity: 'Salon Info d.o.o.',
    tech_stack: 'WooCommerce, B2B/B2C Katalog, Profesyonel Salon Dağıtım Ağı',
    hook_note: 'Kuaför ve güzellik salonlarına litrelik profesyonel ürün sevkiyatı. Yüksek sepet tutarı ve salona teslimatta adres eksiklikleri.',
    growth_opportunities: '• B2B Salon Randevu & Saat Uyumsuzluğu: Kuaför ve güzellik salonları yoğun çalıştığı için kurye geldiğinde yetkili bulunamayabiliyor; ön onay teslimat başarısını artırır.\n• Ağır Sıvı / Litrelik Şampuan ve Boya Paketleri: Ağır ve dökülme riski olan kargolarda iade navlunu hem pahalıdır hem de ambalaj yıpranmasına yol açar.\n• Profesyonel Müşteri Sadakati: Randevulu çalışan salonlara zamanında ve teyitli teslimat B2B tekrar sipariş oranını yükseltir.',
    subject: 'profesionalna kozmetika i sigurnija dostava, Salon Info',
    opening: 'Video sam da Salon Info snabdeva frizerske i kozmetičke salone profesionalnim preparatima širom Srbije. Kod narudžbina za salone i teških paketa, pogrešna adresa ili odsutan primalac stvara trošak duple poštarine i remeti rad frizera koji čekaju robu.'
  },
  {
    id: 26,
    slug: 'custom-kozmetikamoja',
    name: 'Kozmetika Moja',
    sector: 'Doğal & El Yapımı Kozmetik',
    phone: '+381 64 2589 449',
    city: 'Sırbistan Geneli',
    legal_entity: 'Kozmetika Moja',
    tech_stack: 'WooCommerce, RankMath SEO, Elementor, Woodmart Tema, BEX Kurye',
    hook_note: 'BEX ile gönderim, 5.000 RSD üzeri ücretsiz kargo, 490 RSD sabit teslimat. 3-5 günlük bekleme süresinde kapıda ödemeden cayma riski.',
    growth_opportunities: '• 5.000 RSD Üzeri Çift Yönlü Navlun Zararı: Mağaza 5.000 RSD üzeri siparişlerde 490 RSD kargoyu karşılıyor; iade dönen paket yaklaşık 1.000 RSD navlun zararı yazıp küçük butiğin tüm kârını siler.\n• 3-5 İş Günü Teslimat Penceresi: Butik üretim nedeniyle süre 3-5 güne uzadığında müşterinin siparişi unutma veya evde olmama ihtimali artar.\n• BEX Kurye Adres Doğrulaması: Alıcının sokak/daire numarasını SMS ile tek tıkla düzeltmesi BEX kuryelerinin adresi bulamama sorununu önler.',
    subject: 'besplatna dostava preko 5.000 RSD i BEX, Kozmetika Moja',
    opening: 'Pratim rad brenda Kozmetika Moja i video sam da nudite besplatnu dostavu preko 5.000 RSD putem BEX-a. Kod prirodne kozmetike i roka isporuke od 3 do 5 dana, jedan nepreuzet paket na pouzeću znači plaćenu poštarinu u oba smera i briše zaradu cele porudžbine.'
  }
];

const updateStoreStmt = db.prepare(`
  UPDATE stores
  SET sector = ?,
      phone = COALESCE(?, phone),
      city = COALESCE(?, city),
      priority = 'p1_verified',
      hook_note = ?,
      growth_opportunities = ?,
      tech_stack = ?,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

const insertTmplStmt = db.prepare(`
  INSERT INTO templates (slug, title, category, subject, body)
  VALUES (?, ?, 'custom_tailored', ?, ?)
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    subject = excluded.subject,
    body = excluded.body
`);

const BLOK1 = `Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.`;

const BLOK2 = `Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.`;

for (const s of storesData) {
  // Update Store
  updateStoreStmt.run(s.sector, s.phone, s.city, s.hook_note, s.growth_opportunities, s.tech_stack, s.id);
  
  // Create Template
  const body = `Poštovani,\n\n${s.opening}\n\n${BLOK1}\n\n${BLOK2}`;
  insertTmplStmt.run(s.slug, `${s.name}: Kişiselleştirilmiş Kanca & Düşük Sürtünmeli CTA`, s.subject, body);
  console.log(`✅ Processed insights & template for Store #${s.id} (${s.name})`);
}

console.log('🎉 All 6 stores updated with rich insights & templates in database!');
