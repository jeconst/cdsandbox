import { strict as assert } from "assert";

import packageInfo from "../../../package.json";

import { Deployer } from "./deployer";
import { Host } from "./host";
import { Input, Command, InputError } from "./input";
import { Output } from "./output";
import { handleErrorIf } from "./util";

export async function runProgram(host: Host): Promise<number> {
  const input = new Input(host.terminal.stdin);
  const output = new Output(host.terminal.stdout, host.terminal.stderr);

  try {
    const command = await input.readCommand();
    await processCommand(command, host, output);
    return 0;
  } catch (err) {
    handleErrorIf(err, err instanceof InputError);
    output.error(err.message);
    return 1;
  }
}

async function processCommand(command: Command, host: Host, output: Output) {
  if (command.command === "info") {
    output.info(`${packageInfo.name} v${packageInfo.version}`);
  } else {
    const deployer = new Deployer(output, command.config);

    assert.equal(command.command, "init");
    await deployer.init();
  }
}
