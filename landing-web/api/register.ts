export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
    const { storeUrl, fullName, email } = body;
    if (!email || !storeUrl) {
      return res.status(400).json({ error: 'Email and storeUrl are required' });
    }

    const cleanDomain = String(storeUrl).trim().toLowerCase().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^www\./i, '') || 'mojaradnja.rs';
    const cleanEmail = String(email).trim().toLowerCase();
    const recipientName = fullName ? String(fullName).trim() : cleanDomain;

    const safeDomain = cleanDomain.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'store';
    const randKey = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    const randSecret = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
    const apiKey = `pk_live_${safeDomain}_${randKey}`;
    const apiSecret = `sec_live_${safeDomain}_${randSecret}`;

    const dashboardBase = 'https://dashboard.potvrdio.online';
    const magicDashboardUrl = `${dashboardBase}?api_key=${encodeURIComponent(apiKey)}&api_secret=${encodeURIComponent(apiSecret)}&store=${encodeURIComponent(cleanDomain)}&email=${encodeURIComponent(cleanEmail)}&trial=true`;

    const brevoKey = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY || '';

    let emailSent = false;
    let emailMsgId = '';
    let emailErr = '';

    const htmlContent = `<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="utf-8">
  <title>Dobrodošli u Potvrdio</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
    .header { background: #042f2e; padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #14b8a6; font-size: 13px; font-weight: 500; }
    .badge { display: inline-block; background: rgba(20, 184, 166, 0.2); border: 1px solid #14b8a6; color: #5eead4; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; margin-top: 10px; }
    .content { padding: 32px 24px; font-size: 14px; line-height: 1.6; }
    .key-box { background: #0f172a; color: #14b8a6; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #1e293b; text-align: left; }
    .key-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px; font-weight: bold; }
    .key-value { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 14px; font-weight: bold; color: #2dd4bf; word-break: break-all; margin-bottom: 14px; }
    .steps { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .step-item { margin-bottom: 14px; }
    .step-item:last-child { margin-bottom: 0; }
    .step-num { font-weight: 800; color: #0d9488; }
    .btn { display: inline-block; background: #0d9488; color: #ffffff !important; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin: 12px 0; text-align: center; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Dobrodošli u Potvrdio</h1>
      <p>Logistička optimizacija COD isporuke i zaštita od nepreuzetih paketa</p>
      <div class="badge">25 BESPLATNIH VERIFIKACIJA PORUDŽBINA AKTIVIRANO</div>
    </div>
    <div class="content">
      <p>Poštovani <strong>${recipientName}</strong>,</p>
      <p>Uspešno ste aktivirali pilot period za vašu WooCommerce prodavnicu <strong>${cleanDomain}</strong>. Na vaš nalog je dodeljeno <strong>25 besplatnih verifikacija porudžbina</strong> kako biste se uverili u efikasnost sprečavanja lažnih i pogrešnih narudžbina.</p>

      <div class="key-box">
        <div class="key-label">1. Central Backend API Endpoint:</div>
        <div class="key-value">https://api.potvrdio.online/api/v1</div>

        <div class="key-label">2. Vaš API Key (Store ID):</div>
        <div class="key-value">${apiKey}</div>

        <div class="key-label">3. Vaš API Secret (HMAC Signature Key):</div>
        <div class="key-value" style="color: #38bdf8; margin-bottom: 0;">${apiSecret}</div>
      </div>

      <div class="steps">
        <h4 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; color: #334155;">Uputstvo za brzu aktivaciju u 3 koraka:</h4>
        <div class="step-item">
          <span class="step-num">1.</span> <strong>Preuzmite dodatak:</strong> Preuzmite najnoviju verziju WooCommerce dodatka (<a href="https://potvrdio.online/potvrdio-viber-cod.zip" style="color: #0d9488; font-weight: bold;">potvrdio-viber-cod.zip</a>) i instalirajte je u WordPress administraciji (<em>Dodaci &rarr; Dodaj novi &rarr; Otpremi dodatak</em>).
        </div>
        <div class="step-item">
          <span class="step-num">2.</span> <strong>Povežite parametre:</strong> Otvorite <em>Podešavanja &rarr; Potvrdio Viber COD</em> u WordPressu i nalepite vaš API Ključ i API Secret.
        </div>
        <div class="step-item">
          <span class="step-num">3.</span> <strong>Pratite rezultate:</strong> Svaka narudžbina sa pouzećem biće automatski verifikovana, a detaljne izveštaje možete pratiti u vašem trgovačkom panelu.
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${magicDashboardUrl}" class="btn">Prijavite se na Merchant Dashboard &rarr;</a>
      </div>

      <p style="font-size: 12px; color: #64748b; margin-top: 24px;">
        Ukoliko vam je potrebna besplatna tehnička pomoć oko instalacije ili podešavanja kurirskih pravila, naš tim vam stoji na raspolaganju na <a href="mailto:podrska@potvrdio.online" style="color: #0d9488;">podrska@potvrdio.online</a>.
      </p>
    </div>
    <div class="footer">
      <strong>GIZEM ORUM PR Konsultantske aktivnosti Lilanova</strong> &bull; Bulevar Patrijarha Pavla 91, Novi Sad<br>
      PIB: 115512104 &bull; Matični broj: 68423937 &bull; Usklađeno sa ZZPL i GDPR regulativom<br>
      &copy; 2026 Potvrdio. Sva prava zadržana.
    </div>
  </div>
</body>
</html>`;

    if (brevoKey) {
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Potvrdio Podrška', email: 'info@potvrdio.online' },
          to: [{ email: cleanEmail, name: recipientName }],
          bcc: [{ email: 'potvrdioapp@gmail.com', name: 'Potvrdio Admin' }],
          subject: `Dobrodošli u Potvrdio! Vaš API ključ i 25 besplatnih verifikacija (${cleanDomain})`,
          htmlContent,
        }),
      });

      if (brevoRes.ok) {
        const brevoData = await brevoRes.json().catch(() => ({}));
        emailSent = true;
        emailMsgId = String(brevoData.messageId || '');
      } else {
        emailErr = await brevoRes.text().catch(() => 'Brevo error');
      }
    }

    return res.status(200).json({
      success: true,
      apiKey,
      apiSecret,
      trialVerifications: 25,
      isTrial: true,
      emailSent,
      emailMessageId: emailMsgId,
      emailError: emailErr || undefined,
      storeDomain: cleanDomain,
      dashboardUrl: magicDashboardUrl,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
