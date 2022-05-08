export interface AwsState {
  ecr: Record<string, Array<object>>;
}

export interface Aws {
  getState(): AwsState;
}
