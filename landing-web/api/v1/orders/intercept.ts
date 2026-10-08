export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Potvrdio-Api-Key, X-Potvrdio-Api-Secret'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { order_id, customer_name, customer_phone, total_amount, currency, store_name, store_domain } = body;

    if (!order_id) {
      return res.status(400).json({ error: 'Missing order_id' });
    }

    const apiKey = req.headers['x-potvrdio-api-key'] || body.apiKey;
    const now = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: 'Order intercepted successfully',
      order_id: Number(order_id),
      status: 'VERIFICATION_PENDING',
      timestamp: now,
      store_domain: store_domain || 'store',
      apiKey,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
