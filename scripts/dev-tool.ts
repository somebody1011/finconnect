import { PesapalProvider } from '../src/providers/PesapalProvider';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Initialize the provider with test credentials
  const pesapal = new PesapalProvider({baseUrl:process.env.PESAPAL_BASE_URL, PESAPAL_CONSUMER_KEY:process.env.PESAPAL_CONSUMER_KEY,PESAPAL_CONSUMER_SECRET:process.env.PESAPAL_CONSUMER_SECRET});

  try {
    // Step 1: Register an IPN
    const ipnUrl = `${process.env.PESAPAL_IPN_URL}`;
    console.log('Registering IPN...');
    const ipnId = await pesapal.registerIpn(ipnUrl,'GET');
    console.log('Registered IPN ID:', ipnId);

    // Step 2: Initiate a USSD Push
    const payload = {
      "id": "COO1",
      "currency": "TZS",
      "amount": 1000.00,
      "description": "WRAPPER TEST",
      "callback_url": `${process.env.PESAPAL_CALLBACK_URL}`,
      "redirect_mode": "",
      "notification_id": ipnId,
      "branch": "Store Name - HQ",
      "billing_address": {
        "phone_number": "0761844119",
        "first_name": "elisha",
        "last_name": "gerson",

  }

    };
    console.log('Initiating USSD Push...');
    const response = await pesapal.initiateUssdPushRequest({payload,ipnId});
    console.log('USSD Push Response:', response);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error);
    }
  }
}

main();