import { AwsCallerIdentity, AwsClient } from "../core/aws";

export class RealAwsClient implements AwsClient {
  readonly region: string;

  constructor() {
    const region = process.env["AWS_REGION"];

    if (!region) {
      throw new Error("AWS_REGION environment variable is not set.");
    }

    this.region = region;
  }

  getStsCallerIdentity(): AwsCallerIdentity {
    throw new Error("TODO");
  }

  createEcrRepository(options: { repositoryName: string }): void {
    throw new Error("TODO");
  }
}
