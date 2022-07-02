import { AwsCallerIdentity, AwsClient } from "../core/aws-client";

export class RealAwsClient implements AwsClient {
  readonly region: string;

  constructor() {
    const region = process.env["AWS_REGION"];

    if (!region) {
      throw new Error("AWS_REGION environment variable is not set.");
    }

    this.region = region;
  }

  getCallerIdentity(): AwsCallerIdentity {
    throw new Error("Method not implemented.");
  }
}
