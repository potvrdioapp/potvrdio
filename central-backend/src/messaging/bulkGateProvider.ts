import { IMessagingProvider, ViberVerificationParams, SmsFallbackParams, SendMessageResult } from './types';

export class BulkGateMessagingProvider implements IMessagingProvider {
  public readonly name = 'BulkGate';
  private readonly baseUrl: string;
  private readonly appId: string;
  private readonly appToken: string;
  private readonly senderId: string;

  constructor() {
    this.baseUrl = (process.env.BULKGATE_BASE_URL || 'https://portal.bulkgate.com/api/2.0').replace(/\/+$/, '');
    this.appId = process.env.BULKGATE_APP_ID || '';
    this.appToken = process.env.BULKGATE_APP_TOKEN || '';
    this.senderId = process.env.BULKGATE_SENDER_ID || 'gText';
  }

  private cleanPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
  }

  public async sendViberVerification(params: ViberVerificationParams): Promise<SendMessageResult> {
    if (!this.appId || !this.appToken) {
      return {
        success: false,
        providerMessageId: '',
        channel: 'VIBER',
        status: 'FAILED',
        error: 'BULKGATE_APP_ID or BULKGATE_APP_TOKEN is not configured',
      };
    }

    const number = this.cleanPhoneNumber(params.customerPhone);
    const text = `Zdravo ${params.customerName}!\nVaša porudžbina #${params.orderId} (${params.totalAmount} ${params.currency}) je primljena.\nAdresa: ${params.address}, ${params.city}.\n\nPotvrdite ili izmenite podatke:`;

    const payload = {
      application_id: this.appId,
      application_token: this.appToken,
      number,
      text,
      button_text: 'Izmeni adresu',
      button_url: params.editUrl,
    };

    try {
      const response = await fetch(`${this.baseUrl}/viber/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (!response.ok || data.error) {
        return {
          success: false,
          providerMessageId: '',
          channel: 'VIBER',
          status: 'FAILED',
          error: `BulkGate Viber error: ${data.error || response.status}`,
          rawResponse: data,
        };
      }

      const resData = (data.data as Record<string, unknown>) || {};
      const messageId = String(resData.message_id || `bg_vbr_${Date.now()}`);

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
        error: `Network error connecting to BulkGate: ${message}`,
      };
    }
  }

  public async sendSmsFallback(params: SmsFallbackParams): Promise<SendMessageResult> {
    if (!this.appId || !this.appToken) {
      return {
        success: false,
        providerMessageId: '',
        channel: 'SMS',
        status: 'FAILED',
        error: 'BULKGATE_APP_ID or BULKGATE_APP_TOKEN is not configured',
      };
    }

    const number = this.cleanPhoneNumber(params.customerPhone);
    const text = `Potvrdio: Zdravo ${params.customerName}, potvrdite ili izmenite adresu za porudžbinu #${params.orderId}: ${params.editUrl}`;

    const payload = {
      application_id: this.appId,
      application_token: this.appToken,
      number,
      text,
      sender_id: this.senderId,
    };

    try {
      const response = await fetch(`${this.baseUrl}/simple/transactional`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (!response.ok || data.error) {
        return {
          success: false,
          providerMessageId: '',
          channel: 'SMS',
          status: 'FAILED',
          error: `BulkGate SMS error: ${data.error || response.status}`,
          rawResponse: data,
        };
      }

      const resData = (data.data as Record<string, unknown>) || {};
      const messageId = String(resData.message_id || `bg_sms_${Date.now()}`);

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
        error: `Network error connecting to BulkGate SMS: ${message}`,
      };
    }
  }
}
