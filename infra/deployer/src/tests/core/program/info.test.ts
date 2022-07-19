import { CoreTestLab } from "../../support/core-test-lab";

let lab: CoreTestLab;
beforeEach(() => {
  lab = new CoreTestLab();
});

describe("info command", () => {
  it("prints the version", () => lab.testProgram({
    input: { command: "info" },
    expectedExitCode: 0,
    expectedOutput: /aws-ecs-deployer v\d+\.\d+\.\d+\n/,
  }));
});
