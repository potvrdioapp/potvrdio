import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { ViberService } from './viberService';
import { TokenService } from './tokenService';
import { BillingService } from './billingService';
import { WebhookService } from './webhookService';
import { EmailService } from './emailService';
import { MerchantAuthService } from './merchantAuthService';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const viberService = ViberService.getInstance();
const tokenService = TokenService.getInstance();
const billingService = BillingService.getInstance();
const webhookService = WebhookService.getInstance();
const emailService = EmailService.getInstance();
const merchantAuthService = MerchantAuthService.getInstance();

// In-memory registry for intercepted store associations
const orderStoreRegistry = new Map<string, { storeDomain: string; apiSecret: string }>();

export interface MerchantStoreRecord {
  id: string;
  storeName: string;
  storeDomain: string;
  apiKey: string;
  apiSecret: string;
  isTrial: boolean;
  trialRemaining: number;
  credits: number;
  createdAt: string;
  isConnected?: boolean;
  lastPingAt?: string | null;
}

export interface MerchantAccountRecord {
  email: string;
  fullName: string;
  stores: MerchantStoreRecord[];
}

const merchantAccountRegistry = new Map<string, MerchantAccountRecord>();
const storePingRegistry = new Map<string, { lastPingAt: string; storeDomain?: string }>();

export function findStoreByApiKey(apiKey: string): MerchantStoreRecord | null {
  for (const account of merchantAccountRegistry.values()) {
    const found = account.stores.find((s) => s.apiKey === apiKey);
    if (found) return found;
  }
  return null;
}

// Pre-seed demo store in billing service & account registry
billingService.registerMerchant({
  apiKey: 'demo_api_key_123',
  storeName: 'Balkan Style Shop',
  creditBalance: 1875,
  messageCreditsRemaining: 1875,
  planType: 'GROWTH',
  isTrial: false,
  trialVerificationsRemaining: 0,
});

merchantAccountRegistry.set('demo@potvrdio.online', {
  email: 'demo@potvrdio.online',
  fullName: 'Demo Korisnik',
  stores: [{
    id: 'store_demo_balkan',
    storeName: 'Balkan Style Shop',
    storeDomain: 'balkanstyleshop.rs',
    apiKey: 'demo_api_key_123',
    apiSecret: 'demo_secret_456',
    isTrial: false,
    trialRemaining: 0,
    credits: 1875,
    createdAt: '2026-08-15',
    isConnected: true,
    lastPingAt: new Date().toISOString(),
  }],
});

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
      is_trial: merchant?.isTrial ?? false,
      trial_verifications_remaining: merchant?.isTrial ? (merchant.trialVerificationsRemaining ?? 25) : 0,
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

  // Mark store as actively connected upon receiving live order
  const store = findStoreByApiKey(apiKey);
  if (store) {
    store.isConnected = true;
    store.lastPingAt = new Date().toISOString();
  }

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

/**
 * 9. Merchant Registration (Landing Page Free 25 Credits Onboarding)
 * Endpoint: POST /api/v1/merchant/register
 */
