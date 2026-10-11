import { verifyOrderToken } from '../_token';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.query?.token || req.body?.token;
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  const payload = verifyOrderToken(String(token));
  if (!payload) {
    return res.status(404).json({ error: 'Link za izmenu adrese je istekao ili je nevažeći (Token expired or invalid)' });
  }

  return res.status(200).json({
    valid: true,
    orderId: payload.orderId,
    storeName: payload.storeName,
    storeDomain: payload.storeDomain,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    address1: payload.address1,
    address2: payload.address2 || '',
    city: payload.city,
    postcode: payload.postcode || '',
    totalAmount: payload.totalAmount,
    currency: payload.currency,
    expiresAt: new Date(payload.exp).toISOString(),
  });
}
