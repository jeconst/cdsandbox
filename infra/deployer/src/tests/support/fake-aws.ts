import { AwsCallerIdentity, AwsClient, DescribeRepositoriesResponse } from "../../dist/core/aws";

import { TestAwsConfig } from "./test-lab";

export interface AwsState {
  ecr: Record<string, Array<object>>;
}

export function initialAwsState() {
  return { ecr: {} };
}

class ErrorWithCode extends Error {
  constructor(message: string, public readonly Code: string) {
    super(message);
  }
}

export class FakeAwsClient implements AwsClient {
  static readonly config: TestAwsConfig = Object.freeze({
    accountId: "12345678",
    region: "mars-2",
    accessKeyId: "VALIDKEY",
    secretAccessKey: "VALIDSECRET",
    sessionToken: undefined,
  });

  readonly region: string;

  constructor(
    private readonly state: AwsState,
    private readonly env: Record<string, string | undefined>,
  ) {
    this.region = env["AWS_REGION"] || "";
  }

  async getStsCallerIdentity(): Promise<AwsCallerIdentity> {
    this.checkEnvironment();

    return {
      account: "12345678",
    };
  }

  async createEcrRepository(options: { repositoryName: string }): Promise<void> {
    this.state.ecr[options.repositoryName] = [];
  }

  async describeEcrRepositories(): Promise<DescribeRepositoriesResponse> {
    throw new Error("TODO");
  }

  private checkEnvironment(): void {
    if (this.env["AWS_REGION"] === undefined) {
      throw new Error("Region not set");
    }

    if (this.env["AWS_REGION"] !== FakeAwsClient.config.region) {
      throw new Error(`Invalid region: ${this.env["AWS_REGION"]}`);
    }

    if (this.env["AWS_SECRET_ACCESS_KEY"] != FakeAwsClient.config.secretAccessKey) {
      throw new ErrorWithCode("Invalid secret key", "SignatureDoesNotMatch");
    }
  }
}
