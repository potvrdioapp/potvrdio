const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🚀 Adding Batch 2 (7 additional deeply verified WooCommerce COD stores) to Potvrdio CRM...');

const newStores = [
  {
    name: 'Gifts 4 You',
    website: 'https://gifts4you.rs',
    sector: 'Kişiye Özel Hediyeler & Ahşap/Metal Tasarım',
    email: 'info@gifts4you.rs',
    phone: '+381 63 254 646',
    city: 'Niš',
    legal_entity: 'Gifts 4 You Niš',
    contact_person: 'Prodajni Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, Kurir Sistemleri',
    hook_note: 'İsimli, fotoğraflı ve özel mesajlı kişiselleştirilmiş hediyeler. Kapıda ödemede teslim alınmayan kişiye özel ürün başkasına satılamaz, hem hammadde hem çift yönlü kargo %100 doğrudan zarar yazar.',
    growth_opportunities: '• Kişiye Özel Üründe Sıfır İkinci Satış Şansı: Üzerinde isim ve özel tarih yazılı ürün iade geldiğinde çöpe gider; gönderim öncesi SMS teyidi alıcının ciddiyetini garantiye alır.\n• Doğum Günü & Yıl Dönümü Zaman Baskısı: Tarihli hediyelerde adres hatası yüzünden geciken kargo müşteriyi öfkelendirir; tek tıkla adres düzeltme teslimatı hızlandırır.\n• Telefonla Manuel Arama Yükü: Özel tasarım teyidi için harcanan zamanı otomatikleştirir.',
    template: {
      slug: 'custom-gifts4you',
      title: 'Gifts 4 You Özel Şablonu (Kişiye Özel Hediye)',
      subject: 'personalizovani pokloni pouzećem i adresa pre slanja, Gifts 4 You',
      opening: 'Primetio sam sjajne personalizovane poklone koje Gifts 4 You izrađuje i šalje pouzećem. Kod unikatnih predmeta sa imenom i posvetom, nepreuzet paket je stopostotni gubitak — ne samo da plaćate dvostruku poštarinu, već taj proizvod više nikome drugom ne možete prodati.'
    }
  },
  {
    name: 'Poklondžija',
    website: 'https://poklondzija.com',
    sector: 'Hediye Sepetleri, Çiçek & Lüks Kutlama',
    email: 'poklondzija@gmail.com',
    phone: '+381 69 555 4445',
    city: 'Beograd',
    legal_entity: 'Poklondžija Beograd',
    contact_person: 'Poklondžija Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, Elementor, Kurirska Dostava Beograd',
    hook_note: 'Özel hediye sepetleri, çikolatalar, şarap ve çiçek aranjmanları. Gıda içerikli sepetlerin kuryede günlerce beklemesi bozulma riski taşır; sürpriz siparişlerde alıcının kapıda nakit ödemeden kaçınmasını önleme.',
    growth_opportunities: '• Bozulabilir Çikolata & Gurme İçerik: Hediye sepetlerindeki taze ürünlerin kurye transferinde beklemesi kaliteyi bozar; adrese teslimatın ilk seferde başarılması şarttır.\n• Sürpriz ve Hediye Gönderimlerinde Adres Riski: Alıcının evde bulunmaması durumunda hediye sürprizi bozulur; önceden zaman ve adres teyidi teslimatı garanti eder.\n• Belgrad İçi Hızlı Kurye Maliyet Koruması: Teslim edilmeyen kurye seferi iki kat servis masrafı yaratır.',
    template: {
      slug: 'custom-poklondzija',
      title: 'Poklondžija Özel Şablonu (Hediye Sepetleri)',
      subject: 'dostava poklon korpi pouzećem i tačnost adrese, Poklondžija',
      opening: 'Video sam prelepe poklon korpe i aranžmane koje Poklondžija šalje na adrese širom Beograda i Srbije. Kod poklona i poslastica, nepreuzet paket ili netačna adresa znači ne samo dupli trošak kurira, već i rizik da se delikatesni sadržaj ošteti ili vrati pre nego što stigne do slavljenika.'
    }
  },
  {
    name: 'Pokupi.rs',
    website: 'https://pokupi.rs',
    sector: 'Ev, Bahçe, Hobi & Küçük Ev Aletleri',
    email: 'prodaja@pokupi.rs',
    phone: '+381 60 3737 037',
    city: 'Niš',
    legal_entity: 'Pokupi.rs Online Shop',
    contact_person: 'Prodajni Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, Özel Kargo Entegrasyonu',
    hook_note: 'Dış mekan, bahçe aletleri, elektrikli süpürgeler ve hırdavat. Koli boyutları ve ağırlıkları yüksektir; kurye firmalarının teslim alınmayan paketlerde kestiği çift yönlü nakliye bedeli marjı sıfırlar.',
    growth_opportunities: '• Hacimli Koli & Bahçe Aletleri Navlunu: Çim biçme, su pompası ve bahçe aletleri ağır desili ürünlerdir; nepreuzet paket kargo maliyeti satıcıya ciddi zarar yazar.\n• Kapıda Nakit Hazırlama Hatırlatması: Yüksek sepet tutarlarında kurye kapıya gittiğinde nakit bulunmaması teslimatı aksatır; SMS onayıyla tutar netleştirilir.\n• 1-3 Günlük Hızlı Teslimat Güvencesi: Sipariş anında adresi doğrulayarak kargo çıkışını hızlandırır.',
    template: {
      slug: 'custom-pokupi',
      title: 'Pokupi.rs Özel Şablonu (Ev & Bahçe Aletleri)',
      subject: 'isporuka baštenskih alata pouzećem i adresa pre slanja, Pokupi.rs',
      opening: 'Primetio sam široku ponudu alata i opreme za kuću i baštu na Pokupi.rs uz opciju plaćanja pouzećem. Kod teže i kabaste opreme, svaki nepreuzet paket ili pogrešan kontakt telefon donosi vam nepotreban trošak dvostruke poštarine i zadržava robu u povratku.'
    }
  },
  {
    name: 'Konga Music',
    website: 'https://kongamusic.rs',
    sector: 'Müzik Aletleri, Gitarlar & Dijital Piyanolar',
    email: 'info@kongamusic.rs',
    phone: '+381 21 526 076',
    city: 'Novi Sad',
    legal_entity: 'Konga Music Shop Novi Sad',
    contact_person: 'Konga Music Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, Post Express / Daily Express / BEX',
    hook_note: 'Novi Sad merkezli müzik aletleri mağazası (klavyeler, akustik/elektro gitarlar, ses kartları). Enstrümanlar kırılabilir ve hassastır; kurye araçlarında gereksiz el değiştirip geri dönen gitarlar hem hasar riski taşır hem yüksek çift yönlü navlun yazar.',
    growth_opportunities: '• Novi Sad Yerel Güven Bağı: Aynı şehirde faaliyet göstermek sıcak diyalog kurmayı kolaylaştırır.\n• Kırılabilir Enstrüman Koruması: Gitar sapı, klavye tuşları ve ahşap rezonans gövdeleri kargo transferinde sarsıntıya maruz kalır; sadece kesin alıcılara kargo çıkışı yapılmalıdır.\n• Yüksek Sepet Değeri (15.000–60.000 RSD): Yüksek tutarlı müzik siparişlerinde kapıda nakit hazırlığı için SMS teyidi iadeyi sıfırlar.',
    template: {
      slug: 'custom-kongamusic',
      title: 'Konga Music Özel Şablonu (Müzik Aletleri & Novi Sad)',
      subject: 'isporuka muzičkih instrumenata pouzećem i potvrda adrese, Konga Music',
      opening: 'Kao komšija iz Novog Sada, pratim ponudu muzičkih instrumenata u Konga Music shopu. Kod gitara, klavijatura i osetljive audio opreme, nepreuzet paket donosi ogroman nepotreban rizik oštećenja skupih instrumenata u transportu, uz plaćanje dvostruke kurirske poštarine.'
    }
  },
  {
    name: 'Street Moto Shop',
    website: 'https://streetmotoshop.rs',
    sector: 'Motosiklet Ekipmanları, Kasklar & Ceketler',
    email: 'prodaja@streetmotoshop.rs',
    phone: '+381 63 836 5244',
    city: 'Beograd',
    legal_entity: 'Street Moto Shop Beograd',
    contact_person: 'Prodajni Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, Woodmart Theme, WordPress, Intesa, Kurirska Služba',
    hook_note: 'Kasklar, moto ceketleri, eldivenler ve pantolonlar. Kask kutuları yüksek hacimli/desili paketlerdir; beden uyumsuzluğu ve dürtüsel siparişlerde dönen kaskın çift yönlü yüksek navlun zararı ve vitrin stoğunu bloke etmesi.',
    growth_opportunities: '• Hacimli Kask Kutusu Desi Maliyeti: Kasklar e-ticaretteki en geniş kutularda sevk edilir; iade durumunda kuriyer yüksek desi ücreti keser.\n• Beden Teyidi & Kask Ölçüsü: Alıcılar kafa çevresini yanlış ölçüp kapıda iade edebiliyor; SMS onay linki beden ve adres netliği sağlar.\n• Sezonluk Moto Trafiği: Bahar ve yaz aylarında artan kapıda ödeme hacminde personelin telefonla arama iş yükünü sıfırlar.',
    template: {
      slug: 'custom-streetmotoshop',
      title: 'Street Moto Shop Özel Şablonu (Moto Kask & Ekipman)',
      subject: 'isporuka moto kaciga i opreme pouzećem, Street Moto Shop',
      opening: 'Primetio sam odličan asortiman moto kaciga i opreme na Street Moto Shopu uz mogućnost plaćanja pouzećem. Kod kaciga i jakni kutije su kabaste i nose visoke gabarite kod kurira, pa svaki nepreuzet paket stvara skup dupli transport i nepotrebno blokira tražene veličine na lageru.'
    }
  },
  {
    name: 'Isiland',
    website: 'https://isiland.rs',
    sector: 'Premium & Organik Bebek ve Çocuk Giyim',
    email: 'info@isiland.rs',
    phone: '+381 64 812 4478',
    city: 'Beograd',
    legal_entity: 'Isiland Beograd',
    contact_person: 'Isiland Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce 11.1, Divi Theme, PixelYourSite, WordPress, Kurirska Dostava',
    hook_note: 'GOTS sertifikalı organik pamuk bebek tulumları, kıyafetleri ve hediyelik setler. D2C butik bebek markası. Annelerde eksik adres veya kapıda nakit hazır edilmemesi nedeniyle dönen kargolar butik kârlılığını zedeler.',
    growth_opportunities: '• D2C Organik Marka Koruması: Butik üretimde kargo iadesi kâr marjını anında tüketir; SMS ile adresi ve kapı zilini teyit etmek teslimat başarısını %95 üzerine taşır.\n• Bebekli Aileler İçin Kurye Notu: Anneler bebek uyurken zil çalınmasını istemez; onay ekranında özel kurye teslimat notu iletilir.\n• Hediye Siparişlerinde Alıcı Teyidi: Bebeğe hediye gönderenlerin adres hatalarını önler.',
    template: {
      slug: 'custom-isiland',
      title: 'Isiland Özel Şablonu (Organik Bebek Giyim)',
      subject: 'isporuka bebi garderobe pouzećem i potvrda adrese, Isiland',
      opening: 'Vidim sa koliko pažnje Isiland kreira organsku garderobu za bebe i decu i šalje je pouzećem. Kod kupovine za najmlađe, netačna adresa ili nepreuzet paket stvara dvostruki trošak dostave i nepotrebno zadržava fine pamučne komade po kurirskim vozilima umesto da stignu do roditelja.'
    }
  },
  {
    name: 'Kolibri BEBE Shop',
    website: 'https://kolibribebeshop.rs',
    sector: 'Bebek Tekstili, Tulumlar, Kundak & Bebek Odası',
    email: 'webshop@kolibribebeshop.rs',
    phone: '+381 18 555 666',
    city: 'Niš',
    legal_entity: 'Kolibri BEBE Shop Niš (Online D2C)',
    contact_person: 'Webshop Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, LiteSpeed Cache, BEX Express Entegrasyonu',
    hook_note: 'Fiziksel mağazası olmayan, tamamen online çalışan D2C bebek tekstil mağazası. BEX ile tüm Sırbistan\'a kapıda ödeme gönderiyorlar. BEX teslim alamadığı paketi şubeye çeker ve satıcıya çift yönlü navlun faturası çıkar; SMS ön teyidi bu kaybı keser.',
    growth_opportunities: '• %100 Online D2C Modelinde İade Acısı: Fiziksel vitrini olmayan saf e-ticaret modellerinde kargo iadesi doğrudan kârı sıfırlar.\n• BEX Express İade Oranı Azaltma: BEX şubesine çekilen ve alınmayan paketlerin önüne geçer.\n• Bebek Yatağı ve Kundak Desisi: Hacimli bebek tekstili ürünlerinde kargo navlunu korunur.',
    template: {
      slug: 'custom-kolibribebeshop',
      title: 'Kolibri BEBE Shop Özel Şablonu (Bebek Tekstili)',
      subject: 'isporuka bebi opreme pouzećem i tačnost adrese, Kolibri Bebe Shop',
      opening: 'Primetio sam da Kolibri BEBE Shop uspešno posluje kao čista online prodavnica i šalje prelepu bebi opremu pouzećem preko Bex-a. Kod isključivo internet trgovine, nepreuzeti paketi donose čist logistički trošak dvostrukog prevoza, posebno kod kabastih kompleta za bebe.'
    }
  }
];

