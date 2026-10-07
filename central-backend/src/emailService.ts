/**
 * Brevo (Sendinblue) Transactional Email Service
 * Parallel & non-blocking customer notification channel.
 * Designed with store-first branding & high-trust buyer psychology.
 */

export interface OrderItem {
  name: string;
  quantity?: number;
  total?: number;
}

export interface OrderEmailVerificationParams {
  orderId: string;
  storeName?: string;
  storeDomain?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  editUrl: string;
  totalAmount?: number;
  currency?: string;
  address?: string;
  city?: string;
  items?: OrderItem[];
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
  private readonly apiUrl = 'https://api.brevo.com/v3/smtp/email';

  private constructor() {
    this.apiKey = process.env.BREVO_API_KEY || '';
    this.senderEmail = process.env.BREVO_SENDER_EMAIL || 'info@potvrdio.online';
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Cleans and derives an authentic store display name from storeName or storeDomain.
   */
  private getStoreDisplayName(storeName?: string, storeDomain?: string): string {
    if (storeName && storeName.trim()) {
      const trimmed = storeName.trim();
      if (trimmed !== 'WordPress' && trimmed !== 'WooCommerce') {
        return trimmed;
      }
    }
    if (storeDomain) {
      try {
        const clean = storeDomain
          .replace(/^https?:\/\//i, '')
          .replace(/\/.*$/, '')
          .replace(/^www\./i, '');
        if (clean && !clean.includes('localhost') && !clean.includes('127.0.0.1')) {
          return clean.charAt(0).toUpperCase() + clean.slice(1);
        }
      } catch {
        // fallback
      }
    }
    if (storeName && storeName.trim()) {
      return storeName.trim();
    }
    return 'Internet Prodavnica';
  }

  /**
   * Generates a modern, responsive HTML email template centered on the MERCHANT's identity.
   */
  private generateHtmlTemplate(params: OrderEmailVerificationParams, storeDisplay: string): string {
    const formattedAmount = params.totalAmount ? `${params.totalAmount} ${params.currency || 'RSD'}` : 'Plaćanje pouzećem';
    const addressDisplay = params.address ? `${params.address}${params.city ? ', ' + params.city : ''}` : 'Adresa navedena u porudžbini';

    // Format ordered items if available
    let itemsHtml = '';
    if (params.items && params.items.length > 0) {
      const listItems = params.items
        .map((it) => {
          const qty = it.quantity && it.quantity > 1 ? ` &times; ${it.quantity}` : '';
          return `<div style="margin-bottom: 4px; font-weight: 600; color: #0f172a;">&bull; ${it.name}${qty}</div>`;
        })
        .join('');
      itemsHtml = `
          <tr>
            <td style="padding: 10px 0; color: #64748b; vertical-align: top; width: 140px;">Naručeni artikli:</td>
            <td style="padding: 10px 0; text-align: right; color: #0f172a;">${listItems}</td>
          </tr>`;
    }

    return `<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${storeDisplay} – Provera adrese za isporuku</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; color: #1e293b; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; background-color: #f1f5f9; padding: 32px 12px; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06); }
    .header { background: #0f172a; padding: 32px 24px; text-align: center; }
    .header-store { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
    .header-tag { display: inline-block; background: rgba(255, 255, 255, 0.15); color: #e2e8f0; font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 20px; margin-top: 10px; letter-spacing: 0.3px; }
    .content { padding: 36px 28px; }
    .greeting { font-size: 19px; font-weight: 700; margin-bottom: 14px; color: #0f172a; }
    .lead { font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px; }
    .lead strong { color: #0f172a; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px; }
    .card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .table-row-border { border-top: 1px solid #f1f5f9; }
    .btn-container { text-align: center; margin: 32px 0 24px 0; }
    .btn { display: inline-block; background: #16a34a; color: #ffffff !important; text-decoration: none; padding: 15px 32px; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35); text-align: center; }
    .btn:hover { background: #15803d; }
    .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 16px; margin-top: 24px; font-size: 13px; color: #1e40af; line-height: 1.5; }
    .info-box ul { margin: 8px 0 0 0; padding-left: 20px; }
    .info-box li { margin-bottom: 4px; }
    .closing { font-size: 14px; color: #475569; margin-top: 28px; line-height: 1.5; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-store">${storeDisplay}</div>
        <div class="header-tag">Potvrda prijema porudžbine &bull; Provera adrese za dostavu</div>
      </div>
      <div class="content">
        <div class="greeting">Poštovani ${params.customerName},</div>
        <div class="lead">
          Hvala Vam na porudžbini u internet prodavnici <strong>${storeDisplay}</strong>!
          <br><br>
          Vaša porudžbina je uspešno zabeležena i priprema se za slanje. Kako bi kurirska služba paket uručila u najkraćem mogućem roku i na tačnu adresu, molimo Vas da pregledate navedene podatke pre predaje pošiljke kuriru.
        </div>

        <div class="card">
          <div class="card-title">Podaci o porudžbini &bull; ${storeDisplay}</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 140px;">Prodavnica:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #0f172a;">${storeDisplay}</td>
            </tr>
            ${itemsHtml}
            <tr class="table-row-border">
              <td style="padding: 8px 0; color: #64748b;">Iznos za plaćanje:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #16a34a; font-size: 15px;">${formattedAmount}</td>
            </tr>
            <tr class="table-row-border">
              <td style="padding: 8px 0; color: #64748b;">Način plaćanja:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #0f172a;">Plaćanje pouzećem (kuriru pri preuzimanju)</td>
            </tr>
            <tr class="table-row-border">
              <td style="padding: 8px 0; color: #64748b;">Adresa isporuke:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #0f172a;">${addressDisplay}</td>
            </tr>
            ${
              params.customerPhone
                ? `<tr class="table-row-border">
              <td style="padding: 8px 0; color: #64748b;">Kontakt telefon:</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #0f172a;">${params.customerPhone}</td>
            </tr>`
                : ''
            }
          </table>
        </div>

        <div class="btn-container">
          <a href="${params.editUrl}" target="_blank" class="btn">Potvrdite ili Izmenite Adresu Isporuke &rarr;</a>
        </div>

        <div class="info-box">
          <strong>Šta je potrebno da uradite?</strong>
          <ul>
            <li><strong>Podaci su tačni?</strong> Kliknite na dugme iznad i potvrdite adresu u jednom koraku. Vaš paket odmah prelazi u pripremu za slanje.</li>
            <li><strong>Želite dopunu ili izmenu?</strong> Putem istog linka možete dopuniti broj stana, sprat, ulaz ili ostaviti posebnu napomenu za kurira.</li>
          </ul>
          <div style="margin-top: 8px; font-weight: 600; color: #1d4ed8;">⏱️ Link za proveru adrese važi 24 časa od prijema porudžbine.</div>
        </div>

        <div class="closing">
          Srdačan pozdrav,<br>
          <strong>Vaš ${storeDisplay} tim</strong>
        </div>
      </div>
      <div class="footer">
        Ovo obaveštenje Vam šalje internet prodavnica <strong>${storeDisplay}</strong> povodom Vaše porudžbine.<br>
        <span style="font-size: 11px; color: #94a3b8; display: inline-block; margin-top: 6px;">
          Tehnička platforma za sigurnu verifikaciju adresa: Potvrdio.online &bull; Sva prava zadržana.
        </span>
      </div>
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

    const storeDisplay = this.getStoreDisplayName(params.storeName, params.storeDomain);

    // Subject focused purely on the STORE and DELIVERY ADDRESS CHECK:
    // 1. Store name is prominent
    // 2. Clear purpose: verify delivery address for the package
    // 3. NO "Potvrdio"
    // 4. NO raw order ID (#42)
    const subject = `${storeDisplay} – Molimo proverite adresu za isporuku Vašeg paketa`;

    const formattedAmount = params.totalAmount ? `${params.totalAmount} ${params.currency || 'RSD'}` : 'Plaćanje pouzećem';
    const addressDisplay = params.address ? `${params.address}${params.city ? ', ' + params.city : ''}` : 'Adresa navedena u porudžbini';

    const textContent = `Poštovani ${params.customerName},

Hvala Vam na porudžbini u internet prodavnici ${storeDisplay}!

Vaša porudžbina je uspešno primljena. Kako bi kurir paket isporučio bez greške i u najkraćem roku, molimo Vas da pregledate i potvrdite adresu za isporuku putem sledećeg linka:
${params.editUrl}

Podaci o porudžbini:
- Prodavnica: ${storeDisplay}
- Adresa isporuke: ${addressDisplay}
- Iznos za plaćanje: ${formattedAmount} (Plaćanje pouzećem - gotovinom kuriru)

Link važi 24 časa.

Srdačan pozdrav,
Vaš ${storeDisplay} tim`;

    const payload = {
      sender: {
        name: storeDisplay,
        email: this.senderEmail,
      },
      to: [
        {
          email: params.customerEmail,
          name: params.customerName || 'Kupac',
        },
      ],
      subject,
      htmlContent: this.generateHtmlTemplate(params, storeDisplay),
      textContent,
    };

    console.log(`[BREVO EMAIL] Dispatching verification email for Order #${params.orderId} from "${storeDisplay}" to ${params.customerEmail}...`);

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
      console.log(`[BREVO EMAIL SUCCESS] Verification email sent! Sender: "${storeDisplay}", Subject: "${subject}", MessageId: ${messageId}`);
      return { success: true, messageId };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[BREVO EMAIL NETWORK ERROR] Non-blocking error: ${message}`);
      return { success: false, error: message };
    }
  }
}
