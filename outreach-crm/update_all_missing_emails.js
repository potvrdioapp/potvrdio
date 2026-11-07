const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Updating missing emails for all 6 stores...');

const updates = [
  {
    id: 21,
    email: 'b_plus@live.com',
    notes: 'Doğrulanan e-posta: b_plus@live.com (ikincil: zaposlenje@bplus.rs)'
  },
  {
    id: 22,
    email: 'webshop@bosshop.rs',
    notes: 'Doğrulanan e-posta: webshop@bosshop.rs (yönetim: dusan.tomic@bosshop.rs, ana.milosevic@bosshop.rs)'
  },
  {
    id: 23,
    email: 'mirkovic_riders@yahoo.com',
    phone: '+381 60 42 55 266',
    notes: 'Doğrulanan e-posta: mirkovic_riders@yahoo.com, Tel: 060 42 55 266'
  },
  {
    id: 24,
    email: 'luxshopfb@gmail.com',
    phone: '+381 62 812 4044',
    city: 'Senjak, Beograd',
    notes: 'Doğrulanan e-posta: luxshopfb@gmail.com, Tel/WA: 062 812 4044'
  },
  {
    id: 25,
    email: 'prodaja@saloninfo.org',
    notes: 'Doğrulanan e-posta: prodaja@saloninfo.org'
  },
  {
    id: 26,
    email: 'prodaja@kozmetikamoja.rs',
    notes: 'Doğrulanan e-posta: prodaja@kozmetikamoja.rs'
  }
];

const stmt = db.prepare(`
  UPDATE stores
  SET email = ?,
      phone = COALESCE(?, phone),
      city = COALESCE(?, city),
      priority = 'p1_verified',
      notes = notes || ' | ' || ?,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

for (const u of updates) {
  stmt.run(u.email, u.phone || null, u.city || null, u.notes, u.id);
  console.log(`✅ Updated Store #${u.id} -> ${u.email}`);
}

console.log('🎉 All missing emails updated in database!');
