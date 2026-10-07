import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { ViberService } from './viberService';
import { TokenService } from './tokenService';
import { BillingService } from './billingService';
import { WebhookService } from './webhookService';
import { EmailService } from './emailService';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const viberService = ViberService.getInstance();
const tokenService = TokenService.getInstance();
const billingService = BillingService.getInstance();
const webhookService = WebhookService.getInstance();
const emailService = EmailService.getInstance();

// In-memory registry for intercepted store associations
const orderStoreRegistry = new Map<string, { storeDomain: string; apiSecret: string }>();

// Pre-seed persistent test token for mobile-address-app live testing
tokenService.setToken('test_token_123', {
  orderId: 'TEST-101',
  storeDomain: 'prodavnica.rs',
  customerName: 'Atıl Bilge',
  customerPhone: '+381616036556',
  address1: 'Knez Mihailova 42',
  address2: 'Stan 12, 3. sprat',
  city: 'Beograd',
  postcode: '11000',
  totalAmount: 4850,
  currency: 'RSD',
});

// Pre-seed persistent token specifically for Address Change testing (missing house number / apt)
tokenService.setToken('test_token_change', {
  orderId: 'TEST-202',
  storeDomain: 'prodavnica.rs',
  customerName: 'Milica Jovanović',
  customerPhone: '+381616036556',
  address1: 'Bulevar Kralja Aleksandra bb', // 'bb' = without number, needs correction!
  address2: '',
  city: 'Beograd',
  postcode: '11000',
  totalAmount: 6490,
  currency: 'RSD',
});

// Healthcheck
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', service: 'Potvrdio Central Backend API', timestamp: new Date() });
});

/**
 * 0. Central Store & System Dynamic Status Engine (State Machine)
 * Endpoint: GET /api/v1/store/status
 */
app.get('/api/v1/store/status', (req: Request, res: Response) => {
  const apiKey = (req.headers['x-potvrdio-api-key'] as string) || (req.query.api_key as string) || 'demo_api_key_123';
  const merchant = billingService.getMerchant(apiKey);

  const systemState = process.env.SYSTEM_STATE || 'STATE_3';
  const viberStatus = process.env.VIBER_STATUS || 'PENDING_OPERATOR_APPROVAL';
  const viberAppId = process.env.VIBER_APPLICATION_ID || '#Vn4snFkTw99g4i5m';
  const activeChannel = (systemState === 'STATE_3' || viberStatus !== 'ACTIVE') ? 'SMS_LINK' : 'VIBER_INTERACTIVE';

  const planType = merchant?.planType || 'GROWTH';
  const smsMultiplier = billingService.getRequiredCredits(planType, 'SMS');

  res.json({
    system_state: systemState,
    viber_status: viberStatus,
    viber_application_id: viberAppId,
    active_channel: activeChannel,
    messaging_provider: viberService.getGatewayManager().getProviderName(),
    banner: {
      sr: 'Viber Business nalog je u toku verifikacije operatera (#Vn4snFkTw99g4i5m). Vaše COD porudžbine su zaštićene putem SMS mobilnog linka.',
      en: 'Viber Business account is undergoing operator verification (#Vn4snFkTw99g4i5m). COD orders are active via SMS mobile link.',
    },
    credit_rules: {
      viber_cost: 1,
      sms_cost: smsMultiplier,
      merchant_plan: planType,
      credits_remaining: merchant?.messageCreditsRemaining ?? 0,
    },
  });
});

/**
 * 1. WooCommerce Intercepted Order Receiver
 * Endpoint: POST /api/v1/orders/intercept
 */
