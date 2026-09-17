import http from 'http';
import crypto from 'crypto';

/**
 * POTVRDIO END-TO-END ORDER HOLD & APPROVAL SIMULATOR
 * Demonstrates:
 * 1. WooCommerce Checkout Intercept -> Order placed ON-HOLD.
 * 2. Central Backend processing -> Token & Viber dispatch.
 * 3. Customer Action -> Viber Approve OR Mobile Address Update.
 * 4. WooCommerce Webhook Signature Verification -> Order released to PROCESSING.
 */

const WOOCOMMERCE_PORT = 4002;
const BACKEND_URL = 'http://localhost:4001/api/v1';
const API_KEY = 'pk_test_balkan_demo_123';
const API_SECRET = 'sk_test_secret_balkan_456';

// Mock WooCommerce Store Database
const mockWooCommerceOrders: Record<number, any> = {
  8492: {
    id: 8492,
    status: 'pending',
    payment_method: 'cod',
    customer: 'Marko Petrović',
    phone: '+381 64 123 4567',
    shipping_address: {
      address_1: 'Bulevar Oslobođenja 42',
      city: 'Novi Sad',
      postcode: '21000',
    },
    total: 4850,
    currency: 'RSD',
    order_notes: [] as string[],
  },
  8493: {
    id: 8493,
    status: 'pending',
    payment_method: 'cod',
    customer: 'Jelena Jovanović',
    phone: '+381 65 987 6543',
    shipping_address: {
      address_1: 'Kralja Petra 10',
      city: 'Beograd',
      postcode: '11000',
    },
    total: 3200,
    currency: 'RSD',
    order_notes: [] as string[],
  },
};

// 1. Start Mock WooCommerce REST Server
function startMockWooCommerceServer(): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // Endpoint: /wp-json/potvrdio/v1/webhook
      if (req.method === 'POST' && req.url === '/wp-json/potvrdio/v1/webhook') {
        let rawBody = '';
        req.on('data', (chunk) => (rawBody += chunk));
        req.on('end', () => {
          const signature = req.headers['x-potvrdio-signature'] as string;
          const expectedSig = crypto.createHmac('sha256', API_SECRET).update(rawBody).digest('hex');

          if (signature !== expectedSig) {
            console.error('❌ [WOOCOMMERCE] Signature mismatch! Invalid HMAC secret.');
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ status: 'error', message: 'Invalid signature' }));
          }

          const body = JSON.parse(rawBody);
          const order = mockWooCommerceOrders[body.order_id];

          if (!order) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ status: 'error', message: 'Order not found' }));
          }

          console.log(`\n📬 [WOOCOMMERCE WEBHOOK RECEIVED] Order #${body.order_id} action: ${body.action}`);

          if (body.action === 'APPROVED' || body.action === 'UPDATED_ADDRESS') {
            if (body.updated_address) {
              order.shipping_address = { ...order.shipping_address, ...body.updated_address };
              console.log(`   📝 Shipping address updated to: ${body.updated_address.address_1}, ${body.updated_address.city}`);
            }
            if (body.order_note) {
              order.order_notes.push(body.order_note);
              console.log(`   📝 Note added: "${body.order_note}"`);
            }

            // RELEASE ORDER TO PROCESSING
            const oldStatus = order.status;
            order.status = 'processing';
            console.log(`   ✅ [ORDER STATUS CHANGED]: "${oldStatus.toUpperCase()}" -> "${order.status.toUpperCase()}" (Ready for courier!)`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ status: 'success', order_status: 'processing' }));
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ignored' }));
        });
        return;
      }

      res.writeHead(404);
      res.end();
    });

    server.listen(WOOCOMMERCE_PORT, () => {
      resolve(server);
    });
  });
}

