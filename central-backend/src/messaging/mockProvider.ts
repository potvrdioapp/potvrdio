import crypto from 'crypto';
import { IMessagingProvider, ViberVerificationParams, SmsFallbackParams, SendMessageResult } from './types';

export class MockMessagingProvider implements IMessagingProvider {
  public readonly name = 'MockProvider';

  public async sendViberVerification(params: ViberVerificationParams): Promise<SendMessageResult> {
    const providerMessageId = `mock_vbr_${crypto.randomBytes(6).toString('hex')}`;

    console.log(`[MOCK VIBER] Dispatching Viber Verification to ${params.customerPhone}`);
    console.log(`[MOCK VIBER] Order #${params.orderId} | Amount: ${params.totalAmount} ${params.currency}`);
    console.log(`[MOCK VIBER] Message Text: Zdravo ${params.customerName}! Vaša narudžbina #${params.orderId} je primljena. Adresa: ${params.address}, ${params.city}.`);
    console.log(`[MOCK VIBER] Action Button: Izmeni adresu -> ${params.editUrl}`);

    return {
      success: true,
      providerMessageId,
      channel: 'VIBER',
      status: 'SENT',
    };
  }

  public async sendSmsFallback(params: SmsFallbackParams): Promise<SendMessageResult> {
    const providerMessageId = `mock_sms_${crypto.randomBytes(6).toString('hex')}`;

    console.log(`[MOCK SMS FALLBACK] Viber unread/undelivered. Dispatching SMS to ${params.customerPhone}`);
    console.log(`[MOCK SMS] Text: Potvrdio: Zdravo ${params.customerName}, potvrdite ili izmenite adresu za porudžbinu #${params.orderId}: ${params.editUrl}`);

    return {
      success: true,
      providerMessageId,
      channel: 'SMS',
      status: 'SMS_FALLBACK',
    };
  }
}
