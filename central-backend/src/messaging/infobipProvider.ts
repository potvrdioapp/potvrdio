import { IMessagingProvider, ViberVerificationParams, SmsFallbackParams, SendMessageResult } from './types';

export class InfobipMessagingProvider implements IMessagingProvider {
  public readonly name = 'Infobip';
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly viberSender: string;
  private readonly smsSender: string;

  constructor() {
    this.baseUrl = (process.env.INFOBIP_BASE_URL || 'https://api.infobip.com').replace(/\/+$/, '');
    this.apiKey = process.env.INFOBIP_API_KEY || '';
    this.viberSender = process.env.INFOBIP_VIBER_SENDER || 'Potvrdio';
    this.smsSender = process.env.INFOBIP_SMS_SENDER || 'Potvrdio';
  }

  private cleanPhoneNumber(phone: string): string {
    // Remove all non-digits except a leading +
    const cleaned = phone.replace(/[^\d+]/g, '');
    // Infobip expects phone without leading '+'
    return cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
  }

  public async sendViberVerification(params: ViberVerificationParams): Promise<SendMessageResult> {
    if (!this.apiKey) {
      return {
        success: false,
        providerMessageId: '',
        channel: 'VIBER',
        status: 'FAILED',
        error: 'INFOBIP_API_KEY is not configured',
      };
    }

    const to = this.cleanPhoneNumber(params.customerPhone);
    const text = `Zdravo ${params.customerName}!\nVaša narudžbina #${params.orderId} (${params.totalAmount} ${params.currency}) je primljena za plaćanje pouzećem.\nAdresa: ${params.address}, ${params.city}.\n\nMolimo proverite i potvrdite detalje dostave:`;

    const payload = {
      from: this.viberSender,
      to,
      text,
      buttonText: 'Izmeni adresu',
      buttonUrl: params.editUrl,
      trackingData: `order_${params.orderId}`,
    };

    try {
      const response = await fetch(`${this.baseUrl}/viber/1/message/text`, {
        method: 'POST',
        headers: {
          'Authorization': `App ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (!response.ok) {
        return {
          success: false,
          providerMessageId: '',
          channel: 'VIBER',
          status: 'FAILED',
          error: `Infobip HTTP ${response.status}: ${JSON.stringify(data)}`,
          rawResponse: data,
        };
      }

      // Infobip viber response usually contains: { messages: [ { to, status: { id, name, description }, messageId } ] }
      const messages = (data.messages as Array<Record<string, unknown>>) || [];
      const messageId = String(messages[0]?.messageId || `ib_${Date.now()}`);

      return {
        success: true,
        providerMessageId: messageId,
        channel: 'VIBER',
        status: 'SENT',
        rawResponse: data,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        providerMessageId: '',
        channel: 'VIBER',
        status: 'FAILED',
        error: `Network error connecting to Infobip: ${message}`,
      };
    }
  }

  public async sendSmsFallback(params: SmsFallbackParams): Promise<SendMessageResult> {
    if (!this.apiKey) {
      return {
        success: false,
        providerMessageId: '',
        channel: 'SMS',
        status: 'FAILED',
        error: 'INFOBIP_API_KEY is not configured',
      };
    }

    const to = this.cleanPhoneNumber(params.customerPhone);
    const text = `Potvrdio: Zdravo ${params.customerName}, potvrdite ili izmenite adresu za porudžbinu #${params.orderId} kako bi paket bio poslat: ${params.editUrl}`;

    const payload = {
      messages: [
        {
          from: this.smsSender,
          destinations: [{ to }],
          text,
        },
      ],
    };

    try {
      const response = await fetch(`${this.baseUrl}/sms/2/text/advanced`, {
        method: 'POST',
        headers: {
          'Authorization': `App ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (!response.ok) {
        return {
          success: false,
          providerMessageId: '',
          channel: 'SMS',
          status: 'FAILED',
          error: `Infobip SMS HTTP ${response.status}: ${JSON.stringify(data)}`,
          rawResponse: data,
        };
      }

      const messages = (data.messages as Array<Record<string, unknown>>) || [];
      const messageId = String(messages[0]?.messageId || `ib_sms_${Date.now()}`);

      return {
        success: true,
        providerMessageId: messageId,
        channel: 'SMS',
        status: 'SMS_FALLBACK',
        rawResponse: data,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        providerMessageId: '',
        channel: 'SMS',
        status: 'FAILED',
        error: `Network error connecting to Infobip SMS: ${message}`,
      };
    }
  }
}
