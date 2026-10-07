import crypto from 'crypto';

export interface TokenSession {
  token: string;
  orderId: string;
  storeDomain: string;
  apiSecret?: string;
  customerName: string;
  customerPhone: string;
  address1: string;
  address2?: string;
  city: string;
  postcode: string;
  totalAmount: number;
  currency: string;
  expiresAt: Date;
  used: boolean;
}

export class TokenService {
  private static instance: TokenService;
  private tokens: Map<string, TokenSession> = new Map();

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public createToken(sessionData: Omit<TokenSession, 'token' | 'expiresAt' | 'used'>): string {
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours single-use token (Balkan COD accessibility standard)

    const session: TokenSession = {
      ...sessionData,
      token,
      expiresAt,
      used: false,
    };

    this.tokens.set(token, session);
    return token;
  }

  public setToken(customToken: string, sessionData: Omit<TokenSession, 'token' | 'expiresAt' | 'used'>): string {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days for testing/demo tokens
    const session: TokenSession = {
      ...sessionData,
      token: customToken,
      expiresAt,
      used: false,
    };
    this.tokens.set(customToken, session);
    return customToken;
  }

  public validateToken(token: string): TokenSession | null {
    const session = this.tokens.get(token);
    if (!session) return null;
    if (session.used) return null;
    if (new Date() > session.expiresAt) return null;

    return session;
  }

  public consumeToken(token: string): TokenSession | null {
    const session = this.validateToken(token);
    if (session) {
      session.used = true;
      this.tokens.set(token, session);
    }
    return session;
  }
}
