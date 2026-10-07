/**
 * Brevo (Sendinblue) Transactional Email Service
 * Parallel & non-blocking notification channel for Potvrdio order address verification.
 */

export interface OrderEmailVerificationParams {
  orderId: string;
  customerName: string;
  customerEmail: string;
  editUrl: string;
  totalAmount?: number;
  currency?: string;
  address?: string;
  city?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  private static instance: EmailService;
  private readonly apiKey: string;
  private readonly senderEmail: string;
  private readonly senderName: string;
  private readonly apiUrl = 'https://api.brevo.com/v3/smtp/email';

  private constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';
    this.senderEmail = process.env.BREVO_SENDER_EMAIL || 'atilbilge@gmail.com';
    this.senderName = process.env.BREVO_SENDER_NAME || 'Potvrdio';
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Generates a modern, responsive HTML email template matching Potvrdio Design System.
   */
  private generateHtmlTemplate(params: OrderEmailVerificationParams): string {
    const formattedAmount = params.totalAmount ? `${params.totalAmount} ${params.currency || 'RSD'}` : 'Plaćanje pouzećem';
    const addressDisplay = params.address ? `${params.address}${params.city ? ', ' + params.city : ''}` : 'Adresa navedena u porudžbini';

    return `<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potvrda Adrese - Potvrdio</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
    .container { max-width: 560px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #361F6F; padding: 28px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header h1 span { color: #22AF75; }
    .badge { display: inline-block; background: #EDE9FE; color: #6D28D9; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-top: 8px; letter-spacing: 0.5px; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 18px; font-weight: 700; margin-bottom: 12px; color: #0f172a; }
    .lead { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 28px; }
    .card-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
    .card-label { color: #64748b; font-weight: 500; }
    .card-value { color: #0f172a; font-weight: 700; text-align: right; }
    .btn-container { text-align: center; margin: 32px 0 24px 0; }
    .btn { display: inline-block; background: #22AF75; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(34, 175, 117, 0.35); }
    .btn:hover { background: #1b9462; }
    .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; }
    .warning { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Potvrdio<span>.online</span></h1>
      <div class="badge">Sigurna Verifikacija Pošiljke</div>
    </div>
    <div class="content">
      <div class="greeting">Zdravo ${params.customerName},</div>
      <div class="lead">
        Vaša porudžbina <strong>#${params.orderId}</strong> je uspešno primljena. Kako bi vam kurir uručio pošiljku bez odlaganja, molimo proverite ili po potrebi izmenite vašu adresu dostave pre slanja paketa.
      </div>

      <div class="card">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Broj porudžbine:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #0f172a;">#${params.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Ukupan iznos:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #0f172a;">${formattedAmount}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Način plaćanja:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #0f172a;">Plaćanje pouzećem (COD)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Adresa isporuke:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #0f172a;">${addressDisplay}</td>
          </tr>
        </table>
      </div>

      <div class="btn-container">
        <a href="${params.editUrl}" target="_blank" class="btn">Potvrdite ili Izmenite Adresu &rarr;</a>
      </div>

      <div class="warning">
        Jednokratni sigurnosni link važi 24 sata. Ako je adresa potpuno tačna, možete je jednim klikom potvrditi ili uneti dopunske instrukcije (sprat, interfon) za kurira.
      </div>
    </div>
    <div class="footer">
      Ova poruka je automatski poslata u ime prodavca radi zaštite i tačne isporuke vaše porudžbine.<br>
      &copy; ${new Date().getFullYear()} Potvrdio.online &bull; Sva prava zadržana.
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Dispatches order verification email via Brevo SMTP API.
   * Completely non-blocking and isolated with try/catch to never disrupt the main flow.
   */
  public async sendOrderVerificationEmail(params: OrderEmailVerificationParams): Promise<SendEmailResult> {
    if (!this.apiKey) {
      console.warn('[BREVO EMAIL] Skipping: BREVO_API_KEY is not configured in .env');
      return { success: false, error: 'BREVO_API_KEY_NOT_CONFIGURED' };
    }

    if (!params.customerEmail) {
      console.warn(`[BREVO EMAIL] Skipping: No customer email provided for Order #${params.orderId}`);
      return { success: false, error: 'NO_CUSTOMER_EMAIL' };
    }

    const payload = {
      sender: {
        name: this.senderName,
        email: this.senderEmail,
      },
      to: [
        {
          email: params.customerEmail,
          name: params.customerName || 'Kupac',
        },
      ],
      subject: `Potvrdio: Potvrdite ili izmenite adresu za porudžbinu #${params.orderId}`,
      htmlContent: this.generateHtmlTemplate(params),
      textContent: `Potvrdio: Zdravo ${params.customerName}, potvrdite ili izmenite adresu za porudžbinu #${params.orderId}: ${params.editUrl}`,
    };

    console.log(`[BREVO EMAIL] Dispatching verification email for Order #${params.orderId} to ${params.customerEmail}...`);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (!response.ok || data.message || data.code) {
        const errorMsg = String(data.message || data.code || `HTTP ${response.status}`);
        console.warn(`[BREVO EMAIL WARNING] Could not send email via Brevo: ${errorMsg}`);
        return { success: false, error: errorMsg };
      }

      const messageId = String(data.messageId || `brevo_${Date.now()}`);
      console.log(`[BREVO EMAIL SUCCESS] Verification email sent! MessageId: ${messageId}`);
      return { success: true, messageId };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[BREVO EMAIL NETWORK ERROR] Non-blocking error: ${message}`);
      return { success: false, error: message };
    }
  }
}
