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

  const apiKey = String(req.query?.apiKey || req.headers['x-potvrdio-api-key'] || '').trim();
  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey' });
  }

  // Demo store bypass
  if (apiKey === 'demo' || apiKey === 'demo_api_key_123') {
    return res.status(200).json({
      success: true,
      isConnected: true,
      lastPingAt: new Date().toISOString(),
      storeDomain: 'balkanstyleshop.rs',
    });
  }

  // Real merchant store status checked against Supabase database & in-memory cache
  const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

  let isConnected = false;
  let lastPingAt: string | null = null;
  let storeDomain: string | null = null;
  let trialRemaining = 25;
  let creditsRemaining = 0;
  let planType = 'PILOT';
  let notificationChannel = 'EMAIL_ONLY';

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/merchants?api_key=eq.${encodeURIComponent(apiKey)}&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const records = await res.json();
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
    } catch (dbErr: any) {
      console.warn('[SUPABASE STATUS ERROR]:', dbErr?.message || dbErr);
    }
  }

  // Fallback to memory registry if Supabase is not yet populated or offline
  if (!isConnected) {
    const pings = (global as any).__potvrdio_pings;
    const recorded = pings && pings.has(apiKey) ? pings.get(apiKey) : null;
    if (recorded) {
      isConnected = true;
      lastPingAt = recorded.lastPingAt;
      storeDomain = storeDomain || recorded.storeDomain;
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
