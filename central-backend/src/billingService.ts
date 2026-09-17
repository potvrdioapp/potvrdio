export interface MerchantAccount {
  apiKey: string;
  storeName: string;
  creditBalance: number; // In Euros (€)
  messageCreditsRemaining: number;
  planType: 'PAYG' | 'PRO_RESERVE';
}

export interface DeductCreditResult {
  allowed: boolean;
  inGraceBuffer: boolean;
  creditsRemaining: number;
  exhausted: boolean;
}

export class BillingService {
  private static instance: BillingService;
  private merchants: Map<string, MerchantAccount> = new Map();
  private static readonly GRACE_BUFFER = 20; // 20 emergency verifications before hard stop

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
    return this.deductCreditWithGrace(apiKey, cost).allowed;
  }

  public deductCreditWithGrace(apiKey: string, cost: number = 0.024): DeductCreditResult {
    const merchant = this.merchants.get(apiKey);
    if (!merchant) {
      return { allowed: false, inGraceBuffer: false, creditsRemaining: 0, exhausted: true };
    }

    // Check if within normal credits
    if (merchant.messageCreditsRemaining > 0) {
      merchant.messageCreditsRemaining -= 1;
      merchant.creditBalance = Math.max(0, merchant.creditBalance - cost);
      return {
        allowed: true,
        inGraceBuffer: false,
        creditsRemaining: merchant.messageCreditsRemaining,
        exhausted: false,
      };
    }

    // Check if within emergency grace buffer (-1 to -20)
    if (merchant.messageCreditsRemaining > -BillingService.GRACE_BUFFER) {
      merchant.messageCreditsRemaining -= 1;
      console.warn(`[GRACE BUFFER ACTIVE] Merchant ${apiKey} is using emergency credits! Remaining grace: ${BillingService.GRACE_BUFFER + merchant.messageCreditsRemaining}`);
      return {
        allowed: true,
        inGraceBuffer: true,
        creditsRemaining: merchant.messageCreditsRemaining,
        exhausted: false,
      };
    }

    // Completely exhausted (exceeded 20 emergency grace credits)
    return {
      allowed: false,
      inGraceBuffer: false,
      creditsRemaining: merchant.messageCreditsRemaining,
      exhausted: true,
    };
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
