// Add 'export' right here
export abstract class baseProvider {
  protected config: any;
  constructor(config: any) { 
    this.config = config; 
  }
  abstract authenticate(): Promise<string>;
  abstract requestPayment(payload: any): Promise<any>;
}
