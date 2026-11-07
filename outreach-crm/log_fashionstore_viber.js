const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Logging Viber message for Fashion Store...');

const storeId = 2;
const content = `Dobar dan, ovde Atil iz Novog Sada. Pre dva dana sam poslao mejl na info@fashionstore.rs o Potvrdiu, dodatku za WooCommerce koji pre slanja kuriru proverava adresu kupca kod porudžbina pouzećem. Tražim samo 3 do 5 prodavnica za besplatan beta test. Ako vam je lakše, u dve rečenice mogu da objasnim kako radi. Hvala!`;
const subject = 'Viber Takip Hatırlatması: E-posta Sonrası Kısa Bilgilendirme';
const timestamp = '2026-10-16 10:07:00';
const followUpDue = '2026-10-18';

// Insert into communications table
db.prepare(`
  INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
  VALUES (?, 'viber', 'outbound', ?, ?, ?, ?)
`).run(storeId, subject, content, timestamp, followUpDue);

// Update store status to waiting_reply and append note
db.prepare(`
  UPDATE stores
  SET status = 'waiting_reply',
      notes = notes || ' | 16 Ekim 10:07 Viber üzerinden takip mesajı gönderildi. Yanıt bekleniyor.',
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`).run(storeId);

console.log('✅ Fashion Store updated with Viber communication and status: waiting_reply');
