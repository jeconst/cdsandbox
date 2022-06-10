import { AwsState } from "../../dist/core/aws";
import { ProcessHost } from "../../dist/core/host";
import { runProgram } from "../../dist/core/program";

import { FakeAws } from "./fake-aws";
import { FakeTerminal } from "./fake-terminal";

type stringMatcher = string | RegExp;
export type TerminalOutputMatcher =
  | stringMatcher
  | { stderr: stringMatcher }
  | { stdout: stringMatcher, stderr: stringMatcher }

export type TestProgramOptions = {
  input?: object;
  rawInput?: string;
  expectedExitCode: number;
  expectedOutput: TerminalOutputMatcher;
  expectedAwsState?: AwsState;
}

export class TestHost {
  private readonly aws = new FakeAws();

  async testProgram(options: TestProgramOptions): Promise<void> {
    const terminal = new FakeTerminal();
    const host: ProcessHost = { terminal };

    const programRun = runProgram(host);

    if (options.input !== undefined) {
      const inputJson = JSON.stringify(options.input);
      terminal.stdin.write(inputJson + "\n");
    } else if (options.rawInput !== undefined) {
      terminal.stdin.write(options.rawInput);
    }

    terminal.stdin.end();

    const exitCode = await programRun;
    expect(exitCode).toEqual(options.expectedExitCode);

    if (typeof options.expectedOutput === "string" || options.expectedOutput instanceof RegExp) {
      expect(terminal.output()).toMatch(options.expectedOutput);
    } else {
      expect(terminal.output()).toMatchObject(options.expectedOutput);
    }

    if (options.expectedAwsState) {
      expect(this.aws.getState()).toMatchObject(options.expectedAwsState);
    }
  }
}
