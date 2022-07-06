import { AwsClient } from "../../dist/core/aws";
import { Host, Terminal } from "../../dist/core/host";
import { runProgram } from "../../dist/core/program";

import { FakeAwsClient, AwsState, initialAwsState } from "./fake-aws";
import { FakeTerminal } from "./fake-terminal";

type stringMatcher = string | RegExp;
export type TerminalOutputMatcher =
  | stringMatcher
  | { stderr: stringMatcher }
  | { stdout: stringMatcher, stderr: stringMatcher }

export type TestProgramOptions = {
  input?: object;
  env?: Record<string, string>;
  rawInput?: string;
  expectedExitCode: number;
  expectedOutput: TerminalOutputMatcher;
  expectedAwsState?: AwsState;
}

class TestProcessHost implements Host {
  constructor(
    public readonly terminal: Terminal,
    private readonly env: Record<string, string> = {},
    private readonly awsState: AwsState,
  ) {}

  getAwsClient(): AwsClient {
    return new FakeAwsClient(this.awsState, this.env);
  }
}

export class TestHarness {
  private readonly awsState = initialAwsState();

  async testProgram(options: TestProgramOptions): Promise<void> {
    const terminal = new FakeTerminal();
    const host = new TestProcessHost(terminal, options.env, this.awsState);

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

    if (typeof options.expectedOutput === "string") {
      expect(terminal.output()).toEqual(options.expectedOutput);
    } else if (options.expectedOutput instanceof RegExp) {
      expect(terminal.output()).toMatch(options.expectedOutput);
    } else {
      expect(terminal.output()).toMatchObject(options.expectedOutput);
    }

    if (options.expectedAwsState) {
      expect(this.getAwsState()).toMatchObject(options.expectedAwsState);
    }
  }

  private getAwsState() {
    return this.awsState;
  }
}
