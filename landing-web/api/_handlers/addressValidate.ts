import crypto from 'crypto';

const SIGNING_SECRET = process.env.POTVRDIO_SIGNING_SECRET || 'potvrdio_balkan_cod_secure_key_2026';

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

function verifyOrderToken(token: string): any | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [data, sig] = parts;
    const expectedSig = crypto.createHmac('sha256', SIGNING_SECRET).update(data).digest('base64url');

    const sigBuf = Buffer.from(sig);
    const expectedSigBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedSigBuf.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(sigBuf, expectedSigBuf)) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(data));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

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
