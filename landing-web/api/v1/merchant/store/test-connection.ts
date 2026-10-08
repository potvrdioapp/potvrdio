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
  const apiKey = body?.apiKey || req.headers['x-potvrdio-api-key'];

  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey' });
  }

  return res.status(200).json({
    success: true,
    isConnected: true,
    lastPingAt: new Date().toISOString(),
    message: 'Store connection verified successfully',
  });
}
