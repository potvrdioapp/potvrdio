const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Logging Viber message for Fermini...');

const storeId = 4;
const content = `Dobar dan, ovde Atil iz Novog Sada. Pre dva dana sam poslao mejl na info@fermini.rs o Potvrdiu, WooCommerce dodatku koji pre slanja kuriru proverava adresu kupca kod porudžbina pouzećem. Tražim 3 do 5 prodavnica za besplatan beta test (prvih 25 porudžbina pouzećem ili 30 dana, šta pre istekne). Ako želite, u dve rečenice mogu da objasnim kako radi. Hvala!`;
const subject = 'Viber Takip Hatırlatması: E-posta Sonrası Kısa Bilgilendirme';
const timestamp = '2026-10-16 10:14:00';
const followUpDue = '2026-10-18';

// Insert into communications table
db.prepare(`
  INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
  VALUES (?, 'viber', 'outbound', ?, ?, ?, ?)
`).run(storeId, subject, content, timestamp, followUpDue);

// Update store status to waiting_reply and append notes
db.prepare(`
  UPDATE stores
  SET status = 'waiting_reply',
      notes = notes || ' | 16 Ekim 10:14 Viber mesajı atıldı (+381 64 032 3362). Yanıt bekleniyor.',
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`).run(storeId);

console.log('✅ Fermini updated with Viber communication and status: waiting_reply');