const insertStore = db.prepare(`
  INSERT INTO stores (
    name, website, sector, email, phone, city, legal_entity, contact_person,
    priority, status, tech_stack, hook_note, growth_opportunities, created_at, updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, datetime('now'), datetime('now')
  )
`);

const insertTemplate = db.prepare(`
  INSERT OR REPLACE INTO templates (slug, title, category, subject, body, created_at)
  VALUES (?, ?, 'custom', ?, ?, datetime('now'))
`);

const buildBody = (opening) => {
  return `${opening}

Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.

Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?`;
};

for (const s of newStores) {
  const existing = db.prepare('SELECT id FROM stores WHERE website = ?').get(s.website);
  let storeId;
  if (existing) {
    console.log(`⚠️ Store ${s.name} already exists (ID: ${existing.id}), updating...`);
    db.prepare(`
      UPDATE stores SET
        name = ?, sector = ?, email = ?, phone = ?, city = ?, legal_entity = ?, contact_person = ?,
        priority = ?, status = ?, tech_stack = ?, hook_note = ?, growth_opportunities = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      s.name, s.sector, s.email, s.phone, s.city, s.legal_entity, s.contact_person,
      s.priority, s.status, s.tech_stack, s.hook_note, s.growth_opportunities, existing.id
    );
    storeId = existing.id;
  } else {
    const res = insertStore.run(
      s.name, s.website, s.sector, s.email, s.phone, s.city, s.legal_entity, s.contact_person,
      s.priority, s.status, s.tech_stack, s.hook_note, s.growth_opportunities
    );
    storeId = res.lastInsertRowid;
    console.log(`✅ Inserted store ${s.name} (ID: ${storeId})`);
  }

  const fullBody = buildBody(s.template.opening);
  insertTemplate.run(
    s.template.slug,
    s.template.title,
    s.template.subject,
    fullBody
  );
  console.log(`  📄 Created template ${s.template.slug}`);
}

const total = db.prepare('SELECT count(*) as count FROM stores').get();
console.log(`\n🎉 All Batch 2 stores and templates successfully saved! Total stores in CRM: ${total.count}`);
