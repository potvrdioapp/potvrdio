import express, { Request, Response } from 'express';
import cors from 'cors';
import { ViberService } from './viberService';
import { TokenService } from './tokenService';
import { BillingService } from './billingService';
import { WebhookService } from './webhookService';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const viberService = ViberService.getInstance();
const tokenService = TokenService.getInstance();
const billingService = BillingService.getInstance();
const webhookService = WebhookService.getInstance();

// In-memory registry for intercepted store associations
const orderStoreRegistry = new Map<string, { storeDomain: string; apiSecret: string }>();

// Healthcheck
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', service: 'Potvrdio Central Backend API', timestamp: new Date() });
});

/**
 * 1. WooCommerce Intercepted Order Receiver
 * Endpoint: POST /api/v1/orders/intercept
 */
app.post('/api/v1/orders/intercept', async (req: Request, res: Response) => {
  const apiKey = (req.headers['x-potvrdio-api-key'] as string) || 'demo_api_key_123';
  const { order_id, store_domain, customer_name, customer_phone, billing_address, total_amount, currency } = req.body;

  if (!order_id || !customer_phone) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  // Store association for return webhook
  const apiSecret = (req.headers['x-potvrdio-api-secret'] as string) || 'demo_secret_456';
  orderStoreRegistry.set(String(order_id), {
    storeDomain: store_domain || 'http://localhost:3000',
    apiSecret,
  });

  // Deduct 1 credit from merchant balance pool with emergency grace buffer
  const creditStatus = billingService.deductCreditWithGrace(apiKey);
  if (creditStatus.exhausted) {
    console.warn(`[CREDIT ALERT] Merchant ${apiKey} has completely exhausted credits & grace buffer!`);
    await webhookService.dispatchToWooCommerce(store_domain || 'http://localhost:3000', apiSecret, {
      order_id: Number(order_id),
      action: 'OUT_OF_CREDITS',
      timestamp: Math.floor(Date.now() / 1000),
    });
    return res.status(402).json({
      error: 'Krediti na nalogu su istekli. Molimo dopunite kredite na Potvrdio dashboard-u.',
      creditsRemaining: 0,
      exhausted: true
    });
  }

  // Create 24-hour single-use token for address edit link
  const token = tokenService.createToken({
    orderId: String(order_id),
    storeDomain: store_domain || 'http://localhost:3000',
    apiSecret,
    customerName: customer_name,
    customerPhone: customer_phone,
    address1: billing_address?.address_1 || '',
    address2: billing_address?.address_2 || '',
    city: billing_address?.city || 'Beograd',
    postcode: billing_address?.postcode || '11000',
    totalAmount: total_amount || 0,
    currency: currency || 'RSD',
  });

  // Trigger Viber Business API verification message
  const result = await viberService.sendVerificationMessage({
    orderId: String(order_id),
    storeDomain: store_domain || 'http://localhost:3000',
    customerName: customer_name,
    customerPhone: customer_phone,
    totalAmount: total_amount || 0,
    currency: currency || 'RSD',
    address: billing_address?.address_1 || '',
    city: billing_address?.city || 'Beograd',
    token,
  });

  res.json({
    success: true,
    message: 'Order intercepted and Viber message queued',
    viberMessageId: result.messageId,
    editUrl: result.editUrl,
  });
});

/**
 * 2. Viber Interactivity Callback / Webhook Simulation
 * Endpoint: POST /api/v1/viber/webhook
 */
app.post('/api/v1/viber/webhook', async (req: Request, res: Response) => {
  const { order_id, action } = req.body;
  if (!order_id || !action) {
    return res.status(400).json({ error: 'Missing order_id or action' });
  }

  if (action === 'ACTION_APPROVE') {
    viberService.markStatus(order_id, 'APPROVED');
    console.log(`[ACTION_APPROVE] Customer approved order #${order_id} directly in Viber!`);

    // Notify WooCommerce store to transition order from on-hold to processing
    const storeInfo = orderStoreRegistry.get(String(order_id));
    if (storeInfo) {
      await webhookService.dispatchToWooCommerce(storeInfo.storeDomain, storeInfo.apiSecret, {
        order_id: Number(order_id),
        action: 'APPROVED',
        timestamp: Math.floor(Date.now() / 1000),
      });
    }

    return res.json({ status: 'success', action: 'APPROVED', order_id });
  }

  if (action === 'ACTION_CANCEL' || action === 'ACTION_REJECT') {
    viberService.markStatus(order_id, 'REJECTED');
    console.log(`[ACTION_CANCEL] Customer cancelled order #${order_id} directly in Viber!`);

    const storeInfo = orderStoreRegistry.get(String(order_id));
    if (storeInfo) {
      await webhookService.dispatchToWooCommerce(storeInfo.storeDomain, storeInfo.apiSecret, {
        order_id: Number(order_id),
        action: 'CANCELLED',
        timestamp: Math.floor(Date.now() / 1000),
      });
    }

    return res.json({ status: 'success', action: 'CANCELLED', order_id });
  }

  res.json({ status: 'acknowledged' });
});

