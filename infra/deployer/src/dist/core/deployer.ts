import { Aws } from "./aws";
import { AwsClient } from "./aws";
import { CommandConfig } from "./input";
import { Output } from "./output";

export class Deployer {
  private readonly aws: Aws;

  constructor(
    awsClient: AwsClient,
    private readonly config: CommandConfig,
    private readonly output: Output,
  ) {
    this.aws = new Aws(awsClient);
  }

  async init(): Promise<number> {
    this.output.info(`Initializing ECS deployment for '${this.config.projectName}'`);

    const accountId = await this.aws.getAccountId();
    this.output.info(
      `Connected to AWS account ${accountId}, region ${this.aws.region}`
    );

    const reposToCreate = [this.config.projectName, `${this.config.projectName}-test`];

    for (const repoName of reposToCreate) {
      this.output.info(`Creating ECR repository '${repoName}'`);
      this.aws.createEcrRepository(repoName);
    }

    this.output.info("Initialization complete!");

    return 0;
  }
}
