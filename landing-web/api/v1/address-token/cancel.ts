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
    const { token } = body;

    if (!token) {
      return res.status(400).json({ error: 'Missing token' });
    }

    const payload = verifyOrderToken(token);
    if (!payload) {
      return res.status(400).json({ error: 'Nevažeći ili istekao link za otkazivanje' });
    }

    const orderIdNum = parseInt(String(payload.orderId).replace(/\D/g, ''), 10);
    const storeDomain = (payload.storeDomain || '').replace(/\/+$/, '');

    const webhookBody = {
      order_id: orderIdNum,
      action: 'CANCELLED',
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
        console.warn('[WOOCOMMERCE CANCEL WEBHOOK ERROR]', wooError);
      }
    } else {
      wooSuccess = true; // Local simulation
    }

    const nowTime = new Date().toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const orderIdStr = String(payload.orderId || orderIdNum);

    if (!(global as any).__potvrdio_orders) {
      (global as any).__potvrdio_orders = [];
    }
    const foundOrder = (global as any).__potvrdio_orders.find(
      (o: any) => o.id === `#${orderIdStr}` || o.id === orderIdStr || o.id.replace('#', '') === orderIdStr
    );

    if (foundOrder) {
      foundOrder.status = 'CANCELLED';
      foundOrder.responseTime = '45 sek';
      foundOrder.warehouseAction = 'Otkazano od strane kupca · Slanje obustavljeno';
      foundOrder.costSaved = '€3.50 (Ušteda na troškovima povrata)';
      if (!Array.isArray(foundOrder.history)) foundOrder.history = [];
      foundOrder.history.unshift({
        time: nowTime,
        type: 'cancel',
        badge: 'Otkazano 1-Klik',
        title: 'Porudžbina otkazana od strane kupca',
        desc: 'Kupac je izabrao otkazivanje porudžbine pre slanja. Sprečen trošak neisporučenog paketa.',
      });
    }

    try {
      const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'potvrdio.online';
      const proto = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
      await fetch(`${proto}://${host}/api/v1/orders/intercept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STATUS',
          order_id: orderIdNum,
          status: 'CANCELLED',
          responseTime: '45 sek',
          warehouseAction: 'Otkazano od strane kupca · Slanje obustavljeno',
          costSaved: '€3.50',
        }),
      }).catch(() => {});
    } catch {}

    return res.status(200).json({
      status: 'success',
      action: 'CANCELLED',
      order_id: payload.orderId,
      woo_notified: wooSuccess,
      woo_error: wooError,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
