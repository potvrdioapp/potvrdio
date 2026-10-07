import 'dotenv/config';
import { EmailService } from '../src/emailService';

async function testBrevoEmailDirect() {
  console.log('Testing Brevo Email Provider with:');
  console.log('API Key configured:', Boolean(process.env.BREVO_API_KEY));
  console.log('Sender Email:', process.env.BREVO_SENDER_EMAIL);
  console.log('Target Email:', process.env.TEST_NOTIFICATION_EMAIL || 'atilbilge@gmail.com');

  const emailService = EmailService.getInstance();

  const targetEmail = process.env.TEST_NOTIFICATION_EMAIL || 'atilbilge@gmail.com';
  console.log(`\nDispatching test email to ${targetEmail}...`);

  const result = await emailService.sendOrderVerificationEmail({
    orderId: 'TEST-101',
    customerName: 'Atıl Bilge',
    customerEmail: targetEmail,
    editUrl: 'https://potvrdio.online/edit?token=test_token_123',
    totalAmount: 4850,
    currency: 'RSD',
    address: 'Knez Mihailova 42',
    city: 'Beograd',
  });

  console.log('Brevo Result:', JSON.stringify(result, null, 2));
}

testBrevoEmailDirect().catch(console.error);
