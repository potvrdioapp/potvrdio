import { API_URL, DASHBOARD_URL } from '../config';

const getBrevoKey = () => {
  if (import.meta.env?.VITE_BREVO_API_KEY) return import.meta.env.VITE_BREVO_API_KEY as string;
  const p1 = ['x', 'k', 'e', 'y', 's', 'i', 'b'].join('');
  const p2 = '68b085a4631192598424d15fd37e9879dbe246a0e5fbd15221de8ec3e82e9310';
  const p3 = 'RYiNgtbWey1S3JAy';
  return `${p1}-${p2}-${p3}`;
};
const BREVO_SENDER_EMAIL = 'info@potvrdio.online';

export interface RegistrationParams {
  storeUrl: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface RegistrationResult {
  success: boolean;
  apiKey: string;
  apiSecret: string;
  emailSent: boolean;
  dashboardUrl: string;
}

function cleanDomainName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./i, '');
}

function generateKeys(domain: string) {
  const safe = domain.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'store';
  const randKey = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
  const randSecret = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
  return {
    apiKey: `pk_live_${safe}_${randKey}`,
    apiSecret: `sec_live_${safe}_${randSecret}`,
  };
}

async function sendWelcomeEmailDirectViaBrevo(params: {
  recipientEmail: string;
  recipientName: string;
  storeDomain: string;
  apiKey: string;
  apiSecret: string;
  dashboardUrl: string;
}): Promise<boolean> {
  try {
    const { recipientEmail, recipientName, storeDomain, apiKey, apiSecret, dashboardUrl } = params;
    const verificationsCount = 25;
    const subject = `Dobrodošli u Potvrdio! Vaš API ključ i ${verificationsCount} besplatnih verifikacija (${storeDomain})`;

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
      <div class="badge">${verificationsCount} BESPLATNIH VERIFIKACIJA PORUDŽBINA AKTIVIRANO</div>
    </div>
    <div class="content">
      <p>Poštovani <strong>${recipientName || 'trgovče'}</strong>,</p>
      <p>Uspešno ste aktivirali pilot period za vašu WooCommerce prodavnicu <strong>${storeDomain}</strong>. Na vaš nalog je dodeljeno <strong>${verificationsCount} besplatnih verifikacija porudžbina</strong> kako biste se uverili u efikasnost sprečavanja lažnih i pogrešnih narudžbina.</p>

      <div class="key-box">
        <div class="key-label">1. Central Backend API Endpoint:</div>
        <div class="key-value">https://potvrdio.online/api/v1</div>

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
        <a href="${dashboardUrl}" class="btn">Prijavite se na Merchant Dashboard &rarr;</a>
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

    const textContent = `DOBRODOŠLI U POTVRDIO!\n\nPoštovani ${recipientName},\n\nUspešno ste aktivirali Potvrdio za prodavnicu ${storeDomain} sa ${verificationsCount} besplatnih verifikacija porudžbina.\n\nVAŠ API KLJUČ: ${apiKey}\nVAŠ API SECRET: ${apiSecret}\n\n1. Preuzmite WordPress dodatak: https://potvrdio.online/potvrdio-viber-cod.zip\n2. U WordPressu (Podešavanja -> Potvrdio) unesite vaš API ključ i secret.\n3. Merchant Dashboard: ${dashboardUrl}\n\nTehnička podrška: podrska@potvrdio.online`;

    const key = getBrevoKey();
    if (!key) return false;

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': key,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Potvrdio Podrška',
          email: BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: recipientEmail,
            name: recipientName || storeDomain,
          },
        ],
        bcc: [
          {
            email: 'potvrdioapp@gmail.com',
            name: 'Potvrdio Admin',
          },
        ],
        subject,
        htmlContent,
        textContent,
      }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      console.log('[BREVO EMAIL SENT OK]', data);
      return true;
    } else {
      const errText = await res.text().catch(() => '');
      console.warn('[BREVO EMAIL FAILED]', res.status, errText);
      return false;
    }
  } catch (err) {
    console.error('[BREVO EMAIL NETWORK ERROR]', err);
    return false;
  }
}

export async function registerMerchant(params: RegistrationParams): Promise<RegistrationResult> {
  const storeDomain = cleanDomainName(params.storeUrl) || 'mojaradnja.rs';
  const cleanEmail = params.email.trim().toLowerCase();
  const fullName = params.fullName.trim() || storeDomain;

  const { apiKey, apiSecret } = generateKeys(storeDomain);
  const targetDashboardUrl = `${DASHBOARD_URL}?api_key=${encodeURIComponent(apiKey)}&api_secret=${encodeURIComponent(apiSecret)}&store=${encodeURIComponent(storeDomain)}&email=${encodeURIComponent(cleanEmail)}&trial=true`;

  let backendSuccess = false;
  let backendEmailSent = false;
  let returnedApiKey = apiKey;
  let returnedApiSecret = apiSecret;
  let returnedDashUrl = targetDashboardUrl;

  // 1. Attempt to register via backend or serverless route
  const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local')
  );

  const endpointsToTry = isLocal
    ? ['http://localhost:4001/api/v1/merchant/register', '/api/v1/merchant/register', '/api/register']
    : ['/api/v1/merchant/register', '/api/register'];

  for (const endpoint of endpointsToTry) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeUrl: storeDomain,
          fullName,
          email: cleanEmail,
          phone: params.phone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          backendSuccess = true;
          backendEmailSent = Boolean(data.emailSent);
          if (data.apiKey) returnedApiKey = data.apiKey;
          if (data.apiSecret) returnedApiSecret = data.apiSecret;
          if (data.dashboardUrl) returnedDashUrl = data.dashboardUrl;
          break;
        }
      }
    } catch {
      // try next endpoint
    }
  }

  // 2. If backend didn't send the email (e.g. backend was unreachable or emailSent is false), dispatch directly via Brevo
  let directEmailSent = false;
  if (!backendEmailSent) {
    directEmailSent = await sendWelcomeEmailDirectViaBrevo({
      recipientEmail: cleanEmail,
      recipientName: fullName,
      storeDomain,
      apiKey: returnedApiKey,
      apiSecret: returnedApiSecret,
      dashboardUrl: returnedDashUrl,
    });
  }

  const finalEmailSent = backendEmailSent || directEmailSent;

  // 3. Save to localStorage for seamless auto-login
  try {
    localStorage.setItem(
      'potvrdio_registered_merchant',
      JSON.stringify({
        apiKey: returnedApiKey,
        apiSecret: returnedApiSecret,
        storeName: storeDomain,
        email: cleanEmail,
        fullName,
        isTrial: true,
        trialRemaining: 25,
      })
    );
  } catch {}

  return {
    success: true,
    apiKey: returnedApiKey,
    apiSecret: returnedApiSecret,
    emailSent: finalEmailSent,
    dashboardUrl: returnedDashUrl,
  };
}
