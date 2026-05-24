import {baseProvider} from "./BaseProvider.js";

import axios from "axios";

export class AzampayProvider extends baseProvider {
    constructor(config: any) {
        super(config);
    }

    async authenticate(): Promise<string> {
        try {
            const response = await axios.post(
                ` https://authenticator-sandbox.azampay.co.tz/AppRegistration/GenerateToken`,
                {
                    'appName': this.config.AZAMPAY_APP_NAME,
                    'clientId': this.config.AZAMPAY_CONSUMER_KEY,
                    'clientSecret': this.config.AZAMPAY_CONSUMER_SECRET,
                },
                {
                    headers: {
                        
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            return response.data.data.accessToken;
        } catch (error:any) {
            if (error.response) {
                console.error('Authentication Error Response:', error.response.data);
                throw new Error(`Authentication failed: ${error.response.data.message || error.message}`);
            }
            throw new Error(`Authentication failed: ${error}`);
        }
    }

    async initiateUssdPushRequest({ payload }: { payload: any }): Promise<any> {
        try {
            const token = await this.authenticate();
            
            
            const response = await axios.post(
                `${this.config.baseUrl}/azampay/mno/checkout`,
                payload,
                {
                    headers: {
                        
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

           
            
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.error('USSD Push Request Error Response:', error.response.data);
                throw new Error(`Payment request failed: ${error.response.data.message || error.message}`);
            }
            // throw new Error(`Payment request failed: ${error}`);
        }
    }


    async checkPaymentStatus(params: { transactionId: string }): Promise<any> {
        try {
            const token = await this.authenticate();
            
            const response = await axios.get(
                `${this.config.baseUrl}/azampay/mno/checkout/${params.transactionId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            
            return response.data;
        } catch (error: any) {
            throw new Error(`Payment status check failed: ${error}`);
        }
    }
}       



// async function testAzampay() {
//     const azampay = new AzampayProvider({baseUrl:process.env.AZAMPAY_BASE_URL,AZAMPAY_APP_NAME:process.env.AZAMPAY_APP_NAME, AZAMPAY_CONSUMER_KEY:process.env.AZAMPAY_CLIENT_ID, AZAMPAY_CONSUMER_SECRET:process.env.AZAMPAY_API_KEY});
//     const auth = await azampay.authenticate();
//     console.log('Auth token:', auth);

// }

// testAzampay()