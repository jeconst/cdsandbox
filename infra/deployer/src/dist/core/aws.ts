export interface AwsConnectionInfo {
  accountId: string;
  accountName: string;
  region: string;
}

export interface AwsState {
  ecr: Record<string, Array<object>>;
}

export interface Aws {
  getState(): AwsState;
  getConnectionInfo(): AwsConnectionInfo;
  createEcrRepository(name: string): void;
}
