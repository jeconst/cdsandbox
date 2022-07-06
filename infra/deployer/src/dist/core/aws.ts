export interface AwsCallerIdentity {
  account: string;
}

export interface AwsClient {
  readonly region: string;

  getStsCallerIdentity(): AwsCallerIdentity;

  createEcrRepository(options: { repositoryName: string }): void;
}

export class Aws {
  constructor(private readonly client: AwsClient) {
  }

  get region(): string {
    return this.client.region;
  }

  getAccountId(): string {
    const callerIdentity = this.client.getStsCallerIdentity();
    return callerIdentity.account;
  }

  createEcrRepository(name: string): void {
    this.client.createEcrRepository({
      repositoryName: name,
    });
  }
}
