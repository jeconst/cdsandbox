import { Environment } from "./environment";
import { Output } from "./output";

export class Deployer {
  private readonly output: Output;

  constructor(private readonly env: Environment) {
    this.output = new Output(env.stdout, env.stderr);
  }

  async init(): Promise<number> {
    this.output.info("Initializing");
    return 0;
  }
}