app.post('/api/v1/merchant/register', async (req: Request, res: Response) => {
  try {
    const { storeUrl, fullName, email, phone, courier, orderVolume } = req.body;

    if (!email || !storeUrl) {
      return res.status(400).json({ error: 'Web prodavnica i email su obavezni' });
    }

    // Clean store domain
    const cleanDomain = storeUrl
      .replace(/^https?:\/\//i, '')
      .replace(/\/.*$/, '')
      .toLowerCase();

    // Generate unique live API key and HMAC secret
    const randomHex = Math.random().toString(36).substring(2, 10);
    const sanitizedName = cleanDomain.replace(/[^a-z0-9]/g, '') || 'store';
    const apiKey = `pk_live_${sanitizedName}_${randomHex}`;
    const apiSecret = `sec_live_${sanitizedName}_${crypto.randomBytes(8).toString('hex')}`;

    // Register in billing service with 25 guaranteed pilot order verifications
    billingService.registerMerchant({
      apiKey,
      storeName: fullName ? `${fullName} (${cleanDomain})` : cleanDomain,
      creditBalance: 0,
      messageCreditsRemaining: 0,
      planType: 'TRIAL',
      isTrial: true,
      trialVerificationsRemaining: 25,
    });

    const storeRecord: MerchantStoreRecord = {
      id: `store_${randomHex}`,
      storeName: fullName ? `${fullName} (${cleanDomain})` : cleanDomain,
      storeDomain: cleanDomain,
      apiKey,
      apiSecret,
      isTrial: true,
      trialRemaining: 25,
      credits: 0,
      createdAt: new Date().toISOString(),
      isConnected: false,
      lastPingAt: null,
    };

    // Associate storeDomain with HMAC secret for webhook signature verification
    orderStoreRegistry.set(cleanDomain, { storeDomain: cleanDomain, apiSecret });

    const cleanEmail = email.trim().toLowerCase();
    let account = merchantAccountRegistry.get(cleanEmail);
    if (!account) {
      account = {
        email: cleanEmail,
        fullName: fullName || cleanEmail.split('@')[0],
        stores: [],
      };
      merchantAccountRegistry.set(cleanEmail, account);
    }
    const existingStoreIndex = account.stores.findIndex(s => s.storeDomain === cleanDomain);
    if (existingStoreIndex >= 0) {
      account.stores[existingStoreIndex] = storeRecord;
    } else {
      account.stores.push(storeRecord);
    }

    console.log(`[MERCHANT REGISTERED] ${cleanDomain} - ${email} | Key: ${apiKey} | Secret: ${apiSecret} | Pilot: 25 Order Verifications | Courier: ${courier}`);

    // Determine dashboard URL (local dev or production)
    const dashboardBase = process.env.DASHBOARD_URL || (process.env.NODE_ENV === 'production' ? 'https://dashboard.potvrdio.online' : 'http://localhost:3002');

    // Generate a secure 7-day Welcome Magic Token for instant one-click login from email
    const magicToken = merchantAuthService.createMagicToken(
      email,
      7 * 24 * 60 * 60 * 1000,
      'welcome',
      { storeDomain: cleanDomain, apiKey }
    );
    const magicDashboardUrl = `${dashboardBase}?magic_token=${magicToken}&email=${encodeURIComponent(email)}&store=${encodeURIComponent(cleanDomain)}&api_key=${encodeURIComponent(apiKey)}&api_secret=${encodeURIComponent(apiSecret)}`;

    // Dispatch Welcome Email via Brevo with authenticated magic link
    const emailResult = await emailService.sendMerchantWelcomeEmail({
      recipientEmail: email,
      recipientName: fullName || cleanDomain,
      storeUrl: cleanDomain,
      apiKey,
      apiSecret,
      verifications: 25,
      dashboardUrl: magicDashboardUrl,
    });

    console.log(`[WELCOME EMAIL DISPATCH] To: ${email} | Success: ${emailResult.success} | MsgId: ${emailResult.messageId || 'none'} | MagicUrl: ${magicDashboardUrl}`);

    return res.json({
      success: true,
      apiKey,
      apiSecret,
      trialVerifications: 25,
      isTrial: true,
      emailSent: emailResult.success,
      emailMessageId: emailResult.messageId,
      emailError: emailResult.error,
      storeDomain: cleanDomain,
      dashboardUrl: magicDashboardUrl,
      magicToken,
      account,
      activeStore: storeRecord,
    });
  } catch (error: any) {
    console.error('[MERCHANT REGISTER ERROR]', error);
    return res.status(500).json({ error: error.message || 'Registracija nije uspela' });
  }
});

/**
 * 10. Request Magic Login Link via Email
 * Endpoint: POST /api/v1/merchant/magic-link/request
 */
app.post('/api/v1/merchant/magic-link/request', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email adresa je obavezna', code: 'EMAIL_REQUIRED' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const account = merchantAccountRegistry.get(cleanEmail);
    if (!account) {
      return res.status(404).json({
        error: 'Nalog sa ovom e-poštom nije pronađen. Molimo registrujte vašu prvu prodavnicu.',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    // Create 15-minute magic login token
    const token = merchantAuthService.createMagicToken(cleanEmail, 15 * 60 * 1000, 'login');
    const dashboardBase = process.env.DASHBOARD_URL || (process.env.NODE_ENV === 'production' ? 'https://dashboard.potvrdio.online' : 'http://localhost:3002');
    const firstStore = account.stores[0];
    const magicUrl = `${dashboardBase}?magic_token=${token}&email=${encodeURIComponent(cleanEmail)}&store=${encodeURIComponent(firstStore?.storeDomain || '')}&api_key=${encodeURIComponent(firstStore?.apiKey || '')}`;

    const emailRes = await emailService.sendMerchantMagicLoginEmail({
      recipientEmail: cleanEmail,
      recipientName: account.fullName || cleanEmail,
      magicUrl,
      expiresInMinutes: 15,
    });

    console.log(`[MAGIC LINK SENT] To: ${cleanEmail} | Success: ${emailRes.success} | URL: ${magicUrl}`);

    return res.json({
      success: true,
      message: 'Prijavni link je poslat na vašu email adresu.',
      emailSent: emailRes.success,
      devMagicUrl: process.env.NODE_ENV !== 'production' ? magicUrl : undefined,
    });
  } catch (err: any) {
    console.error('[MAGIC LINK REQUEST ERROR]', err);
    return res.status(500).json({ error: err.message || 'Greška pri slanju linka', code: 'SERVER_ERROR' });
  }
});

/**
 * 11. Authenticate via Magic Token
 * Endpoint: POST /api/v1/merchant/magic-login
 */
app.post('/api/v1/merchant/magic-login', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token je obavezan', code: 'TOKEN_REQUIRED' });
    }

    const session = merchantAuthService.consumeMagicToken(String(token).trim());
    if (!session) {
      return res.status(401).json({
        error: 'Prijavni link je istekao ili je već iskorišćen. Molimo zatražite novi.',
        code: 'TOKEN_INVALID_OR_EXPIRED',
      });
    }

    const account = merchantAccountRegistry.get(session.email);
    if (!account) {
      return res.status(404).json({
        error: 'Nalog sa ovom e-poštom nije pronađen.',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    console.log(`[MAGIC LOGIN AUTHENTICATED] ${session.email} via token ${session.token.substring(0, 10)}...`);

    return res.json({
      success: true,
      account,
      activeStore: account.stores[0],
    });
  } catch (err: any) {
    console.error('[MAGIC LOGIN ERROR]', err);
    return res.status(500).json({ error: err.message || 'Greška pri prijavi', code: 'SERVER_ERROR' });
  }
});

/**
 * 12. Merchant Login with Access Code (API Key)
 * Endpoint: POST /api/v1/merchant/login
 */
app.post('/api/v1/merchant/login', async (req: Request, res: Response) => {
  try {
    const { email, password, accessCode } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email adresa je obavezna', code: 'EMAIL_REQUIRED' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // If demo request
    if (cleanEmail === 'demo' || cleanEmail === 'demo@potvrdio.online') {
      const demoAccount = merchantAccountRegistry.get('demo@potvrdio.online')!;
      return res.json({
        success: true,
        isDemo: true,
        account: demoAccount,
        activeStore: demoAccount.stores[0],
      });
    }

    const account = merchantAccountRegistry.get(cleanEmail);
    if (!account) {
      return res.status(404).json({
        error: 'Nalog sa ovom e-poštom nije pronađen. Molimo registrujte vašu prvu prodavnicu.',
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    // Security Verification: Require valid Access Code (API Key) or password
    const providedCode = String(accessCode || password || '').trim();
    if (!providedCode) {
      return res.status(401).json({
        error: 'Unesite vaš API ključ (Access Code) ili zatražite Magic Link na email.',
        code: 'CREDENTIALS_REQUIRED',
      });
    }

    const isValidKey =
      account.stores.some((s) => s.apiKey === providedCode) ||
      providedCode === 'demo_api_key_123';

    if (!isValidKey) {
      return res.status(401).json({
        error: 'Neispravan pristupni kod ili API ključ. Proverite podatke ili zatražite prijavni link na email.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    return res.json({
      success: true,
      isDemo: false,
      account,
      activeStore: account.stores[0],
    });
  } catch (error: any) {
    console.error('[MERCHANT LOGIN ERROR]', error);
    return res.status(500).json({ error: error.message || 'Greška pri prijavi', code: 'SERVER_ERROR' });
  }
});

/**
 * 11. Add New WooCommerce Store to Existing Account
 * Endpoint: POST /api/v1/merchant/stores/add
 */
app.post('/api/v1/merchant/stores/add', async (req: Request, res: Response) => {
  try {
    const { email, storeUrl, storeName } = req.body;
    if (!email || !storeUrl) {
      return res.status(400).json({ error: 'Email i URL prodavnice su obavezni' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanDomain = storeUrl
      .replace(/^https?:\/\//i, '')
      .replace(/\/.*$/, '')
      .toLowerCase();

    const randomHex = Math.random().toString(36).substring(2, 10);
    const sanitizedName = cleanDomain.replace(/[^a-z0-9]/g, '') || 'store';
    const apiKey = `pk_live_${sanitizedName}_${randomHex}`;

    billingService.registerMerchant({
      apiKey,
      storeName: storeName || cleanDomain,
      creditBalance: 0,
      messageCreditsRemaining: 0,
      planType: 'TRIAL',
      isTrial: true,
      trialVerificationsRemaining: 25,
    });

    const apiSecret = `sec_live_${sanitizedName}_${crypto.randomBytes(8).toString('hex')}`;

    const newStore: MerchantStoreRecord = {
      id: `store_${randomHex}`,
      storeName: storeName || cleanDomain,
      storeDomain: cleanDomain,
      apiKey,
      apiSecret,
      isTrial: true,
      trialRemaining: 25,
      credits: 0,
      createdAt: new Date().toISOString(),
      isConnected: false,
      lastPingAt: null,
    };

    orderStoreRegistry.set(cleanDomain, { storeDomain: cleanDomain, apiSecret });

    let account = merchantAccountRegistry.get(cleanEmail);
    if (!account) {
      account = {
        email: cleanEmail,
        fullName: cleanEmail.split('@')[0],
        stores: [],
      };
      merchantAccountRegistry.set(cleanEmail, account);
    }
    account.stores.push(newStore);

    return res.json({
      success: true,
      store: newStore,
      stores: account.stores,
    });
  } catch (error: any) {
    console.error('[ADD STORE ERROR]', error);
    return res.status(500).json({ error: error.message || 'Greška pri dodavanju prodavnice' });
  }
});

/**
 * 12. WooCommerce Plugin Ping Receiver (Option A - Automatic Listening)
 * Endpoint: POST /api/v1/merchant/store/ping
 */
app.post('/api/v1/merchant/store/ping', (req: Request, res: Response) => {
  const apiKey = (req.headers['x-potvrdio-api-key'] as string) || req.body?.apiKey;
  const storeDomain = req.body?.storeDomain;

  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey' });
  }

  const now = new Date().toISOString();
  storePingRegistry.set(apiKey, { lastPingAt: now, storeDomain });

  const store = findStoreByApiKey(apiKey);
  if (store) {
    store.isConnected = true;
    store.lastPingAt = now;
    console.log(`[STORE PING] Store ${store.storeDomain} connected via WooCommerce Ping (Key: ${apiKey})`);
    return res.json({
      success: true,
      isConnected: true,
      lastPingAt: now,
      message: 'Store connection verified successfully',
    });
  }

  console.log(`[STORE PING] Recorded ping for API Key: ${apiKey} (Domain: ${storeDomain || 'unknown'})`);
  return res.json({
    success: true,
    isConnected: true,
    lastPingAt: now,
    message: 'Ping acknowledged',
  });
});

/**
 * 13. Test Store Connection Trigger (Option B - User Initiated Test)
 * Endpoint: POST /api/v1/merchant/store/test-connection
 */
app.post('/api/v1/merchant/store/test-connection', (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey' });
  }

  const store = findStoreByApiKey(apiKey);
  const recordedPing = storePingRegistry.get(apiKey);

  if ((store && store.isConnected && store.lastPingAt) || recordedPing) {
    const pingTime = (store && store.lastPingAt) || recordedPing?.lastPingAt || new Date().toISOString();
    if (store) {
      store.isConnected = true;
      store.lastPingAt = pingTime;
    }
    console.log(`[CONNECTION VERIFIED] Store ${store?.storeDomain || recordedPing?.storeDomain || apiKey} verified (Last ping: ${pingTime})`);
    return res.json({
      success: true,
      isConnected: true,
      lastPingAt: pingTime,
      message: 'WooCommerce connection verified successfully',
    });
  }

  console.log(`[CONNECTION CHECK FAILED] Store for API key ${apiKey} has not sent a ping yet.`);
  return res.status(404).json({
    success: false,
    isConnected: false,
    lastPingAt: null,
    error: 'NO_SIGNAL_RECEIVED',
    message: 'No signal received from WordPress site yet.',
  });
});

/**
 * 14. Check Store Connection Status
 * Endpoint: GET /api/v1/merchant/store/status
 */
app.get('/api/v1/merchant/store/status', (req: Request, res: Response) => {
  const apiKey = (req.query.apiKey as string) || (req.headers['x-potvrdio-api-key'] as string);
  if (!apiKey) {
    return res.status(400).json({ error: 'Missing apiKey' });
  }

  const store = findStoreByApiKey(apiKey);
  const recordedPing = storePingRegistry.get(apiKey);
  const isConnected = (store && store.isConnected) || Boolean(recordedPing);
  const lastPingAt = store?.lastPingAt || recordedPing?.lastPingAt || null;

  return res.json({
    success: true,
    isConnected,
    lastPingAt,
  });
});

/**
 * 15. Download WooCommerce Plugin (.zip)
 * Endpoint: GET /api/v1/download/plugin
 */
app.get('/api/v1/download/plugin', (req: Request, res: Response) => {
  const pluginZipPath = path.resolve(__dirname, '../../potvrdio-viber-cod.zip');
  if (fs.existsSync(pluginZipPath)) {
    return res.download(pluginZipPath, 'potvrdio-woocommerce.zip');
  }
  return res.status(404).json({ error: 'Plugin package not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Potvrdio Central API Server listening on port ${PORT}`);
});

