const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Upgrading Backup Shop in SQLite database...');

const updateStoreStmt = db.prepare(`
  UPDATE stores
  SET name = 'Backup Shop',
      website = 'https://backupshop.rs',
      sector = 'Giyim, Çanta & Deri Aksesuar (David Jones, Anekke, Doca)',
      email = 'office@backupshop.rs',
      phone = '+381 64 859 8050',
      city = 'Zrenjanin',
      legal_entity = 'Željko Veselinović PR Trgovina na malo tekstilom i predmetima od kože Back Up Zrenjanin',
      priority = 'p1_verified',
      contact_person = 'Željko Veselinović (Vlasnik/Preduzetnik)',
      hook_note = 'Sitede uslovi-isporuke sayfasında siparişten sonra 24-48 saat içinde her müşterinin telefonla teyit için arandığı açıkça yazıyor. Kanca: 24-48 saatlik manuel arama yükünü tek tıkla otomatik SMS onayına dönüştürme.',
      growth_opportunities = '• Manuel Telefon Teyidi (24-48 Saat): Sitede sipariş sonrasında satıcının müşteriyi 24-48 saat içinde (hafta sonu siparişlerinde Pazartesi) arayarak verileri ve siparişi teyit ettiği açıkça belirtiliyor. Otomatik SMS teyidi bu manuel iş yükünü ve günlerce arama bekleme süresini sıfırlar.\n• Butik Stok Kilitlenmesi: Sitede \"stokların fiziksel mağaza ile paylaşıldığı ve tükenmiş olabileceği\" uyarısı var. Teyitsiz kargo kuryede günlerce dolaşıp iade dönerse vitrin ürünü raftan düşer.\n• 7.000 RSD Üzeri Çift Yönlü Navlun Riski: Post Express ve AKS ile gönderiliyor, 7.000 RSD üzeri ücretsiz kargo veriliyor. İade dönen paket çift yönlü navlun zararı yazıyor.',
      tech_stack = 'WooCommerce (WordPress), Blocksy Tema, Elementor, LiteSpeed Cache, Variation Swatches, Kurumsal E-posta (Cloudflare korumalı)',
      notes = 'PIB: 101166628, MB: 62272147. Zrenjanin merkezli, 1996’dan beri faaliyet gösteren 30 yıllık butik. Sahibi Željko Veselinović. Doğrulanmış e-posta: office@backupshop.rs (kullanıcı ofis@backupshop.rs olarak da belirtti).',
      updated_at = CURRENT_TIMESTAMP
  WHERE website LIKE '%backupshop%'
`);

updateStoreStmt.run();

const templateSlug = 'custom-backupshop';
const templateTitle = 'Backup Shop: Zrenjanin Butik, 24-48 Saat Telefon Teyidi & Post Express / AKS';
const templateCategory = 'custom_tailored';
const templateSubject = 'telefonska provera porudžbina i Post Express, BackUp Shop';
const templateBody = `Poštovani gospodine Veselinoviću,

Video sam da na sajtu navodite da vaš prodavac nakon porudžbine telefonom kontaktira svakog kupca radi provere podataka, što može potrajati 24 do 48 sati. Kod brendiranih tašni i garderobe koje šaljete putem Post Expressa i AKS-a, taj ručni rad i čekanje na poziv mogu da zamene automatske poruke, a vi šaljete samo proverene pakete.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.`;

const existingTmpl = db.prepare('SELECT id FROM templates WHERE slug = ?').get(templateSlug);
if (existingTmpl) {
  db.prepare(`
    UPDATE templates
    SET title = ?, category = ?, subject = ?, body = ?
    WHERE slug = ?
  `).run(templateTitle, templateCategory, templateSubject, templateBody, templateSlug);
  console.log('✅ Template updated for Backup Shop.');
} else {
  db.prepare(`
    INSERT INTO templates (slug, title, category, subject, body)
    VALUES (?, ?, ?, ?, ?)
  `).run(templateSlug, templateTitle, templateCategory, templateSubject, templateBody);
  console.log('✅ Template inserted for Backup Shop.');
}

console.log('🎉 Backup Shop data processing complete!');
