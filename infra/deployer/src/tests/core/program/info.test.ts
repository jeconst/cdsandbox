import { TestHost } from "../../support/test-host";

let host: TestHost;
beforeEach(() => {
  host = new TestHost();
});

describe("info command", () => {
  it("prints the version", () => host.testProgram({
    input: { command: "info" },
    expectedExitCode: 0,
    expectedOutput: /aws-ecs-deployer v\d+\.\d+\.\d+\n/,
  }));
});
