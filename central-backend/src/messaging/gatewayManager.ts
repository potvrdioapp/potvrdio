import crypto from 'crypto';
import {
  IMessagingProvider,
  ViberVerificationParams,
  SmsFallbackParams,
  SendMessageResult,
  DeliveryStatus,
  MessagingChannel,
} from './types';
import { InfobipMessagingProvider } from './infobipProvider';
import { BulkGateMessagingProvider } from './bulkGateProvider';
import { MockMessagingProvider } from './mockProvider';

export interface GatewayMessageRecord {
  id: string;
  providerMessageId: string;
  orderId: string;
  phone: string;
  channel: MessagingChannel;
  status: DeliveryStatus;
  providerName: string;
  editUrl: string;
  sentAt: Date;
  fallbackSentAt?: Date;
  error?: string;
}

export class GatewayManager {
  private static instance: GatewayManager;
  private provider: IMessagingProvider;
  private messageRecords = new Map<string, GatewayMessageRecord>();
  private fallbackTimers = new Map<string, NodeJS.Timeout>();
  private readonly fallbackDelayMs: number;

  private constructor() {
    this.provider = this.resolveProvider();

    // Default 300 seconds (5 minutes) in production, configurable for tests/dev
    const delaySeconds = parseInt(process.env.SMS_FALLBACK_DELAY_SECONDS || '300', 10);
    this.fallbackDelayMs = delaySeconds * 1000;

    console.log(`[GATEWAY MANAGER] Initialized provider: ${this.provider.name} | Fallback delay: ${delaySeconds}s`);
  }

  public static getInstance(): GatewayManager {
    if (!GatewayManager.instance) {
      GatewayManager.instance = new GatewayManager();
    }
    return GatewayManager.instance;
  }

  private resolveProvider(): IMessagingProvider {
    const configured = (process.env.MESSAGING_PROVIDER || '').toLowerCase();

    if (configured === 'infobip' || (!configured && process.env.INFOBIP_API_KEY)) {
      return new InfobipMessagingProvider();
    }

    if (configured === 'bulkgate' || (!configured && process.env.BULKGATE_APP_ID)) {
      return new BulkGateMessagingProvider();
    }

    return new MockMessagingProvider();
  }

