import { AwsClient } from "../../dist/core/aws";
import { Host } from "../../dist/core/host";
import { runProgram } from "../../dist/core/program";

import { FakeAwsClient, AwsState, initialAwsState } from "./fake-aws";
import { FakeTerminal } from "./fake-terminal";
import { TestLab, TestAwsConfig } from "./test-lab";

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

class TestHost implements Host {
  constructor(
    public terminal: FakeTerminal = new FakeTerminal(),
    public env: Record<string, string | undefined> = {},
    public awsState: AwsState = initialAwsState(),
  ) {}

  getAwsClient(): AwsClient {
    return new FakeAwsClient(this.awsState, this.env);
  }
}

export class CoreTestLab implements TestLab {
  host = new TestHost();

  readonly awsConfig: TestAwsConfig = FakeAwsClient.config;

  async testProgram(options: TestProgramOptions): Promise<void> {
    if (options.env) {
      Object.assign(this.host.env, options.env);
    }

    const programRun = runProgram(this.host);

    if (options.input !== undefined) {
      const inputJson = JSON.stringify(options.input);
      this.host.terminal.stdin.write(inputJson + "\n");
    } else if (options.rawInput !== undefined) {
      this.host.terminal.stdin.write(options.rawInput);
    }

    this.host.terminal.stdin.end();

    const exitCode = await programRun;
    expect(exitCode).toEqual(options.expectedExitCode);

    if (typeof options.expectedOutput === "string") {
      expect(this.host.terminal.output()).toEqual(options.expectedOutput);
    } else if (options.expectedOutput instanceof RegExp) {
      expect(this.host.terminal.output()).toMatch(options.expectedOutput);
    } else {
      expect(this.host.terminal.output()).toMatchObject(options.expectedOutput);
    }

    if (options.expectedAwsState) {
      expect(this.host.awsState).toMatchObject(options.expectedAwsState);
    }
  }

  setEnvironmentVariable(name: string, value: string | undefined): void {
    this.host.env[name] = value;
  }

  cleanUp() {
    this.host = new TestHost();
  }
}
