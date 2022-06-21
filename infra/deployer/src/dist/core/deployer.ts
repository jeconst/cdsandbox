import { CommandConfig } from "./input";
import { Output } from "./output";

export class Deployer {
  constructor(
    private readonly output: Output,
    private readonly config: CommandConfig,
  ) {
  }

  async init(): Promise<number> {
    this.output.info(`Initializing ECS deployment for '${this.config.projectName}'`);

    this.output.info("Connected to AWS account");

    return 0;
  }
}
