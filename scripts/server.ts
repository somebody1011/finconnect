import express from 'express';
import dotenv from 'dotenv';
// import { PesapalProvider } from '../src/providers/PesapalProvider';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// const pesapal = new PesapalProvider({
//   baseUrl: process.env.PESAPAL_BASE_URL || 'https://cybqa.pesapal.com/pesapalv3',
//   PESAPAL_CONSUMER_KEY: process.env.PESAPAL_CONSUMER_KEY || '',
//   PESAPAL_CONSUMER_SECRET: process.env.PESAPAL_CONSUMER_SECRET || '',
// });

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