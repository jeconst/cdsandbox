import { Readable } from "stream";

import { LineReader } from "./line-reader";

export type CommandConfig = unknown

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

function hasOwnProperty<K extends string>(obj: object, prop: K): obj is Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
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

  if (typeof parsed !== "object" || parsed === null) {
    throw new InputError("Expected object");
  }

  if (!hasOwnProperty(parsed, "command")) {
    throw new InputError("Expected object to have `command`");
  }

  if (typeof parsed.command !== "string") {
    throw new InputError("Expected command to be a string");
  }

  if (parsed.command === "info") {
    return { command: "info" };
  } else if (parsed.command === "init") {
    return { command: "init", config: "TODO" };
  } else {
    throw new InputError(`Invalid command: ${parsed.command}`);
  }
}
