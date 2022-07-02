import { AwsCallerIdentity, AwsClient } from "../../dist/core/aws-client";

export interface AwsState {
  ecr: Record<string, Array<object>>;
}

export function initialAwsState() {
  return { ecr: {} };
}

export class FakeAwsClient implements AwsClient {
  readonly region: string;

  constructor(private readonly state: AwsState, env: Record<string, string>) {
    const region = env["AWS_REGION"];

    if (!region) {
      throw new Error("AWS_REGION environment variable is not set.");
    }

    this.region = region;
  }

  getCallerIdentity(): AwsCallerIdentity {
    return {
      account: "2345678",
    };
  }
}
