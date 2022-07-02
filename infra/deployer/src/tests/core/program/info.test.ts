import { TestHarness } from "../../support/test-harness";

let harness: TestHarness;
beforeEach(() => {
  harness = new TestHarness();
});

describe("info command", () => {
  it("prints the version", () => harness.testProgram({
    input: { command: "info" },
    expectedExitCode: 0,
    expectedOutput: /aws-ecs-deployer v\d+\.\d+\.\d+\n/,
  }));
});
