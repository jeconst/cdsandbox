import * as stream from "stream";

import { Cli } from "../../dist/core/cli";
import { Host } from "../../dist/core/host";

class OutputStream extends stream.Writable {
  contents = "";

  _write(chunk: Buffer | string, _encoding: unknown, callback: () => void) {
    const text = chunk.toString();
    this.contents += text;
    callback();
  }
}

export type TerminalOutput =
  | string
  | { stderr: string }
  | { stdout: string, stderr: string }

type stringMatcher = string | RegExp;
export type TerminalOutputMatcher =
  | stringMatcher
  | { stderr: stringMatcher }
  | { stdout: stringMatcher, stderr: stringMatcher }

export interface TestCliOptions {
  args: string[];
  expectedExitCode: number;
  expectedOutput: TerminalOutputMatcher;
}

export class TestHost implements Host {
  stdout: OutputStream;
  stderr: OutputStream;

  constructor() {
    this.stdout = new OutputStream();
    this.stderr = new OutputStream();
  }

  output(): TerminalOutput {
    if (!this.stderr.contents) {
      return this.stdout.contents;
    }

    if (this.stdout.contents) {
      return {
        stdout: this.stdout.contents,
        stderr: this.stderr.contents,
      };
    } else {
      return { stderr: this.stderr.contents };
    }
  }

  async testCli(options: TestCliOptions): Promise<void> {
    const cli = new Cli(this);

    const exitCode = await cli.run(options.args);

    expect(exitCode).toEqual(options.expectedExitCode);

    if (typeof options.expectedOutput === "string" || options.expectedOutput instanceof RegExp) {
      expect(this.output()).toMatch(options.expectedOutput);
    } else {
      expect(this.output()).toMatchObject(options.expectedOutput);
    }
  }
}
