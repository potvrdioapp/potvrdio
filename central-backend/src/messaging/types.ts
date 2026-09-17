export type DeliveryStatus =
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'SEEN'
  | 'FAILED'
  | 'APPROVED'
  | 'REJECTED'
  | 'EDIT_CLICKED'
  | 'SMS_FALLBACK';

export type MessagingChannel = 'VIBER' | 'SMS';

export interface ViberVerificationParams {
  orderId: string;
  storeDomain: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  currency: string;
  address: string;
  city: string;
  token: string;
  editUrl: string;
}

export interface SmsFallbackParams {
  orderId: string;
  customerPhone: string;
  customerName: string;
  editUrl: string;
}

export interface SendMessageResult {
  success: boolean;
  providerMessageId: string;
  channel: MessagingChannel;
  status: DeliveryStatus;
  error?: string;
  rawResponse?: unknown;
}

export interface IMessagingProvider {
  readonly name: string;
  sendViberVerification(params: ViberVerificationParams): Promise<SendMessageResult>;
  sendSmsFallback(params: SmsFallbackParams): Promise<SendMessageResult>;
}
