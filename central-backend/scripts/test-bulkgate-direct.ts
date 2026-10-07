import 'dotenv/config';
import { BulkGateMessagingProvider } from '../src/messaging/bulkGateProvider';

async function testBulkGateDirect() {
  console.log('Testing BulkGate Messaging Provider with credentials:');
  console.log('App ID:', process.env.BULKGATE_APP_ID);
  console.log('Sender ID:', process.env.BULKGATE_SENDER_ID);

  const provider = new BulkGateMessagingProvider();
  
  // Test SMS Fallback call (using dry or live check format)
  const customerPhone = process.env.TEST_PHONE_NUMBER || '+381616036556';
  console.log(`\nSending test SMS payload to ${customerPhone}...`);
  const result = await provider.sendSmsFallback({
    orderId: 'TEST-101',
    customerPhone,
    customerName: 'Atıl Bilge',
    editUrl: 'https://potvrdio.online/edit?token=test_token_123',
  });

  console.log('Result:', JSON.stringify(result, null, 2));
}

testBulkGateDirect().catch(console.error);
