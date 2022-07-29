import { ECRClient, DescribeRepositoriesCommand } from "@aws-sdk/client-ecr";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

import { AwsClient, AwsCallerIdentity, DescribeRepositoriesResponse } from "../core/aws";

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

  async describeEcrRepositories() {
    const client = new ECRClient({});
    const result = await client.send(new DescribeRepositoriesCommand({}));

    return {
      nextToken: result.nextToken,
      repositories: result.repositories?.map(repo => ({
        repositoryName: repo.repositoryName,
      })) ?? [],
    }
  }
}
