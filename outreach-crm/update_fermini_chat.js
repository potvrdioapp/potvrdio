const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Updating Fermini live chat and status...');

const storeId = 4;

// 1. Inbound from Sanela
db.prepare(`
  INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
  VALUES (?, 'viber', 'inbound', 'Viber Yanıtı: Sanela (Kažite)', 'Kažite', '2026-10-16 10:15:00', NULL)
`).run(storeId);

// 2. Outbound from Atıl
const outboundContent = `Hvala na odgovoru! 
Kada kupac poruči pouzećem, Potvrdio mu šalje SMS ili Viber poruku sa linkom: jednim klikom potvrdi porudžbinu ili ispravi adresu. 

Porudžbina do tada stoji na čekanju (On-Hold), pa kuriru šaljete samo potvrđene pakete. 

Beta je besplatna i bez obaveza. Otprilike koliko paketa pouzećem vam se mesečno vrati?
Ako vam je lakše da vidite nego da čitate, ovde je kratak prikaz kako radi: https://potvrdio.online/kako-funkcionise`;

db.prepare(`
  INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
  VALUES (?, 'viber', 'outbound', 'Viber Açıklama & Demo Linki', ?, '2026-10-16 10:18:00', '2026-10-17')
`).run(storeId, outboundContent);

// 3. Update Store status to replied, set contact person Sanela, and update notes
db.prepare(`
  UPDATE stores
  SET contact_person = 'Sanela',
      status = 'replied',
      notes = notes || ' | 16 Ekim 10:15 Sanela Viber üzerinden \"Kažite\" yanıtı verdi. 10:18 demo linki ve aylık iade hacmi sorusu iletildi.',
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`).run(storeId);

console.log('✅ Fermini live chat logged, status set to: replied, contact person: Sanela');
