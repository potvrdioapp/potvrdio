const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const tls = require('node:tls');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

// Load local .env if present
const ENV_PATH = path.join(__dirname, '.env');
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

function formatHtmlBody(plainText) {
  const escaped = plainText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const styledSig = [
    '<div style="color:#5f6368;font-family:Arial,sans-serif;font-size:14px;line-height:1.45;">',
    'Atil Bilge Orum<br>',
    '<strong style="color:#4b1535;">Potvrdio</strong>.<strong style="color:#38761d;">online</strong><br>',
    'Novi Sad<br>',
    'Tel: <span style="text-decoration:underline;">+381 61 603 6556</span>',
    '</div>'
  ].join('');

  const withSig = escaped.replace(
    /Atil Bilge Orum\r?\n[Pp]otvrdio\.online\r?\nNovi Sad\r?\nTel: \+381 61 603 6556/,
    styledSig
  );

  const paragraphs = withSig.split(/\r?\n\r?\n/).map(p => {
    if (p.startsWith('<div')) return p;
    return `<p style="margin:0 0 14px 0;">${p.replace(/\r?\n/g, '<br>')}</p>`;
  }).join('');

  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222222;line-height:1.5;">${paragraphs}</div>`;
}

function appendToImapSent({ host, user, pass, rawMime }) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port: 993, servername: host });
    const bytes = Buffer.byteLength(rawMime, 'utf8');
    let step = 0;
    let buf = '';
    socket.setEncoding('utf8');
    socket.setTimeout(10000, () => { socket.destroy(); resolve(false); });
    socket.on('error', () => resolve(false));
    socket.on('data', chunk => {
      buf += chunk;
      if (step === 0 && buf.includes('* OK')) {
        step = 1; buf = '';
        socket.write(`A1 LOGIN "${user}" "${pass.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"\r\n`);
      } else if (step === 1 && buf.includes('A1 OK')) {
        step = 2; buf = '';
        socket.write(`A2 APPEND "Sent" (\\Seen) {${bytes}+}\r\n${rawMime}\r\n`);
      } else if (step === 2 && (buf.includes('A2 OK') || buf.includes('A2 NO') || buf.includes('A2 BAD'))) {
        step = 3;
        socket.write('A3 LOGOUT\r\n');
        socket.end();
        resolve(buf.includes('A2 OK'));
      }
    });
  });
}

