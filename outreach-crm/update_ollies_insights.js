const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Updating Ollie\'s insights, founder info and custom template...');

const storeId = 20;

const sector = 'Premium Maslinovo Ulje & Prirodna Kozmetika';
const contactPerson = 'Jelena Savić (Osnivač)';
const hookNote = 'Deda Sava aile mirası, 700 zeytin ağacı, cam şişeli sızma zeytinyağı ve doğal kozmetik. 10.000 RSD üzeri ücretsiz teslimat. Cam ambalaj kırılma riski ve çift yönlü navlun kaybı.';
const growthOpportunities = `• Cam Şişe & Hassas Sıvı Taşınması: Cam şişedeki soğuk sıkım zeytinyağı ve kremlerin iade sürecinde kurye araçlarında günlerce dolaşması kırılma ve akma riski yaratır; kargo çıkışı öncesi SMS teyidi bunu önler.
• 10.000 RSD Üzeri Yüksek Sepet & Çift Yönlü Navlun: 10.000 RSD üzeri ücretsiz kargo sunuluyor; tek bir teslim alınmayan koli tüm sipariş kârını siler.
• Aile Mirası & Hikaye Odaklı İletişim: Jelena Hanım markayı Dede Sava mirasıyla kurduğu için teyit SMS/Viber mesajında butik, kişisel bir ton kullanılması müşteri sadakatini ve teslim alma oranını artırır.`;
const techStack = 'WooCommerce, Elementor Pro, Qi Addons, RankMath SEO, Klaviyo Entegrasyonu';

// Update store
db.prepare(`
  UPDATE stores
  SET name = ?,
      sector = ?,
      contact_person = ?,
      priority = 'p1_verified',
      hook_note = ?,
      growth_opportunities = ?,
      tech_stack = ?,
      notes = notes || ' | Jelena Savić (kurucu), Deda Sava 700 zeytin ağacı hikayesi. 10.000 RSD üzeri ücretsiz kargo.',
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`).run("Ollie's", sector, contactPerson, hookNote, growthOpportunities, techStack, storeId);

// Insert or update template
const templateSlug = 'custom-ollies';
const templateTitle = "Ollie's: Jelena Savić, Deda Sava Mirası, Cam Şişe Zeytinyağı & 10.000 RSD Kargo";
const templateSubject = "priča o dedi Savi, maslinovo ulje i nepreuzeti paketi, Ollie's";
const templateBody = `Poštovana Jelena,

Pročitao sam priču o vašem dedi Savi i maslinjaku od 700 stabala. Kod prirodne kozmetike i vrhunskog maslinovog ulja u staklenoj ambalaži, svaki paket koji se vrati na pouzeću ne znači samo dupli trošak dostave (posebno uz besplatnu dostavu preko 10.000 RSD), već i rizik od oštećenja proizvoda koji danima putuje umesto da bude kod kupca.

Razvijam Potvrdio, dodatak za WooCommerce: pre slanja paketa kupac dobija SMS sa linkom i jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju. Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza.

Ako želite, pošaljem vam link sa kratkim prikazom (30 sekundi). Dovoljno je da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.`;

db.prepare(`
  INSERT INTO templates (slug, title, category, subject, body)
  VALUES (?, ?, 'custom_tailored', ?, ?)
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    subject = excluded.subject,
    body = excluded.body
`).run(templateSlug, templateTitle, templateSubject, templateBody);

console.log('✅ Ollie\'s successfully updated in database with rich insights and template!');
