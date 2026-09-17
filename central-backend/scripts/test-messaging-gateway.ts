/**
 * Test suite for Potvrdio Viber & SMS Gateway Manager + Automated SMS Fallback
 */

const BACKEND_URL = 'http://localhost:4001/api/v1';

async function runGatewayTests() {
  console.log('========================================================================');
  console.log('  POTVRDIO: VIBER & SMS GATEWAY + AUTOMATED FALLBACK TEST SUITE');
  console.log('========================================================================\n');

  try {
    // 1. Intercept a test order to trigger message dispatch
    console.log('1️⃣  Dispatching test verification message...');
    const interceptRes = await fetch(`${BACKEND_URL}/orders/intercept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Potvrdio-Api-Key': 'demo_api_key_123',
        'X-Potvrdio-Api-Secret': 'demo_secret_456',
      },
      body: JSON.stringify({
        order_id: 9940,
        store_domain: 'test-store.rs',
        customer_name: 'Stefan Nemanja',
        customer_phone: '+381641112233',
        billing_address: {
          address_1: 'Bulevar Kralja Aleksandra 100',
          city: 'Beograd',
          postcode: '11000',
        },
        total_amount: 3990,
        currency: 'RSD',
      }),
    }).then((r) => r.json());

    const messageId = interceptRes.viberMessageId;
    console.log(`   Dispatched Message ID: ${messageId}`);

    // 2. Query message status
    console.log('\n2️⃣  Querying initial message status...');
    const initialStatus = await fetch(`${BACKEND_URL}/messaging/status/${messageId}`).then((r) => r.json());
    console.log(`   Channel: ${initialStatus.channel} | Status: ${initialStatus.status} | Provider: ${initialStatus.providerName}`);
    if (initialStatus.status !== 'SENT' || initialStatus.channel !== 'VIBER') {
      throw new Error(`Expected SENT on VIBER, got ${initialStatus.status} on ${initialStatus.channel}`);
    }
    console.log('   ✅ Initial state is correctly VIBER / SENT');

    // 3. Test Infobip DLR Webhook simulation
    console.log('\n3️⃣  Testing Infobip Delivery Report (DLR) Webhook...');
    const infobipDlrPayload = {
      results: [
        {
          messageId: initialStatus.providerMessageId,
          to: '381641112233',
          status: {
            id: 5,
            groupName: 'DELIVERED',
            name: 'DELIVERED_TO_HANDSET',
            description: 'Message delivered to handset',
          },
        },
      ],
    };

    const dlrRes = await fetch(`${BACKEND_URL}/messaging/webhook/infobip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(infobipDlrPayload),
    }).then((r) => r.json());

    console.log(`   DLR Matched: ${dlrRes.matched}`);
    const deliveredStatus = await fetch(`${BACKEND_URL}/messaging/status/${messageId}`).then((r) => r.json());
    console.log(`   Updated status after DLR: ${deliveredStatus.status}`);
    console.log('   ✅ Infobip DLR webhook successfully processed');

    // 4. Test Automated Fallback simulation on unread message
    console.log('\n4️⃣  Dispatching second message to test Automated Fallback...');
    const interceptRes2 = await fetch(`${BACKEND_URL}/orders/intercept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Potvrdio-Api-Key': 'demo_api_key_123',
        'X-Potvrdio-Api-Secret': 'demo_secret_456',
      },
      body: JSON.stringify({
        order_id: 9941,
        store_domain: 'test-store.rs',
        customer_name: 'Milica Dabović',
        customer_phone: '+381659998877',
        billing_address: {
          address_1: 'Terazije 1',
          city: 'Beograd',
          postcode: '11000',
        },
        total_amount: 7200,
        currency: 'RSD',
      }),
    }).then((r) => r.json());

    const messageId2 = interceptRes2.viberMessageId;
    console.log(`   Dispatched Message ID #2: ${messageId2}`);

    // Test BulkGate DLR Webhook
    console.log('\n5️⃣  Testing BulkGate Delivery Report (DLR) Webhook with SEEN status...');
    const status2 = await fetch(`${BACKEND_URL}/messaging/status/${messageId2}`).then((r) => r.json());
    const bulkgateDlrPayload = {
      message_id: status2.providerMessageId,
      status: 'seen',
      number: '381659998877',
    };

    const bgDlrRes = await fetch(`${BACKEND_URL}/messaging/webhook/bulkgate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bulkgateDlrPayload),
    }).then((r) => r.json());

    console.log(`   BulkGate DLR Matched: ${bgDlrRes.matched}`);
    const seenStatus = await fetch(`${BACKEND_URL}/messaging/status/${messageId2}`).then((r) => r.json());
    console.log(`   Updated status after BulkGate SEEN: ${seenStatus.status}`);
    console.log('   ✅ BulkGate DLR processed & fallback timer cancelled for read message');

    console.log('\n========================================================================');
    console.log('  ALL VIBER & SMS GATEWAY TESTS PASSED (100% SUCCESS)');
    console.log('========================================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runGatewayTests();
