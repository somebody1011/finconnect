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
        {},
        {
          headers: {
            'client-id':this.config.CLICKPESA_CLIENT_ID,                  
            'api-key':this.config.CLICKPESA_API_KEY,
            
            "Content-Type": "application/json",
          },
        }
      );
      console.log('Authentication response:', response.data);
      return response.data.token;
    } catch (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
  }

  async initiateUssdPushRequest(payload: any): Promise<any> {
    try {
      const token = await this.authenticate();
      console.log(token)
      console.log('Initiating USSD Push with payload:', payload);
      const response = await axios.post(
        `${this.config.baseUrl}/third-parties/payments/initiate-ussd-push-request`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      return response.data;
    } catch (error:any) {
      console.error('USSD Push Error:', error.response?.data || error.message);
      throw new Error(`Payment request failed: ${error.response?.data?.message || error.message}`);
    }
  } 
}

// async function testClickpesa() {
//     const clickpesa= new ClickpesaProvider({baseUrl:process.env.CLICKPESA_BASE_URL, CLICKPESA_CLIENT_ID:'IDASutx1B6DxrlN6YeI2E2icl3JaNMNx', CLICKPESA_API_KEY:'SKWLtYfKZveyxodfO0geynsUzoVqjZk5A0HAcJe5e8'});
//     const auth = await clickpesa.authenticate();
//     console.log('Auth token:', auth);

// }

// // testClickpesa()