const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Logging Viber & WhatsApp follow-up for Comfortino...');

const storeId = 5;
const channel = 'viber';
const direction = 'outbound';
const subject = 'Viber & WhatsApp Takip: 15 Ekim E-posta Hatırlatması & How-it-Works Linki';
const content = `Dobar dan, ovde Atil iz Novog Sada. Pisao sam vam mejlom 15. oktobra o nepreuzetim paketima kod AKS dostave. Kod obuće svaki vraćeni paket znači plaćenu dostavu u oba smera. Ovde je kratko objašnjenje (2 minuta): https://potvrdio.online/kako-funkcionise?&c=comfortino\nBeta je besplatna za prvih 25 porudžbina pouzećem.`;
const timestamp = '2026-10-19 11:44:00';
const followUpDue = '2026-10-21';

// Insert communication
db.prepare(`
  INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(storeId, channel, direction, subject, content, timestamp, followUpDue);

// Update store status, follow_up_due, notes
db.prepare(`
  UPDATE stores
  SET status = 'waiting_reply',
      follow_up_due = ?,
      notes = notes || ' | 19 Ekim 11:44 Viber & WhatsApp takip mesajı gönderildi (kako-funkcionise video linki paylaşıldı). Yanıt bekleniyor.',
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`).run(followUpDue, storeId);

console.log('✅ Comfortino updated: communication logged, status: waiting_reply, follow_up_due: 2026-10-21');
