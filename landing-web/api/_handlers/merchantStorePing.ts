export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Potvrdio-Api-Key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const apiKey = req.headers['x-potvrdio-api-key'] || body?.apiKey;
  const storeDomain = body?.storeDomain;

  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey' });
  }

  const now = new Date().toISOString();

  if (!(global as any).__potvrdio_pings) {
    (global as any).__potvrdio_pings = new Map();
  }
  (global as any).__potvrdio_pings.set(apiKey, {
    lastPingAt: now,
    storeDomain: storeDomain || 'store',
    timestamp: Date.now(),
  });

  // Persist ping to Supabase
  const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/merchants?api_key=eq.${encodeURIComponent(apiKey)}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          is_connected: true,
          last_ping_at: now,
          updated_at: now,
        }),
      });

      // Insert audit log
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
        }),
      }).catch(() => {});
    } catch (dbErr: any) {
      console.warn('[SUPABASE PING ERROR]:', dbErr?.message || dbErr);
    }
  }

  return res.status(200).json({
    success: true,
    isConnected: true,
    lastPingAt: now,
    message: 'Store connection verified successfully',
    storeDomain,
    apiKey,
  });
}
