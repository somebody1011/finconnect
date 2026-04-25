// import process from "process";import { baseProvider } from "./BaseProvider";
import { baseProvider } from "./BaseProvider";
import axios from "axios";

export class ClickpesaProvider extends baseProvider {
  constructor(config: any) {
    super(config);
  }

  async authenticate(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/third-parties/generate-token`,
        {
          headers: {
            'client-id': this.config.CLICKPESA_CLIENT_ID,                  
            'api-key': this.config.CLICKPESA_API_KEY ,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.token;
    } catch (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
  }

  async initiateUssdPushRequest(payload: any): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await axios.post(
        `${this.config.baseUrl}/third-parties/payments/initiate-ussd-push-request`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Payment request failed: ${error}`);
    }
  } 
}
