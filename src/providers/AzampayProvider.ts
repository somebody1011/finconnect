import {baseProvider} from "./BaseProvider.js";
import * as dotenv from 'dotenv';
dotenv.config();
import axios from "axios";
import * as crypto from 'crypto';

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
            // console.log('Obtained Auth Token:', token); // Debug log for token  
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

            
            return response.data.transactionId;
        } catch (error: any) {
            if (error.response) {
                console.error('USSD Push Request Error Response:', error.response.data);
                throw new Error(`Payment request failed: ${error.response.data.message || error.message}`);
            }
            throw new Error(`Payment request failed: ${error.message || error}`);
        }
    }

    //  Check Transaction Status (Unsupported in Tanzania Sandbox)
    async checkPaymentStatus(params: { transactionId: string }): Promise<any> {
        throw new Error("AzamPay Tanzania does not support polling for payment status. Please use the Webhook Callback (handleCallback) strategy instead.");
    }

    // Handle Payment Callback with Signature Verification 
    async getPublicKey(): Promise<string> {
        try {
            const token = await this.authenticate();
            const response = await axios.get(`${this.config.baseUrl}/azampay/v1/public-key?format=Pem`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.publicKey;
        } catch (error: any) {
            throw new Error(`Failed to fetch public key: ${error.message}`);
        }
    }

    verifyCallbackSignature(
        utilityRef: string,
        externalReference: string,
        transactionStatus: string,
        operatorName: string,
        signatureBase64: string,
        publicKeyPem: string
    ): boolean {
        const dataToVerify = `${utilityRef}${externalReference}${transactionStatus}${operatorName}`;
        const verifier = crypto.createVerify('SHA256');
        verifier.update(dataToVerify, 'utf8');
        verifier.end();
        return verifier.verify(publicKeyPem, signatureBase64, 'base64');
    }

    async handleCallback(callbackData: any): Promise<{isValid: boolean, data: any}> {
        try {
            const publicKeyPem = await this.getPublicKey();
            
            const isValid = this.verifyCallbackSignature(
                callbackData.utilityref || '',
                callbackData.externalreference || '',
                callbackData.transactionstatus || '',
                callbackData.operator || '',
                callbackData.signature || '',
                publicKeyPem
            );
            
            return { isValid, data: callbackData };
        } catch (error: any) {
            throw new Error(`Callback handling failed: ${error.message}`);
        }
    }
}       



// async function testAzampay() {
//     const azampay = new AzampayProvider({baseUrl:process.env.AZAMPAY_BASE_URL,AZAMPAY_APP_NAME:process.env.AZAMPAY_APP_NAME, AZAMPAY_CONSUMER_KEY:process.env.AZAMPAY_CLIENT_ID, AZAMPAY_CONSUMER_SECRET:process.env.AZAMPAY_API_KEY});
//     const auth = await azampay.authenticate();
//     console.log('Auth token:', auth);

// }

// testAzampay()