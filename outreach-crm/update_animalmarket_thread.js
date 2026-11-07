const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Updating Animal Market communication thread and status...');

const store = db.prepare('SELECT * FROM stores WHERE name LIKE ?').get('%Animal%');
if (!store) {
  console.error('Store Animal Market not found!');
  process.exit(1);
}

const commsToInsert = [
  {
    store_id: store.id,
    channel: 'email',
    direction: 'inbound',
    subject: 'Re: Potvrda adrese za porudžbine pouzećem, Animal Market',
    content: 'Postovani shop jos uvek nije pusten u rad, kada stignemo dotle kontaktiracemo vas',
    timestamp: '2026-10-15 11:26:00',
    follow_up_due: null
  },
  {
    store_id: store.id,
    channel: 'email',
    direction: 'outbound',
    subject: 'Re: Potvrda adrese za porudžbine pouzećem, Animal Market',
    content: `Poštovani,
hvala na odgovoru. Da li možete okvirno da mi kažete kada planirate pokretanje shopa i da li će plaćanje pouzećem biti dostupno? Javiću vam se tada, a ako vam u međuvremenu zatreba nešto vezano za potvrdu adresa, slobodno me kontaktirajte.`,
    timestamp: '2026-10-15 12:16:00',
    follow_up_due: null
  },
  {
    store_id: store.id,
    channel: 'email',
    direction: 'inbound',
    subject: 'Re: Potvrda adrese za porudžbine pouzećem, Animal Market',
    content: `Ja licno pravim taj shop i pored toga imam posla pa ne mogu tacno da odredim, ja se nadam da cu ga do nove godine pustiti u rad jer treba jos 1k proizvoda da ubacim i izmenim razne stvari, bice i online placanje kao i placanje pouzecem takodje treba da ubacim da sabere u racun i samu putarinu... nadam se da cu to sve izvesti do nove godine`,
    timestamp: '2026-10-15 12:21:00',
    follow_up_due: null
  },
  {
    store_id: store.id,
    channel: 'email',
    direction: 'outbound',
    subject: 'Re: Potvrda adrese za porudžbine pouzećem, Animal Market',
    content: `Poštovani,
hvala vam na detaljnom odgovoru, potpuno razumem da je oko pokretanja shopa puno posla.
Kada budete završili osnovno podešavanje, ja ću sam instalirati i podesiti Potvrdio za vas, bez ikakvog dodatnog posla sa vaše strane. Ako vam odgovara, javiću vam se početkom januara.
Usput, ako u vašem okruženju poznajete vlasnike WooCommerce shopova koji primaju plaćanje pouzećem, bio bih vam zahvalan ako me preporučite. Rado ću im besplatno podesiti Potvrdio.
Srećno sa pripremama!
Srdačan pozdrav,
Atil Bilge Orum`,
    timestamp: '2026-10-15 12:28:00',
    follow_up_due: '2027-01-05'
  }
];

const insertStmt = db.prepare(`
  INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const c of commsToInsert) {
  insertStmt.run(c.store_id, c.channel, c.direction, c.subject, c.content, c.timestamp, c.follow_up_due);
}

const updateStoreStmt = db.prepare(`
  UPDATE stores
  SET status = 'replied',
      notes = ?,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

const newNotes = `Mağaza kurucusu bizzat geliştiriyor. Yılbaşına kadar (Aralık 2026 sonu) 1.000 ürün daha ekleyip, kapıda ödeme ve kargo/yol ücreti hesaplama modülünü tamamlayarak yayına almayı hedefliyor. Kurulum bittiğinde Potvrdio'yu zahmetsizce ve ücretsiz kurma teklifi yapıldı. Takip tarihi Ocak 2027 başı (2027-01-05) olarak belirlendi. Ayrıca WooCommerce & kapıda ödeme kullanan tanıdık mağazalar için tavsiye (referral) istendi.`;

updateStoreStmt.run(newNotes, store.id);

console.log('✅ Animal Market successfully updated with 4 new communications, status: replied, follow-up: 2027-01-05');