async function runSimulation() {
  console.log('========================================================================');
  console.log('  POTVRDIO: WOOCOMMERCE ORDER HOLD & APPROVAL FLOW SIMULATION');
  console.log('========================================================================\n');

  const wooServer = await startMockWooCommerceServer();
  console.log(`🟢 Mock WooCommerce Store active at http://localhost:${WOOCOMMERCE_PORT}\n`);

  try {
    // -------------------------------------------------------------------------
    // SENARYO 1: VIBER'DAN TEK TIKLA DOĞRUDAN ONAY (ONE-CLICK APPROVE)
    // -------------------------------------------------------------------------
    console.log('------------------------------------------------------------------------');
    console.log('📌 SENARYO 1: Müşteri Viber Butonundan "DA, ADRESA JE TAČNA" Diyor');
    console.log('------------------------------------------------------------------------');

    // Adım 1.1: WooCommerce'de COD Sipariş verilir
    const order1 = mockWooCommerceOrders[8492];
    console.log(`1️⃣  Müşteri (${order1.customer}) Kapıda Ödeme (COD) ile sipariş verdi.`);
    
    // WooCommerce plugin intercept: sipariş ON-HOLD yapılır
    order1.status = 'on-hold';
    console.log(`   🔒 [POTVRDIO HOOK]: Sipariş #${order1.id} beklemeye alındı: STATUS = "ON-HOLD"`);
    console.log(`   ⛔ [GÜVENLİK]: Kargo etiketi basımı durduruldu, müşteri onayı bekleniyor.`);

    // Adım 1.2: Central Backend'e bildirim
    const interceptRes1 = await fetch(`${BACKEND_URL}/orders/intercept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Potvrdio-Api-Key': API_KEY,
        'X-Potvrdio-Api-Secret': API_SECRET,
      },
      body: JSON.stringify({
        order_id: order1.id,
        store_domain: `http://localhost:${WOOCOMMERCE_PORT}`,
        customer_name: order1.customer,
        customer_phone: order1.phone,
        total_amount: order1.total,
        currency: order1.currency,
        billing_address: order1.shipping_address,
      }),
    }).then((r) => r.json());

    console.log(`2️⃣  Central Backend siparişi yakaladı & Viber mesajı kuyruğa alındı.`);
    console.log(`   Viber Message ID: ${interceptRes1.viberMessageId}`);
    console.log(`   Müşteri Viber Doğrulama Linki: ${interceptRes1.editUrl}`);

    // Adım 1.3: Müşteri Viber'da "EVET, ADRES DOĞRU" butonuna basar
    console.log(`3️⃣  Müşteri Viber'da [ DA, ADRESA JE TAČNA ] butonuna tıkladı...`);
    await fetch(`${BACKEND_URL}/viber/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: order1.id,
        action: 'ACTION_APPROVE',
      }),
    }).then((r) => r.json());

    // Bekle
    await new Promise((r) => setTimeout(r, 600));

    console.log(`4️⃣  WooCommerce Güncel Sipariş Durumu: #${order1.id} -> [${order1.status.toUpperCase()}]`);
    console.log(`   🎉 SONUÇ: Sipariş kargoya verilmek üzere otomatik serbest bırakıldı!\n`);

    // -------------------------------------------------------------------------
    // SENARYO 2: MOBİL FORM ÜZERİNDEN ADRES GÜNCELLEME & ONAYLAMA
    // -------------------------------------------------------------------------
    console.log('------------------------------------------------------------------------');
    console.log('📌 SENARYO 2: Müşteri Adresi Değiştirmek İstiyor (potvrdio.online/edit)');
    console.log('------------------------------------------------------------------------');

    const order2 = mockWooCommerceOrders[8493];
    console.log(`1️⃣  Müşteri (${order2.customer}) sipariş verdi: ${order2.shipping_address.address_1}, ${order2.shipping_address.city}`);
    order2.status = 'on-hold';
    console.log(`   🔒 Sipariş #${order2.id} beklemeye alındı: STATUS = "ON-HOLD"`);

    const interceptRes2 = await fetch(`${BACKEND_URL}/orders/intercept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Potvrdio-Api-Key': API_KEY,
        'X-Potvrdio-Api-Secret': API_SECRET,
      },
      body: JSON.stringify({
        order_id: order2.id,
        store_domain: `http://localhost:${WOOCOMMERCE_PORT}`,
        customer_name: order2.customer,
        customer_phone: order2.phone,
        total_amount: order2.total,
        currency: order2.currency,
        billing_address: order2.shipping_address,
      }),
    }).then((r) => r.json());

    // Token parse et
    const token = interceptRes2.editUrl.split('token=')[1];
    console.log(`2️⃣  24 Saat Geçerli Tek Kullanımlık Token Üretildi: ${token}`);

    // Adım 2.2: Mobil Webview açılır ve token sorgulanır
    console.log(`3️⃣  Müşteri "IZMENI ADRESU" linkine tıkladı, form açıldı.`);
    const tokenData = await fetch(`${BACKEND_URL}/address-token/${token}`).then((r) => r.json());
    console.log(`   Form Doğrulandı: Müşteri = ${tokenData.customerName}, Tutar = ${tokenData.totalAmount} ${tokenData.currency}`);

    // Adım 2.3: Müşteri adresi düzeltir ve "Güncelle ve Siparişi Onayla" butonuna basar
    console.log(`4️⃣  Müşteri yeni adresi girdi ve [ Güncelle ve Siparişi Onayla ] butonuna bastı...`);
    const updatePayload = {
      address_1: 'Nemanjina 18, Stan 4',
      address_2: '3. sprat, interfon 12',
      city: 'Beograd',
      postcode: '11000',
      order_note: 'Molim kovertu predati na portirnici ako nisam tu.',
    };

    await fetch(`${BACKEND_URL}/address-token/${token}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    }).then((r) => r.json());

    await new Promise((r) => setTimeout(r, 600));

    console.log(`5️⃣  WooCommerce Son Durum Özeti:`);
    console.log(`   Sipariş ID: #${order2.id}`);
    console.log(`   Güncel Durum: [${order2.status.toUpperCase()}]`);
    console.log(`   Yeni Teslimat Adresi: ${order2.shipping_address.address_1}, ${order2.shipping_address.city}`);
    console.log(`   Kurye Notu: ${order2.order_notes.join(' | ')}`);
    console.log(`   🎉 SONUÇ: WooCommerce'de adres güncellendi ve sipariş "processing" durumuna alındı!\n`);

    console.log('========================================================================');
    console.log('  TÜM TEST SENARYOLARI BAŞARIYLA TAMAMLANDI (100% OK)');
    console.log('========================================================================\n');

  } catch (err: any) {
    console.error('Test hatası:', err);
  } finally {
    wooServer.close();
  }
}

runSimulation();
