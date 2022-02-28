import { Cli } from "./core/cli";
import { realEnvironment } from "./ext/real-environment";

export async function runCli(args: string[]): Promise<number> {
  const cli = new Cli(realEnvironment());
  return await cli.run(args);
}
