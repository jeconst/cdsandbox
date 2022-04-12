import { Cli } from "./core/cli";
import { getSystemHost } from "./ext/system-host";

export async function runCli(args: string[]): Promise<number> {
  const cli = new Cli(getSystemHost());
  return await cli.run(args);
}