function sendSmtp({ to, subject, body }) {
  subject = String(subject || '').replace(/\s*[—–]\s*/g, ', ');
  body = String(body || '').replace(/\s*[—–]\s*/g, ', ');
  const host = process.env.SMTP_HOST || 'mail.privateemail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromName = process.env.SMTP_FROM_NAME || 'Potvrdio';
  if (!user || !pass) return Promise.reject(new Error('SMTP_USER / SMTP_PASS missing in .env'));

  const boundary = '----=_Part_' + crypto.randomUUID().replace(/-/g, '');
  const htmlBody = formatHtmlBody(body);
  const rawMime = [
    `From: "${fromName}" <${user}>`,
    `To: <${to}>`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@potvrdio.online>`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(body).toString('base64').match(/.{1,76}/g).join('\r\n'),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(htmlBody).toString('base64').match(/.{1,76}/g).join('\r\n'),
    `--${boundary}--`
  ].join('\r\n');

  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host, port, servername: host });
    let buffer = '';
    const steps = [
      'EHLO potvrdio.online',
      'AUTH LOGIN',
      Buffer.from(user).toString('base64'),
      Buffer.from(pass).toString('base64'),
      `MAIL FROM:<${user}>`,
      `RCPT TO:<${to}>`,
      'DATA',
      rawMime + '\r\n.',
      'QUIT'
    ];
    let idx = 0;

    socket.setEncoding('utf8');
    socket.setTimeout(15000, () => { socket.destroy(); reject(new Error('SMTP timeout')); });
    socket.on('error', reject);
    socket.on('data', chunk => {
      buffer += chunk;
      const lines = buffer.split('\r\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line || line[3] === '-') continue;
        const code = parseInt(line.slice(0, 3), 10);
        if (code >= 400) {
          socket.destroy();
          return reject(new Error('SMTP Error: ' + line));
        }
        if (idx < steps.length) {
          socket.write(steps[idx++] + '\r\n');
        } else {
          socket.end();
          appendToImapSent({ host, user, pass, rawMime }).then(() => resolve(line));
        }
      }
    });
  });
}

const PORT = process.env.PORT || 3333;
const DB_PATH = path.join(__dirname, 'data', 'potvrdio_outreach.db');
const PUBLIC_DIR = path.join(__dirname, 'public');

if (!fs.existsSync(DB_PATH)) {
  console.log('⚠️ Database not found. Running seed...');
  require('./seed.js');
}

const db = new DatabaseSync(DB_PATH);

// ---------------- DRIP QUEUE STATE ----------------
const dripState = {
  running: false,
  total: 0,
  sent: 0,
  lastSentStore: null,
  lastSentAt: null,
  nextStore: null,
  nextSendAt: null,
  lastError: null,
  timer: null
};

function getStoreSlugServer(store) {
  if (!store || !store.website) return '';
  return store.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/www\./, '').split('.')[0].toLowerCase();
}

function getNextUncontactedStore() {
  return db.prepare(`
    SELECT * FROM stores
    WHERE status = 'not_contacted' AND email IS NOT NULL AND trim(email) != ''
    ORDER BY id ASC LIMIT 1
  `).get() || null;
}

async function runDripStep() {
  if (!dripState.running) return;
  const store = getNextUncontactedStore();
  if (!store) {
    dripState.running = false;
    dripState.nextStore = null;
    dripState.nextSendAt = null;
    return;
  }

  const slug = 'custom-' + getStoreSlugServer(store);
  const tpl = db.prepare('SELECT * FROM templates WHERE slug = ?').get(slug)
    || db.prepare("SELECT * FROM templates WHERE slug = 'sablon-general-custom'").get();

  const subject = tpl.subject.replace(/\{\{STORE_NAME\}\}/g, store.name);
  const content = tpl.body.replace(/\{\{STORE_NAME\}\}/g, store.name);

  try {
    await sendSmtp({ to: store.email.trim(), subject, body: content });
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const followUpDue = db.prepare("SELECT DATE('now', '+2 days', 'localtime') as d").get().d;

    db.prepare(`
      INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
      VALUES (?, 'email', 'outbound', ?, ?, ?, ?)
    `).run(store.id, subject, content, timestamp, followUpDue);

    db.prepare("UPDATE stores SET status = 'email_sent', follow_up_due = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(followUpDue, store.id);

    dripState.sent++;
    dripState.lastSentStore = `#${store.id} ${store.name} (${store.email})`;
    dripState.lastSentAt = timestamp;
    dripState.lastError = null;
  } catch (err) {
    dripState.lastError = `#${store.id} ${store.name}: ${err.message}`;
    dripState.running = false;
    return;
  }

  const next = getNextUncontactedStore();
  if (!next || !dripState.running) {
    dripState.running = false;
    dripState.nextStore = null;
    dripState.nextSendAt = null;
    return;
  }

  // Random delay between 120s and 180s (2-3 minutes)
  const delayMs = (120 + Math.floor(Math.random() * 61)) * 1000;
  dripState.nextStore = `#${next.id} ${next.name} (${next.email})`;
  dripState.nextSendAt = Date.now() + delayMs;
  dripState.timer = setTimeout(runDripStep, delayMs);
}

// Helper for JSON responses
function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(payload);
}

