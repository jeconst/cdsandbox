import { Cli } from "../../dist/core/cli";

import { TestHost } from "./test-host";

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

export async function testCli(options: TestCliOptions): Promise<void> {
  const host = new TestHost;
  const cli = new Cli(host);

  const exitCode = await cli.run(options.args);

  expect(exitCode).toEqual(options.expectedExitCode);

  if (typeof options.expectedOutput === "string" || options.expectedOutput instanceof RegExp) {
    expect(host.output()).toMatch(options.expectedOutput);
  } else {
    expect(host.output()).toMatchObject(options.expectedOutput);
  }
}
