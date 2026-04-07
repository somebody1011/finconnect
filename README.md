# finconnect
🚀 Unified Fintech Wrapper (Node.js + TypeScript)A lightweight, provider-agnostic integration wrapper for East African Fintech APIs. Integrate M-Pesa, ClickPesa, and AzamPay using a single, unified syntax.

📌 Problem StatementIntegrating multiple payment providers usually requires learning different authentication flows (OAuth2 vs. JWT), different payload structures, and different error handling. This package abstracts those complexities, allowing developers to switch providers by changing a single string.✨ FeaturesUnified Interface: One method processPayment() for all providers.Automatic Token Management: Handles OAuth2 and JWT generation/refreshing internally.Type Safety: Full TypeScript support for payment requests and responses.Plug-and-Play: Strategy-based architecture makes adding new providers easy.🛠 InstallationBash# Clone the repository
git clone https://github.com/yourusername/fintech-wrapper.git

# Install dependencies
npm install
🚀 Quick Start1. Configure your EnvironmentCreate a .env file in your root directory:Code snippetMPESA_APP_KEY=your_key
MPESA_APP_SECRET=your_secret
AZAMPAY_SECRET=your_secret
CLICKPESA_CLIENT_ID=your_id
CLICKPESA_API_KEY=your_api_key
2. Basic UsageTypeScriptimport { FintechGateway } from './src/FintechGateway';

const gateway = new FintechGateway('mpesa', {
  apiKey: process.env.MPESA_APP_KEY,
  apiSecret: process.env.MPESA_APP_SECRET,
  shortCode: '174379',
  environment: 'sandbox'
});

async function runPayment() {
  const response = await gateway.processPayment({
    amount: 1000,
    phoneNumber: '255700000000',
    reference: 'REF-99'
  });

  if (response.success) {
    console.log(`Success! Transaction ID: ${response.transactionId}`);
  } else {
    console.error(`Error: ${response.message}`);
  }
}

runPayment();

🏗 Supported ProvidersProviderStatusAuth MethodRegionM-Pesa✅ ActiveOAuth2Kenya / TanzaniaAzamPay✅ ActiveBearer / SecretTanzaniaClickPesa✅ ActiveJWTEast AfricaAirtel Money🛠 Coming Soon-Africa🛡 Security Best PracticesServer-Side Only: This package is intended for Node.js backend use. Never expose your API keys or use this wrapper directly on the frontend.Env Variables: Always use dotenv or a secrets manager to handle credentials.🗺 Roadmap[ ] Add Webhook Verification utilities.
[ ] Add B2C (Business to Customer) support.
[ ] Implement automatic retry logic for failed API calls.
[ ] Add unit tests using Jest.

🤝 ContributingContributions are welcome! If you'd like to add a new provider (e.g., Tigopesa, Airtel Money), please:Fork the repo.Create a new provider class in src/providers/.Ensure it implements the IProvider interface.Submit a Pull Request.📄 LicenseThis project is licensed under the MIT License - see the LICENSE file for details.Pro-Tip for your GitHub:Include a folder named examples/ in your repo with a simple test-mpesa.ts and test-azampay.ts file. When other developers see that they can run your code in 5 seconds, they will be much more likely to use your package!Good luck with the build—you're building a tool that solves a real-world headache.