  public setProvider(provider: IMessagingProvider) {
    this.provider = provider;
    console.log(`[GATEWAY MANAGER] Provider manually switched to: ${provider.name}`);
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  /**
   * Dispatches initial Viber verification message and schedules automated 5-minute SMS fallback
   */
  public async dispatchVerification(params: ViberVerificationParams): Promise<{ messageId: string; editUrl: string }> {
    const internalId = `vbr_${crypto.randomBytes(8).toString('hex')}`;
    const result: SendMessageResult = await this.provider.sendViberVerification(params);

    const record: GatewayMessageRecord = {
      id: internalId,
      providerMessageId: result.providerMessageId || internalId,
      orderId: params.orderId,
      phone: params.customerPhone,
      channel: result.channel,
      status: result.status,
      providerName: this.provider.name,
      editUrl: params.editUrl,
      sentAt: new Date(),
      error: result.error,
    };

    this.messageRecords.set(internalId, record);
    this.messageRecords.set(params.orderId, record); // Map by orderId too for fast lookups

    // Schedule automated 5-minute SMS Fallback
    this.scheduleSmsFallback(internalId, {
      orderId: params.orderId,
      customerPhone: params.customerPhone,
      customerName: params.customerName,
      editUrl: params.editUrl,
    });

    return {
      messageId: internalId,
      editUrl: params.editUrl,
    };
  }

  /**
   * Schedules automated fallback to SMS if customer has not delivered/seen or acted upon Viber message
   */
  private scheduleSmsFallback(messageId: string, params: SmsFallbackParams) {
    // Clear any existing timer for this message
    this.cancelFallbackTimer(messageId);

    const timer = setTimeout(async () => {
      const record = this.messageRecords.get(messageId);
      if (!record) return;

      // Only trigger fallback if message is still pending/sent or failed (customer didn't approve, reject, or edit)
      const nonFallbackStatuses: DeliveryStatus[] = ['APPROVED', 'REJECTED', 'EDIT_CLICKED', 'SEEN'];
      if (!nonFallbackStatuses.includes(record.status)) {
        console.log(`[AUTOMATED FALLBACK] Viber message ${messageId} unread after ${this.fallbackDelayMs / 1000}s. Triggering SMS Fallback to ${params.customerPhone}...`);

        const smsResult = await this.provider.sendSmsFallback(params);
        record.channel = 'SMS';
        record.status = 'SMS_FALLBACK';
        record.fallbackSentAt = new Date();
        record.providerMessageId = smsResult.providerMessageId;
        if (smsResult.error) {
          record.error = smsResult.error;
        }
      }
      this.fallbackTimers.delete(messageId);
    }, this.fallbackDelayMs);

    this.fallbackTimers.set(messageId, timer);
  }

  public cancelFallbackTimer(messageId: string) {
    const existing = this.fallbackTimers.get(messageId);
    if (existing) {
      clearTimeout(existing);
      this.fallbackTimers.delete(messageId);
    }
  }

  /**
   * Updates message status when customer takes action (Approve / Reject / Edit Clicked)
   */
  public updateStatus(orderIdOrMessageId: string, status: DeliveryStatus) {
    const record = this.messageRecords.get(orderIdOrMessageId);
    if (record) {
      record.status = status;
      // Stop fallback countdown since user actively engaged
      this.cancelFallbackTimer(record.id);
    }
  }

  public getRecord(orderIdOrMessageId: string): GatewayMessageRecord | undefined {
    return this.messageRecords.get(orderIdOrMessageId);
  }

  public getAllRecords(): GatewayMessageRecord[] {
    const unique = new Map<string, GatewayMessageRecord>();
    for (const record of this.messageRecords.values()) {
      unique.set(record.id, record);
    }
    return Array.from(unique.values());
  }

  /**
   * Processes Infobip DLR (Delivery Report) Webhooks
   */
  public handleInfobipDlr(payload: Record<string, unknown>): { matched: boolean; status?: string } {
    const results = (payload.results as Array<Record<string, unknown>>) || [];
    let matched = false;

    for (const item of results) {
      const providerMsgId = String(item.messageId || '');
      const statusObj = (item.status as Record<string, unknown>) || {};
      const groupName = String(statusObj.groupName || statusObj.name || '').toUpperCase();

      for (const record of this.messageRecords.values()) {
        if (record.providerMessageId === providerMsgId) {
          matched = true;
          if (groupName.includes('DELIVERED')) {
            record.status = 'DELIVERED';
          } else if (groupName.includes('SEEN') || groupName.includes('READ')) {
            record.status = 'SEEN';
            this.cancelFallbackTimer(record.id);
          } else if (groupName.includes('UNDELIVERABLE') || groupName.includes('REJECTED') || groupName.includes('FAILED')) {
            record.status = 'FAILED';
          }
          console.log(`[DLR INFOBIP] Updated msg ${record.id} to status: ${record.status}`);
        }
      }
    }

    return { matched };
  }

  /**
   * Processes BulkGate DLR (Delivery Report) Webhooks
   */
  public handleBulkGateDlr(payload: Record<string, unknown>): { matched: boolean; status?: string } {
    const providerMsgId = String(payload.message_id || payload.id || '');
    const rawStatus = String(payload.status || '').toUpperCase();
    let matched = false;

    for (const record of this.messageRecords.values()) {
      if (record.providerMessageId === providerMsgId) {
        matched = true;
        if (rawStatus === 'DELIVERED') {
          record.status = 'DELIVERED';
        } else if (rawStatus === 'SEEN' || rawStatus === 'READ') {
          record.status = 'SEEN';
          this.cancelFallbackTimer(record.id);
        } else if (rawStatus === 'UNDELIVERED' || rawStatus === 'FAILED') {
          record.status = 'FAILED';
        }
        console.log(`[DLR BULKGATE] Updated msg ${record.id} to status: ${record.status}`);
      }
    }

    return { matched };
  }
}
