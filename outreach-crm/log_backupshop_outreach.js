const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Logging sent email for Backup Shop and creating follow-up template...');

const store = db.prepare('SELECT * FROM stores WHERE website LIKE ?').get('%backupshop%');
if (!store) {
  console.error('Backup Shop store not found!');
  process.exit(1);
}

const sentContent = `Na vašem sajtu piše da vaš tim nakon porudžbine kontaktira kupce radi potvrde porudžbine i isporuke. Kod plaćanja pouzećem to je ručni posao za svaku porudžbinu, a pogrešna adresa se često otkrije tek kada je kurir već krenuo.

Razvijam Potvrdio (potvrdio.online), WooCommerce dodatak koji taj korak radi automatski: kupac dobija SMS sa linkom, jednim klikom potvrđuje porudžbinu ili ispravlja adresu, a porudžbina do tada ostaje na čekanju (On-Hold).

Tražim 3 do 5 prodavnica za zatvoreni beta test: dve nedelje, besplatno, na stvarnim porudžbinama. Da li bi vas zanimalo? Dovoljan je kratak odgovor na ovaj mejl, pa vam šaljem detalje.`;

const sentSubject = 'Automatizacija provere adrese i potvrde za BackUp Shop (WooCommerce)';
const followUpDue = '2026-10-17'; // 48 hours later

// Insert into communications
db.prepare(`
  INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
  VALUES (?, 'email', 'outbound', ?, ?, '2026-10-15 15:15:00', ?)
`).run(store.id, sentSubject, sentContent, followUpDue);

// Update store status to email_sent
db.prepare(`
  UPDATE stores
  SET status = 'email_sent',
      notes = notes || ' | 15 Ekim 15:15 Şablon A ile ilk e-posta gönderildi. Takip tarihi: 17 Ekim.',
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`).run(store.id);

// Create or update follow-up template
const followupSlug = 'custom-backupshop-followup';
const followupTitle = 'Backup Shop Takip (Follow-up): 24-48 Saat Arama Süresi & 30 Sn Demo Linki';
const followupSubject = 'Re: Automatizacija provere adrese i potvrde za BackUp Shop (WooCommerce)';
const followupBody = `Poštovani gospodine Veselinoviću,

Samo kratko da se nadovežem na prethodni mejl. Ako vam je lakše da prvo vidite kako izgleda, ovde je kratak prikaz (30 sekundi):
https://potvrdio.online/kako-funkcionise

Za Backup Shop ovo znači da vaš prodavac ne mora ručno da zove kupce 24 do 48 sati nakon porudžbine — kupac jednim klikom potvrdi adresu na SMS-u, a vi šaljete samo proverene pakete Post Expressom i AKS-om.

Besplatno je za prvih 25 porudžbina pouzećem ili najviše 30 dana od aktivacije, bez obaveza. Dovoljno je samo da odgovorite sa "da". Ako trenutno nije aktuelno, slobodno mi samo javite.`;

const existingFup = db.prepare('SELECT id FROM templates WHERE slug = ?').get(followupSlug);
if (existingFup) {
  db.prepare(`
    UPDATE templates
    SET title = ?, subject = ?, body = ?, category = 'followup'
    WHERE slug = ?
  `).run(followupTitle, followupSubject, followupBody, followupSlug);
} else {
  db.prepare(`
    INSERT INTO templates (slug, title, category, subject, body)
    VALUES (?, ?, 'followup', ?, ?)
  `).run(followupSlug, followupTitle, followupSubject, followupBody);
}

console.log('✅ Communication logged, status set to email_sent, and follow-up template created!');
