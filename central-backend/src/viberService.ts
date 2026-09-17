import { GatewayManager, GatewayMessageRecord } from './messaging/gatewayManager';
import { DeliveryStatus, MessagingChannel } from './messaging/types';

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
  private gatewayManager: GatewayManager;

  private constructor() {
    this.gatewayManager = GatewayManager.getInstance();
  }

  public static getInstance(): ViberService {
    if (!ViberService.instance) {
      ViberService.instance = new ViberService();
    }
    return ViberService.instance;
  }

  public async sendVerificationMessage(payload: ViberMessagePayload): Promise<{ messageId: string; editUrl: string }> {
    const editUrl = `https://potvrdio.online/edit?token=${payload.token}`;

    const result = await this.gatewayManager.dispatchVerification({
      orderId: payload.orderId,
      storeDomain: payload.storeDomain,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      totalAmount: payload.totalAmount,
      currency: payload.currency,
      address: payload.address,
      city: payload.city,
      token: payload.token,
      editUrl,
    });

    return result;
  }

  public markStatus(orderIdOrMessageId: string, status: DeliveryStatus) {
    this.gatewayManager.updateStatus(orderIdOrMessageId, status);
  }

  public getLog(): Array<{
    id: string;
    orderId: string;
    phone: string;
    status: DeliveryStatus;
    channel: MessagingChannel;
    sentAt: Date;
  }> {
    return this.gatewayManager.getAllRecords().map((r: GatewayMessageRecord) => ({
      id: r.id,
      orderId: r.orderId,
      phone: r.phone,
      status: r.status,
      channel: r.channel,
      sentAt: r.sentAt,
    }));
  }

  public getGatewayManager(): GatewayManager {
    return this.gatewayManager;
  }
}

