import express from 'express';
import dotenv from 'dotenv';
import { FintechSDK } from '../src/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// const pesapal = new PesapalProvider({
//   baseUrl: process.env.PESAPAL_BASE_URL || 'https://cybqa.pesapal.com/pesapalv3',
//   PESAPAL_CONSUMER_KEY: process.env.PESAPAL_CONSUMER_KEY || '',
//   PESAPAL_CONSUMER_SECRET: process.env.PESAPAL_CONSUMER_SECRET || '',
// });

const fintechSDK = new FintechSDK({
  provider: 'azampay',
  config: {
    baseUrl: process.env.AZAMPAY_BASE_URL || 'https://sandbox.azampay.co.tz',
    AZAMPAY_APP_NAME: process.env.AZAMPAY_APP_NAME,
    AZAMPAY_CONSUMER_KEY: process.env.AZAMPAY_CLIENT_ID,
    AZAMPAY_CONSUMER_SECRET: process.env.AZAMPAY_API_KEY
  }
});

// IMPORTANT: Make sure to update your AZAMPAY_CALLBACK_URL in the AzamPay Portal
// to point to your ngrok URL with this exact path, e.g.,
// https://ayla-soarable-interspersedly.ngrok-free.dev/azampay/callback
app.post('/azampay/callback', async (req, res) => {
  console.log('Received AzamPay Callback:', req.body);
  try {
    // This will fetch the public key and verify the signature automatically
    const result = await fintechSDK.handleCallback(req.body);
    
    if (result.isValid) {
      const transactionData = result.data;
      console.log('✅ Payment Signature Verified!', transactionData);
      
      // TODO: Update your database using transactionData
      // Example: await updateOrder(transactionData.utilityref, transactionData.transactionstatus);
      
      res.status(200).send('OK');
    } else {
      console.error('❌ Invalid signature received in callback');
      res.status(400).send('Invalid Signature');
    }
  } catch (error: any) {
    console.error('Callback processing error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/ipn', async (req, res) => {
  try {
    const ipnData = req.body;
    console.log('Received IPN:', ipnData);

    // Process the IPN data as needed
    // For example, you can verify the payment status and update your database

    res.status(200).send('IPN received');
  } catch (error) {
    console.error('Error processing IPN:', error);
    res.status(500).send('Error processing IPN');
  }
});

app.get('/callback_url', (req, res) => {
  res.send('Callback URL hit');
});
app.get('/', (req, res) => {
  res.send('Fintech SDK Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});