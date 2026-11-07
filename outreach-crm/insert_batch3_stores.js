const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

const STANDARD_BLOCK_1 = `Potvrdio je lagan WooCommerce dodatak koji kupcima koji izaberu plaćanje pouzećem automatski šalje SMS ili Viber poruku sa linkom za potvrdu porudžbine i tačnosti adrese. Dok kupac ne potvrdi, porudžbina ostaje na čekanju (On-Hold), pa kuriru predajete samo pakete koji sigurno imaju primaoca.`;
const STANDARD_BLOCK_2 = `Ako ima smisla, rado bih vam u 30 sekundi pokazao kako izgleda sa strane kupca. Da li ste otvoreni da pogledate?`;

const buildBody = (opening) => `${opening}\n\n${STANDARD_BLOCK_1}\n\n${STANDARD_BLOCK_2}`;

const newStores = [
  {
    name: 'Medenjaci.rs',
    website: 'https://medenjaci.rs',
    sector: 'Ručno Dekorirani Medenjaci, Svadbene & Dečije Poslastice',
    email: 'biljana@medenjaci.rs',
    phone: '+381 69 493 0229',
    city: 'Srbija',
    legal_entity: 'Domaći Medenjaci Biljana',
    contact_person: 'Biljana',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, LiteSpeed Cache, Post Express / Kurye Sistemleri',
    hook_note: 'Unikatni ručno rađeni medenjaci za svadbe i rođendane su personalizovani i jestivi proizvodi sa rokom trajanja. Nepreuzet paket koji danima putuje po kurirskim vozilima se suši, lomi i predstavlja 100% gubitak robe i dvostrukog prevoza.',
    growth_opportunities: '• Kişiye Özel Jestivi Ürün Yangını: Medenjaci doğrudan sipariş sahibinin ismiyle üretilir; iade edilen ürün başkasına satılamaz ve 100% çöpe gider.\n• Etkinlik Tarihi Güvencesi: SMS teyidinde müşteriye kutlama tarihinden önce teslimat teyidi iletilir.\n• Kapıda Nakit Hazırlama Hatırlatması: Düğün/kutlama telaşında nakit unutulmasını önler.',
    template: {
      slug: 'custom-medenjaci',
      title: 'Medenjaci.rs Özel Şablonu (Ručno Rađeni Medenjaci)',
      subject: 'isporuka unikatnih medenjaka pouzećem i potvrda adrese, Biljana',
      opening: 'Vidim sa koliko majstorstva i ljubavi ukrašavate domaće medenjake za rođendane i venčanja i šaljete ih pouzećem. Kod unikatnih i jestivih poslastica, nepreuzet paket je stopostotna šteta — proizvod više ne možete iskoristiti, a plaćate dvostruku poštarinu kuriru.'
    }
  },
  {
    name: 'Afa Baby Shop',
    website: 'https://afababy.rs',
    sector: 'Bebek Arabaları, Oto Koltukları, Mama Sandalyeleri & Bebek Odası',
    email: 'office@afababy.rs',
    phone: '+381 65 526 2544',
    city: 'Srbija',
    legal_entity: 'Afa Baby Shop Online',
    contact_person: 'Prodajni Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, Elementor, Pouzeće, Kurye Dağıtım Ağı',
    hook_note: 'Bebek arabası ve oto koltukları e-ticaretin en hacimli ve yüksek desili ürünleridir (10-25 kg zapreminske mase). Kurye iadesinde çift yönlü devasa navlun faturası çıkar.',
    growth_opportunities: '• Yüksek Hacim & Desi Koruması: 15-20 kg hacimli koli iadesinde satıcı yüzlerce dinar gidiş-dönüş kargo bedeli öder.\n• Yeni Anne-Babalara Adres Teyidi: Yeni taşınan ailelerin eksik kapı/apartman no girişlerini SMS ekranında düzeltme.\n• Garanti ve Montaj Güveni: Onay ekranında güven tazeleyerek sepet terkini önleme.',
    template: {
      slug: 'custom-afababy',
      title: 'Afa Baby Shop Özel Şablonu (Bebek Arabaları & Oprema)',
      subject: 'isporuka bebi kolica pouzećem i tačnost adrese, Afa Baby',
      opening: 'Primetio sam odličnu ponudu kolica za bebe i auto sedišta na Afa Baby Shopu uz opciju plaćanja pouzećem. Kod velikih i kabastih kutija za bebe, svaki nepreuzet paket ili pogrešno unet broj stana donosi ozbiljan trošak dvostrukog transporta i zadržava robu u kurirskim magacinima.'
    }
  },
  {
    name: 'Portobello Poklon Korpe',
    website: 'https://poklonkorpe.rs',
    sector: 'Lüks Hediye Sepetleri, İş Hediyeleri, Şarap & Çikolata Gurme Kutuları',
    email: 'portobello.ybc.nbg@gmail.com',
    phone: '+381 11 214 55 71',
    city: 'Novi Beograd',
    legal_entity: 'Portobello YUBC Novi Beograd',
    contact_person: 'Portobello Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, GTM4WP, Google Tag Manager, Kurir Dostava',
    hook_note: 'Hediye sepetleri şarap, ithal çikolata ve delikates içerir. Teslimat gününde alıcıya ulaşılamazsa cam şişelerin kırılma riski doğar, kurye geri döner ve sürpriz bozulur.',
    growth_opportunities: '• Alıcı Teyidi / Hediye Sürprizi Koruması: Başkasına hediye gönderildiğinde alıcının telefon ve gün teyidi şarttır.\n• Cam ve Hassas Gıda Güvenliği: Kurye araçlarında günlerce çalkalanmayı engeller.\n• Kurumsal ve VIP Müşteri İmajı: SMS/Viber onay kartı hediye deneyimini prestijli kılar.',
    template: {
      slug: 'custom-poklonkorpe',
      title: 'Portobello Poklon Korpe Özel Şablonu (Hediye Sepetleri)',
      subject: 'dostava poklon korpi pouzećem i tačnost adrese pre slanja, Portobello',
      opening: 'Video sam prelepo aranžirane poklon korpe i poslovne aranžmane na Poklonkorpe.rs. Kod korpi sa vinom i slatkišima, nepreuzeta pošiljka ili netačna adresa ne samo da stvara trošak duple dostave, već nosi rizik oštećenja stakla i kvari ceo trenutak slavljeniku.'
    }
  },
  {
    name: 'Mediflora Biljna Apoteka',
    website: 'https://biljna-apoteka.rs',
    sector: 'Doğal Bitkisel İlaçlar, Bitki Damlaları, Çaylar ve Manastır Tentürleri',
    email: 'kontakt@mediflora.rs',
    phone: '+381 11 380 62 81',
    city: 'Beograd',
    legal_entity: 'Mediflora Biljna Apoteka Beograd',
    contact_person: 'Apotekarski Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, Beograd Čelopečka, Pouzeće, Kurye Ağı',
    hook_note: 'Cam damlalıklı şişelerde sunulan doğal bitki tentürleri ve şuruplar kargo aktarmalarında sarsılma ve kırılma riski taşır. Teslim alınmayan paket çift yönlü navlun ve ürün yıpranması yaratır.',
    growth_opportunities: '• Yaşlı ve Telefonla Sipariş Veren Kitleye SMS Kolaylığı: Karmaşık web formları yerine telefon onay linki.\n• Hassas Cam Şişe Güvenliği: Kuryeye sadece adresi kesinleşmiş ve onaylanmış paketler verilir.\n• Kapıda Ödenecek Tutarın Netleştirilmesi: Kurye komisyonu itirazlarını engeller.',
    template: {
      slug: 'custom-mediflora',
      title: 'Mediflora Biljna Apoteka Özel Şablonu (Bitkisel Damlalar)',
      subject: 'isporuka Mediflora biljnih kapi pouzećem i tačnost adrese, Mediflora',
      opening: 'Primetio sam dugu tradiciju i vrhunski asortiman biljnih kapi i tinktura u Mediflora biljnoj apoteci uz slanje pouzećem. Kod prirodnih preparata u staklu, nepreuzeta pošiljka donosi plaćanje duple poštarine kuriru i nepotrebno izlaže osetljive bočice sarkanju po magacinima.'
    }
  },
  {
    name: 'Izaberi Poklon',
    website: 'https://izaberipoklon.rs',
    sector: 'Kişiye Özel Baskılı Hediyeler, Peluş Oyuncak, Sihirli Kupa, Foto-Kamen',
    email: 'office@izaberipoklon.rs',
    phone: '061 31 54 641',
    city: 'Beograd',
    legal_entity: 'Izaberi Poklon Beograd',
    contact_person: 'D2C Poklon Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, Pouzeće, Beograd D2C, Custom Product Designer',
    hook_note: 'Üzerine isim, fotoğraf veya tarih basılan kişiye özel ürünler nepreuzet paket durumunda tekrar satılamaz; doğrudan %100 sermaye kaybıdır.',
    growth_opportunities: '• Kişiye Özel Ürün Yangınını Kesme: İsim baskılı ürünler geri döndüğünde çöpe atılır; ön onay şarttır.\n• Sosyal Medya Dürtüsel Sipariş Filtresi: Instagram\'dan sipariş verip unutanları eler.\n• Kargo Öncesi Adres Netleştirme: Kurye teslimat başarısını %97\'ye çıkarır.',
    template: {
      slug: 'custom-izaberipoklon',
      title: 'Izaberi Poklon Özel Şablonu (Kişiye Özel Hediyeler)',
      subject: 'personalizovani pokloni pouzećem i adresa pre slanja, Izaberi Poklon',
      opening: 'Primetio sam sjajne personalizovane poklone i plišane igračke sa štampom na Izaberi Poklon shopu. Kod personalizacije sa imenom i fotografijom kupca, svaki paket koji se vrati nepreuzet je čist gubitak robe koja više nema kome da se proda, uz plaćanje dvostrukog prevoza.'
    }
  },
  {
    name: 'Gravura.rs',
    website: 'https://gravura.rs',
    sector: 'Lazer Ahşap & Cam Gravür, Kişiye Özel Ahşap Şişe Kutuları ve Kesme Tahtaları',
    email: 'gravurars@gmail.com',
    phone: '+381 64 446 4197',
    city: 'Srbija',
    legal_entity: 'Gravura.rs Radionica',
    contact_person: 'Gravura Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, D2C Lazer Atölyesi, Pouzeće',
    hook_note: 'Ahşap veya cam üzerine kalıcı lazer kazıma ile isim veya logo işlenir. Müşteri kapıda paketi almazsa satıcı hem çift yönlü kargo parasını öder hem de kazınmış ürünü hurdaya ayırır.',
    growth_opportunities: '• %100 Fire Riski: Kalıcı kazınmış unikat ürünler başkasına satılamaz.\n• Hediye Siparişlerinde Alıcı Teyidi: Kutlama hediyelerinde teslimat günü kesinliği.\n• SMS Doğrulaması ile Ciddiyet: Sipariş ciddiyetini artırarak kapıda vazgeçmeleri keser.',
    template: {
      slug: 'custom-gravura',
      title: 'Gravura.rs Özel Şablonu (Lazer Ahşap Gravür)',
      subject: 'isporuka unikatnih graviranih poklona pouzećem, Gravura.rs',
      opening: 'Vidim sa koliko preciznosti izrađujete gravirane drvene kutije i unikatne poklone na Gravura.rs. Kod proizvoda na kojima je trajno urezana lična posveta, nepreuzet paket je stopostotni gubitak — robu više niko ne može kupiti, a plaća se i dupla poštarina kuriru.'
    }
  },
  {
    name: 'Štampane Majice',
    website: 'https://stampanemajice.rs',
    sector: 'D2C Özel Tasarım Baskılı Tişört ve Sweatshirt Modası',
    email: 'info@stampanemajice.rs',
    phone: '062 704 679',
    city: 'Srbija',
    legal_entity: 'Štampane Majice Online Shop',
    contact_person: 'Webshop Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, D2C Tekstil Baskı, Pouzeće',
    hook_note: 'Sosyal medyadan gelen dürtüsel siparişlerde kapıda ödemeden vazgeçme oranı yüksektir. Özel basılan tişört geri döndüğünde stokta eritilemez.',
    growth_opportunities: '• Dürtüsel Sipariş İadelerini Önleme: Sosyal medya dürtüsel siparişlerinde %15 iade oranını SMS teyidi sıfırlar.\n• Beden Doğrulaması: SMS teyit ekranında beden teyidi alarak yanlış beden iadesini önleme.\n• Sadece Onaylı Siparişleri Basma: Mağaza personeli tişörtü basmadan önce SMS onayını bekler.',
    template: {
      slug: 'custom-stampanemajice',
      title: 'Štampane Majice Özel Şablonu (Özel Baskılı Tişörtler)',
      subject: 'isporuka štampanih majica pouzećem i potvrda adrese, Štampane Majice',
      opening: 'Primetio sam veliku ponudu kreativnih štampanih majica i dukseva na vašem shopu uz slanje pouzećem. Kod online prodaje garderobe sa štampom, impulsivne porudžbine gde kupac ne preuzme paket donose bespotreban trošak duple poštarine i drže robu danima u transportu.'
    }
  },
  {
    name: 'Greenshop.rs',
    website: 'https://greenshop.rs',
    sector: 'Sertifikalı Doğal Kozmetik, Eko Bakım & Organik Ürünler (5000+ Recenzija)',
    email: 'info@greenshop.rs',
    phone: null,
    city: 'Srbija',
    legal_entity: 'Greenshop.rs Eko Trgovina',
    contact_person: 'E-commerce Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, GTM4WP, Google Tag Manager, Google Analytics 4, Pouzeće',
    hook_note: 'Yüksek hacimli D2C doğal kozmetik operasyonu; kapıda ödemede %10 iade bile aylık yüzlerce kargo faturası ve lojistik maliyeti yaratır.',
    growth_opportunities: '• Yüksek Hacimde Küçük Yüzde = Büyük Kâr: 5.000+ yorumluk devasa katalogda %5 iade düşüşü binlerce euro kargo tasarrufu sağlar.\n• Adres Eksikliklerini Giderme: Apartman no ve bina girişi eksikliklerini Potvrdio ekranında tek tıkla tamamlama.\n• Hassas Doğal Kremlerin Korunması: Aşırı sıcak/soğukta kurye araçlarında günlerce beklemeyi önleme.',
    template: {
      slug: 'custom-greenshop',
      title: 'Greenshop.rs Özel Şablonu (Doğal & Eko Kozmetik)',
      subject: 'isporuka prirodne kozmetike pouzećem i tačnost adrese, Greenshop',
      opening: 'Primetio sam impresivan asortiman sertifikovane prirodne kozmetike i preko 5.000 recenzija na Greenshop.rs uz opciju plaćanja pouzećem. Kod velikog mesečnog broja paketa, svaka netačno uneta adresa ili nepreuzeta pošiljka stvara ozbiljan logistički trošak i gomila povratne poštarine.'
    }
  },
  {
    name: 'Slatkoteka ®',
    website: 'https://slatkoteka.rs',
    sector: 'Butik Donut, Pasta, Tatlı Hediyeleri & Gurme Çikolata (Slatkoteka Markası)',
    email: 'upit@slatkoteka.rs',
    phone: '065 33 00 508',
    city: 'Beograd',
    legal_entity: 'Slatkoteka Beograd',
    contact_person: 'Slatkoteka Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, Beograd Lokasyonları, Pouzeće, Fresh Delivery Ekibi',
    hook_note: 'Donut ve pastalar günlük taze unlu mamullerdir. Alıcı kapıda bulunamazsa o gün bayatlar ve 100% imha edilir. Ön teyit fireyi sıfırlar.',
    growth_opportunities: '• Günlük Taze Üründe Sıfır Fire: Teslim alınmayan pasta ve donut doğrudan çöpe atılır; SMS ön teyidi bu kaybı tamamen engeller.\n• Daire ve Zil No Detaylarının Alınması: Kuryenin kapıda beklemesini ve alıcıya ulaşamama sorununu ortadan kaldırır.\n• VIP Marka İmajı: SMS ve Viber onay akışı lüks pastane marka imajını güçlendirir.',
    template: {
      slug: 'custom-slatkoteka',
      title: 'Slatkoteka ® Özel Şablonu (Günlük Taze Donut & Pastalar)',
      subject: 'dostava svežih krofni i torti i tačnost adrese pre slanja, Slatkoteka',
      opening: 'Kao ljubitelj slatkiša pratim neverovatan uspeh i prelepe krofne i torte koje Slatkoteka dostavlja širom Beograda. Kod svežih poslastica sa dnevnim rokom trajanja, nepreuzet paket ili netačan broj stana znači stopostotan otpis proizvoda koji više ne može da se vrati u vitrinu.'
    }
  },
  {
    name: 'Pikshop',
    website: 'https://pikshop.rs',
    sector: 'Ahşap Çocuk Mutfakları, Bebek Evleri, Montessori Eğitici Oyuncaklar',
    email: 'info@pikshop.rs',
    phone: null,
    city: 'Srbija',
    legal_entity: 'Pikshop D2C Igračke',
    contact_person: 'Prodajni Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, Pouzeće, Ağır Karton Lojistiği',
    hook_note: 'Ahşap çocuk mutfakları ve bebek evleri 8 ila 15 kg masif kartonlarda gönderilir. Nepreuzet paket yüksek desi tarifesiyle çift yönlü kargo faturası çıkarır.',
    growth_opportunities: '• Masif Desi Koruması: 10-15 kg ahşap mutfak kolisi iadesinde çift yönlü yüksek kargo kaybını önleme.\n• Doğum Günü Teslimat Teyidi: Çocuğun doğum günü öncesinde alıcının adreste hazır olmasını sağlama.\n• Orijinal Kutu Hasarını Önleme: Kurye araçlarında haftalarca dolaşıp kutunun ezilmesini engelleme.',
    template: {
      slug: 'custom-pikshop',
      title: 'Pikshop Özel Şablonu (Ahşap Oyuncaklar & Mutfaklar)',
      subject: 'isporuka drvenih igračaka pouzećem i potvrda adrese, Pikshop',
      opening: 'Video sam bogatu ponudu drvenih igračaka, kuhinjica i kućica za lutke na Pikshop.rs. Kod teških i masivnih paketa igračaka, nepreuzeta pošiljka donosi plaćanje skupe duple poštarine kuriru i rizik da se originalna kutija ošteti u povratnom transportu.'
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

let insertedCount = 0;

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
    insertedCount++;
  }

  const fullBody = buildBody(s.template.opening);
  insertTemplate.run(
    s.template.slug,
    s.template.title,
    s.template.subject,
    fullBody
  );
  console.log(`  📄 Created/Updated template ${s.template.slug}`);
}

const totalStores = db.prepare('SELECT count(*) as count FROM stores').get();
const totalTemplates = db.prepare('SELECT count(*) as count FROM templates').get();
console.log(`\n🎉 Done! Added ${insertedCount} new stores.`);
console.log(`Total stores in CRM database: ${totalStores.count}`);
console.log(`Total templates in CRM database: ${totalTemplates.count}`);
