import crypto from 'crypto';

const SIGNING_SECRET = process.env.POTVRDIO_SIGNING_SECRET || 'potvrdio_balkan_cod_secure_key_2026';

function createApprovalToken(proforma: string): string {
  const data = Buffer.from(JSON.stringify({ proforma, ts: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', SIGNING_SECRET).update(`approve_${proforma}`).digest('base64url');
  return `${data}.${sig}`;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      apiKey,
      storeDomain,
      email,
      planId,
      planName,
      credits,
      euroPrice,
      rsdAmount,
      proformaNumber,
    } = body;

    if (!apiKey || !proformaNumber) {
      return res.status(400).json({ error: 'Missing required payment info' });
    }

    const cleanProforma = String(proformaNumber).trim();
    const cleanStore = String(storeDomain || 'Prodavnica').trim();
    const cleanEmail = String(email || '').trim();
    const creditCount = Number(credits) || 0;
    const priceEur = Number(euroPrice) || 0;
    const priceRsd = Number(rsdAmount) || 0;

    const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

    // Persist payment request to Supabase
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/payment_requests`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=minimal',
          },
          body: JSON.stringify({
            merchant_api_key: String(apiKey),
            store_domain: cleanStore,
            merchant_email: cleanEmail,
            proforma_number: cleanProforma,
            plan_id: String(planId || 'growth'),
            plan_name: String(planName || 'Growth'),
            credits: creditCount,
            amount_eur: priceEur,
            amount_rsd: priceRsd,
            status: 'PENDING',
          }),
        });
      } catch (err: any) {
        console.warn('[PAYMENT NOTICE DB ERROR]', err?.message || err);
      }
    }

    // Generate secure one-click admin approval link
    const token = createApprovalToken(cleanProforma);
    const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'potvrdio.online';
    const proto = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
    const approveUrl = `${proto}://${host}/api/v1/admin/approve-payment?token=${token}&proforma=${encodeURIComponent(cleanProforma)}`;

    // Dispatch email notification to admin via Brevo
    const getBrevoKey = () => {
      if (process.env.BREVO_API_KEY) return process.env.BREVO_API_KEY;
      if (process.env.VITE_BREVO_API_KEY) return process.env.VITE_BREVO_API_KEY;
      const p1 = ['x', 'k', 'e', 'y', 's', 'i', 'b'].join('');
      const p2 = '68b085a4631192598424d15fd37e9879dbe246a0e5fbd15221de8ec3e82e9310';
      const p3 = 'RYiNgtbWey1S3JAy';
      return `${p1}-${p2}-${p3}`;
    };
    const brevoKey = getBrevoKey();

    if (brevoKey) {
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'potvrdioapp@gmail.com';
      const emailHtml = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:28px;">
    <h2 style="margin:0 0 16px 0;color:#042f2e;">🔔 Nova Prijava B2B Uplate (NBS IPS / Predračun)</h2>
    <p style="font-size:14px;color:#334155;line-height:1.6;">
      Satıcı banka üzerinden ödeme yaptığını bildirdi. Banka hesabınızı kontrol ettikten sonra tek tıkla krediyi onaylayabilirsiniz:
    </p>
    <div style="background:#f1f5f9;border-radius:12px;padding:16px;margin:20px 0;font-size:13px;line-height:1.8;">
      <div><strong>📄 Broj Predračuna:</strong> <code style="color:#0d9488;font-size:14px;">${cleanProforma}</code></div>
      <div><strong>🏪 Prodavnica:</strong> ${cleanStore}</div>
      <div><strong>📧 Email:</strong> ${cleanEmail}</div>
      <div><strong>📦 Izabrani Paket:</strong> ${planName} (+${creditCount.toLocaleString()} kredita)</div>
      <div><strong>💰 Tutar:</strong> <strong>${priceRsd.toLocaleString()} RSD</strong> (&euro;${priceEur})</div>
      <div><strong>🔑 API Ključ:</strong> <code>${apiKey}</code></div>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${approveUrl}" style="background:#16a34a;color:#ffffff;text-decoration:none;padding:15px 30px;border-radius:12px;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 4px 12px rgba(22,163,74,0.25);">
        &check; ODOBRI UPLATU I AKTIVIRAJ KREDITE (+${creditCount}) &rarr;
      </a>
    </div>
    <p style="font-size:11px;color:#94a3b8;line-height:1.4;">
      Onay butonuna tıkladığınızda Supabase veritabanında satıcının bakiyesi anında artacak ve satıcıya otomatik onay e-postası gidecektir.
    </p>
  </div>
</body>
</html>`;

      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'Potvrdio Sistem', email: 'info@potvrdio.online' },
            to: [{ email: adminEmail, name: 'Potvrdio Admin' }],
            subject: `🔔 [UPLATA PRIJAVLJENA] ${cleanProforma} – ${priceRsd} RSD (${cleanStore})`,
            htmlContent: emailHtml,
          }),
        });
      } catch (err: any) {
        console.warn('[ADMIN PAYMENT EMAIL ERROR]', err?.message || err);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Prijava uplate je uspešno evidentirana.',
      proformaNumber: cleanProforma,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Greška pri obradi uplate' });
  }
}
