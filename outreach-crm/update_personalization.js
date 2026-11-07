const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Updating store hook notes and templates in SQLite DB...');

const block1 = 'Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.';
const block2 = 'Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.';

function assembleEmail(greeting, opening) {
  return `${greeting}\n\n${opening}\n\n${block1}\n\n${block2}`;
}

const customOutreachData = [
  {
    website: 'https://comfortino.rs',
    hook_note: 'Dostava samo 250 din sübvansiyonu + AKS kurye. Ayakkabı kutuları desisi yüksek; alıcı paketi almazsa 250 din sübvansiyon + gidiş-dönüş çift kargo mağazanın tüm marjını siliyor.',
    templateSlug: 'custom-comfortino',
    templateTitle: 'Comfortino Özel: Sabit 250 RSD Kargo Sübvansiyonu & Desi Riski',
    subject: 'dostava i potvrda adrese, comfortino',
    body: `Poštovani,

Video sam da Comfortino isporučuje putem AKS kurira. Kod obuće svaki nepreuzet paket znači plaćenu dostavu u oba smera i par cipela koji danima ne može da se proda drugom kupcu.

Razvijam Potvrdio, dodatak za WooCommerce koji pre slanja paketa kupcu šalje poruku sa jednim klikom za potvrdu ili ispravku adrese, kako bi se smanjio broj nepreuzetih paketa. Trenutno tražim nekoliko prodavnica za zatvorenu beta verziju, besplatno za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije.

Ako vam je zanimljivo, rado ću vam poslati link sa kratkim objašnjenjem kako funkcioniše.

Srdačan pozdrav,

Atil Bilge Orum
potvrdio.online
Novi Sad
Tel: +381 61 603 6556`
  },
  {
    website: 'https://petzooshop.rs',
    hook_note: 'BEX kurye + 6.000 RSD üzeri ücretsiz kargo. 14–15 kg büyük mama çuvalları (Pro Plan, Dog Chow, Cat Chow). Ağır desi yükü; teslim alınmayan 15 kg çuvalın 2 yönlü kargo maliyeti tüm kâr marjını siliyor.',
    templateSlug: 'custom-petzooshop',
    templateTitle: 'Pet Zoo Shop: 15 kg Mama Çuvalları & BEX Kargo Maliyeti',
    subject: 'džakovi od 15 kg i nepreuzeti paketi, Pet Zoo Shop',
    body: assembleEmail('Poštovani,', 'Video sam da Pet Zoo Shop šalje džakove hrane od 14 do 15 kg putem BEX-a, uz besplatnu dostavu preko 6.000 RSD. Kod tako teških paketa jedan nepreuzet džak znači plaćenu dostavu u oba smera, što može da pojede zaradu sa cele porudžbine.')
  },
  {
    website: 'https://perbipharm.rs',
    hook_note: 'Veterinar apoteka & pet hrana (AS Iberian, Cane Cuccioli) + AKS kurye. Hassas veteriner ürünlerinin ve mamaların kuryede günlerce beklemesi ve nepreuzet paket riski.',
    templateSlug: 'custom-perbipharm',
    templateTitle: 'Perbipharm: Veteriner İlaç/Besin Hassasiyeti & AKS Kurye',
    subject: 'potvrda adrese pre slanja AKS-om, Perbipharm',
    body: assembleEmail('Poštovani,', 'Video sam da Perbipharm šalje veterinarske preparate i dijetetsku hranu putem AKS-a. Kod takvih proizvoda pogrešna adresa ili nepreuzet paket znači ne samo dupli trošak dostave, već i kupca koji čeka hranu ili terapiju za svog ljubimca.')
  },
  {
    website: 'https://lekiko.rs',
    hook_note: 'Kragujevac yerel butik Pet/Vet Shop. Sırbistan geneline kapıda ödeme. Manuel telefonla arama veya mesajla teyit yükünü SMS linkiyle sıfırlama.',
    templateSlug: 'custom-lekiko',
    templateTitle: 'Lekiko: Kragujevac Yerel Butik & Manuel Arama Yükü',
    subject: 'manje zvanja oko porudžbina, Lekiko',
    body: assembleEmail('Poštovani,', 'Video sam da Lekiko iz Kragujevca šalje opremu i hranu za ljubimce pouzećem širom Srbije. Ako vaš tim ručno zove kupce radi provere porudžbine, taj posao može da preuzme automatska poruka, a vi šaljete samo potvrđene porudžbine.')
  },
  {
    website: 'https://prodajaparfema.rs',
    hook_note: 'Orijinal ve niş parfümler (Armani, Hugo Boss, Club De Nuit) + 4.000 RSD üzeri ücretsiz kargo. Yüksek sepet tutarı; sahte/asılsız sipariş filtresi ve yüksek değerli ürünün kuryede hasar/kayıp görmesini önleme.',
    templateSlug: 'custom-prodajaparfema',
    templateTitle: 'Prodaja Parfema: 4.000 RSD Üzeri Kargo & Orijinal Parfüm Güvenliği',
    subject: 'nepreuzeti paketi kod skupih porudžbina, Prodaja Parfema',
    body: assembleEmail('Poštovani,', 'Video sam da prodajete originalne parfeme uz besplatnu dostavu preko 4.000 RSD. Kod porudžbina veće vrednosti jedan nepreuzet paket briše zaradu od više uspešnih prodaja, a potvrda pre slanja izdvaja neozbiljne porudžbine pre nego što paket krene.')
  },
  {
    website: 'https://fitaky.rs',
    hook_note: 'Bebek & anne doğal kozmetiği + 3.500 RSD üzeri ücretsiz kargo. Bebekli annelerde uyku saati, bozuk interfon veya eksik kapı no nedeniyle kuryenin teslim yapamaması ve paketin geri dönmesi riski.',
    templateSlug: 'custom-fitaky',
    templateTitle: 'Fitaky: Bebek/Anne Kozmetiği & Kurye Adres Notu',
    subject: 'dostava mamama sa bebama, Fitaky',
    body: assembleEmail('Poštovani,', 'Pratim Fitaky i vašu prirodnu kozmetiku za bebe i mame. Kod dostave porodicama sa malom decom često se desi da niko nije kod kuće kada kurir stigne, pa se paket vrati uz dupli trošak dostave. Potvrda adrese pre slanja to smanjuje.')
  },
  {
    website: 'https://eridan.rs',
    hook_note: 'AquaFarm biyoteknolojik cilt bakımı + "Isporuka 3 do 7 radnih dana". 3-7 gün teslimat süresinde kapıda ödemeli müşterinin siparişi unutması veya vazgeçmesi riski; sipariş anında SMS ile teyit.',
    templateSlug: 'custom-eridan',
    templateTitle: 'Eridan: 3-7 Günlük Teslimat Süresinde Vazgeçme Riski',
    subject: 'rok isporuke 3-7 dana i pouzeće, Eridan',
    body: assembleEmail('Poštovani,', 'Video sam da za Eridan preparate navodite rok isporuke od 3 do 7 radnih dana. Kod pouzeća, što je rok duži, to je veća šansa da kupac zaboravi porudžbinu ili ne bude kod kuće kada kurir stigne. Potvrda odmah posle porudžbine i pre slanja to smanjuje.')
  },
  {
    website: 'https://carna.rs',
    hook_note: 'Radan Dağı melisa (matičnjak) plantasyonu butik doğal kozmetik + Post Express otkupnina. Butik üretimde her iade paket hem çift yönlü kargo maliyeti hem de emeğin rafta beklemesi demek.',
    templateSlug: 'custom-carna',
    templateTitle: 'Čarna: Radan Dağı Melisa Butik Üretim & Post Express',
    subject: 'Post Express i pouzeće, Čarna',
    body: assembleEmail('Poštovani,', 'Pročitao sam priču o vašoj plantaži matičnjaka na Radan planini. Kod ručno rađene kozmetike svaki paket koji se vrati preko Post Expressa znači poštarinu u oba smera i proizvod koji je bio na putu umesto kod kupca.')
  },
  {
    website: 'https://purahomespa.rs',
    hook_note: 'Marija Đukić PR Pura Kozmetika (Beograd) + 4.500 RSD üzeri ücretsiz kargo. Butik esansiyel yağlar, lip food ve oda difüzörlerinde sübvanse edilen kargonun iadeyle çifte maliyet yaratması.',
    templateSlug: 'custom-purahomespa',
    templateTitle: 'Pura Home Spa: Marija Hanım & 4.500 RSD Ücretsiz Kargo Riski',
    subject: 'besplatna dostava iznad 4.500 RSD, Pura Home Spa',
    body: assembleEmail('Poštovana gospođo Đukić,', 'Pratim rad Pura Home Spa i video sam da nudite besplatnu dostavu iznad 4.500 RSD. Pošto se difuzori i spa proizvodi često kupuju kao poklon, teže je da kurir stigne do pravog primaoca. Jedan vraćen paket znači plaćenu dostavu u oba smera i briše profit cele porudžbine.')
  },
  {
    website: 'https://pravialati.rs',
    hook_note: 'Akülü ve elektrikli el aletleri (Ingco buşilica/brusilica). Ağır ve hacimli kutularda yanlış adres veya kapıda nakiti hazır olmayan alıcı nedeniyle çift yönlü ağır desi navlun kaybı.',
    templateSlug: 'custom-pravialati',
    templateTitle: 'Pravi Alati: Ingco Takım Çantaları & Ağır Desi Navlun Riski',
    subject: 'Ingco alati pouzećem, Pravi Alati',
    body: assembleEmail('Poštovani,', 'Video sam da Pravi Alati prodaje Ingco električni alat pouzećem. Kod teških kofera i mašina vraćen paket znači skupu povratnu poštarinu, a alat danima kruži umesto da bude kod kupca. Potvrda porudžbine i adrese pre slanja štiti vas od toga.')
  },
  {
    website: 'https://ac-vinulovic.rs',
    hook_note: 'Negotin merkezli traktör/agro lastikleri, C-kombi lastikleri ve aküler. E-ticaretteki en ağır ve en pahalı kargo kategorisi; teslim alınmayan lastik veya akü Negotin\'e döndüğünde yüzlerce dinar zarar.',
    templateSlug: 'custom-ac-vinulovic',
    templateTitle: 'AC Vinulović: Negotin Lastik/Akü Kargo Ağırlığı & Çift Yönlü İade',
    subject: 'gume i akumulatori pouzećem, AC Vinulović',
    body: assembleEmail('Poštovani,', 'Video sam da iz Negotina šaljete gume i akumulatore širom Srbije. Kod gabaritnih i teških paketa poštarina je visoka, pa jedan nepreuzet paket do Negotina znači veliki trošak. Potvrda kupca i adrese pre slanja štedi taj trošak.')
  },
  {
    website: 'https://kaninobuca.com',
    hook_note: 'Niş el yapımı hakiki deri ayakkabı + 12.000 RSD üzeri ücretsiz kargo. Yüksek sepet tutarı; kapıda ödemede teslim alınmayan pakette deri ayakkabının 10 gün kuryede mahsur kalmasını önleme.',
    templateSlug: 'custom-kaninobuca',
    templateTitle: 'Kanin Obuća: Niş El Yapımı Hakiki Deri & 12.000 RSD Sepet',
    subject: 'ručno rađena obuća i pouzeće, Kanin Obuća',
    body: assembleEmail('Poštovani,', 'Video sam da Kanin iz Niša prodaje ručno rađenu kožnu obuću, uz besplatnu dostavu preko 12.000 RSD. Kod porudžbina te vrednosti nepreuzet paket znači plaćenu dostavu u oba smera i par cipela koji je danima van prodaje.')
  },
  {
    website: 'https://ljuba.rs',
    hook_note: 'Subotica Ljuba 024 d.o.o. Demon RQ580 motorlu tırpan ve testereler + 3 ürün > 7.000 RSD ücretsiz kargo. 8-10 kg motorlu makinelerde kapıda ödeme iadesinde yüksek çift yönlü kargo navlunu.',
    templateSlug: 'custom-ljuba',
    templateTitle: 'Ljuba 024: Subotica Demon Tırpan/Testere & Ağır Makine Kargo Riski',
    subject: 'trimeri i motorne testere pouzećem, Ljuba 024',
    body: assembleEmail('Poštovani,', 'Video sam da Ljuba 024 iz Subotice prodaje Demon trimere i motorne testere, uz besplatnu dostavu za tri artikla preko 7.000 RSD. Kod mašina od 8 do 10 kg povratna poštarina je visoka, pa jedna nepreuzeta porudžbina pojede zaradu.')
  }
];

const updateHookStmt = db.prepare('UPDATE stores SET hook_note = ? WHERE website = ?');
const updateTemplateStmt = db.prepare(`
  UPDATE templates 
  SET title = ?, subject = ?, body = ?
  WHERE slug = ?
`);

for (const item of customOutreachData) {
  updateHookStmt.run(item.hook_note, item.website);
  updateTemplateStmt.run(item.templateTitle, item.subject, item.body, item.templateSlug);
  console.log(`✅ Updated ${item.website} hook & template (${item.templateSlug})`);
}

console.log('🎉 Store personalization hooks and tailored templates successfully updated!');
