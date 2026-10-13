import crypto from 'crypto';

const SIGNING_SECRET = process.env.POTVRDIO_SIGNING_SECRET || 'potvrdio_balkan_cod_secure_key_2026';

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

function verifyMagicToken(token: string): { email: string } | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [data, sig] = parts;
    const expectedSig = crypto.createHmac('sha256', SIGNING_SECRET).update(data).digest('base64url');

    const sigBuf = Buffer.from(sig);
    const expectedSigBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedSigBuf.length || !crypto.timingSafeEqual(sigBuf, expectedSigBuf)) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(data));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
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
    const { token } = body;

    if (!token) {
      return res.status(400).json({ error: 'Token je obavezan', code: 'TOKEN_REQUIRED' });
    }

    const payload = verifyMagicToken(token);
    if (!payload || !payload.email) {
      return res.status(401).json({
        error: 'Prijavni link je nevažeći ili je istekao. Molimo zatražite novi.',
        code: 'TOKEN_INVALID_OR_EXPIRED',
      });
    }

    const cleanEmail = payload.email.trim().toLowerCase();

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
        console.warn('[MAGIC LOGIN DB ERROR]', err?.message || err);
      }
    }

    if (!Array.isArray(matchedStores) || matchedStores.length === 0) {
      return res.status(404).json({
        error: 'Nalog nije pronađen.',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    const stores = matchedStores.map((s: any) => ({
      id: s.id || `store_${s.api_key}`,
      storeName: s.store_name || s.store_domain,
      storeDomain: s.store_domain,
      apiKey: s.api_key,
      apiSecret: s.api_secret,
      isTrial: (s.plan_type || 'PILOT') === 'PILOT',
      trialRemaining: typeof s.trial_verifications_remaining === 'number' ? s.trial_verifications_remaining : 25,
      credits: typeof s.message_credits_remaining === 'number' ? s.message_credits_remaining : 0,
      isConnected: Boolean(s.is_connected),
      lastPingAt: s.last_ping_at || null,
    }));

    const activeStore = stores[0];

    return res.status(200).json({
      success: true,
      account: {
        email: cleanEmail,
        fullName: activeStore?.storeName || cleanEmail.split('@')[0],
        stores,
      },
      activeStore,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Greška pri obradi magic linka' });
  }
}
