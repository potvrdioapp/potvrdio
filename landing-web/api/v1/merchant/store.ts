export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Potvrdio-Api-Key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const action = String(req.query?.action || '').trim().toLowerCase();

  // Route 1: stores/add
  if (action === 'stores-add' || action === 'add' || req.url?.includes('stores/add')) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { storeDomain, storeName, email } = body;
    if (!storeDomain || !email) {
      return res.status(400).json({ error: 'Store domain and email are required' });
    }

    const cleanDomain = String(storeDomain).trim().toLowerCase().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^www\./i, '');
    const cleanEmail = String(email).trim().toLowerCase();
    const finalStoreName = storeName ? String(storeName).trim() : cleanDomain;

    const safeDomain = cleanDomain.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'store';
    const randKey = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    const randSecret = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
    const apiKey = `pk_live_${safeDomain}_${randKey}`;
    const apiSecret = `sec_live_${safeDomain}_${randSecret}`;

    let insertedId = `store_${Date.now()}`;

    if (supabaseUrl && supabaseKey) {
      try {
        const insertRes = await fetch(`${supabaseUrl}/rest/v1/merchants?on_conflict=store_domain`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=representation',
          },
          body: JSON.stringify({
            store_name: finalStoreName,
            store_domain: cleanDomain,
            email: cleanEmail,
            api_key: apiKey,
            api_secret: apiSecret,
            plan_type: 'PILOT',
            notification_channel: 'EMAIL_ONLY',
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

    return res.status(200).json({
      success: true,
      store: {
        id: insertedId,
        storeName: finalStoreName,
        storeDomain: cleanDomain,
        apiKey,
        apiSecret,
        planType: 'PILOT',
        trialRemaining: 25,
        credits: 0,
        isConnected: false,
        notificationChannel: 'EMAIL_ONLY',
      },
    });
  }

  // Route 2: store/test-connection
  if (action === 'test-connection' || req.url?.includes('test-connection')) {
    return res.status(200).json({
      success: true,
      verified: true,
      ping: true,
      serverTime: new Date().toISOString(),
    });
  }

  // Route 3: store/ping
  if (action === 'ping' || req.url?.includes('/ping')) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const apiKey = String(body.apiKey || req.headers['x-potvrdio-api-key'] || '').trim();
    const storeDomain = String(body.storeDomain || body.store_domain || '').trim();

    if (supabaseUrl && supabaseKey && apiKey) {
      try {
        fetch(`${supabaseUrl}/rest/v1/store_pings`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: apiKey,
            store_domain: storeDomain || null,
            ip_address: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null,
          }),
        }).catch(() => {});

        fetch(`${supabaseUrl}/rest/v1/merchants?api_key=eq.${encodeURIComponent(apiKey)}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_connected: true,
            last_ping_at: new Date().toISOString(),
          }),
        }).catch(() => {});
      } catch {}
    }

    return res.status(200).json({
      success: true,
      pong: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Route 4: store/status (default GET /status)
  const apiKey = String(req.query?.apiKey || req.headers['x-potvrdio-api-key'] || '').trim();
  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey' });
  }

  if (apiKey === 'demo' || apiKey === 'demo_api_key_123') {
    return res.status(200).json({
      success: true,
      isConnected: true,
      lastPingAt: new Date().toISOString(),
      storeDomain: 'balkanstyleshop.rs',
      trialRemaining: 0,
      creditsRemaining: 1875,
      notificationChannel: 'EMAIL_ONLY',
    });
  }

  let isConnected = false;
  let lastPingAt: string | null = null;
  let storeDomain: string | null = null;
  let trialRemaining = 25;
  let creditsRemaining = 0;
  let planType = 'PILOT';
  let notificationChannel = 'EMAIL_ONLY';

  if (supabaseUrl && supabaseKey) {
    try {
      const dbRes = await fetch(`${supabaseUrl}/rest/v1/merchants?api_key=eq.${encodeURIComponent(apiKey)}&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json',
        },
      });

      if (dbRes.ok) {
        const records = await dbRes.json();
        if (Array.isArray(records) && records.length > 0) {
          const m = records[0];
          isConnected = Boolean(m.is_connected);
          lastPingAt = m.last_ping_at || null;
          storeDomain = m.store_domain || null;
          trialRemaining = typeof m.trial_verifications_remaining === 'number' ? m.trial_verifications_remaining : 25;
          creditsRemaining = typeof m.message_credits_remaining === 'number' ? m.message_credits_remaining : 0;
          planType = m.plan_type || 'PILOT';
          notificationChannel = m.notification_channel || 'EMAIL_ONLY';
        }
      }
    } catch (err: any) {
      console.warn('[STATUS DB ERROR]:', err?.message || err);
    }
  }

  return res.status(200).json({
    success: true,
    isConnected,
    lastPingAt,
    storeDomain,
    trialRemaining,
    creditsRemaining,
    planType,
    notificationChannel,
  });
}
