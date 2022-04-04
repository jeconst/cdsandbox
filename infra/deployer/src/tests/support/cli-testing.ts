import { Cli } from "../../dist/core/cli";

import { TestEnvironment } from "./test-environment";

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
  const env = new TestEnvironment;
  const cli = new Cli(env);

  const exitCode = await cli.run(options.args);

  expect(exitCode).toEqual(options.expectedExitCode);

  if (typeof options.expectedOutput === "string" || options.expectedOutput instanceof RegExp) {
    expect(env.output()).toMatch(options.expectedOutput);
  } else {
    expect(env.output()).toMatchObject(options.expectedOutput);
  }
}
