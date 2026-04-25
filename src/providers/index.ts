import { baseProvider } from './BaseProvider';
import { ClickpesaProvider } from './ClickpesaProvider';
import { PesapalProvider } from './PesapalProvider';

export enum ProviderType {
  clickpesa = 'clickpesa',
  pesapal = 'pesapal',
}

export class ProviderFactory {
  /**
   * Factory method to create a specific provider instance.
   * 
   * Security Considerations:
   * 1. Validates the provider type against an allowed list via a switch statement,
   *    preventing prototype pollution or instantiation of arbitrary objects.
   * 2. Throws an explicit error for unsupported providers, avoiding silent failures.
   * 3. Validates that essential configuration parameters are present before instantiating.
   */
  static createProvider(provider: ProviderType | string, config: any): baseProvider {
    switch (String(provider).toLowerCase()) {
      case ProviderType.clickpesa:
        if (!config || !config.baseUrl || !config.CLICKPESA_CLIENT_ID || !config.CLICKPESA_API_KEY) {
          throw new Error("Invalid configuration: Missing required fields for Clickpesa.");
        }
        return new ClickpesaProvider(config);

      case ProviderType.pesapal:
        if (!config || !config.baseUrl || !config.PESAPAL_CONSUMER_KEY || !config.PESAPAL_CONSUMER_SECRET) {
          throw new Error("Invalid configuration: Missing required fields for Pesapal.");
        }
        return new PesapalProvider(config);

      default:
        // Security: Fail securely if an unknown provider is requested.
        throw new Error(`Unsupported provider type: ${String(provider)}`);
    }
  }
}

export class FintechSDK {
  private gateway: baseProvider;

  constructor(options: { provider: ProviderType | string; config: any }) {
    // Utilize the secure ProviderFactory to instantiate the gateway
    this.gateway = ProviderFactory.createProvider(options.provider, options.config);
  }

  async registerIpn(ipnUrl: string, ipnNotificationType: "GET" | "POST" = "GET") {
    // Allows the user to register an IPN and retrieve an ipnId
    return this.gateway.registerIpn(ipnUrl, ipnNotificationType);
  }

  async pay(data: any, ipnId?: string) {
    // Normalizes the data structure depending on what the underlying provider expects.
    if (this.gateway instanceof PesapalProvider) {
      // Pesapal expects an object with payload and ipnId
      return this.gateway.initiateUssdPushRequest({ payload: data, ipnId });
    } else {
      // Clickpesa and others expect the raw payload directly
      return this.gateway.initiateUssdPushRequest(data);
    }
  }
}