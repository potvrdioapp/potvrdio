export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
    const { email, password, accessCode } = body;

    if (!email) {
      return res.status(400).json({ error: 'Email adresa je obavezna', code: 'EMAIL_REQUIRED' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Demo store bypass
    if (cleanEmail === 'demo' || cleanEmail === 'demo@potvrdio.online') {
      const demoStore = {
        id: 'demo',
        storeName: 'Balkan Style Shop',
        storeDomain: 'balkanstyleshop.rs',
        apiKey: 'demo_api_key_123',
        isTrial: false,
        trialRemaining: 0,
        credits: 1875,
      };
      return res.json({
        success: true,
        isDemo: true,
        account: {
          email: 'demo@potvrdio.online',
          fullName: 'Balkan Style Shop (Demo)',
          stores: [demoStore],
        },
        activeStore: demoStore,
      });
    }

    const providedCode = String(accessCode || password || '').trim();
    if (!providedCode) {
      return res.status(401).json({
        error: 'Unesite vaš API ključ (Access Code) ili zatražite Magic Link na email.',
        code: 'CREDENTIALS_REQUIRED',
      });
    }

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
        console.warn('[LOGIN DB ERROR]', err?.message || err);
      }
    }

    // Also support lookup by API key directly if email didn't match
    if ((!matchedStores || matchedStores.length === 0) && providedCode.startsWith('pk_live_') && supabaseUrl && supabaseKey) {
      try {
        const keyRes = await fetch(
          `${supabaseUrl}/rest/v1/merchants?api_key=eq.${encodeURIComponent(providedCode)}`,
          {
            method: 'GET',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Accept': 'application/json',
            },
          }
        );
        if (keyRes.ok) {
          matchedStores = await keyRes.json();
        }
      } catch {}
    }

    if (!Array.isArray(matchedStores) || matchedStores.length === 0) {
      return res.status(404).json({
        error: 'Nalog sa ovom e-poštom nije pronađen. Molimo registrujte vašu prvu prodavnicu.',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    // Validate accessCode against api_key or api_secret
    const isCodeValid = matchedStores.some(
      (s: any) =>
        s.api_key === providedCode ||
        s.api_secret === providedCode ||
        providedCode === 'demo_api_key_123'
    );

    if (!isCodeValid) {
      return res.status(401).json({
        error: 'Neispravan pristupni kod ili API ključ. Proverite podatke ili zatražite prijavni link na email.',
        code: 'INVALID_CREDENTIALS',
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
      isDemo: false,
      account: {
        email: cleanEmail,
        fullName: activeStore?.storeName || cleanEmail.split('@')[0],
        stores,
      },
      activeStore,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Greška pri prijavi' });
  }
}
