import packageInfo from "../../../package.json";

import { Deployer } from "./deployer";
import { ProcessHost } from "./host";
import { Input, Command, InputError } from "./input";
import { Output } from "./output";

export async function runProgram(host: ProcessHost): Promise<number> {
  const input = new Input(host.terminal.stdin);
  const output = new Output(host.terminal.stdout, host.terminal.stderr);
  const deployer = new Deployer(output);
  const context = { output, deployer };

  try {
    const command = await input.readCommand();
    await processCommand(command, context);
    return 0;
  } catch (err) {
    if (err instanceof InputError) {
      output.error(err.message);
      return 1;
    }

    /* istanbul ignore next */
    throw err;
  }
}

type CommandContext = {
  deployer: Deployer;
  output: Output;
};

async function processCommand(command: Command, { deployer, output }: CommandContext) {
  if (command.command === "init") {
    await deployer.init();
  } else if (command.command === "info") {
    output.info(`${packageInfo.name} v${packageInfo.version}`);
  }
}
