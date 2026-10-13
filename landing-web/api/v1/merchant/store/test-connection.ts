export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Potvrdio-Api-Key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const apiKey = String(body?.apiKey || req.headers['x-potvrdio-api-key'] || '').trim();

  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey' });
  }

  // Demo store bypass
  if (apiKey === 'demo' || apiKey === 'demo_api_key_123') {
    return res.status(200).json({
      success: true,
      isConnected: true,
      lastPingAt: new Date().toISOString(),
      message: 'Demo WooCommerce connection verified successfully',
    });
  }

  const pings = (global as any).__potvrdio_pings;
  const recorded = pings && pings.has(apiKey) ? pings.get(apiKey) : null;

  if (recorded) {
    return res.status(200).json({
      success: true,
      isConnected: true,
      lastPingAt: recorded.lastPingAt,
      message: 'WooCommerce connection verified successfully',
      storeDomain: recorded.storeDomain,
    });
  }

  return res.status(404).json({
    success: false,
    isConnected: false,
    lastPingAt: null,
    error: 'NO_SIGNAL_RECEIVED',
    message: 'No signal received from WordPress site yet.',
  });
}
