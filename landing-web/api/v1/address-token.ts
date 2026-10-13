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

  const rawAction = String(req.query?.action || '').trim().toLowerCase();
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const token = req.query?.token || body.token || (rawAction.length > 20 ? rawAction : '');

  // Branch 1: Validate
  if (req.method === 'GET' || rawAction === 'validate' || (!rawAction && req.method === 'POST' && !body.address_1 && !body.is_cancellation)) {
    if (!token) return res.status(400).json({ error: 'Missing token' });
    const payload = verifyOrderToken(token);
    if (!payload) return res.status(400).json({ valid: false, error: 'Token is invalid or expired' });
    return res.status(200).json({ valid: true, payload });
  }

  // Branch 2: Cancel
  if (rawAction === 'cancel' || body.is_cancellation || req.url?.includes('/cancel')) {
    if (!token) return res.status(400).json({ error: 'Missing token' });
    const payload = verifyOrderToken(token);
    if (!payload) return res.status(400).json({ error: 'Nevažeći ili istekao link za otkazivanje' });

    const orderIdNum = parseInt(String(payload.orderId).replace(/\D/g, ''), 10);
    const storeDomain = (payload.storeDomain || '').replace(/\/+$/, '');
    const apiSecret = payload.apiSecret;

    let wooSuccess = false;
    let wooError = null;

    if (storeDomain && orderIdNum && apiSecret) {
      try {
        const cancelPayload = JSON.stringify({
          order_id: orderIdNum,
          status: 'cancelled',
          customer_note: 'Porudžbina otkazana od strane kupca putem Potvrdio SMS/Viber linka.',
          timestamp: Math.floor(Date.now() / 1000),
        });

        const signature = crypto.createHmac('sha256', apiSecret).update(cancelPayload).digest('hex');
        const wooRes = await fetch(`${storeDomain}/wp-json/potvrdio/v1/order/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Potvrdio-Signature': signature,
            'X-Potvrdio-Api-Key': payload.apiKey || '',
          },
          body: cancelPayload,
        });

        if (wooRes.ok) {
          wooSuccess = true;
        } else {
          wooError = await wooRes.text().catch(() => 'WooCommerce rejection');
        }
      } catch (err: any) {
        wooError = err?.message;
      }
    }

    // Update central order state
    const centralOrders = (global as any).__potvrdio_orders || [];
    const foundOrder = centralOrders.find((o: any) => o.id === `#${payload.orderId}` || o.id === payload.orderId);
    if (foundOrder) {
      foundOrder.status = 'CANCELLED';
      foundOrder.responseTime = '35 sek';
      foundOrder.warehouseAction = 'Otkazano od strane kupca · Slanje obustavljeno';
      foundOrder.costSaved = '€3.50';
    }

    return res.status(200).json({
      success: true,
      cancelled: true,
      order_id: orderIdNum,
      woo_notified: wooSuccess,
      woo_error: wooError,
      message: 'Porudžbina je uspešno otkazana pre slanja. Paket neće biti poslat.',
    });
  }

  // Branch 3: Submit (Confirm / Edit)
  if (rawAction === 'submit' || req.method === 'POST') {
    if (!token) return res.status(400).json({ error: 'Missing token' });
    const payload = verifyOrderToken(token);
    if (!payload) return res.status(400).json({ error: 'Nevažeći ili istekao link' });

    const orderIdNum = parseInt(String(payload.orderId).replace(/\D/g, ''), 10);
    const storeDomain = (payload.storeDomain || '').replace(/\/+$/, '');
    const apiSecret = payload.apiSecret;

    const addressChanged = Boolean(
      (body.address_1 && body.address_1 !== payload.address1) ||
      (body.city && body.city !== payload.city) ||
      (body.postcode && body.postcode !== payload.postcode)
    );

    let wooSuccess = false;
    let wooError = null;

    if (storeDomain && orderIdNum && apiSecret) {
      try {
        const updatePayload = JSON.stringify({
          order_id: orderIdNum,
          status: 'processing',
          address_1: body.address_1 || payload.address1,
          address_2: body.address_2 || payload.address2,
          city: body.city || payload.city,
          postcode: body.postcode || payload.postcode,
          customer_note: body.order_note || undefined,
          timestamp: Math.floor(Date.now() / 1000),
        });

        const signature = crypto.createHmac('sha256', apiSecret).update(updatePayload).digest('hex');
        const wooRes = await fetch(`${storeDomain}/wp-json/potvrdio/v1/order/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Potvrdio-Signature': signature,
            'X-Potvrdio-Api-Key': payload.apiKey || '',
          },
          body: updatePayload,
        });

        if (wooRes.ok) {
          wooSuccess = true;
        } else {
          wooError = await wooRes.text().catch(() => 'WooCommerce rejection');
        }
      } catch (err: any) {
        wooError = err?.message;
      }
    }

    const centralOrders = (global as any).__potvrdio_orders || [];
    const foundOrder = centralOrders.find((o: any) => o.id === `#${payload.orderId}` || o.id === payload.orderId);
    if (foundOrder) {
      foundOrder.status = addressChanged ? 'EDITED_ADDRESS' : 'APPROVED';
      foundOrder.responseTime = '35 sek';
      foundOrder.warehouseAction = 'Spremno za slanje · WooCommerce status "Processing"';
    }

    return res.status(200).json({
      success: true,
      confirmed: true,
      order_id: orderIdNum,
      woo_notified: wooSuccess,
      woo_error: wooError,
      address_changed: addressChanged,
      message: 'Adresa je uspešno potvrđena. Paket je spreman za pakovanje i slanje.',
    });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
