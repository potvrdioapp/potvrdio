const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Logging October 19 Viber follow-up message for Fermini...');

const storeId = 4;
const channel = 'viber';
const direction = 'outbound';
const subject = 'Viber Takip: Hafta Sonu Sonrası Demo & 25 Siparişlik Ücretsiz Kurulum Hatırlatması';
const timestamp = '2026-10-19 17:00:00';
const followUpDue = '2026-10-22';
const content = `Dobar dan Sanela, nadam se da ste lepo odmorili za vikend!

Samo kratko da se javim,  da li ste stigli da bacite pogled na prikaz?

Ako vam zvuči korisno za smanjenje vraćenih paketa, možemo besplatno podesiti proveru adrese za prvih 25 porudžbina (bez ikakvih obaveza i troškova za vas), pa da vidite kako funkcioniše u praksi.

Pozdrav, Atil`;

// Insert communication
db.prepare(`
  INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(storeId, channel, direction, subject, content, timestamp, followUpDue);

// Update store notes and follow_up_due
db.prepare(`
  UPDATE stores
  SET notes = notes || ' | 19 Ekim 17:00 Viber takibi yapıldı (hafta sonu sonrası demo inceleme ve 25 siparişlik ücretsiz kurulum hatırlatıldı).',
      follow_up_due = ?,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`).run(followUpDue, storeId);

console.log('✅ Communication successfully logged for Fermini (ID: 4)!');
