const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Logging Viber message and phone for Šifonjer...');

const storeId = 3;
const phone = '+381 63 818 4777';
const content = `Dobar dan, ovde Atil iz Novog Sada. Pre dva dana sam poslao mejl na podrska@sifonjer.rs o Potvrdiu, WooCommerce dodatku koji pre slanja kuriru proverava adresu kupca kod porudžbina pouzećem. Kod polovne garderobe, gde je svaki komad jedinstven, nepreuzet paket posebno boli. Tražim 3 do 5 prodavnica za besplatan beta test (prvih 25 porudžbina pouzećem ili 30 dana, šta pre istekne). Ako želite, u dve rečenice mogu da objasnim kako radi. Hvala!`;
const subject = 'Viber Takip Hatırlatması: Tekil 1-of-1 İkinci El Ürün Kancası';
const timestamp = '2026-10-16 10:12:00';
const followUpDue = '2026-10-18';

// Insert into communications table
db.prepare(`
  INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
  VALUES (?, 'viber', 'outbound', ?, ?, ?, ?)
`).run(storeId, subject, content, timestamp, followUpDue);

// Update store phone, status to waiting_reply, and append notes
db.prepare(`
  UPDATE stores
  SET phone = ?,
      status = 'waiting_reply',
      notes = notes || ' | 16 Ekim 10:12 Viber mesajı atıldı (+381638184777). Yanıt bekleniyor.',
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`).run(phone, storeId);

console.log('✅ Šifonjer updated with phone, Viber communication, and status: waiting_reply');
