import {baseProvider} from './BaseProvider';
import axios from 'axios';

export class PesapalProvider extends baseProvider {
    constructor(config: any) {
        super(config);
    }

    async authenticate(): Promise<string> {
        try {
            const response = await axios.post(
                `${this.config.baseUrl}/api/Auth/RequestToken`,
                {
                    consumer_key: this.config.PESAPAL_CONSUMER_KEY,
                    consumer_secret: this.config.PESAPAL_CONSUMER_SECRET,
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data.token;
        } catch (error) {
            throw new Error(`Authentication failed: ${error}`);
        }
    }

async registerIpn(ipnUrl: string, ipnNotificationType: "GET" | "POST"): Promise<any> {
        try {
            const token = await this.authenticate();
            const response = await axios.post(
                `${this.config.baseUrl}/api/URLSetup/RegisterIPN`, // sandbox path
                {
                    url: ipnUrl,
                    ipn_notification_type: ipnNotificationType
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        
                    }
                }
            );
            return response.data.ipn_id;
        } catch (error) {
            throw new Error(`IPN registration failed: ${error}`);
        }
    }

    async initiateUssdPushRequest({ payload, ipnId }: { payload: any, ipnId?: string }): Promise<any> {
        try {
            const token = await this.authenticate();
            const finalPayload = {
                ...payload,
                notification_id: ipnId 
            };
            const response = await axios.post(
                `${this.config.baseUrl}/api/Transactions/SubmitOrderRequest`,
                finalPayload,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(`Payment request failed: ${error}`);
        }
    }
}