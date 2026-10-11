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
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { token, address_1, address_2, city, postcode, order_note } = body;

    if (!token) {
      return res.status(400).json({ error: 'Missing token' });
    }

    const payload = verifyOrderToken(token);
    if (!payload) {
      return res.status(400).json({ error: 'Nevažeći ili istekao link za potvrdu (Token invalid or expired)' });
    }

    const orderIdNum = parseInt(String(payload.orderId).replace(/\D/g, ''), 10);
    const storeDomain = (payload.storeDomain || '').replace(/\/+$/, '');

    const webhookBody = {
      order_id: orderIdNum,
      action: 'APPROVED',
      updated_address: {
        address_1: address_1 || payload.address1,
        address_2: address_2 || payload.address2 || '',
        city: city || payload.city,
        postcode: postcode || payload.postcode || '',
      },
      order_note: order_note || '',
      timestamp: Math.floor(Date.now() / 1000),
    };

    const bodyStr = JSON.stringify(webhookBody);
    const signature = crypto.createHmac('sha256', payload.apiSecret || '').update(bodyStr).digest('hex');

    let wooSuccess = false;
    let wooError = null;

    const isLocalDomain =
      !storeDomain ||
      storeDomain.includes('localhost') ||
      storeDomain.includes('127.0.0.1') ||
      storeDomain.includes('.local') ||
      storeDomain.includes('.test') ||
      storeDomain.includes('.example') ||
      storeDomain.includes('.invalid');

    if (storeDomain && !isLocalDomain) {
      const webhookUrl = `${storeDomain}/wp-json/potvrdio/v1/webhook`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        let wooRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Potvrdio-Api-Key': payload.apiKey || '',
            'X-Potvrdio-Signature': signature,
          },
          body: bodyStr,
          signal: controller.signal,
        });

        // Fallback for WordPress sites using default plain permalinks
        if (wooRes.status === 404) {
          const fallbackUrl = `${storeDomain}/?rest_route=/potvrdio/v1/webhook`;
          wooRes = await fetch(fallbackUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Potvrdio-Api-Key': payload.apiKey || '',
              'X-Potvrdio-Signature': signature,
            },
            body: bodyStr,
            signal: controller.signal,
          });
        }

        clearTimeout(timeoutId);

        if (wooRes.ok) {
          wooSuccess = true;
        } else {
          wooError = `WooCommerce status: ${wooRes.status}`;
        }
      } catch (err: any) {
        wooError = err?.message || 'Failed to dispatch to WooCommerce';
        console.warn('[WOOCOMMERCE WEBHOOK DISPATCH ERROR]', wooError);
      }
    } else {
      wooSuccess = true; // Local simulation (cloud cannot reach local domain)
    }

    return res.status(200).json({
      status: 'success',
      action: 'APPROVED',
      order_id: payload.orderId,
      woo_notified: wooSuccess,
      woo_error: wooError,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
