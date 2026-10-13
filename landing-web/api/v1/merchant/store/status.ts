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

  // Real merchant store status checked against recorded ping registry
  const pings = (global as any).__potvrdio_pings;
  const recorded = pings && pings.has(apiKey) ? pings.get(apiKey) : null;
  const isConnected = Boolean(recorded);

  return res.status(200).json({
    success: true,
    isConnected,
    lastPingAt: recorded ? recorded.lastPingAt : null,
    storeDomain: recorded ? recorded.storeDomain : null,
  });
}
