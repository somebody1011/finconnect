import { baseProvider } from "./BaseProvider.js";
import axios from "axios";
import * as dotenv from 'dotenv';

dotenv.config();

export class ClickpesaProvider extends baseProvider {
  constructor(config: any) {
    super(config);
  }

    async authenticate(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/generate-token`, // Resolves cleanly to https://clickpesa.com
        {},
        {
          headers: {
            'client-id': this.config.CLICKPESA_CLIENT_ID,                  
            'api-key': this.config.CLICKPESA_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
  }

  async initiateUssdPushRequest(payload: any): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await axios.post(
        `${this.config.baseUrl}/third-parties/payments/initiate-ussd-push-request`, // Added /third-parties/
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token, 
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('USSD Push Error:', error.response?.data || error.message);
      throw new Error(`Payment request failed: ${error.response?.data?.message || error.message}`);
    }
  } 

  async checkPaymentStatus(params: { transactionId: string }): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await axios.get(
        `${this.config.baseUrl}/third-parties/payments/${params.transactionId}`, // Added /third-parties/
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token, 
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Payment status check failed: ${error}`);
    }
  }
}

