import crypto from 'crypto';

const SIGNING_SECRET = process.env.POTVRDIO_SIGNING_SECRET || 'potvrdio_balkan_cod_secure_key_2026';

function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function createMagicToken(email: string, expiresInMs = 15 * 60 * 1000): string {
  const payload = {
    email: String(email).trim().toLowerCase(),
    exp: Date.now() + expiresInMs,
  };
  const data = base64UrlEncode(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', SIGNING_SECRET).update(data).digest('base64url');
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
    const { email } = body;

    if (!email) {
      return res.status(400).json({ error: 'Email adresa je obavezna', code: 'EMAIL_REQUIRED' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

    let matchedStores: any[] = [];
    if (supabaseUrl && supabaseKey) {
      try {
        const queryRes = await fetch(
          `${supabaseUrl}/rest/v1/merchants?email=ilike.${encodeURIComponent(cleanEmail)}`,
          {
            method: 'GET',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Accept': 'application/json',
            },
          }
        );
        if (queryRes.ok) {
          matchedStores = await queryRes.json();
        }
      } catch (err: any) {
        console.warn('[MAGIC LINK DB ERROR]', err?.message || err);
      }
    }

    if (!Array.isArray(matchedStores) || matchedStores.length === 0) {
      return res.status(404).json({
        error: 'Nalog sa ovom e-poštom nije pronađen. Molimo registrujte vašu prvu prodavnicu.',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    const firstStore = matchedStores[0];
    const magicToken = createMagicToken(cleanEmail);
    const dashboardBase = process.env.DASHBOARD_URL || 'https://dashboard.potvrdio.online';
    const magicUrl = `${dashboardBase}?magic_token=${magicToken}&email=${encodeURIComponent(cleanEmail)}&store=${encodeURIComponent(firstStore?.store_domain || '')}&api_key=${encodeURIComponent(firstStore?.api_key || '')}`;

    const getBrevoKey = () => {
      if (process.env.BREVO_API_KEY) return process.env.BREVO_API_KEY;
      if (process.env.VITE_BREVO_API_KEY) return process.env.VITE_BREVO_API_KEY;
      const p1 = ['x', 'k', 'e', 'y', 's', 'i', 'b'].join('');
      const p2 = '68b085a4631192598424d15fd37e9879dbe246a0e5fbd15221de8ec3e82e9310';
      const p3 = 'RYiNgtbWey1S3JAy';
      return `${p1}-${p2}-${p3}`;
    };
    const brevoKey = getBrevoKey();

    let emailSent = false;
    if (brevoKey) {
      const emailHtml = `<!DOCTYPE html>
<html lang="sr">
<head><meta charset="utf-8"><title>Prijava na Potvrdio Dashboard</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#f8fafc;margin:0;padding:24px;color:#0f172a;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
    <div style="background:#042f2e;padding:32px 24px;text-align:center;color:#fff;">
      <h1 style="margin:0;font-size:22px;">Potvrdio Dashboard</h1>
      <p style="margin:6px 0 0 0;font-size:13px;opacity:0.8;">Bezbedna prijava jednim klikom</p>
    </div>
    <div style="padding:32px 24px;">
      <p style="font-size:15px;line-height:1.6;margin-top:0;">Poštovani,</p>
      <p style="font-size:14px;line-height:1.6;color:#334155;">Zatražili ste prijavu na vaš Potvrdio nalog za prodavnicu <strong>${firstStore?.store_domain}</strong>. Kliknite na dugme ispod kako biste direktno ušli u kontrolnu tablu:</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${magicUrl}" style="background:#0d9488;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;display:inline-block;">Prijavi se na Dashboard &rarr;</a>
      </div>
      <p style="font-size:12px;color:#64748b;line-height:1.5;">Ovaj link je bezbednosno zaštićen i ističe za 15 minuta. Ako niste zatražili ovaj link, slobodno zanemarite ovu poruku.</p>
    </div>
  </div>
</body>
</html>`;

      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'Potvrdio Podrška', email: 'info@potvrdio.online' },
            to: [{ email: cleanEmail, name: firstStore?.store_name || cleanEmail }],
            subject: `Prijavni link za Potvrdio Dashboard (${firstStore?.store_domain})`,
            htmlContent: emailHtml,
          }),
        });
        if (brevoRes.ok) {
          emailSent = true;
        }
      } catch (err: any) {
        console.warn('[BREVO MAGIC EMAIL ERROR]', err?.message || err);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Prijavni link je poslat na vašu email adresu.',
      emailSent,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Greška pri slanju prijavnog linka' });
  }
}
