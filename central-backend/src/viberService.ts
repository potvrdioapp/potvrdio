import crypto from 'crypto';

export interface ViberMessagePayload {
  orderId: string;
  storeDomain: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  currency: string;
  address: string;
  city: string;
  token: string;
}

export class ViberService {
  private static instance: ViberService;
  private messageLog: Array<{
    id: string;
    orderId: string;
    phone: string;
    status: 'SENT' | 'DELIVERED' | 'READ' | 'APPROVED' | 'REJECTED' | 'EDIT_CLICKED' | 'SMS_FALLBACK';
    channel: 'VIBER' | 'SMS';
    sentAt: Date;
  }> = [];

  public static getInstance(): ViberService {
    if (!ViberService.instance) {
      ViberService.instance = new ViberService();
    }
    return ViberService.instance;
  }

  public async sendVerificationMessage(payload: ViberMessagePayload): Promise<{ messageId: string; editUrl: string }> {
    const messageId = `vbr_${crypto.randomBytes(8).toString('hex')}`;
    const editUrl = `https://potvrdio.online/edit?token=${payload.token}`;

    console.log(`[VIBER GATEWAY] Sending Viber Message to ${payload.customerPhone} for Order #${payload.orderId}`);
    console.log(`[VIBER TEXT] Zdravo ${payload.customerName}! Vaša narudžbina #${payload.orderId} (Iznos: ${payload.totalAmount} ${payload.currency}) je primljena. Adresa: ${payload.address}, ${payload.city}.`);
    console.log(`[BUTTON 1] [APPROVE] DA, ADRESA JE TAČNA I POTVRĐUJEM`);
    console.log(`[BUTTON 2] [EDIT] IZMENI ADRESU -> ${editUrl}`);

    const logEntry = {
      id: messageId,
      orderId: payload.orderId,
      phone: payload.customerPhone,
      status: 'SENT' as const,
      channel: 'VIBER' as const,
      sentAt: new Date(),
    };
    this.messageLog.push(logEntry);

    // Simulate 5-minute SMS Fallback timer check
    setTimeout(() => {
      const msg = this.messageLog.find(m => m.id === messageId);
      if (msg && (msg.status === 'SENT')) {
        console.log(`[SMS FALLBACK TRIGGERED] Viber message unread for 5 min. Sending SMS fallback to ${payload.customerPhone}...`);
        msg.status = 'SMS_FALLBACK';
        msg.channel = 'SMS';
      }
    }, 5000); // 5 seconds simulation for dev testing

    return { messageId, editUrl };
  }

  public markStatus(orderId: string, status: 'APPROVED' | 'REJECTED' | 'EDIT_CLICKED') {
    const msg = this.messageLog.find(m => m.orderId === orderId);
    if (msg) {
      msg.status = status;
    }
  }

  public getLog() {
    return this.messageLog;
  }
}