app.post('/api/v1/orders/intercept', async (req: Request, res: Response) => {
  const apiKey = (req.headers['x-potvrdio-api-key'] as string) || 'demo_api_key_123';
  const {
    order_id,
    store_domain,
    store_name,
    customer_name,
    customer_phone,
    billing_address,
    shipping_address,
    total_amount,
    currency,
    items,
  } = req.body;

  if (!order_id || !customer_phone) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  // Store association for return webhook
  const apiSecret = (req.headers['x-potvrdio-api-secret'] as string) || 'demo_secret_456';
  orderStoreRegistry.set(String(order_id), {
    storeDomain: store_domain || 'http://localhost:3000',
    apiSecret,
  });

  const isState3 = (process.env.SYSTEM_STATE || 'STATE_3') === 'STATE_3' || process.env.VIBER_STATUS !== 'ACTIVE';
  const targetChannel: 'VIBER' | 'SMS' = isState3 ? 'SMS' : 'VIBER';

  // Deduct credits from merchant balance pool based on channel and package
  const creditStatus = billingService.deductCreditWithGrace(apiKey, targetChannel);
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

  const resolvedAddress1 = shipping_address?.address_1 || billing_address?.address_1 || '';
  const resolvedAddress2 = shipping_address?.address_2 || billing_address?.address_2 || '';
  const resolvedCity = shipping_address?.city || billing_address?.city || 'Beograd';
  const resolvedPostcode = shipping_address?.postcode || billing_address?.postcode || '11000';

  // Create 24-hour single-use token for address edit link
  const token = tokenService.createToken({
    orderId: String(order_id),
    storeDomain: store_domain || 'http://localhost:3000',
    storeName: store_name,
    apiSecret,
    customerName: customer_name,
    customerPhone: customer_phone,
    address1: resolvedAddress1,
    address2: resolvedAddress2,
    city: resolvedCity,
    postcode: resolvedPostcode,
    totalAmount: total_amount || 0,
    currency: currency || 'RSD',
  });

  // Trigger Viber Business API verification message
  const result = await viberService.sendVerificationMessage({
    orderId: String(order_id),
    storeDomain: store_domain || 'http://localhost:3000',
    storeName: store_name,
    customerName: customer_name,
    customerPhone: customer_phone,
    totalAmount: total_amount || 0,
    currency: currency || 'RSD',
    address: resolvedAddress1,
    city: resolvedCity,
    token,
  });

  // Parallel & non-blocking Email notification via Brevo
  const customerEmail = req.body.customer_email || billing_address?.email || req.body.email || process.env.TEST_NOTIFICATION_EMAIL;
  if (customerEmail) {
    emailService.sendOrderVerificationEmail({
      orderId: String(order_id),
      storeName: store_name,
      storeDomain: store_domain,
      customerName: customer_name,
      customerPhone: customer_phone,
      customerEmail,
      editUrl: result.editUrl,
      totalAmount: total_amount || 0,
      currency: currency || 'RSD',
      address: resolvedAddress1,
      city: resolvedCity,
      items: Array.isArray(items) ? items : undefined,
    }).catch((err) => {
      console.warn('[EMAIL NOTIFICATION NON-BLOCKING WARNING]', err?.message || err);
    });
  }

  // Parallel & non-blocking Simulation Email dispatching exact Viber & SMS texts for testing review
  const adminTestEmail = process.env.TEST_NOTIFICATION_EMAIL || customerEmail;
  if (adminTestEmail) {
    emailService.sendSimulationEmail({
      orderId: String(order_id),
      storeName: store_name,
      storeDomain: store_domain,
      customerName: customer_name,
      customerPhone: customer_phone,
      recipientEmail: adminTestEmail,
      totalAmount: total_amount || 0,
      currency: currency || 'RSD',
      address: resolvedAddress1,
      city: resolvedCity,
      editUrl: result.editUrl,
    }).catch((err) => {
      console.warn('[SIMULATION EMAIL NON-BLOCKING WARNING]', err?.message || err);
    });
  }

  res.json({
    success: true,
    message: 'Order intercepted and verification dispatched',
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
    storeName: session.storeName,
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

  const session = tokenService.consumeToken(token, {
    address1: address_1,
    address2: address_2,
    city,
    postcode,
  });
  if (!session) {
    return res.status(400).json({ error: 'Nevažeći ili istekao token za slanje' });
  }

  viberService.markStatus(session.orderId, 'APPROVED');

  console.log(`[ADDRESS UPDATED & APPROVED] Order #${session.orderId} updated to: ${address_1}, ${city}. Releasing order to Processing in WooCommerce!`);

  // Dispatch signed webhook to WooCommerce to update shipping address & transition to Processing
  await webhookService.dispatchToWooCommerce(session.storeDomain, session.apiSecret || 'demo_secret_456', {
    order_id: parseInt(String(session.orderId).replace(/\D/g, ''), 10) || 101,
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
    order_id: parseInt(String(session.orderId).replace(/\D/g, ''), 10) || 101,
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

/**
 * 6. Infobip DLR (Delivery Report) Webhook Receiver
 * Endpoint: POST /api/v1/messaging/webhook/infobip
 */
app.post('/api/v1/messaging/webhook/infobip', (req: Request, res: Response) => {
  const gatewayManager = viberService.getGatewayManager();
  const result = gatewayManager.handleInfobipDlr(req.body);
  res.json({ success: true, matched: result.matched });
});

/**
 * 7. BulkGate DLR (Delivery Report) Webhook Receiver
 * Endpoint: POST /api/v1/messaging/webhook/bulkgate
 */
app.post('/api/v1/messaging/webhook/bulkgate', (req: Request, res: Response) => {
  const gatewayManager = viberService.getGatewayManager();
  const result = gatewayManager.handleBulkGateDlr(req.body);
  res.json({ success: true, matched: result.matched });
});

/**
 * 8. Message Delivery Status Query
 * Endpoint: GET /api/v1/messaging/status/:id
 */
app.get('/api/v1/messaging/status/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const gatewayManager = viberService.getGatewayManager();
  const record = gatewayManager.getRecord(id);

  if (!record) {
    return res.status(404).json({ error: 'Message not found' });
  }

  res.json(record);
});

app.listen(PORT, () => {
  console.log(`🚀 Potvrdio Central API Server listening on port ${PORT}`);
});

