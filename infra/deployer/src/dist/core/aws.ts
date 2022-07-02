import { AwsClient } from "./aws-client";

export class Aws {
  constructor(private readonly client: AwsClient) {
  }

  get region(): string {
    return this.client.region;
  }

  getAccountId(): string {
    const callerIdentity = this.client.getCallerIdentity();
    return callerIdentity.account;
  }

  createEcrRepository(name: string): void {
    throw new Error("TODO");
  }
}
