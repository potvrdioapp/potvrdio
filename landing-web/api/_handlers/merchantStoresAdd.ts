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
    const { email, storeUrl, storeName } = body;

    if (!storeUrl || !email) {
      return res.status(400).json({ error: 'Store URL i email su obavezni' });
    }

    const cleanDomain = String(storeUrl).trim().toLowerCase().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^www\./i, '');
    const cleanEmail = String(email).trim().toLowerCase();
    const finalStoreName = String(storeName || cleanDomain).trim();

    const safeDomain = cleanDomain.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'store';
    const randKey = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    const randSecret = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
    const apiKey = `pk_live_${safeDomain}_${randKey}`;
    const apiSecret = `sec_live_${safeDomain}_${randSecret}`;

    const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

    let insertedId = `store_${Date.now()}`;

    if (supabaseUrl && supabaseKey) {
      try {
        const insertRes = await fetch(`${supabaseUrl}/rest/v1/merchants`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            store_name: finalStoreName,
            store_domain: cleanDomain,
            email: cleanEmail,
            api_key: apiKey,
            api_secret: apiSecret,
            plan_type: 'PILOT',
            trial_verifications_remaining: 25,
            message_credits_remaining: 0,
            is_connected: false,
          }),
        });

        if (insertRes.ok) {
          const rows = await insertRes.json();
          if (Array.isArray(rows) && rows[0]?.id) {
            insertedId = rows[0].id;
          }
        }
      } catch (err: any) {
        console.warn('[ADD STORE DB ERROR]', err?.message || err);
      }
    }

    const newStore = {
      id: insertedId,
      storeName: finalStoreName,
      storeDomain: cleanDomain,
      apiKey,
      apiSecret,
      isTrial: true,
      trialRemaining: 25,
      credits: 0,
      isConnected: false,
    };

    return res.status(200).json({
      success: true,
      store: newStore,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Greška pri dodavanju prodavnice' });
  }
}
