import { PesapalProvider } from '../src/providers/PesapalProvider';

async function main() {
  // Initialize the provider with test credentials
  const pesapal = new PesapalProvider({baseUrl:'https://api.pesapal.com', PESAPAL_CONSUMER_KEY:'your-api-key',PESAPAL_CONSUMER_SECRET:'your-api-secret'});

  try {
    // Step 1: Register an IPN
    const ipnUrl = 'https://yourdomain.com/ipn';
    console.log('Registering IPN...');
    const ipnId = await pesapal.registerIpn(ipnUrl,'GET');
    console.log('Registered IPN ID:', ipnId);

    // Step 2: Initiate a USSD Push
    const payload = {
      phoneNumber: '254700123456',
      amount: 100,
      currency: 'KES',
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

// main();