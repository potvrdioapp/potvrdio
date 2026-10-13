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

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const rawAction = String(req.query?.action || '').trim().toLowerCase();
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const token = req.query?.token || body.token || (rawAction.length > 20 ? rawAction : '');

  // Branch 1: Validate / Status Check
  if (req.method === 'GET' || rawAction === 'validate' || rawAction === 'check' || (!rawAction && req.method === 'POST' && !body.address_1 && !body.is_cancellation)) {
    if (!token) return res.status(400).json({ error: 'Missing token' });
    const payload = verifyOrderToken(token);
    if (!payload) return res.status(400).json({ valid: false, error: 'Token is invalid or expired' });

    // Check live database status if available
    let liveStatus = 'SMS_FALLBACK';
    const orderIdNum = parseInt(String(payload.orderId).replace(/\D/g, ''), 10);
    if (supabaseUrl && supabaseKey && payload.apiKey && orderIdNum) {
      try {
        const checkRes = await fetch(
          `${supabaseUrl}/rest/v1/orders?merchant_api_key=eq.${encodeURIComponent(payload.apiKey)}&order_id=eq.${encodeURIComponent(String(orderIdNum))}&limit=1`,
          {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Accept': 'application/json',
            },
          }
        );
        if (checkRes.ok) {
          const rows = await checkRes.json();
          if (Array.isArray(rows) && rows[0]?.status) {
            liveStatus = rows[0].status;
          }
        }
      } catch {}
    }

    const isVerified = liveStatus === 'APPROVED' || liveStatus === 'EDITED_ADDRESS';
    const isCancelled = liveStatus === 'CANCELLED';

    return res.status(200).json({
      valid: true,
      verified: isVerified,
      cancelled: isCancelled,
      status: liveStatus,
      payload,
    });
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
        const cancelWebhookPayload = JSON.stringify({
          order_id: orderIdNum,
          action: 'CANCELLED',
          status: 'cancelled',
          customer_note: body.reason || 'Porudžbina otkazana od strane kupca putem Potvrdio SMS/Viber linka.',
          timestamp: Math.floor(Date.now() / 1000),
        });

        const signature = crypto.createHmac('sha256', apiSecret).update(cancelWebhookPayload).digest('hex');
        
        // 1. Try standard /wp-json/potvrdio/v1/webhook
        let wooRes = await fetch(`${storeDomain}/wp-json/potvrdio/v1/webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Potvrdio-Signature': signature,
            'X-Potvrdio-Api-Key': payload.apiKey || '',
          },
          body: cancelWebhookPayload,
        }).catch((err) => {
          wooError = err?.message;
          return null;
        });

        // 2. Fallback to /wp-json/potvrdio/v1/order/cancel if 404
        if (!wooRes || wooRes.status === 404) {
          wooRes = await fetch(`${storeDomain}/wp-json/potvrdio/v1/order/cancel`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Potvrdio-Signature': signature,
              'X-Potvrdio-Api-Key': payload.apiKey || '',
            },
            body: cancelWebhookPayload,
          }).catch((err) => {
            wooError = err?.message;
            return null;
          });
        }

        if (wooRes && wooRes.ok) {
          wooSuccess = true;
          wooError = null;
        } else if (wooRes && !wooRes.ok) {
          wooError = await wooRes.text().catch(() => 'WooCommerce rejection');
        }
      } catch (err: any) {
        wooError = err?.message;
      }
    }

    const nowTime = new Date().toLocaleTimeString('sr-RS', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newCancelHistory = {
      time: nowTime,
      type: 'cancelled',
      badge: 'Otkazano',
      title: 'Porudžbina otkazana od strane kupca',
      desc: body.reason ? `Razlog: ${body.reason}. Slanje paketa je obustavljeno.` : 'Kupac je otkazao narudžbinu putem linka. Paket je obustavljen pre predaje kuriru.',
    };

    // 1. Persist status change to Supabase database FIRST (Immediate & Reliable)
    if (supabaseUrl && supabaseKey) {
      try {
        let existingHistory: any[] = [];
        let rowFound = false;
        const filterQuery = payload.apiKey
          ? `merchant_api_key=eq.${encodeURIComponent(payload.apiKey)}&order_id=eq.${encodeURIComponent(String(orderIdNum))}`
          : `order_id=eq.${encodeURIComponent(String(orderIdNum))}`;

        const getRes = await fetch(`${supabaseUrl}/rest/v1/orders?${filterQuery}&limit=1`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Accept': 'application/json',
          },
        });

        if (getRes.ok) {
          const rows = await getRes.json();
          if (Array.isArray(rows) && rows[0]) {
            rowFound = true;
            existingHistory = Array.isArray(rows[0].history) ? rows[0].history : [];
          }
        }

        const mergedHistory = [...existingHistory, newCancelHistory];

        if (rowFound) {
          await fetch(`${supabaseUrl}/rest/v1/orders?${filterQuery}`, {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              status: 'CANCELLED',
              response_time: '35 sek',
              warehouse_action: 'Otkazano od strane kupca · Slanje obustavljeno',
              cost_saved: '€3.50',
              history: mergedHistory,
              updated_at: new Date().toISOString(),
            }),
          });
        } else {
          // If the order wasn't previously in database, insert it directly
          await fetch(`${supabaseUrl}/rest/v1/orders`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              merchant_api_key: payload.apiKey || '',
              order_id: String(orderIdNum),
              customer_name: payload.customerName || 'Kupac',
              customer_phone: payload.customerPhone || '',
              city: payload.city || 'Beograd',
              address: payload.address1 || '',
              total_amount: Number(payload.totalAmount) || 0,
              currency: payload.currency || 'RSD',
              status: 'CANCELLED',
              channel: 'SMS',
              response_time: '35 sek',
              warehouse_action: 'Otkazano od strane kupca · Slanje obustavljeno',
              cost_saved: '€3.50',
              history: mergedHistory,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }),
          });
        }
      } catch (dbErr: any) {
        console.warn('[SUPABASE CANCEL UPDATE ERROR]:', dbErr?.message || dbErr);
      }
    }

    // 2. Update in-memory fallback & notify intercept container
    const centralOrders = (global as any).__potvrdio_orders || [];
    const foundOrder = centralOrders.find((o: any) => o.id === `#${payload.orderId}` || o.id === payload.orderId);
    if (foundOrder) {
      foundOrder.status = 'CANCELLED';
      foundOrder.responseTime = '35 sek';
      foundOrder.warehouseAction = 'Otkazano od strane kupca · Slanje obustavljeno';
      foundOrder.costSaved = '€3.50';
      if (Array.isArray(foundOrder.history)) {
        foundOrder.history.push(newCancelHistory);
      }
    }

    try {
      fetch('https://potvrdio.online/api/v1/orders/intercept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STATUS',
          order_id: orderIdNum,
          status: 'CANCELLED',
        }),
      }).catch(() => {});
    } catch {}

    // 3. Attempt direct outbound webhook to merchant store (with strict 2.5s timeout)
    if (storeDomain && orderIdNum && apiSecret) {
      try {
        const cancelWebhookPayload = JSON.stringify({
          order_id: orderIdNum,
          action: 'CANCELLED',
          status: 'cancelled',
          customer_note: body.reason || 'Porudžbina otkazana od strane kupca putem Potvrdio SMS/Viber linka.',
          timestamp: Math.floor(Date.now() / 1000),
        });

        const signature = crypto.createHmac('sha256', apiSecret).update(cancelWebhookPayload).digest('hex');
        
        let wooRes = await fetch(`${storeDomain}/wp-json/potvrdio/v1/webhook`, {
          method: 'POST',
          signal: AbortSignal.timeout(2500),
          headers: {
            'Content-Type': 'application/json',
            'X-Potvrdio-Signature': signature,
            'X-Potvrdio-Api-Key': payload.apiKey || '',
          },
          body: cancelWebhookPayload,
        }).catch((err) => {
          wooError = err?.message;
          return null;
        });

        if (!wooRes || wooRes.status === 404) {
          wooRes = await fetch(`${storeDomain}/wp-json/potvrdio/v1/order/cancel`, {
            method: 'POST',
            signal: AbortSignal.timeout(2500),
            headers: {
              'Content-Type': 'application/json',
              'X-Potvrdio-Signature': signature,
              'X-Potvrdio-Api-Key': payload.apiKey || '',
            },
            body: cancelWebhookPayload,
          }).catch((err) => {
            wooError = err?.message;
            return null;
          });
        }

        if (wooRes && wooRes.ok) {
          wooSuccess = true;
          wooError = null;
        } else if (wooRes && !wooRes.ok) {
          wooError = await wooRes.text().catch(() => 'WooCommerce rejection');
        }
      } catch (err: any) {
        wooError = err?.message;
      }
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

    const finalAddr1 = body.address_1 || payload.address1 || '';
    const finalAddr2 = body.address_2 || payload.address2 || '';
    const finalCity = body.city || payload.city || 'Beograd';
    const finalPostcode = body.postcode || payload.postcode || '';
    const newAddressDisplay = `${finalAddr1}${finalAddr2 ? ', ' + finalAddr2 : ''}${finalCity ? ', ' + finalCity : ''}`;
    const finalStatus = addressChanged ? 'EDITED_ADDRESS' : 'APPROVED';

    const nowTime = new Date().toLocaleTimeString('sr-RS', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newHistoryEntry = {
      time: nowTime,
      type: 'verified',
      badge: addressChanged ? 'Izmenjena Adresa' : 'Verifikovano',
      title: addressChanged ? 'Kupac ažurirao podatke i potvrdio' : 'Kupac je potvrdio adresu',
      desc: addressChanged
        ? `Kupac je uneo izmene: ${newAddressDisplay}${body.order_note ? ' · Napomena: ' + body.order_note : ''}. Spremno za slanje.`
        : 'Podaci su tačni. Porudžbina je potvrđena i spremna za prelazak u Processing.',
    };

    let dbStatus = 'NOT_ATTEMPTED';
    let dbError: any = null;

    // 1. Persist approval and updated address directly into Supabase database FIRST (Immediate & Reliable)
    if (supabaseUrl && supabaseKey) {
      try {
        let existingHistory: any[] = [];
        let existingShipping: any = {};
        let rowFound = false;
        const filterQuery = payload.apiKey
          ? `merchant_api_key=eq.${encodeURIComponent(payload.apiKey)}&order_id=eq.${encodeURIComponent(String(orderIdNum))}`
          : `order_id=eq.${encodeURIComponent(String(orderIdNum))}`;

        const getRes = await fetch(`${supabaseUrl}/rest/v1/orders?${filterQuery}&limit=1`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Accept': 'application/json',
          },
        });

        if (getRes.ok) {
          const rows = await getRes.json();
          if (Array.isArray(rows) && rows[0]) {
            rowFound = true;
            existingHistory = Array.isArray(rows[0].history) ? rows[0].history : [];
            existingShipping = typeof rows[0].shipping_address === 'object' && rows[0].shipping_address ? rows[0].shipping_address : {};
          }
        }

        const mergedHistory = [...existingHistory, newHistoryEntry];
        const updatedShipping = {
          ...existingShipping,
          address_1: finalAddr1,
          address_2: finalAddr2,
          city: finalCity,
          postcode: finalPostcode,
          customer_note: body.order_note || undefined,
        };

        if (rowFound) {
          const patchRes = await fetch(`${supabaseUrl}/rest/v1/orders?${filterQuery}`, {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              status: finalStatus,
              address: newAddressDisplay,
              city: finalCity,
              shipping_address: updatedShipping,
              response_time: '35 sek',
              warehouse_action: addressChanged
                ? 'Izmenjena adresa · Spremno za slanje · WooCommerce status "Processing"'
                : 'Potvrđeno bez izmena · Spremno za slanje · WooCommerce status "Processing"',
              history: mergedHistory,
              updated_at: new Date().toISOString(),
            }),
          });
          dbStatus = `PATCH_${patchRes.status}`;
          if (!patchRes.ok) {
            dbError = await patchRes.text().catch(() => '');
            console.warn('[SUPABASE PATCH ERROR]:', patchRes.status, dbError);
          }
        } else {
          // If the order wasn't previously in database, insert it directly with verified status!
          const insertRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              merchant_api_key: payload.apiKey || '',
              order_id: String(orderIdNum),
              customer_name: payload.customerName || 'Kupac',
              customer_phone: payload.customerPhone || '',
              city: finalCity,
              address: newAddressDisplay,
              shipping_address: updatedShipping,
              total_amount: Number(payload.totalAmount) || 0,
              currency: payload.currency || 'RSD',
              status: finalStatus,
              channel: 'SMS',
              response_time: '35 sek',
              warehouse_action: addressChanged
                ? 'Izmenjena adresa · Spremno za slanje · WooCommerce status "Processing"'
                : 'Potvrđeno bez izmena · Spremno za slanje · WooCommerce status "Processing"',
              history: mergedHistory,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }),
          });
          dbStatus = `INSERT_${insertRes.status}`;
          if (!insertRes.ok) {
            dbError = await insertRes.text().catch(() => '');
            console.warn('[SUPABASE INSERT APPROVED ERROR]:', insertRes.status, dbError);
          }
        }
      } catch (dbErr: any) {
        console.warn('[SUPABASE SUBMIT UPDATE ERROR]:', dbErr?.message || dbErr);
      }
    }

    // 2. In-memory fallback & notify intercept container
    const centralOrders = (global as any).__potvrdio_orders || [];
    const foundOrder = centralOrders.find((o: any) => o.id === `#${payload.orderId}` || o.id === payload.orderId);
    if (foundOrder) {
      foundOrder.status = finalStatus;
      foundOrder.responseTime = '35 sek';
      foundOrder.warehouseAction = addressChanged
        ? 'Izmenjena adresa · Spremno za slanje · WooCommerce status "Processing"'
        : 'Potvrđeno bez izmena · Spremno za slanje · WooCommerce status "Processing"';
      if (Array.isArray(foundOrder.history)) {
        foundOrder.history.push(newHistoryEntry);
      }
    }

    try {
      fetch('https://potvrdio.online/api/v1/orders/intercept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STATUS',
          order_id: orderIdNum,
          status: finalStatus,
          updated_address: {
            address_1: finalAddr1,
            address_2: finalAddr2,
            city: finalCity,
            postcode: finalPostcode,
            customer_note: body.order_note || undefined,
          },
        }),
      }).catch(() => {});
    } catch {}

    // 3. Attempt direct outbound webhook to merchant store (with strict 2.5s timeout)
    let wooSuccess = false;
    let wooError = null;

    if (storeDomain && orderIdNum && apiSecret) {
      try {
        const webhookPayload = JSON.stringify({
          order_id: orderIdNum,
          action: addressChanged ? 'UPDATED_ADDRESS' : 'APPROVED',
          status: 'processing',
          updated_address: {
            address_1: finalAddr1,
            address_2: finalAddr2,
            city: finalCity,
            postcode: finalPostcode,
          },
          address_1: finalAddr1,
          address_2: finalAddr2,
          city: finalCity,
          postcode: finalPostcode,
          order_note: body.order_note || undefined,
          customer_note: body.order_note || undefined,
          timestamp: Math.floor(Date.now() / 1000),
        });

        const signature = crypto.createHmac('sha256', apiSecret).update(webhookPayload).digest('hex');

        let wooRes = await fetch(`${storeDomain}/wp-json/potvrdio/v1/webhook`, {
          method: 'POST',
          signal: AbortSignal.timeout(2500),
          headers: {
            'Content-Type': 'application/json',
            'X-Potvrdio-Signature': signature,
            'X-Potvrdio-Api-Key': payload.apiKey || '',
          },
          body: webhookPayload,
        }).catch((err) => {
          wooError = err?.message;
          return null;
        });

        if (!wooRes || wooRes.status === 404) {
          wooRes = await fetch(`${storeDomain}/wp-json/potvrdio/v1/order/confirm`, {
            method: 'POST',
            signal: AbortSignal.timeout(2500),
            headers: {
              'Content-Type': 'application/json',
              'X-Potvrdio-Signature': signature,
              'X-Potvrdio-Api-Key': payload.apiKey || '',
            },
            body: webhookPayload,
          }).catch((err) => {
            wooError = err?.message;
            return null;
          });
        }

        if (wooRes && wooRes.ok) {
          wooSuccess = true;
          wooError = null;
        } else if (wooRes && !wooRes.ok) {
          wooError = await wooRes.text().catch(() => 'WooCommerce rejection');
        }
      } catch (err: any) {
        wooError = err?.message;
      }
    }

    return res.status(200).json({
      success: true,
      confirmed: true,
      order_id: orderIdNum,
      woo_notified: wooSuccess,
      woo_error: wooError,
      address_changed: addressChanged,
      db_status: dbStatus,
      db_error: dbError,
      message: 'Adresa je uspešno potvrđena. Paket je spreman za pakovanje i slanje.',
    });
  }

  return res.status(404).json({ error: 'Endpoint not found' });
}
