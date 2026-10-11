import crypto from 'crypto';

const SIGNING_SECRET = process.env.POTVRDIO_SIGNING_SECRET || 'potvrdio_balkan_cod_secure_key_2026';

export interface OrderTokenPayload {
  orderId: string;
  storeName: string;
  storeDomain: string;
  customerName: string;
  customerPhone: string;
  address1: string;
  address2?: string;
  city: string;
  postcode?: string;
  totalAmount: number;
  currency: string;
  apiSecret?: string;
  apiKey?: string;
  exp: number; // timestamp in ms
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Creates a signed, tamper-proof, URL-safe order token.
 */
export function createOrderToken(payload: OrderTokenPayload): string {
  const payloadStr = JSON.stringify(payload);
  const data = base64UrlEncode(payloadStr);
  const sig = crypto.createHmac('sha256', SIGNING_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

/**
 * Verifies and decodes an order token. Returns null if tampered or expired.
 */
export function verifyOrderToken(token: string): OrderTokenPayload | null {
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

    const payload: OrderTokenPayload = JSON.parse(base64UrlDecode(data));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}
