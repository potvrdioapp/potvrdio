import crypto from 'crypto';

export interface WebhookPayload {
  order_id: number;
  action: 'APPROVED' | 'UPDATED_ADDRESS';
  updated_address?: {
    address_1?: string;
    address_2?: string;
    city?: string;
    postcode?: string;
  };
  order_note?: string;
  timestamp: number;
}

export class WebhookService {
  private static instance: WebhookService;

  public static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  /**
   * Dispatches signed webhook payload to WooCommerce store
   */
  public async dispatchToWooCommerce(
    storeDomain: string,
    apiSecret: string,
    payload: WebhookPayload
  ): Promise<{ success: boolean; responseStatus?: number; data?: any }> {
    const cleanUrl = storeDomain.replace(/\/+$/, '');
    const targetUrl = `${cleanUrl}/wp-json/potvrdio/v1/webhook`;
    const bodyString = JSON.stringify(payload);

    // Compute HMAC-SHA256 signature
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(bodyString)
      .digest('hex');

    console.log(`[WEBHOOK DISPATCH] Sending to ${targetUrl} (Order #${payload.order_id}, Action: ${payload.action})`);

    try {
      // Use native fetch (Node 18+)
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Potvrdio-Signature': signature,
        },
        body: bodyString,
      });

      const data = await response.json().catch(() => ({}));
      console.log(`[WEBHOOK RESPONSE] Status: ${response.status}`, data);

      return {
        success: response.ok,
        responseStatus: response.status,
        data,
      };
    } catch (err: any) {
      console.warn(`[WEBHOOK NETWORK ERROR] Could not reach WooCommerce store at ${targetUrl}: ${err.message}`);
      return {
        success: false,
        data: { error: err.message },
      };
    }
  }
}