/**
 * 3. Validate Token for Mobile Address App (potvrdio.online/edit)
 * Endpoint: GET /api/v1/address-token/:token
 */
app.get('/api/v1/address-token/:token', (req: Request, res: Response) => {
  const { token } = req.params;
  const session = tokenService.validateToken(token);

  if (!session) {
    return res.status(404).json({ error: 'Link za izmenu adrese je istekao ili je već iskorišćen (Token expired or invalid)' });
  }

  res.json({
    orderId: session.orderId,
    customerName: session.customerName,
    customerPhone: session.customerPhone,
    address1: session.address1,
    address2: session.address2,
    city: session.city,
    postcode: session.postcode,
    totalAmount: session.totalAmount,
    currency: session.currency,
    expiresAt: session.expiresAt,
  });
});

/**
 * 4. Submit Mobile Address Form & Release WooCommerce Order
 * Endpoint: POST /api/v1/address-token/:token/submit
 */
app.post('/api/v1/address-token/:token/submit', async (req: Request, res: Response) => {
  const { token } = req.params;
  const { address_1, address_2, city, postcode, order_note } = req.body;

  const session = tokenService.consumeToken(token);
  if (!session) {
    return res.status(400).json({ error: 'Nevažeći ili istekao token za slanje' });
  }

  viberService.markStatus(session.orderId, 'APPROVED');

  console.log(`[ADDRESS UPDATED & APPROVED] Order #${session.orderId} updated to: ${address_1}, ${city}. Releasing order to Processing in WooCommerce!`);

  // Dispatch signed webhook to WooCommerce to update shipping address & transition to Processing
  await webhookService.dispatchToWooCommerce(session.storeDomain, session.apiSecret || 'demo_secret_456', {
    order_id: Number(session.orderId),
    action: 'UPDATED_ADDRESS',
    updated_address: {
      address_1,
      address_2,
      city,
      postcode,
    },
    order_note,
    timestamp: Math.floor(Date.now() / 1000),
  });

  res.json({
    success: true,
    message: 'Adresa uspešno ažurirana! Vaša pošiljka je potvrdjena.',
    orderId: session.orderId,
    updatedAddress: {
      address_1,
      address_2,
      city,
      postcode,
    },
    orderNote: order_note,
  });
});

/**
 * 4b. Customer Cancels Order from Mobile Web Link
 * Endpoint: POST /api/v1/address-token/:token/cancel
 */
app.post('/api/v1/address-token/:token/cancel', async (req: Request, res: Response) => {
  const { token } = req.params;
  const session = tokenService.consumeToken(token);
  if (!session) {
    return res.status(400).json({ error: 'Nevažeći ili istekao token za otkazivanje' });
  }

  viberService.markStatus(session.orderId, 'REJECTED');
  console.log(`[CUSTOMER CANCELLED VIA WEB] Order #${session.orderId} cancelled by customer via web link.`);

  await webhookService.dispatchToWooCommerce(session.storeDomain, session.apiSecret || 'demo_secret_456', {
    order_id: Number(session.orderId),
    action: 'CANCELLED',
    timestamp: Math.floor(Date.now() / 1000),
  });

  res.json({
    success: true,
    message: 'Porudžbina je uspešno otkazana. Prodavac i kurir su obavešteni.',
    orderId: session.orderId,
  });
});

/**
 * 5. Billing Webhook Handler (Paddle / Lemon Squeezy Merchant of Record)
 * Endpoint: POST /api/v1/billing/webhook
 */
app.post('/api/v1/billing/webhook', (req: Request, res: Response) => {
  const { merchant_api_key, package_type, amount_euro } = req.body;
  
  let credits = 600; // Starter €15
  if (package_type === 'GROWTH') credits = 1875; // Growth €45
  if (package_type === 'PRO') credits = 6000; // Pro €120
  if (package_type === 'PRO_RESERVE') credits = 1800; // €29/mo

  billingService.processWebhookTopUp(merchant_api_key || 'demo_api_key_123', amount_euro || 15, credits);

  res.json({ status: 'success', message: 'Credits updated successfully' });
});

app.listen(PORT, () => {
  console.log(`🚀 Potvrdio Central API Server listening on port ${PORT}`);
});