// Helper for parsing JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) { // 1MB limit
        req.destroy();
        reject(new Error('Body size exceeded'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Serve static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function serveStatic(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  try {
    // ---------------- API ENDPOINTS ----------------

    // 1. GET /api/stats
    if (req.method === 'GET' && pathname === '/api/stats') {
      const totalStores = db.prepare('SELECT count(*) as count FROM stores').get().count;
      const p1Count = db.prepare("SELECT count(*) as count FROM stores WHERE priority = 'p1_verified'").get().count;
      const p2Count = db.prepare("SELECT count(*) as count FROM stores WHERE priority = 'p2_unverified'").get().count;
      const contactedCount = db.prepare("SELECT count(*) as count FROM stores WHERE status IN ('email_sent', 'waiting_reply', 'replied', 'call_scheduled', 'closed_beta')").get().count;
      const closedBetaCount = db.prepare("SELECT count(*) as count FROM stores WHERE status = 'closed_beta'").get().count;
      const repliedCount = db.prepare("SELECT count(*) as count FROM stores WHERE status = 'replied'").get().count;
      const totalComms = db.prepare('SELECT count(*) as count FROM communications').get().count;

      const followUpTodayAndPrior = db.prepare("SELECT count(*) as count FROM stores WHERE follow_up_due IS NOT NULL AND follow_up_due <= DATE('now', 'localtime')").get().count;
      const followUpTomorrowAndPrior = db.prepare("SELECT count(*) as count FROM stores WHERE follow_up_due IS NOT NULL AND follow_up_due <= DATE('now', '+1 day', 'localtime')").get().count;
      const followUpTotal = db.prepare("SELECT count(*) as count FROM stores WHERE follow_up_due IS NOT NULL").get().count;

      // Status breakdown
      const statuses = ['not_contacted', 'email_sent', 'waiting_reply', 'replied', 'call_scheduled', 'closed_beta', 'on_hold', 'rejected'];
      const statusCounts = {};
      for (const st of statuses) {
        statusCounts[st] = db.prepare('SELECT count(*) as count FROM stores WHERE status = ?').get(st).count;
      }

      return sendJson(res, 200, {
        totalStores,
        p1Count,
        p2Count,
        contactedCount,
        closedBetaCount,
        repliedCount,
        totalComms,
        followUpTodayAndPrior,
        followUpTomorrowAndPrior,
        followUpTotal,
        statusCounts
      });
    }

    // 2. GET /api/stores
    if (req.method === 'GET' && pathname === '/api/stores') {
      const search = parsedUrl.searchParams.get('search') || '';
      const priority = parsedUrl.searchParams.get('priority') || 'all';
      const status = parsedUrl.searchParams.get('status') || 'all';
      const followUp = parsedUrl.searchParams.get('follow_up') || 'all';

      let sql = `
        SELECT 
          s.*,
          (SELECT count(*) FROM communications c WHERE c.store_id = s.id) AS comm_count,
          (SELECT max(timestamp) FROM communications c WHERE c.store_id = s.id) AS last_contact_at
        FROM stores s
        WHERE 1=1
      `;
      const params = [];

      if (priority !== 'all') {
        sql += ' AND s.priority = ?';
        params.push(priority);
      }

      if (status !== 'all') {
        if (status === 'contacted') {
          sql += " AND s.status IN ('email_sent', 'waiting_reply', 'replied', 'call_scheduled', 'closed_beta')";
        } else {
          sql += ' AND s.status = ?';
          params.push(status);
        }
      }

      if (followUp === 'today_and_prior') {
        sql += " AND s.follow_up_due IS NOT NULL AND s.follow_up_due <= DATE('now', 'localtime')";
      } else if (followUp === 'tomorrow_and_prior') {
        sql += " AND s.follow_up_due IS NOT NULL AND s.follow_up_due <= DATE('now', '+1 day', 'localtime')";
      } else if (followUp === 'today') {
        sql += " AND s.follow_up_due = DATE('now', 'localtime')";
      } else if (followUp === 'tomorrow') {
        sql += " AND s.follow_up_due = DATE('now', '+1 day', 'localtime')";
      } else if (followUp === 'this_week') {
        sql += " AND s.follow_up_due IS NOT NULL AND s.follow_up_due <= DATE('now', '+7 days', 'localtime')";
      } else if (followUp === 'has_follow_up') {
        sql += " AND s.follow_up_due IS NOT NULL";
      } else if (followUp === 'no_follow_up') {
        sql += " AND s.follow_up_due IS NULL";
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(followUp)) {
        sql += " AND s.follow_up_due = ?";
        params.push(followUp);
      }

      if (search.trim()) {
        sql += ` AND (
          s.name LIKE ? OR 
          s.website LIKE ? OR 
          s.sector LIKE ? OR 
          s.city LIKE ? OR 
          s.email LIKE ? OR 
          s.hook_note LIKE ?
        )`;
        const q = `%${search.trim()}%`;
        params.push(q, q, q, q, q, q);
      }

      if (followUp !== 'all' && followUp !== 'no_follow_up') {
        sql += ` ORDER BY s.follow_up_due ASC, s.id ASC`;
      } else {
        sql += `
          ORDER BY 
            CASE s.status
              WHEN 'replied' THEN 1
              WHEN 'call_scheduled' THEN 2
              WHEN 'closed_beta' THEN 3
              WHEN 'email_sent' THEN 4
              WHEN 'waiting_reply' THEN 5
              WHEN 'not_contacted' THEN 6
              WHEN 'on_hold' THEN 7
              WHEN 'rejected' THEN 8
              ELSE 9
            END ASC,
            CASE s.priority
              WHEN 'p1_verified' THEN 1
              WHEN 'p2_unverified' THEN 2
              ELSE 3
            END ASC,
            s.id ASC
        `;
      }

      const stmt = db.prepare(sql);
      const rows = stmt.all(...params);
      return sendJson(res, 200, rows);
    }

    // 3. GET /api/stores/:id
    const storeDetailMatch = pathname.match(/^\/api\/stores\/(\d+)$/);
    if (req.method === 'GET' && storeDetailMatch) {
      const id = parseInt(storeDetailMatch[1], 10);
      const store = db.prepare('SELECT * FROM stores WHERE id = ?').get(id);

      if (!store) {
        return sendJson(res, 404, { error: 'Store not found' });
      }

      const communications = db.prepare(`
        SELECT * FROM communications 
        WHERE store_id = ? 
        ORDER BY timestamp DESC, id DESC
      `).all(id);

      return sendJson(res, 200, {
        ...store,
        communications
      });
    }

    // 4. POST /api/stores
    if (req.method === 'POST' && pathname === '/api/stores') {
      const body = await parseBody(req);
      if (!body.name || !body.website) {
        return sendJson(res, 400, { error: 'Name and website are required' });
      }

      const stmt = db.prepare(`
        INSERT INTO stores (
          name, website, sector, email, phone, city, legal_entity, priority, status, hook_note, growth_opportunities, tech_stack, contact_person, notes, follow_up_due
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        body.name,
        body.website,
        body.sector || '',
        body.email || null,
        body.phone || null,
        body.city || '',
        body.legal_entity || '',
        body.priority || 'p1_verified',
        body.status || 'not_contacted',
        body.hook_note || '',
        body.growth_opportunities || '',
        body.tech_stack || '',
        body.contact_person || '',
        body.notes || '',
        body.follow_up_due || null
      );

      const created = db.prepare('SELECT * FROM stores WHERE id = ?').get(result.lastInsertRowid);
      return sendJson(res, 201, created);
    }

    // 5. PATCH /api/stores/:id
    if (req.method === 'PATCH' && storeDetailMatch) {
      const id = parseInt(storeDetailMatch[1], 10);
      const body = await parseBody(req);

      const existing = db.prepare('SELECT * FROM stores WHERE id = ?').get(id);
      if (!existing) {
        return sendJson(res, 404, { error: 'Store not found' });
      }

      const updated = {
        name: body.name ?? existing.name,
        website: body.website ?? existing.website,
        sector: body.sector ?? existing.sector,
        email: body.email ?? existing.email,
        phone: body.phone ?? existing.phone,
        city: body.city ?? existing.city,
        legal_entity: body.legal_entity ?? existing.legal_entity,
        priority: body.priority ?? existing.priority,
        status: body.status ?? existing.status,
        hook_note: body.hook_note ?? existing.hook_note,
        growth_opportunities: body.growth_opportunities ?? existing.growth_opportunities,
        tech_stack: body.tech_stack ?? existing.tech_stack,
        contact_person: body.contact_person ?? existing.contact_person,
        notes: body.notes ?? existing.notes,
        follow_up_due: body.follow_up_due !== undefined ? (body.follow_up_due || null) : existing.follow_up_due
      };

      db.prepare(`
        UPDATE stores SET
          name = ?, website = ?, sector = ?, email = ?, phone = ?, city = ?,
          legal_entity = ?, priority = ?, status = ?, hook_note = ?,
          growth_opportunities = ?, tech_stack = ?, contact_person = ?,
          notes = ?, follow_up_due = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        updated.name, updated.website, updated.sector, updated.email, updated.phone,
        updated.city, updated.legal_entity, updated.priority, updated.status,
        updated.hook_note, updated.growth_opportunities, updated.tech_stack,
        updated.contact_person, updated.notes, updated.follow_up_due, id
      );

      const store = db.prepare('SELECT * FROM stores WHERE id = ?').get(id);
      return sendJson(res, 200, store);
    }

    // 6. POST /api/stores/:id/communications
    const storeCommMatch = pathname.match(/^\/api\/stores\/(\d+)\/communications$/);
    if (req.method === 'POST' && storeCommMatch) {
      const storeId = parseInt(storeCommMatch[1], 10);
      const body = await parseBody(req);

      if (!body.content || !body.content.trim()) {
        return sendJson(res, 400, { error: 'Content/message is required' });
      }

      const channel = body.channel || 'email';
      const direction = body.direction || 'outbound';
      const subject = body.subject || '';
      const content = body.content.trim();
      const timestamp = body.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);
      const followUpDue = body.follow_up_due || null;

      const stmt = db.prepare(`
        INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(storeId, channel, direction, subject, content, timestamp, followUpDue);

      // Optionally update store status if specified
      if (body.update_status) {
        db.prepare('UPDATE stores SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(body.update_status, storeId);
      }

      // If follow-up date specified, sync to store
      if (followUpDue) {
        db.prepare('UPDATE stores SET follow_up_due = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(followUpDue, storeId);
      }

      const created = db.prepare('SELECT * FROM communications WHERE id = ?').get(result.lastInsertRowid);
      return sendJson(res, 201, created);
    }

    // 6.5 POST /api/stores/:id/send-email (Direct PrivateEmail SMTP send + DB log)
    const storeSendEmailMatch = pathname.match(/^\/api\/stores\/(\d+)\/send-email$/);
    if (req.method === 'POST' && storeSendEmailMatch) {
      const storeId = parseInt(storeSendEmailMatch[1], 10);
      const body = await parseBody(req);
      const store = db.prepare('SELECT * FROM stores WHERE id = ?').get(storeId);
      if (!store) return sendJson(res, 404, { error: 'Store not found' });

      const to = (body.to || store.email || '').trim();
      const subject = (body.subject || '').trim();
      const content = (body.content || '').trim();
      const followUpDue = body.follow_up_due || null;

      if (!to || !subject || !content) {
        return sendJson(res, 400, { error: 'Alıcı (to), konu (subject) ve içerik (content) zorunludur.' });
      }

      await sendSmtp({ to, subject, body: content });

      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const result = db.prepare(`
        INSERT INTO communications (store_id, channel, direction, subject, content, timestamp, follow_up_due)
        VALUES (?, 'email', 'outbound', ?, ?, ?, ?)
      `).run(storeId, subject, content, timestamp, followUpDue);

      db.prepare('UPDATE stores SET status = ?, follow_up_due = COALESCE(?, follow_up_due), updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(body.update_status || 'email_sent', followUpDue, storeId);

      const created = db.prepare('SELECT * FROM communications WHERE id = ?').get(result.lastInsertRowid);
      return sendJson(res, 201, { success: true, communication: created });
    }

    // 7. DELETE /api/communications/:id
    const deleteCommMatch = pathname.match(/^\/api\/communications\/(\d+)$/);
    if (req.method === 'DELETE' && deleteCommMatch) {
      const commId = parseInt(deleteCommMatch[1], 10);
      db.prepare('DELETE FROM communications WHERE id = ?').run(commId);
      return sendJson(res, 200, { success: true });
    }

    // 7.5 POST /api/stores/bulk-follow-up
    if (req.method === 'POST' && pathname === '/api/stores/bulk-follow-up') {
      const body = await parseBody(req);
      const { store_ids, follow_up_due, action, days } = body;

      if (action === 'postpone_overdue') {
        const offset = typeof days === 'number' ? days : 1;
        const info = db.prepare(`
          UPDATE stores 
          SET follow_up_due = DATE('now', '+' || ? || ' days', 'localtime'),
              updated_at = CURRENT_TIMESTAMP
          WHERE follow_up_due IS NOT NULL 
            AND follow_up_due <= DATE('now', 'localtime')
        `).run(offset);
        return sendJson(res, 200, { success: true, updatedCount: info.changes });
      }

      if (Array.isArray(store_ids) && store_ids.length > 0) {
        const newDate = follow_up_due || null;
        const stmt = db.prepare('UPDATE stores SET follow_up_due = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        for (const sid of store_ids) {
          stmt.run(newDate, sid);
        }
        return sendJson(res, 200, { success: true, updatedCount: store_ids.length });
      }

      return sendJson(res, 400, { error: 'Invalid bulk update parameters' });
    }

    // 8. GET /api/templates
    if (req.method === 'GET' && pathname === '/api/templates') {
      const templates = db.prepare('SELECT * FROM templates ORDER BY id ASC').all();
      return sendJson(res, 200, templates);
    }

    // 9. DRIP QUEUE ENDPOINTS
    if (req.method === 'GET' && pathname === '/api/drip/status') {
      const remaining = db.prepare("SELECT count(*) as c FROM stores WHERE status = 'not_contacted' AND email IS NOT NULL AND trim(email) != ''").get().c;
      const next = getNextUncontactedStore();
      return sendJson(res, 200, {
        running: dripState.running,
        total: dripState.total || (dripState.sent + remaining),
        sent: dripState.sent,
        remaining,
        lastSentStore: dripState.lastSentStore,
        lastSentAt: dripState.lastSentAt,
        nextStore: dripState.nextStore || (next ? `#${next.id} ${next.name} (${next.email})` : null),
        nextSendAt: dripState.nextSendAt,
        lastError: dripState.lastError
      });
    }

    if (req.method === 'POST' && pathname === '/api/drip/start') {
      if (!dripState.running) {
        const remaining = db.prepare("SELECT count(*) as c FROM stores WHERE status = 'not_contacted' AND email IS NOT NULL AND trim(email) != ''").get().c;
        if (remaining === 0) return sendJson(res, 400, { error: 'Gönderilecek bekleyen mağaza kalmadı.' });
        dripState.running = true;
        dripState.total = dripState.sent + remaining;
        dripState.lastError = null;
        runDripStep();
      }
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === 'POST' && pathname === '/api/drip/stop') {
      dripState.running = false;
      if (dripState.timer) clearTimeout(dripState.timer);
      dripState.timer = null;
      dripState.nextSendAt = null;
      return sendJson(res, 200, { ok: true });
    }

    // ---------------- STATIC WEB ASSETS ----------------
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '') {
      safePath = '/index.html';
    }

    const fullFilePath = path.join(PUBLIC_DIR, safePath);
    if (fs.existsSync(fullFilePath) && fs.statSync(fullFilePath).isFile()) {
      return serveStatic(req, res, fullFilePath);
    }

    // Fallback to index.html for SPA-like experience
    const indexHtml = path.join(PUBLIC_DIR, 'index.html');
    if (fs.existsSync(indexHtml)) {
      return serveStatic(req, res, indexHtml);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');

  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`
🚀 ========================================================
   Potvrdio Local Store Outreach CRM & DB is running!
   --------------------------------------------------------
   🌐 URL:      http://localhost:${PORT}
   📂 Database: ${DB_PATH}
   📦 Bundle:   Isolated in /outreach-crm (0 impact on app)
========================================================
`);
});
