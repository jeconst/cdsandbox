export interface AwsClient {
  readonly region: string;

  getStsCallerIdentity(): Promise<AwsCallerIdentity>;

  createEcrRepository(options: { repositoryName: string }): Promise<void>;
}

export interface AwsCallerIdentity {
  account: string;
}

export class Aws {
  constructor(private readonly client: AwsClient) {
  }

  get region(): string {
    return this.client.region;
  }

  async getAccountId(): Promise<string> {
    const callerIdentity = await this.client.getStsCallerIdentity();
    return callerIdentity.account;
  }

  createEcrRepository(name: string): void {
    this.client.createEcrRepository({
      repositoryName: name,
    });
  }
}
