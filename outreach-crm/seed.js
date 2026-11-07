const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'potvrdio_outreach.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

console.log('🔄 Initializing database at:', dbPath);
const db = new DatabaseSync(dbPath);

// Execute schema
db.exec(schemaSql);

// Clean existing data for a clean seed
db.exec(`
  DELETE FROM communications;
  DELETE FROM templates;
  DELETE FROM stores;
  DELETE FROM sqlite_sequence WHERE name IN ('stores', 'communications', 'templates');
`);

console.log('📦 Seeding stores...');

const insertStore = db.prepare(`
  INSERT INTO stores (
    name, website, sector, email, phone, city, legal_entity, priority, status, hook_note, notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const storesData = [
  // P1 Verified Stores
  {
    name: 'Animal Market',
    website: 'https://animalmarket.rs',
    sector: 'Pet Shop & Hayvan Yemi',
    email: 'shop@animalmarket.rs',
    phone: '+381 63 824 66 89',
    city: 'Sırbistan Geneli',
    legal_entity: 'Animal Market',
    priority: 'p1_verified',
    status: 'email_sent',
    hook_note: 'Sitede açıkça sipariş sonrası mesajla teyit yapıldığı yazıyor. Kanca: Onay ve adres kontrolünü otomatikleştirme.',
    notes: 'İlk pilot adayı. 13 Ekim Salı 10:06’da Şablon A e-postası gönderildi. 24-48 saat sonra yanıt gelmezse takip e-postası atılacak.'
  },
  {
    name: 'Fashion Store',
    website: 'https://fashionstore.rs',
    sector: 'Kadın Giyim & Butik',
    email: 'info@fashionstore.rs',
    phone: '064/307-19-52',
    city: 'Čačak',
    legal_entity: 'Fashion Store Čačak',
    priority: 'p1_verified',
    status: 'email_sent',
    hook_note: 'Čačak’ta fiziksel butik + online satış. Kanca: 2 yönlü kargo maliyeti ve iade sürecinde ürünün raftan düşüp başkasına satılamaması.',
    notes: '14 Ekim’de Şablon B1 gönderildi (İlk 25 kapıda ödeme siparişi veya 30 gün ücretsiz beta teklifi).'
  },
  {
    name: 'Šifonjer',
    website: 'https://sifonjer.rs',
    sector: 'Polovna Firmirana Garderoba',
    email: 'podrska@sifonjer.rs',
    phone: null,
    city: 'Sırbistan Geneli',
    legal_entity: 'Šifonjer',
    priority: 'p1_verified',
    status: 'email_sent',
    hook_note: 'İkinci el / vintage tekil ürünler. Kanca: Her parça 1-of-1 (tek) olduğu için iade sürecinde başkasına satılamayan ürün kaybı riski yüksek.',
    notes: '14 Ekim’de Şablon B2 gönderildi.'
  },
  {
    name: 'Fermini',
    website: 'https://fermini.rs',
    sector: 'Giyim & Tekstil',
    email: 'info@fermini.rs',
    phone: '+381 64 032 3362',
    city: 'Sırbistan Geneli',
    legal_entity: 'Fermini',
    priority: 'p1_verified',
    status: 'email_sent',
    hook_note: 'Geniş giyim/tekstil kataloğu. Kanca: Kurye yola çıktıktan sonra fark edilen yanlış adres ve çift yönlü kargo maliyeti.',
    notes: '14 Ekim’de Şablon B3 gönderildi.'
  },
  {
    name: 'Comfortino',
    website: 'https://comfortino.rs',
    sector: 'Anatomik & Medikal Ayakkabı',
    email: 'obuca.comfortino@gmail.com',
    phone: '063 351 060',
    city: 'Sırbistan Geneli',
    legal_entity: 'Comfortino Obuća',
    priority: 'p1_verified',
    status: 'email_sent',
    hook_note: 'Niş Ayakkabı: Aktif WooCommerce mağazası. [Hipotez: Ayakkabı kutularının kargo desisi yüksek olduğundan teslimat onayı satıcıyı korur].',
    notes: 'Gönderildi (15 Ekim, 11:00). AKS kurye + ayakkabı desi kancası.'
  },
  {
    name: 'Pet Zoo Shop',
    website: 'https://petzooshop.rs',
    sector: 'Pet Shop & Mama',
    email: 'info@petzooshop.rs',
    phone: '+381 63 455 955',
    city: 'Sırbistan Geneli',
    legal_entity: 'Pet Zoo Shop',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'Pet Ürünleri: Aktif WooCommerce sepeti ve kapıda ödeme. [Hipotez: Ağır mama çuvallarının gidiş-dönüş kargo maliyeti yüksektir].',
    notes: 'Sonraki dalga hedefi (Ağır mama çuvalı kargo riski).'
  },
  {
    name: 'Perbipharm',
    website: 'https://perbipharm.rs',
    sector: 'Veteriner Eczane & Pet Hrana',
    email: 'office@perbipharm.rs',
    phone: '+381 63 692 229',
    city: 'Sırbistan Geneli',
    legal_entity: 'Perbipharm',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'Veteriner Ürünleri: Aktif WooCommerce e-ticaret akışı ve kapıda nakit ödeme.',
    notes: 'Klinik & mama karması; güven ve teyit önemli.'
  },
  {
    name: 'Lekiko',
    website: 'https://lekiko.rs',
    sector: 'Pet Shop',
    email: 'info@lekiko.rs',
    phone: '+381 63 224 490',
    city: 'Kragujevac',
    legal_entity: 'Lekiko Pet Shop Kragujevac',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'Bölgesel Pet Shop: Kragujevac merkezli, Sırbistan geneline kapıda ödeme ile gönderim yapan aktif mağaza.',
    notes: 'Kragujevac yerel butik e-ticaret örneği.'
  },
  {
    name: 'Prodaja Parfema',
    website: 'https://prodajaparfema.rs',
    sector: 'Parfüm & Kozmetik',
    email: 'info@prodajaparfema.rs',
    phone: '069/100-1996',
    city: 'Sırbistan Geneli',
    legal_entity: 'Prodaja Parfema RS',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'Parfüm E-Ticaret: Aktif WooCommerce sepeti. [Hipotez: Yüksek sepet tutarlı siparişlerde sahte alıcı ve asılsız sipariş filtresi sağlar].',
    notes: 'Yüksek sepet ortalaması nedeniyle sahte sipariş önleme değeri çok net.'
  },
  {
    name: 'Fitaky',
    website: 'https://fitaky.rs',
    sector: 'Doğal Bebek & Aile Kozmetiği',
    email: 'kontakt@fitaky.rs',
    phone: '+381 60 700 4033',
    city: 'Sırbistan Geneli',
    legal_entity: 'Fitaky Beauty & Baby',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'D2C Doğal Kozmetik: Temiz WooCommerce sepeti ve kapıda nakit ödeme. Anne-bebek odaklı yerel üretici.',
    notes: 'D2C butik yerel üretici, marka değeri ve müşteri memnuniyetine önem veriyor.'
  },
  {
    name: 'Eridan',
    website: 'https://eridan.rs',
    sector: 'Cilt Bakımı & Kozmetik',
    email: 'info@eridan.rs',
    phone: '+381 65 20 54 710',
    city: 'Beograd',
    legal_entity: 'Eridan Green d.o.o. (Patrijarha Varnave 48, Beograd)',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'D2C Kozmetik: Patrijarha Varnave 48, Beograd adresli kayıtlı şirket. Aktif WooCommerce 11.2 sepeti ve kapıda ödeme.',
    notes: 'Kurumsal yapısı sağlam D2C cilt bakım markası.'
  },
  {
    name: 'Čarna',
    website: 'https://carna.rs',
    sector: 'El Yapımı Bitkisel Kozmetik',
    email: 'info@carna.rs',
    phone: '+381 64 030 5900',
    city: 'Sırbistan Geneli',
    legal_entity: 'Čarna Kozmetika',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'Butik Kozmetik: Aktif WooCommerce mağazası. Sitede Post Express otkupnina şartları açıkça belirtilmiş.',
    notes: 'Post Express teslimat kurallarını sitede özel olarak vurgulamışlar.'
  },
  {
    name: 'Pura Home Spa',
    website: 'https://purahomespa.rs',
    sector: 'Aromaterapi & Spa Ürünleri',
    email: 'purakozmetika@gmail.com',
    phone: null,
    city: 'Sırbistan Geneli',
    legal_entity: 'Pura Home Spa',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'Butik D2C: Aktif WooCommerce sepeti ve kapıda nakit ödeme seçeneği.',
    notes: 'Doğal mum, oda kokusu ve spa ürünleri.'
  },
  {
    name: 'Pravi Alati',
    website: 'https://pravialati.rs',
    sector: 'Hobi & El Aletleri',
    email: 'info@pravialati.rs',
    phone: '+381 64 648 8279',
    city: 'Sırbistan Geneli',
    legal_entity: 'Pravi Alati',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'Teknik Ekipman: Aktif WooCommerce sepeti ve kapıda ödeme. Hırdavat ve el aletleri satışı.',
    notes: 'Ağır el aleti kutuları ve yüksek sepet tutarları.'
  },
  {
    name: 'AC Vinulović',
    website: 'https://ac-vinulovic.rs',
    sector: 'Oto Lastik & Akü',
    email: 'shop@ac-vinulovic.rs',
    phone: '062/815-7483',
    city: 'Negotin',
    legal_entity: 'AC Vinulović Negotin',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'Oto Donanım: Aktif WooCommerce sepeti. Ağır desi ürünlerde (lastik/akü) kapıda nakit ödeme sunuyor.',
    notes: 'En yüksek kargo desi maliyetine sahip kategorilerden biri.'
  },
  {
    name: 'Kanin Obuća',
    website: 'https://kaninobuca.com',
    sector: 'Ayakkabı & Deri',
    email: 'info@kaninobuca.com',
    phone: '+381 18 590 158',
    city: 'Niš',
    legal_entity: 'Kanin Obuća (Miodraga Petrovića Čkalje 2, 18000 Niš)',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'Niş ayakkabı üreticisi. Güncel Niš merkezi doğrulandı (Önceki TC Kalča eski dükkandı).',
    notes: 'Eski kanin.rs domaini kaninobuca.com adresine yönleniyor.'
  },
  {
    name: 'Ljuba 024',
    website: 'https://ljuba.rs',
    sector: 'Hırdavat & Bahçe Malzemeleri',
    email: 'info@ljuba024.com',
    phone: '+381 65 463 1313',
    city: 'Subotica',
    legal_entity: 'Ljuba 024 d.o.o. Subotica',
    priority: 'p1_verified',
    status: 'not_contacted',
    hook_note: 'Subotica tescilli ticari unvan Ljuba 024 d.o.o. Alan adı ljuba.rs, kurumsal iletişim info@ljuba024.com.',
    notes: 'Yerel ve güvenilir ticaret firması.'
  },

  // P2 Unverified / Secondary Pool
  {
    name: 'Backup Shop',
    website: 'https://backupshop.rs',
    sector: 'Elektronik & Aksesuar',
    email: null,
    phone: null,
    city: 'Sırbistan',
    legal_entity: 'Backup Shop',
    priority: 'p2_unverified',
    status: 'not_contacted',
    hook_note: 'Sitede açık kurumsal e-posta bulunmuyor; sadece web formu ve telefon mevcut.',
    notes: 'İkincil havuz. Doğrudan e-posta bulunursa önceliklendirilebilir.'
  },
  {
    name: 'JAT Fashion',
    website: 'https://jatfashion.rs',
    sector: 'Moda & Giyim',
    email: null,
    phone: null,
    city: 'Sırbistan',
    legal_entity: 'JAT Fashion',
    priority: 'p2_unverified',
    status: 'not_contacted',
    hook_note: 'Açık e-posta yok (Web form / Telefon).',
    notes: 'İkincil havuz.'
  },
  {
    name: 'Ollies',
    website: 'https://ollies.rs',
    sector: 'Giyim',
    email: null,
    phone: null,
    city: 'Sırbistan',
    legal_entity: 'Ollies',
    priority: 'p2_unverified',
    status: 'not_contacted',
    hook_note: 'Açık e-posta yok.',
    notes: 'İkincil havuz.'
  },
  {
    name: 'B Plus',
    website: 'https://bplus.rs',
    sector: 'Kozmetik & Bakım',
    email: null,
    phone: null,
    city: 'Sırbistan',
    legal_entity: 'B Plus',
    priority: 'p2_unverified',
    status: 'not_contacted',
    hook_note: 'Açık e-posta yok.',
    notes: 'İkincil havuz.'
  },
  {
    name: 'Boss Shop',
    website: 'https://bosshop.rs',
    sector: 'Genel E-Ticaret',
    email: null,
    phone: null,
    city: 'Sırbistan',
    legal_entity: 'Boss Shop',
    priority: 'p2_unverified',
    status: 'not_contacted',
    hook_note: 'Açık e-posta yok.',
    notes: 'İkincil havuz.'
  },
  {
    name: 'Djomla Bike',
    website: 'https://djomla-bike.rs',
    sector: 'Bisiklet & Ekipman',
    email: null,
    phone: null,
    city: 'Sırbistan',
    legal_entity: 'Djomla Bike',
    priority: 'p2_unverified',
    status: 'not_contacted',
    hook_note: 'Açık e-posta yok.',
    notes: 'İkincil havuz.'
  },
  {
    name: 'Lux Shop',
    website: 'https://luxshop.rs',
    sector: 'Hediyelik & Lüks Eşya',
    email: null,
    phone: null,
    city: 'Sırbistan',
    legal_entity: 'Lux Shop',
    priority: 'p2_unverified',
    status: 'not_contacted',
    hook_note: 'Açık e-posta yok.',
    notes: 'İkincil havuz.'
  },
  {
    name: 'Salon Info',
    website: 'https://saloninfo.rs',
    sector: 'Kuaför & Salon Ürünleri',
    email: null,
    phone: null,
    city: 'Sırbistan',
    legal_entity: 'Salon Info',
    priority: 'p2_unverified',
    status: 'not_contacted',
    hook_note: 'Açık e-posta yok.',
    notes: 'İkincil havuz.'
  },
  {
    name: 'Kozmetika Moja',
    website: 'https://kozmetikamoja.rs',
    sector: 'Kozmetik',
    email: null,
    phone: null,
    city: 'Sırbistan',
    legal_entity: 'Kozmetika Moja',
    priority: 'p2_unverified',
    status: 'not_contacted',
    hook_note: 'Açık e-posta yok.',
    notes: 'İkincil havuz.'
  },
  {
    name: 'Fagor',
    website: 'https://fagor.rs',
    sector: 'Ev Aletleri & Beyaz Eşya',
    email: 'info@fagor.rs',
    phone: null,
    city: 'Beograd',
    legal_entity: 'Apejron d.o.o. (Coral Electric)',
    priority: 'disqualified',
    status: 'rejected',
    hook_note: 'Apejron d.o.o. 30 yıllık geçmişi, showroom ve servis ağı olan büyük distribütör.',
    notes: 'Erken aşama kapalı beta için uygun değil (Çok büyük kurumsal yapı).'
  },
  {
    name: 'CF Moto Delovi',
    website: 'https://cfmotodelovi.rs',
    sector: 'Motosiklet Yedek Parça',
    email: 'info@cfmotodelovi.rs',
    phone: null,
    city: 'Beograd',
    legal_entity: 'Guevara d.o.o.',
    priority: 'disqualified',
    status: 'rejected',
    hook_note: 'CFMOTO resmi distribütör yapısı.',
    notes: 'Bağımsız mağaza değil, resmi holding distribütör parçası.'
  },
  {
    name: 'PC Group',
    website: 'https://pcgroup.rs',
    sector: 'Oto Yedek Parça',
    email: 'office@pcgroup.rs',
    phone: null,
    city: 'Sırbistan',
    legal_entity: 'PC Group d.o.o.',
    priority: 'disqualified',
    status: 'rejected',
    hook_note: 'Peugeot / Citroen yedek parça distribütörü.',
    notes: 'Büyük toptan/distribütör formatı.'
  }
];

storesData.forEach(store => {
  insertStore.run(
    store.name,
    store.website,
    store.sector,
    store.email,
    store.phone,
    store.city,
    store.legal_entity,
    store.priority,
    store.status,
    store.hook_note,
    store.notes
  );
});

console.log(`✅ Inserted ${storesData.length} stores.`);

// Seed Templates
console.log('📝 Seeding Serbian outreach templates...');

const insertTemplate = db.prepare(`
  INSERT INTO templates (slug, title, category, subject, body)
  VALUES (?, ?, ?, ?, ?)
`);

const templatesData = [
  {
    slug: 'sablon-a',
    title: 'Şablon A (Animal Market & Manuel Teyit Yapan Mağazalar)',
    category: 'first_touch',
    subject: 'Automatizacija provere adrese i potvrde za {{STORE_NAME}} (WooCommerce)',
    body: `Poštovani,

Na vašem sajtu piše da vaš tim nakon porudžbine kontaktira kupce radi potvrde porudžbine i isporuke. Kod plaćanja pouzećem to je ručni posao za svaku porudžbinu, a pogrešna adresa se često otkrije tek kada je kurir već krenuo.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji taj korak radi automatski: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: dve nedelje, besplatno, na stvarnim porudžbinama. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl, pa vam šaljem detalje.

Srdačan pozdrav,
Atıl Bilge Örüm
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556`
  },
  {
    slug: 'sablon-a-followup',
    title: 'Şablon A Takip (24-48 Saat Hatırlatma / 30 Sn Demo)',
    category: 'followup',
    subject: 'Re: Automatizacija provere adrese i potvrde za {{STORE_NAME}} (WooCommerce)',
    body: `Poštovani,

Znam da vam je radno vreme puno pakovanja i obrade porudžbina, pa ću biti sasvim kratak.

Testiranje ne zahteva nikakve izmene na vašem sajtu niti tehničke rizike. Ako vas zanima samo da vidite kratak primer (30 sekundi) kako to izgleda na telefonu kupca pre nego što kurir uopšte preuzme paket, mogu vam poslati link?

Pozdrav,
Atıl`
  },
  {
    slug: 'sablon-b-fashion',
    title: 'Şablon B1 (Fashion Store - Butik & Çift Yönlü Kargo Riski)',
    category: 'first_touch',
    subject: 'Potvrda adrese za porudžbine pouzećem, Fashion Store',
    body: `Poštovani,

Video sam da pored radnje u Čačku imate i online prodavnicu sa plaćanjem pouzećem. Svaki nepreuzet paket znači plaćenu dostavu u oba smera i artikal koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije (šta pre istekne). Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556`
  },
  {
    slug: 'sablon-b-sifonjer',
    title: 'Şablon B2 (Šifonjer - İkinci El / 1-of-1 Tekil Ürün Kaybı)',
    category: 'first_touch',
    subject: 'Potvrda adrese za porudžbine pouzećem, Šifonjer',
    body: `Poštovani,

Video sam da prodajete polovnu firmiranu garderobu uz plaćanje pouzećem. Kod polovne garderobe je svaki komad jedinstven, pa nepreuzet paket znači plaćenu dostavu u oba smera i komad koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li biste bili zainteresovani? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556`
  },
  {
    slug: 'sablon-b-fermini',
    title: 'Şablon B3 (Fermini - Geniş Katalog & Kurye Çıkışı Yanlış Adres)',
    category: 'first_touch',
    subject: 'Potvrda adrese za porudžbine pouzećem, Fermini',
    body: `Poštovani,

Video sam da imate širok asortiman odeće i tekstila uz plaćanje pouzećem. Pogrešna adresa se često otkrije tek kada je kurir već krenuo, a to znači nepreuzet paket i plaćenu dostavu u oba smera.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556`
  },
  {
    slug: 'sablon-general-custom',
    title: 'Şablon C (Genel WooCommerce / Yüksek Desi & Kapıda Ödeme)',
    category: 'first_touch',
    subject: 'Potvrda adrese za porudžbine pouzećem, {{STORE_NAME}}',
    body: `Poštovani,

Video sam da imate aktivan WooCommerce sa plaćanjem pouzećem. Nepreuzet paket ili pogrešna adresa znači plaćenu dostavu u oba smera i nepotreban trošak.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556`
  }
];

templatesData.forEach(t => {
  insertTemplate.run(t.slug, t.title, t.category, t.subject, t.body);
});

console.log(`✅ Inserted ${templatesData.length} outreach templates.`);

// Seed initial communication history for Animal Market, Fashion Store, Šifonjer, Fermini
console.log('💬 Seeding communication history...');

const getStoreByName = db.prepare('SELECT id FROM stores WHERE name = ?');
const insertComm = db.prepare(`
  INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// 1. Animal Market
const animalMarket = getStoreByName.get('Animal Market');
if (animalMarket) {
  insertComm.run(
    animalMarket.id,
    'email',
    'outbound',
    'Automatizacija provere adrese i potvrde za Animal Market (WooCommerce)',
    `Gönderilen E-posta (13 Ekim Salı, 10:06):

Poštovani,

Na vašem sajtu piše da vaš tim nakon porudžbine kontaktira kupce radi potvrde porudžbine i isporuke. Kod plaćanja pouzećem to je ručni posao za svaku porudžbinu, a pogrešna adresa se često otkrije tek kada je kurir već krenuo.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji taj korak radi automatski: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: dve nedelje, besplatno, na stvarnim porudžbinama. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl, pa vam šaljem detalje.

Srdačan pozdrav,
Atıl Bilge Örüm
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556`,
    '2026-10-13 10:06:00',
    '2026-10-15'
  );
}

// 2. Fashion Store
const fashionStore = getStoreByName.get('Fashion Store');
if (fashionStore) {
  insertComm.run(
    fashionStore.id,
    'email',
    'outbound',
    'Potvrda adrese za porudžbine pouzećem, Fashion Store',
    `Gönderilen E-posta (14 Ekim 2026):

Poštovani,

Video sam da pored radnje u Čačku imate i online prodavnicu sa plaćanjem pouzećem. Svaki nepreuzet paket znači plaćenu dostavu u oba smera i artikal koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije (šta pre istekne). Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556`,
    '2026-10-14 11:30:00',
    '2026-10-16'
  );
}

// 3. Šifonjer
const sifonjer = getStoreByName.get('Šifonjer');
if (sifonjer) {
  insertComm.run(
    sifonjer.id,
    'email',
    'outbound',
    'Potvrda adrese za porudžbine pouzećem, Šifonjer',
    `Gönderilen E-posta (14 Ekim 2026):

Poštovani,

Video sam da prodajete polovnu firmiranu garderobu uz plaćanje pouzećem. Kod polovne garderobe je svaki komad jedinstven, pa nepreuzet paket znači plaćenu dostavu u oba smera i komad koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li biste bili zainteresovani? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556`,
    '2026-10-14 11:45:00',
    '2026-10-16'
  );
}

// 4. Fermini
const fermini = getStoreByName.get('Fermini');
if (fermini) {
  insertComm.run(
    fermini.id,
    'email',
    'outbound',
    'Potvrda adrese za porudžbine pouzećem, Fermini',
    `Gönderilen E-posta (14 Ekim 2026):

Poštovani,

Video sam da imate širok asortiman odeće i tekstila uz plaćanje pouzećem. Pogrešna adresa se često otkrije tek kada je kurir već krenuo, a to znači nepreuzet paket i plaćenu dostavu u oba smera.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji proverava adresu pre slanja kuriru: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: besplatno, za prvih 25 porudžbina pouzećem ili 30 dana od aktivacije. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl.

Srdačan pozdrav,
Atil Bilge Orum
Potvrdio.online • Novi Sad
Tel: +381 61 603 6556`,
    '2026-10-14 12:00:00',
    '2026-10-16'
  );
}

// 5. Comfortino
const comfortino = getStoreByName.get('Comfortino');
if (comfortino) {
  insertComm.run(
    comfortino.id,
    'email',
    'outbound',
    'dostava i potvrda adrese, comfortino',
    `Poštovani,

Video sam da Comfortino isporučuje putem AKS kurira. Kod obuće svaki nepreuzet paket znači plaćenu dostavu u oba smera i par cipela koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio, dodatak za WooCommerce koji pre slanja paketa kupcu šalje poruku sa jednim klikom za potvrdu ili ispravku adrese, kako bi se smanjio broj nepreuzetih paketa. Trenutno tražim nekoliko prodavnica za zatvorenu beta verziju, besplatno za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije.

Ako vam je zanimljivo, rado ću vam poslati link sa kratkim objašnjenjem kako funkcioniše.

Srdačan pozdrav,

Atil Bilge Orum
potvrdio.online
Novi Sad
Tel: +381 61 603 6556`,
    '2026-10-15 11:00:00',
    '2026-10-17'
  );
}

// Apply store-specific custom personalization and tailored templates
require('./update_personalization.js');
require('./update_opportunities.js');
require('./update_email_format.js');

console.log('✅ Seed completed successfully!');
const count = db.prepare('SELECT count(*) as total FROM stores').get();
const commCount = db.prepare('SELECT count(*) as total FROM communications').get();
console.log(`📊 DB Summary: ${count.total} stores, ${commCount.total} communications logged.`);
