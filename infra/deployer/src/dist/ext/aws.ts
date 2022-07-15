import { AwsCallerIdentity, AwsClient } from "../core/aws";

import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

export class LiveAwsClient implements AwsClient {
  readonly region: string;

  constructor() {
    const region = process.env["AWS_REGION"];

    if (!region) {
      throw new Error("AWS_REGION environment variable is not set.");
    }

    this.region = region;
  }

  async getStsCallerIdentity(): Promise<AwsCallerIdentity> {
    const client = new STSClient({});
    const result = await client.send(new GetCallerIdentityCommand({}));

    return {
      account: result.Account || "",
    };
  }

  async createEcrRepository(options: { repositoryName: string }): Promise<void> {
    throw new Error("TODO");
  }
}
