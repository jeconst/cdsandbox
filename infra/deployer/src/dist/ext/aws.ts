import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

import { AwsCallerIdentity, AwsClient } from "../core/aws";

export class LiveAwsClient implements AwsClient {
  readonly region: string;

  constructor() {
    this.region = process.env["AWS_REGION"] || "";
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
