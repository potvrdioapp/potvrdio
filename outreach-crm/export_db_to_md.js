const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const db = new DatabaseSync(dbPath);

console.log('🔄 Exporting SQLite database to Markdown document...');

const stores = db.prepare('SELECT * FROM stores ORDER BY id ASC').all();
const comms = db.prepare(`
  SELECT c.*, s.name as store_name, s.website as store_website, s.email as store_email
  FROM communications c 
  JOIN stores s ON s.id = c.store_id 
  ORDER BY c.timestamp DESC, c.id DESC
`).all();
const templates = db.prepare('SELECT * FROM templates ORDER BY id ASC').all();

const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

let md = '# Potvrdio Outreach CRM · Tam Veritabanı Dökümü\n\n';
md += '> **Dışa Aktarma Tarihi:** ' + now + '  \n';
md += '> **Kaynak Veritabanı:** `outreach-crm/data/potvrdio_outreach.db` (SQLite)  \n';
md += '> **Kapsam:** ' + stores.length + ' Mağaza, ' + comms.length + ' İletişim Kaydı, ' + templates.length + ' Outreach Şablonu  \n\n';
md += '---\n\n';

// Stats Overview
const p1Count = stores.filter(s => s.priority === 'p1_verified').length;
const p2Count = stores.filter(s => s.priority === 'p2_unverified').length;
const disqualifiedCount = stores.filter(s => s.priority === 'disqualified').length;
const contactedCount = stores.filter(s => s.status !== 'not_contacted' && s.status !== 'rejected').length;

md += '## 1. Veritabanı Özet İstatistikleri\n\n';
md += '| Metrik | Sayı | Açıklama |\n';
md += '| :--- | :---: | :--- |\n';
md += '| **Toplam Mağaza Sayısı** | ' + stores.length + ' | Sistemde kayıtlı toplam e-ticaret işletmesi |\n';
md += '| **P1 Doğrulanmış Mağazalar** | ' + p1Count + ' | WooCommerce + Kapıda Ödeme + Canlı E-posta teyitli odak liste |\n';
md += '| **P2 İkincil Havuz** | ' + p2Count + ' | Açık e-postası bulunmayan veya ikinci aşamaya bırakılanlar |\n';
md += '| **Diskalifiye / Uygun Değil** | ' + disqualifiedCount + ' | Çok büyük holding/distribütör formatındaki elenenler |\n';
md += '| **Temas Kurulan Mağazalar** | ' + contactedCount + ' | İlk e-postası gönderilmiş mağazalar |\n';
md += '| **Kayıtlı İletişim / Etkileşim** | ' + comms.length + ' | Giden e-posta ve takip kayıtları |\n';
md += '| **Outreach Şablonları** | ' + templates.length + ' | Mağazaya özel ve genel Sırpça soğuk satış şablonları |\n\n';
md += '---\n\n';

// Stores Master Table
md += '## 2. Mağazalar Genel Tablosu (Stores Master List)\n\n';
md += '| ID | Mağaza Adı | Web Sitesi | Sektör | Şehir | E-posta | Telefon | Öncelik | Durum |\n';
md += '| :-: | :--- | :--- | :--- | :--- | :--- | :--- | :-: | :--- |\n';

stores.forEach(s => {
  const email = s.email ? '`' + s.email + '`' : '*(Yok)*';
  const phone = s.phone ? '`' + s.phone + '`' : '*(Yok)*';
  const cleanUrl = s.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
  md += '| ' + s.id + ' | **' + s.name + '** | [' + cleanUrl + '](' + s.website + ') | ' + (s.sector || '-') + ' | ' + (s.city || '-') + ' | ' + email + ' | ' + phone + ' | `' + s.priority + '` | `' + s.status + '` |\n';
});

md += '\n---\n\n';

// Stores Detailed Breakdown
md += '## 3. Mağaza Detay Dosyaları ve Fırsat Analizleri\n\n';

