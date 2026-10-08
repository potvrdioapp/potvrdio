import crypto from 'crypto';

export interface MerchantMagicTokenSession {
  token: string;
  email: string;
  storeDomain?: string;
  apiKey?: string;
  expiresAt: Date;
  used: boolean;
  purpose: 'welcome' | 'login';
}

export class MerchantAuthService {
  private static instance: MerchantAuthService;
  private tokens: Map<string, MerchantMagicTokenSession> = new Map();

  public static getInstance(): MerchantAuthService {
    if (!MerchantAuthService.instance) {
      MerchantAuthService.instance = new MerchantAuthService();
    }
    return MerchantAuthService.instance;
  }

  /**
   * Generates a cryptographically secure, time-limited magic token.
   * Default expiration: 15 minutes for login requests, 7 days for welcome links.
   */
  public createMagicToken(
    email: string,
    expiresInMs: number = 15 * 60 * 1000,
    purpose: 'welcome' | 'login' = 'login',
    metadata?: { storeDomain?: string; apiKey?: string }
  ): string {
    const token = 'ml_' + crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInMs);

    this.tokens.set(token, {
      token,
      email: email.trim().toLowerCase(),
      storeDomain: metadata?.storeDomain,
      apiKey: metadata?.apiKey,
      expiresAt,
      used: false,
      purpose,
    });

    return token;
  }

  /**
   * Validates a token without consuming it.
   */
  public validateMagicToken(token: string): MerchantMagicTokenSession | null {
    if (!token) return null;
    const session = this.tokens.get(token.trim());
    if (!session) return null;
    if (session.used) return null;
    if (new Date() > session.expiresAt) return null;
    return session;
  }

  /**
   * Consumes a single-use token upon successful login.
   */
  public consumeMagicToken(token: string): MerchantMagicTokenSession | null {
    const session = this.validateMagicToken(token);
    if (session) {
      // Mark as used so it cannot be replayed
      session.used = true;
      this.tokens.set(session.token, session);
    }
    return session;
  }
}
