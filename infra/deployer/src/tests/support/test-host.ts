import { Cli } from "../../dist/core/cli";
import { ProcessHost } from "../../dist/core/host";

import { FakeTerminal } from "./fake-terminal";

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

export class TestHost {
  async testCli(options: TestCliOptions): Promise<void> {
    const terminal = new FakeTerminal();
    const host: ProcessHost = { terminal };
    const cli = new Cli(host);

    const exitCode = await cli.run(options.args);

    expect(exitCode).toEqual(options.expectedExitCode);

    if (typeof options.expectedOutput === "string" || options.expectedOutput instanceof RegExp) {
      expect(terminal.output()).toMatch(options.expectedOutput);
    } else {
      expect(terminal.output()).toMatchObject(options.expectedOutput);
    }
  }
}
