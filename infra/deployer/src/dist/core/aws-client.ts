export interface AwsCallerIdentity {
  account: string;
}

export interface AwsClient {
  readonly region: string;

  getCallerIdentity(): AwsCallerIdentity;
}
