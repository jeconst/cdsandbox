import { TestHost } from "../../support/test-host";

let host: TestHost;
beforeEach(() => {
  host = new TestHost();
});

describe("init command", () => {
  it("initializes the ECR repository", () => host.testProgram({
    input: {
      command: "init",
      config: {
        projectName: "my-cool-project",
      },
    },
    expectedExitCode: 0,
    expectedOutput: "Initializing\n",
    expectedAwsState: {
      ecr: {
        "my-cool-project": [],
      },
    },
  }));
});
