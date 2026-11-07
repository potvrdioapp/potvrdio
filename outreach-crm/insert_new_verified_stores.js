const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🚀 Adding 8 deeply verified WooCommerce COD stores to Potvrdio CRM...');

const newStores = [
  {
    name: 'Kocke.rs',
    website: 'https://kocke.rs',
    sector: 'Oyuncak, Lego & Eğitici Çocuk Setleri',
    email: 'info@kocke.rs',
    phone: '+381 63 111 8148',
    city: 'Beograd',
    legal_entity: 'Kocke.rs Online Shop',
    contact_person: 'Prodajni Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, Elementor, MailerLite, Kurir Sistemleri',
    hook_note: 'Çocuk oyuncakları, Lego ve eğitici yapboz setleri satışı. Çocukların dürtüsel isteğiyle verilen kapıda ödeme siparişlerinde ebeveynlerin kargo kapıya gelene kadar vazgeçmesi veya kutunun hasar görüp rafta değer kaybetmesi riski çok yüksek.',
    growth_opportunities: '• Dürtüsel Çocuk Siparişi İptalleri: Çocukların isteğiyle aceleyle verilen kapıda ödeme siparişlerinde ebeveyn teslimat anında ödemekten kaçınabiliyor; anlık SMS onayı ebeveyn ciddiyetini teyit eder.\n• Kutu ve Ambalaj Koruma: Lego ve koleksiyonluk oyuncak kutularının kargo transfer merkezlerinde ezilmeden doğrudan alıcısına ulaşması sağlanır.\n• Okul ve Hediye Dönemi Zirveleri: Doğum günleri ve yılbaşı pik dönemlerinde telefonla arama yükünü sıfırlar.',
    template: {
      slug: 'custom-kocke',
      title: 'Kocke.rs Özel Şablonu (Oyuncak & Çocuk)',
      subject: 'potvrda adrese za porudžbine pouzećem, Kocke.rs',
      opening: 'Primetio sam da Kocke.rs ima odličan izbor Lego setova i dečijih igračaka uz plaćanje pouzećem. Kod igračaka i poklona, kupci često u trenutku poruče na brzinu, a kada kurir stigne desi se da paket ostane nepreuzet — što vam stvara dvostruku poštarinu i rizik da se originalna kutija ošteti u povratu.'
    }
  },
  {
    name: 'Silver and Fashion',
    website: 'https://silverandfashion.rs',
    sector: '925 Ayar Gümüş Takı & Mücevherat',
    email: 'silverandfashion2021@gmail.com',
    phone: '+381 60 490 7060',
    city: 'Novi Sad',
    legal_entity: 'Silver and Fashion (Mina Stanković PR)',
    contact_person: 'Mina Stanković / Dejan Đurić',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce 11.2, WordPress, Woodmart Theme, Post Express Entegrasyonu',
    hook_note: 'Novi Sad merkezli 925 ayar gümüş takı (küpe, kolye, yüzük) üreticisi ve satıcısı. 3.000 RSD üzeri ücretsiz kargo sunuyorlar. Takıda kapıda ödeme iadeleri küçük paket olmasına rağmen kargo ve sigorta kaybı yaratır. Aynı şehirde olmamız (Novi Sad) doğrudan sıcak güven avantajı sağlar.',
    growth_opportunities: '• Lokal Novi Sad Güveni: Atıl da Novi Sad merkezli olduğundan yerel empati ve komşu işletme bağı çok kuvvetlidir.\n• 3.000 RSD Üzeri Ücretsiz Kargo Koruma: Kargo maliyetini mağaza üstlendiği için teslim alınmayan her paket doğrudan net kârdan iki kat kargo ücreti eksiltir.\n• Yüzük Ölçüsü & Adres Netliği: Teslimat öncesi gönderilen onay linki alıcının ciddiyetini ve adresin doğruluğunu garanti altına alır.',
    template: {
      slug: 'custom-silverandfashion',
      title: 'Silver and Fashion Özel Şablonu (Gümüş Takı & Novi Sad)',
      subject: 'isporuka nakita pouzećem i potvrda adrese, Silver and Fashion',
      opening: 'Kao komšija iz Novog Sada, pratim prelep rad Silver and Fashion tima sa srebrnim nakitom. Pošto za porudžbine preko 3.000 RSD nudite besplatnu dostavu preko Post Express-a, nepreuzeti paketi i netačne adrese prave dvostruki trošak koji direktno jede zaradu na ručno pravljenim komadima.'
    }
  },
  {
    name: 'Ljuljuška',
    website: 'https://ljuljuska.com',
    sector: 'Bebek & Çocuk Salıncakları & Doğal Tekstil',
    email: 'info@ljuljuska.com',
    phone: '+381 22 434 356',
    city: 'Karlovčić (Srem)',
    legal_entity: 'Ljiljana Aspradakis PR Ljuljuška (MB: 65429608, PIB: 111464302)',
    contact_person: 'Ljiljana Aspradakis',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, Elementor, Post Express, Banca Intesa',
    hook_note: 'Bebek ve küçük çocuklar için özel tasarım kumaş salıncak atölyesi. Post Express ile kapıda ödeme gönderiyorlar. Hacimli ve özenle dikilmiş tekstil ürünlerinde geri dönen paket kumaşın kirlenmesi, paket aşınması ve yüksek kargo maliyeti riski taşır.',
    growth_opportunities: '• Hacimli Tekstil Salıncak Koruması: Salıncaklar hem hacimli hem de el emeği ürünlerdir; geri dönen paket Post Express gidiş-dönüş navlunu yükler.\n• Anne-Bebek Hedef Kitlesinde Adres Netliği: Yeni doğum yapmış veya taşınmış anneler kargo adresinde kapı zili veya kat numarasını eksik girebilir; tek tıkla adres düzeltme teslimat başarısını artırır.\n• Atölye Butik Güveni: Kurucu Ljiljana Hanım doğrudan butiğin başında olduğu için kişiselleştirilmiş yaklaşım dönüş oranını yükseltir.',
    template: {
      slug: 'custom-ljuljuska',
      title: 'Ljuljuška Özel Şablonu (Bebek Salıncakları)',
      subject: 'dostava Ljuljuški i adresa pre slanja, Ljiljana',
      opening: 'Poštovana Ljiljana, vidim sa koliko ljubavi i pažnje izrađujete Ljuljuške za najmlađe i šaljete ih pouzećem preko Post Express-a. Kod tako specifičnih i kabastih tekstilnih paketa, nepreuzeta pošiljka ili pogrešno uneta adresa znači plaćanje dvostruke poštarine i nepotrebno habanje unikatnog proizvoda u transportu.'
    }
  },
  {
    name: 'Prodaja Parfema',
    website: 'https://prodajaparfema.rs',
    sector: 'Orijinal Parfüm & Kozmetik',
    email: 'info@prodajaparfema.rs',
    phone: '+381 11 405 3838',
    city: 'Beograd',
    legal_entity: 'Prodaja Parfema Srbija',
    contact_person: 'Call Centar Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, WPForms Pro, Post Express, Yandex Delivery, Banca Intesa',
    hook_note: 'Parfüm ve kozmetik satışı. 4.000 RSD üzeri ücretsiz kargo, Post Express ve Belgrad içi Yandex Delivery ile aynı gün teslimat. Parfüm sektöründe kapıda ödeme siparişleri Sırbistan\'da en yüksek iade oranına sahiptir (%15-20); kurye kapıya gittiğinde paranın olmaması veya alıcının vazgeçmesi günlük ciddi zarar yaratır.',
    growth_opportunities: '• Sırbistan Parfüm Pazarında Yüksek İade Acısı: Parfüm siparişlerinde impulsif alımlar çok yaygındır; Potvrdio gönderilmeden önce SMS onayı alarak ciddiyetsiz siparişleri depodan çıkmadan eler.\n• Yandex Same-Day ve Post Express Tasarrufu: Belgrad içi acil teslimatlarda yanlış adres veya ulaşılamayan alıcı kurye maliyetini anında yakar; ön doğrulama bunu engeller.\n• 4.000 RSD Ücretsiz Kargo Sınırı Koruması: Bedava kargo maliyeti mağazaya ait olduğundan her geri dönen paket doğrudan kârdan çift yönlü navlun düşürür.',
    template: {
      slug: 'custom-prodajaparfema',
      title: 'Prodaja Parfema Özel Şablonu (Parfüm & Kozmetik)',
      subject: 'nepreuzeti paketi parfema i provera adrese pre slanja, Prodaja Parfema',
      opening: 'Video sam da na Prodaja Parfema nudite besplatnu dostavu preko 4.000 RSD i brzu isporuku pouzećem. U industriji parfema dobro je poznato koliko impulsivnih kupaca poruči pouzećem pa se predomisli dok kurir stigne, što vam stvara dupli trošak kurirske službe i nepotrebno zadržava vredan lager u kombiju.'
    }
  },
  {
    name: 'AS Ribolov',
    website: 'https://asribolov.rs',
    sector: 'Balıkçılık & Kamp Ekipmanları',
    email: 'prodaja@asribolov.rs',
    phone: '+381 62 240 916',
    city: 'Obrenovac',
    legal_entity: 'TR AS NO 1 SA PROIZVODNJOM (PIB: 105041751, MB: 60720053)',
    contact_person: 'Prodajni Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, OceanWP, Özel Kurir Takip',
    hook_note: 'Balıkçılık takımları, olta kamışları, makineler ve kamp teçhizatı. 4.000 RSD üzeri ücretsiz kargo, 20 kg\'a kadar paket gönderimi. Olta kamışları uzun silindirik tüplerde taşındığından kuriyerlerde özel gabari/desi tarifesine tabidir; geri dönen paket çok yüksek kargo faturası çıkarır.',
    growth_opportunities: '• Silindirik Olta Tüpleri ve Ağır Kargo Navlunu: Olta kamışları uzun ve kırılabilir olduğundan kuriyer firmaları ek desi ücreti alır; nepreuzeti paketler en pahalı iade kategorisindedir.\n• 20 Kg\'a Varan Ağır Paket Koruması: Yem çuvalları ve ağır kamp malzemelerinde teslim alınmayan sipariş iki kat navlun yükler.\n• Hafta Sonu Balık Avı Siparişleri: Cuma günleri aceleyle "hafta sonuna yetişsin" diye sipariş veren ama sonra adreste bulunamayan alıcılar filtrelenir.',
    template: {
      slug: 'custom-asribolov',
      title: 'AS Ribolov Özel Şablonu (Balıkçılık & Kamp)',
      subject: 'isporuka ribolovačke opreme pouzećem i tačnost adrese, AS Ribolov',
      opening: 'Primetio sam da AS Ribolov šalje vrhunski ribolovački pribor i štapove pouzećem širom Srbije. Kod dugačkih štapova i teže opreme do 20kg, kurirske službe naplaćuju posebne gabarite, pa svaka pogrešna adresa ili nepreuzet paket donosi ogroman nepotreban trošak povratne poštarine.'
    }
  },
  {
    name: 'Mey Home Beograd',
    website: 'https://meyhome.rs',
    sector: 'Ev Tekstili, Nevresim, Halı & Yatak Örtüsü',
    email: 'mey.home.doo@gmail.com',
    phone: '+381 60 501 5885',
    city: 'Beograd',
    legal_entity: 'Mey Home DOO',
    contact_person: 'Mey Home Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, Elementor, Bex Express',
    hook_note: 'Posteljine, jorgani, tepisi, prekrivači ve yolluk satışı. Bex Express ile kapıda ödeme gönderiyorlar. Halı ve nevresimler hacimli (yüksek desi) paketlerdir; adreste bulunamayan veya telefonunu açmayan alıcılar yüzünden Bex kargoyu geri getirdiğinde mağaza ağır nakliye bedeli öder.',
    growth_opportunities: '• Ağır ve Hacimli Ev Tekstili Paketleri: Halı ve yorganlar metreküp olarak çok yer kaplar; iade navlunu küçük bir zarfa kıyasla 3-4 kat daha pahalıdır.\n• Bex Express İkinci Dağıtım Sorunu: Alıcıya ilk seferde ulaşılamazsa paket şubeye çekilir ve genellikle iadeye düşer; önceden SMS onayı teslim alma oranını %95+ seviyesine çıkarır.\n• Yeni Ev/Taşınma Adresleri: Müşteriler yeni taşındıkları dairenin adresini veya kapı numarasını eksik yazabilir; onay linkindeki adres düzeltme özelliği bunu çözer.',
    template: {
      slug: 'custom-meyhome',
      title: 'Mey Home Özel Şablonu (Ev Tekstili & Halı)',
      subject: 'isporuka posteljina i tepiha pouzećem, Mey Home',
      opening: 'Video sam bogatu ponudu posteljina i tepiha na Mey Home shopu i da pošiljke šaljete pouzećem preko Bex-a. Kod tako kabastih i teških paketa kućnog tekstila, nepreuzeta pošiljka ili pogrešno upisan broj stana znači plaćanje skupe povratne vožnje i zadržavanje robe.'
    }
  },
  {
    name: 'Kafa Amigo',
    website: 'https://kafaamigo.rs',
    sector: 'Taze Kavrulmuş Kahve & Espresso Kapsülleri',
    email: 'gogicmilan.amigo@gmail.com',
    phone: '+381 61 208 6994',
    city: 'Sombor',
    legal_entity: 'Kafa Amigo (Milan Gogić PR)',
    contact_person: 'Milan Gogić',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, Post Express / DExpress',
    hook_note: 'Sombor merkezli taze çekirdek kahve kavurucusu ve Nespresso uyumlu kapsül üreticisi. Kurucusu Milan Gogić. Taze kavrulmuş kahve bekleme süresine duyarlıdır; kuryede günlerce gezip geri dönen kahve tazeliğini yitirir ve satıcıya çift yönlü kargo masrafı çıkarır.',
    growth_opportunities: '• Taze Gıda Tazelik Kaybı: Kavrulmuş kahvenin 10-15 gün kargo deposunda ve kurye aracında beklemesi aromasını bozar; ön onay sadece teslim alacak gerçek kahveseverlere gönderim yapılmasını sağlar.\n• Kurucu Milan Bey İle Doğrudan İletişim: Butik kahve kavurucularında kurucu lojistiğe bizzat bakar; hızlı ve net değer önerisi dikkat çeker.\n• Ofis ve Ev Abonelikleri: Düzenli kahve siparişi veren müşterilerde adres doğrulaması süreci hızlandırır.',
    template: {
      slug: 'custom-kafaamigo',
      title: 'Kafa Amigo Özel Şablonu (Taze Kahve & Sombor)',
      subject: 'sveže pržena kafa i potvrda adrese pre slanja, Milane',
      opening: 'Poštovani Milane, vidim sa koliko pažnje Amigo Kafa prži svežu kafu i espresso kapsule i šalje ih ljubiteljima kafe pouzećem. Kod sveže kafe, svaki nepreuzet paket koji danima putuje po kurirskim magacinima ne samo da donosi dupli trošak dostave, već i gubi onaj vrhunski kvalitet i svežinu arome.'
    }
  },
  {
    name: 'Amelles Kozmetika',
    website: 'https://amelles.rs',
    sector: 'Doğal Mineral Kozmetik & Cilt Bakımı',
    email: 'online@amelles.rs',
    phone: '+381 36 242 5615',
    city: 'Vrnjačka Banja',
    legal_entity: 'PR AMELLES',
    contact_person: 'Amelles Tim',
    priority: 'p1_verified',
    status: 'not_contacted',
    tech_stack: 'WooCommerce, WordPress, Elementor, SSL Enkripsiyon, Kargo Entegrasyonu',
    hook_note: 'Vrnjačka Banja kaynaklı mineral ve doğal cilt bakım kozmetikleri. 5.900 RSD üzeri ücretsiz kargo, kapıda ödeme kabul ediyorlar. Cam kavanoz ve hassas serum şişeleri kargo transferinde risklidir; geri dönen her paket hem kargo bedeli hem de kırılma riski demektir.',
    growth_opportunities: '• Cam Şişe ve Hassas Serum Koruması: Doğal tonikler ve cam kavanoz kremler kargo transfer merkezlerinde tekrar tekrar el değiştirdikçe kırılma ve akma riski artar; doğrudan alıcıya ulaşması elzemdir.\n• 5.900 RSD Yüksek Ücretsiz Kargo Eşiği: Mağaza yüksek sepetli siparişlerde kargoyu üstlendiğinden teslim alınmayan tek bir paket 1.000+ RSD net kargo zararı yazar.\n• Butik Doğal Marka Prestiji: Alıcıya kargo çıkmadan önce gelen kurumsal Viber/SMS onay ekranı mağazanın profesyonel algısını güçlendirir.',
    template: {
      slug: 'custom-amelles',
      title: 'Amelles Kozmetika Özel Şablonu (Doğal Kozmetik)',
      subject: 'isporuka Amelles kozmetike pouzećem i tačnost adrese, Amelles',
      opening: 'Primetio sam prelepu liniju prirodne mineralne kozmetike na Amelles shopu i da za veće porudžbine nudite besplatnu isporuku pouzećem. Kod staklenih bočica i osetljivih seruma, nepreuzet paket ili netačna adresa ne samo da stvara dupli trošak transporta, već izlaže unikatne preparate nepotrebnom tumbanju po kurirskim vozilima.'
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
  // Check if store already exists
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

  // Insert template
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
console.log(`\n🎉 All 8 stores and templates successfully saved! Total stores in CRM: ${total.count}`);
