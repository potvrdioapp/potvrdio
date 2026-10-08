export type PlanType = 'TRIAL' | 'STARTER' | 'GROWTH' | 'PRO_SCALE' | 'PRO_RESERVE' | 'PAYG';

export interface MerchantAccount {
  apiKey: string;
  storeName: string;
  creditBalance: number; // In Euros (€)
  messageCreditsRemaining: number;
  planType: PlanType;
  isTrial?: boolean;
  trialVerificationsRemaining?: number;
}

export interface DeductCreditResult {
  allowed: boolean;
  inGraceBuffer: boolean;
  creditsRemaining: number;
  exhausted: boolean;
  creditsDeducted: number;
  isTrialDeduction?: boolean;
  trialVerificationsRemaining?: number;
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
        planType: 'GROWTH',
      });
      BillingService.instance.merchants.set('pk_test_balkan_demo_123', {
        apiKey: 'pk_test_balkan_demo_123',
        storeName: 'Mock WooCommerce Demo Store',
        creditBalance: 50.00,
        messageCreditsRemaining: 2000,
        planType: 'GROWTH',
      });
    }
    return BillingService.instance;
  }

  public getMerchant(apiKey: string): MerchantAccount | undefined {
    return this.merchants.get(apiKey);
  }

  public registerMerchant(account: MerchantAccount): void {
    this.merchants.set(account.apiKey, account);
  }

  /**
   * Calculates required credit deduction based on channel and merchant package
   * Viber: 1 credit
   * SMS (State 3 direct SMS or State 4 fallback):
   *   - Starter: 8 credits
   *   - Growth: 8 credits
   *   - Pro Scale: 9 credits
   *   - Pro Reserve: 11 credits
   */
  public getRequiredCredits(planType: PlanType, channel: 'VIBER' | 'SMS'): number {
    if (channel === 'VIBER') {
      return 1;
    }

    switch (planType) {
      case 'STARTER':
        return 8;
      case 'GROWTH':
      case 'PAYG':
        return 8;
      case 'PRO_SCALE':
        return 9;
      case 'PRO_RESERVE':
        return 11;
      default:
        return 8;
    }
  }

  public deductCredit(apiKey: string, channel: 'VIBER' | 'SMS' = 'VIBER'): boolean {
    return this.deductCreditWithGrace(apiKey, channel).allowed;
  }

  public deductCreditWithGrace(apiKey: string, channel: 'VIBER' | 'SMS' = 'VIBER'): DeductCreditResult {
    const merchant = this.merchants.get(apiKey);
    if (!merchant) {
      return { allowed: false, inGraceBuffer: false, creditsRemaining: 0, exhausted: true, creditsDeducted: 0 };
    }

    // 1. Check if merchant is in Free Trial / Pilot mode (25 guaranteed order verifications)
    if (merchant.isTrial && (merchant.trialVerificationsRemaining ?? 0) > 0) {
      merchant.trialVerificationsRemaining = (merchant.trialVerificationsRemaining ?? 0) - 1;
      const remaining = merchant.trialVerificationsRemaining;
      console.log(`[PILOT VERIFICATION] Merchant ${apiKey} used 1 verification (Channel: ${channel}). Remaining pilot verifications: ${remaining}/25`);

      if (remaining === 0) {
        merchant.isTrial = false;
        console.log(`[PILOT COMPLETED] Merchant ${apiKey} has completed all 25 free pilot verifications.`);
      }

      return {
        allowed: true,
        inGraceBuffer: false,
        creditsRemaining: remaining,
        exhausted: false,
        creditsDeducted: 1,
        isTrialDeduction: true,
        trialVerificationsRemaining: remaining,
      };
    }

    // 2. Standard commercial credit pool calculation
    const creditsToDeduct = this.getRequiredCredits(merchant.planType, channel);

    // Check if within normal credits
    if (merchant.messageCreditsRemaining >= creditsToDeduct) {
      merchant.messageCreditsRemaining -= creditsToDeduct;
      return {
        allowed: true,
        inGraceBuffer: false,
        creditsRemaining: merchant.messageCreditsRemaining,
        exhausted: false,
        creditsDeducted: creditsToDeduct,
      };
    }

    // Check if within emergency grace buffer
    if (merchant.messageCreditsRemaining > -BillingService.GRACE_BUFFER) {
      merchant.messageCreditsRemaining -= creditsToDeduct;
      console.warn(`[GRACE BUFFER ACTIVE] Merchant ${apiKey} is using emergency credits! Remaining: ${merchant.messageCreditsRemaining}`);
      return {
        allowed: true,
        inGraceBuffer: true,
        creditsRemaining: merchant.messageCreditsRemaining,
        exhausted: false,
        creditsDeducted: creditsToDeduct,
      };
    }

    // Completely exhausted
    return {
      allowed: false,
      inGraceBuffer: false,
      creditsRemaining: merchant.messageCreditsRemaining,
      exhausted: true,
      creditsDeducted: 0,
    };
  }

  public processWebhookTopUp(merchantApiKey: string, amountEuro: number, creditsToAdd: number) {
    const merchant = this.merchants.get(merchantApiKey);
    if (merchant) {
      merchant.isTrial = false;
      merchant.creditBalance += amountEuro;
      merchant.messageCreditsRemaining += creditsToAdd;
      console.log(`[PADDLE/LEMON BILLING WEBHOOK] Added €${amountEuro} (+${creditsToAdd} credits) to ${merchant.storeName}`);
    }
  }
}
