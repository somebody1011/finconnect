# FinConnect

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)

**A unified wrapper for East African fintech payment providers**

[Features](#features) • [Quick Start](#quick-start) • [Supported Providers](#supported-providers) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## Overview

FinConnect is a lightweight, provider-agnostic integration wrapper that simplifies payment processing across multiple East African fintech platforms. Instead of managing different authentication flows, payload structures, and error handling for each provider, FinConnect provides a **single, unified API** for M-Pesa, AzamPay, ClickPesa, and more.

### The Problem We Solve

Integrating multiple payment providers typically requires:
- Learning different authentication flows (OAuth2 vs. JWT)
- Managing different payload structures per provider
- Implementing custom error handling for each API
- Maintaining complex provider-specific logic

FinConnect eliminates this complexity with a consistent, developer-friendly interface.

---

## ✨ Features

- 🔌 **Provider-Agnostic API** - Single interface for multiple payment providers
- 🔐 **Multi-Auth Support** - OAuth2, JWT, Bearer tokens handled transparently
- ⚡ **Type-Safe** - Full TypeScript support with complete type definitions
- 🌍 **Regional Coverage** - M-Pesa (Kenya/Tanzania), AzamPay (Tanzania), ClickPesa (East Africa)
- 🛡️ **Error Handling** - Consistent error messages and status tracking
- 🔄 **Async/Await Ready** - Modern async patterns throughout
- 📝 **Well-Documented** - Comprehensive examples and API documentation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later

### Installation

```bash
# Clone the repository
git clone https://github.com/somebody1011/finconnect.git

# Navigate to project directory
cd finconnect

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in your root directory with your provider credentials:

```env
# M-Pesa Configuration
MPESA_APP_KEY=your_key
MPESA_APP_SECRET=your_secret
MPESA_SHORT_CODE=174379

# AzamPay Configuration
AZAMPAY_SECRET=your_secret

# ClickPesa Configuration
CLICKPESA_CLIENT_ID=your_id
CLICKPESA_API_KEY=your_api_key
```

### Basic Usage

```typescript
import { FintechGateway } from './src/FintechGateway';

// Initialize gateway for M-Pesa
const gateway = new FintechGateway('mpesa', {
  apiKey: process.env.MPESA_APP_KEY,
  apiSecret: process.env.MPESA_APP_SECRET,
  shortCode: '174379',
  environment: 'sandbox'
});

// Process a payment
async function processPayment() {
  try {
    const response = await gateway.processPayment({
      amount: 1000,
      phoneNumber: '255700000000',
      reference: 'REF-99'
    });

    if (response.success) {
      console.log(`✅ Payment successful! Transaction ID: ${response.transactionId}`);
    } else {
      console.error(`❌ Payment failed: ${response.message}`);
    }
  } catch (error) {
    console.error('Error processing payment:', error);
  }
}

processPayment();
```

---

## 🏗️ Supported Providers

| Provider | Status | Auth Method | Region(s) |
|----------|--------|-------------|-----------|
| **ClickPesa** |🚧 Onprogress | JWT | East Africa |
| **M-Pesa** | 📋 Planned| OAuth2 | Kenya, Tanzania |
| **AzamPay** |  📋 Planned   | Bearer/Secret | Tanzania |
| **Airtel Money** | 📋 Planned | — | East Africa |
| **Tigopesa** | 📋 Planned | — | Tanzania |

---

## 📚 API Reference

### FintechGateway

#### Constructor

```typescript
new FintechGateway(provider: string, config: ProviderConfig)
```

**Parameters:**
- `provider` - The payment provider identifier ('mpesa', 'azampay', 'clickpesa')
- `config` - Provider-specific configuration object

#### Methods

##### `processPayment()`

```typescript
processPayment(params: PaymentParams): Promise<PaymentResponse>
```

**Parameters:**
```typescript
interface PaymentParams {
  amount: number;
  phoneNumber: string;
  reference: string;
  description?: string;
}
```

**Returns:**
```typescript
interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}
```

**Example:**
```typescript
const result = await gateway.processPayment({
  amount: 5000,
  phoneNumber: '254712345678',
  reference: 'ORD-2024-001',
  description: 'Payment for order #123'
});
```

---

## 📁 Project Structure

```
finconnect/
├── src/
│   ├── FintechGateway.ts        # Main gateway class
│   ├── providers/
│   │   ├── BaseProvider.ts      # Abstract base class
│   │   ├── MpesaProvider.ts     # M-Pesa implementation
│   │   ├── AzampayProvider.ts   # AzamPay implementation
│   │   └── ClickpesaProvider.ts # ClickPesa implementation
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── utils/
│       └── errorHandler.ts      # Error handling utilities
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

---

## 🔒 Security Best Practices

1. **Never commit credentials** - Use `.env` files and add them to `.gitignore`
2. **Use environment variables** - Store sensitive keys outside version control
3. **Validate inputs** - Always validate payment amounts and phone numbers
4. **HTTPS only** - All API calls are made over HTTPS
5. **Error messages** - Avoid exposing sensitive details in error responses

**Example:**
```typescript
// ❌ DO NOT DO THIS
const gateway = new FintechGateway('mpesa', {
  apiKey: 'your_actual_key_here'
});

// ✅ DO THIS
const gateway = new FintechGateway('mpesa', {
  apiKey: process.env.MPESA_APP_KEY,
  apiSecret: process.env.MPESA_APP_SECRET
});
```

---

## 🗺️ Roadmap

- [x] ClickPesa integration
- [ ] M-Pesa integration
- [ ] AzamPay integration
- [ ] Add B2C (Business to Customer) support
- [ ] Implement automatic retry logic for failed API calls
- [ ] Add comprehensive unit tests using Jest
- [ ] Add rate limiting and throttling
- [ ] Support for transaction status polling
- [ ] Webhook integration for payment notifications
- [ ] SDK for React Native

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** on GitHub
2. **Create a feature branch** for your changes:
   ```bash
   git checkout -b feature/add-new-provider
   ```
3. **Add a new provider** (if applicable):
   - Create a new file in `src/providers/` (e.g., `NewProviderName.ts`)
   - Extend the `BaseProvider` class
   - Implement required methods: `authenticate()`, `processPayment()`, `getTransactionStatus()`
4. **Add tests** for your changes:
   ```bash
   npm test
   ```
5. **Commit your changes** with clear messages:
   ```bash
   git commit -m "Add support for XYZ provider"
   ```
6. **Push to your fork** and submit a Pull Request

### Development Setup

```bash
# Install dev dependencies
npm install --save-dev

# Run tests
npm test

# Build the project
npm run build

# Lint the code
npm run lint
```

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **Issues** - Report bugs or request features via [GitHub Issues](https://github.com/somebody1011/finconnect/issues)
- **Discussions** - Join our community discussions [here](https://github.com/somebody1011/finconnect/discussions)
- **Author** - [@somebody1011](https://github.com/somebody1011)

---

## 🙏 Acknowledgments

- Built with ❤️ for the East African fintech community
- Inspired by Stripe's elegant API design
- Special thanks to all contributors and early users
- Thanks to the open-source community for amazing tools and libraries

---

<div align="center">

Made with ❤️ by [somebody1011](https://github.com/somebody1011)

⭐ Star us on GitHub! [somebody1011/finconnect](https://github.com/somebody1011/finconnect)

</div>
