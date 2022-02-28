import packageInfo from "../../../package.json";

import { Deployer } from "./deployer";
import { Environment } from "./environment";
import { Output } from "./output";

export class Cli {
  private readonly deployer: Deployer;
  private readonly output: Output;

  constructor(env: Environment) {
    this.deployer = new Deployer(env);
    this.output = new Output(env.stdout, env.stderr);
  }

  async run(args: string[]): Promise<number> {
    args = args.slice();
    const commandName = args.shift();

    if (!commandName) {
      this.output.error("No command specified");
      return 1;
    }

    switch (commandName) {
      case "init":
        return await this.deployer.init();
      case "info":
        this.output.info(`${packageInfo.name} v${packageInfo.version}`);
        return 0;
      default:
        this.output.error(`Invalid command: ${commandName}`);
        return 1;
    }
  }
}

