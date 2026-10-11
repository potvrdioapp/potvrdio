import crypto from 'crypto';
import { verifyOrderToken } from '../_token';

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

    if (storeDomain && !storeDomain.includes('localhost') && !storeDomain.includes('127.0.0.1')) {
      const webhookUrl = `${storeDomain}/wp-json/potvrdio/v1/webhook`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const wooRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Potvrdio-Api-Key': payload.apiKey || '',
            'X-Potvrdio-Signature': signature,
          },
          body: bodyStr,
          signal: controller.signal,
        });
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
      wooSuccess = true; // Local simulation
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
