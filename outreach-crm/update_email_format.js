const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Updating outreach templates with the newly structured blocks (no manual signature, exact Serbian copy)...');

// Common Block 1 (Product Value Prop)
const block1 = 'Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.';

// Common Block 2 (CTA)
const block2 = 'Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.';

// Function to assemble the email (Greeting + Opening + Block 1 + Block 2)
function assembleEmail(greeting, opening) {
  return `${greeting}\n\n${opening}\n\n${block1}\n\n${block2}`;
}

const templatesToUpdate = [
  {
    slug: 'custom-petzooshop',
    title: 'Pet Zoo Shop: 15 kg Mama Çuvalları & BEX Kargo Maliyeti',
    subject: 'džakovi od 15 kg i nepreuzeti paketi, Pet Zoo Shop',
    greeting: 'Poštovani,',
    opening: 'Video sam da Pet Zoo Shop šalje džakove hrane od 14 do 15 kg putem BEX-a, uz besplatnu dostavu preko 6.000 RSD. Kod tako teških paketa jedan nepreuzet džak znači plaćenu dostavu u oba smera, što može da pojede zaradu sa cele porudžbine.'
  },
  {
    slug: 'custom-perbipharm',
    title: 'Perbipharm: Veteriner İlaç/Besin Hassasiyeti & AKS Kurye',
    subject: 'potvrda adrese pre slanja AKS-om, Perbipharm',
    greeting: 'Poštovani,',
    opening: 'Video sam da Perbipharm šalje veterinarske preparate i dijetetsku hranu putem AKS-a. Kod takvih proizvoda pogrešna adresa ili nepreuzet paket znači ne samo dupli trošak dostave, već i kupca koji čeka hranu ili terapiju za svog ljubimca.'
  },
  {
    slug: 'custom-lekiko',
    title: 'Lekiko: Kragujevac Yerel Butik & Manuel Arama Yükü',
    subject: 'manje zvanja oko porudžbina, Lekiko',
    greeting: 'Poštovani,',
    opening: 'Video sam da Lekiko iz Kragujevca šalje opremu i hranu za ljubimce pouzećem širom Srbije. Ako vaš tim ručno zove kupce radi provere porudžbine, taj posao može da preuzme automatska poruka, a vi šaljete samo potvrđene porudžbine.'
  },
  {
    slug: 'custom-prodajaparfema',
    title: 'Prodaja Parfema: 4.000 RSD Üzeri Kargo & Orijinal Parfüm Güvenliği',
    subject: 'nepreuzeti paketi kod skupih porudžbina, Prodaja Parfema',
    greeting: 'Poštovani,',
    opening: 'Video sam da prodajete originalne parfeme uz besplatnu dostavu preko 4.000 RSD. Kod porudžbina veće vrednosti jedan nepreuzet paket briše zaradu od više uspešnih prodaja, a potvrda pre slanja izdvaja neozbiljne porudžbine pre nego što paket krene.'
  },
  {
    slug: 'custom-fitaky',
    title: 'Fitaky: Bebek/Anne Kozmetiği & Kurye Adres Notu',
    subject: 'dostava mamama sa bebama, Fitaky',
    greeting: 'Poštovani,',
    opening: 'Pratim Fitaky i vašu prirodnu kozmetiku za bebe i mame. Kod dostave porodicama sa malom decom često se desi da niko nije kod kuće kada kurir stigne, pa se paket vrati uz dupli trošak dostave. Potvrda adrese pre slanja to smanjuje.'
  },
  {
    slug: 'custom-eridan',
    title: 'Eridan: 3-7 Günlük Teslimat Süresinde Vazgeçme Riski',
    subject: 'rok isporuke 3-7 dana i pouzeće, Eridan',
    greeting: 'Poštovani,',
    opening: 'Video sam da za Eridan preparate navodite rok isporuke od 3 do 7 radnih dana. Kod pouzeća, što je rok duži, to je veća šansa da kupac zaboravi porudžbinu ili ne bude kod kuće kada kurir stigne. Potvrda odmah posle porudžbine i pre slanja to smanjuje.'
  },
  {
    slug: 'custom-carna',
    title: 'Čarna: Radan Dağı Melisa Butik Üretim & Post Express',
    subject: 'Post Express i pouzeće, Čarna',
    greeting: 'Poštovani,',
    opening: 'Pročitao sam priču o vašoj plantaži matičnjaka na Radan planini. Kod ručno rađene kozmetike svaki paket koji se vrati preko Post Expressa znači poštarinu u oba smera i proizvod koji je bio na putu umesto kod kupca.'
  },
  {
    slug: 'custom-purahomespa',
    title: 'Pura Home Spa: Marija Hanım & 4.500 RSD Ücretsiz Kargo Riski',
    subject: 'besplatna dostava iznad 4.500 RSD, Pura Home Spa',
    greeting: 'Poštovana gospođo Đukić,',
    opening: 'Pratim rad Pura Home Spa i video sam da nudite besplatnu dostavu iznad 4.500 RSD. Pošto se difuzori i spa proizvodi često kupuju kao poklon, teže je da kurir stigne do pravog primaoca. Jedan vraćen paket znači plaćenu dostavu u oba smera i briše profit cele porudžbine.'
  },
  {
    slug: 'custom-pravialati',
    title: 'Pravi Alati: Ingco Takım Çantaları & Ağır Desi Navlun Riski',
    subject: 'Ingco alati pouzećem, Pravi Alati',
    greeting: 'Poštovani,',
    opening: 'Video sam da Pravi Alati prodaje Ingco električni alat pouzećem. Kod teških kofera i mašina vraćen paket znači skupu povratnu poštarinu, a alat danima kruži umesto da bude kod kupca. Potvrda porudžbine i adrese pre slanja štiti vas od toga.'
  },
  {
    slug: 'custom-ac-vinulovic',
    title: 'AC Vinulović: Negotin Lastik/Akü Kargo Ağırlığı & Çift Yönlü İade',
    subject: 'gume i akumulatori pouzećem, AC Vinulović',
    greeting: 'Poštovani,',
    opening: 'Video sam da iz Negotina šaljete gume i akumulatore širom Srbije. Kod gabaritnih i teških paketa poštarina je visoka, pa jedan nepreuzet paket do Negotina znači veliki trošak. Potvrda kupca i adrese pre slanja štedi taj trošak.'
  },
  {
    slug: 'custom-kaninobuca',
    title: 'Kanin Obuća: Niş El Yapımı Hakiki Deri & 12.000 RSD Sepet',
    subject: 'ručno rađena obuća i pouzeće, Kanin Obuća',
    greeting: 'Poštovani,',
    opening: 'Video sam da Kanin iz Niša prodaje ručno rađenu kožnu obuću, uz besplatnu dostavu preko 12.000 RSD. Kod porudžbina te vrednosti nepreuzet paket znači plaćenu dostavu u oba smera i par cipela koji je danima van prodaje.'
  },
  {
    slug: 'custom-ljuba',
    title: 'Ljuba 024: Subotica Demon Tırpan/Testere & Ağır Makine Kargo Riski',
    subject: 'trimeri i motorne testere pouzećem, Ljuba 024',
    greeting: 'Poštovani,',
    opening: 'Video sam da Ljuba 024 iz Subotice prodaje Demon trimere i motorne testere, uz besplatnu dostavu za tri artikla preko 7.000 RSD. Kod mašina od 8 do 10 kg povratna poštarina je visoka, pa jedna nepreuzeta porudžbina pojede zaradu.'
  }
];

const updateStmt = db.prepare(`
  UPDATE templates 
  SET title = ?, subject = ?, body = ?
  WHERE slug = ?
`);

for (const item of templatesToUpdate) {
  const fullBody = assembleEmail(item.greeting, item.opening);
  updateStmt.run(item.title, item.subject, fullBody, item.slug);
  console.log(`✅ Updated ${item.slug} -> Subject: "${item.subject}"`);
}

console.log('🎉 All 12 uncontacted templates updated successfully in database!');