stores.forEach(s => {
  const storeComms = comms.filter(c => c.store_id === s.id);
  md += '### ' + s.id + '. ' + s.name + ' (' + s.website + ')\n\n';
  md += '- **Web Sitesi:** [' + s.website + '](' + s.website + ')\n';
  md += '- **Sektör / Kategori:** ' + (s.sector || 'Belirtilmemiş') + '\n';
  md += '- **Şehir / Konum:** ' + (s.city || 'Sırbistan Geneli') + '\n';
  md += '- **Tüzel Kişilik / Not:** ' + (s.legal_entity || '-') + '\n';
  md += '- **Doğrulanmış E-posta:** ' + (s.email ? '`' + s.email + '`' : '*(Açık kurumsal e-posta yok)*') + '\n';
  md += '- **Doğrulanmış Telefon:** ' + (s.phone ? '`' + s.phone + '`' : '*(Telefon yok)*') + '\n';
  md += '- **Öncelik Seviyesi:** `' + s.priority + '` | **Güncel Durum:** `' + s.status + '`\n';
  md += '- **Altyapı & Tech Stack:** ' + (s.tech_stack || 'WooCommerce Standart') + '\n\n';
  
  md += '#### 🎯 Saha Kancası & Değer Önerisi (Pitch Angle)\n';
  md += '> ' + (s.hook_note || 'Henüz özel saha notu girilmemiş.') + '\n\n';
  
  md += '#### 💡 Geliştirme & Büyüme Fırsatları (Growth Opportunities)\n';
  if (s.growth_opportunities) {
    md += s.growth_opportunities.split('\n').map(line => '> ' + line).join('\n') + '\n\n';
  } else {
    md += '> Standart WooCommerce optimizasyon adımları geçerlidir.\n\n';
  }
  
  if (s.notes) {
    md += '**Dahili Ekip Notu:** ' + s.notes + '\n\n';
  }

  if (storeComms.length > 0) {
    md += '**İletişim Geçmişi (' + storeComms.length + ' Kayıt):**\n';
    storeComms.forEach(c => {
      md += '- **[' + c.timestamp + ']** (' + c.channel.toUpperCase() + ' / ' + c.direction + ') - *' + c.subject + '*\n';
    });
    md += '\n';
  } else {
    md += '*Henüz bu mağazayla bir iletişim kaydı bulunmuyor.*\n\n';
  }
  
  md += '---\n\n';
});

// Communications Full Log
md += '## 4. İletişim ve Etkileşim Geçmişi (All Communications Log)\n\n';

comms.forEach((c) => {
  md += '### Kayıt #' + c.id + ' · ' + c.store_name + ' (' + c.timestamp + ')\n\n';
  md += '- **Mağaza:** ' + c.store_name + ' (ID: ' + c.store_id + ')\n';
  md += '- **Kanal:** `' + c.channel + '` | **Yön:** `' + c.direction + '`\n';
  md += '- **Konu Başlığı:** `' + c.subject + '`\n';
  md += '- **Gönderim Zamanı:** `' + c.timestamp + '`\n';
  md += '- **Takip Tarihi (Follow-up Due):** `' + (c.follow_up_due || 'Yok') + '`\n\n';
  md += '**Mesaj / E-posta İçeriği:**\n\n';
  md += '```text\n' + c.content + '\n```\n\n';
  md += '---\n\n';
});

// Templates Library
md += '## 5. Outreach ve Satış Şablonları Kütüphanesi (Templates)\n\n';

templates.forEach(t => {
  md += '### Şablon: ' + t.title + ' (`' + t.slug + '`)\n\n';
  md += '- **Kategori:** `' + t.category + '`\n';
  md += '- **E-posta Konusu (Subject):** `' + t.subject + '`\n\n';
  md += '**Şablon Metni:**\n\n';
  md += '```text\n' + t.body + '\n```\n\n';
  md += '---\n\n';
});

const outputPath = path.join(__dirname, '..', 'docs', 'potvrdio_outreach_database_export.md');
fs.writeFileSync(outputPath, md, 'utf-8');
console.log('✅ Exported successfully to:', outputPath);
console.log('File size:', fs.statSync(outputPath).size, 'bytes');
