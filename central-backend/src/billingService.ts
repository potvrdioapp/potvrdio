export interface MerchantAccount {
  apiKey: string;
  storeName: string;
  creditBalance: number; // In Euros (€)
  messageCreditsRemaining: number;
  planType: 'PAYG' | 'PRO_RESERVE';
}

export class BillingService {
  private static instance: BillingService;
  private merchants: Map<string, MerchantAccount> = new Map();

  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
      // Add demo merchant for initial testing
      BillingService.instance.merchants.set('demo_api_key_123', {
        apiKey: 'demo_api_key_123',
        storeName: 'Balkan Style Shop (Srbija)',
        creditBalance: 45.00,
        messageCreditsRemaining: 1875,
        planType: 'PAYG',
      });
    }
    return BillingService.instance;
  }

  public getMerchant(apiKey: string): MerchantAccount | undefined {
    return this.merchants.get(apiKey);
  }

  public deductCredit(apiKey: string, cost: number = 0.024): boolean {
    const merchant = this.merchants.get(apiKey);
    if (!merchant) return false;
    if (merchant.messageCreditsRemaining <= 0) return false;

    merchant.messageCreditsRemaining -= 1;
    merchant.creditBalance = Math.max(0, merchant.creditBalance - cost);
    return true;
  }

  public processWebhookTopUp(merchantApiKey: string, amountEuro: number, creditsToAdd: number) {
    const merchant = this.merchants.get(merchantApiKey);
    if (merchant) {
      merchant.creditBalance += amountEuro;
      merchant.messageCreditsRemaining += creditsToAdd;
      console.log(`[PADDLE/LEMON BILLING WEBHOOK] Added €${amountEuro} (+${creditsToAdd} credits) to ${merchant.storeName}`);
    }
  }
}
