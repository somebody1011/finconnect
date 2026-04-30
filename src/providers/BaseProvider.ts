// Add 'export' right here
export abstract class baseProvider {
  protected config: any;
  constructor(config: any) { 
    this.config = config; 
  }
  abstract authenticate(): Promise<string>;
  abstract initiateUssdPushRequest(params: { payload: any, ipnId?: string }): Promise<any>;
  async registerIpn(_ipnUrl: string, _ipnNotificationType: "GET" | "POST"): Promise<any> {
    throw new Error("IPN registration not supported by this provider");
  }
}
