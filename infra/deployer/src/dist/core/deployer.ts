import { Output } from "./output";

export class Deployer {
  constructor(private readonly output: Output) {
  }

  async init(): Promise<number> {
    this.output.info("Initializing");
    return 0;
  }
}
