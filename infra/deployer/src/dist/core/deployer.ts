import { Aws } from "./aws";
import { CommandConfig } from "./input";
import { Output } from "./output";

export class Deployer {
  constructor(
    private readonly aws: Aws,
    private readonly config: CommandConfig,
    private readonly output: Output,
  ) {
  }

  async init(): Promise<number> {
    this.output.info(`Initializing ECS deployment for '${this.config.projectName}'`);

    const awsInfo = this.aws.getConnectionInfo();
    this.output.info(
      `Connected to AWS account ${awsInfo.accountId} (${awsInfo.accountName})` +
      `, region ${awsInfo.region}`
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
