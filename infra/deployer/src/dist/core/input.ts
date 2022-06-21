import { Readable } from "stream";

import { LineReader } from "./line-reader";
import { UnknownNavigationError, UnknownNavigator } from "./unknown-navigator";
import { handleErrorIf } from "./util";

export type CommandConfig = {
  projectName: string;
}

export type InfoCommand = { command: "info" }

export type DeploymentCommand =
  | { command: "init", config: CommandConfig }

export type Command = InfoCommand | DeploymentCommand

export class InputError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class Input {
  private readonly lineReader;

  constructor(inputStream: Readable) {
    this.lineReader = new LineReader(inputStream);
  }

  async readCommand(): Promise<Command> {
    const line = await this.lineReader.readLine();

    if (!line) {
      throw new InputError("No command specified");
    }

    return parseCommand(line);
  }
}

function parseJson(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch (err) {
    throw new InputError("Invalid JSON");
  }
}

function parseCommand(json: string): Command {
  const parsed: unknown = parseJson(json);
  const navigator = new UnknownNavigator(parsed);

  try {
    const command = navigator.property("command").expectString();

    if (command === "info") {
      return { command: "info" };
    } else if (command === "init") {
      const config = navigator.property("config");
      const projectName = config.property("projectName").expectString();

      return { command: "init", config: { projectName } };
    } else {
      throw new InputError(`Invalid command: ${command}`);
    }
  } catch (err) {
    handleErrorIf(err, err instanceof UnknownNavigationError);
    throw new InputError(err.message);
  }
}
