import { TestHarness } from "../../support/test-harness";

let harness: TestHarness;
beforeEach(() => {
  harness = new TestHarness();
});

describe("init command", () => {
  it("initializes the ECR repository", () => harness.testProgram({
    input: {
      command: "init",
      config: {
        projectName: "my-cool-project",
      },
    },
    env: {
      AWS_ACCESS_KEY_ID: "TEST-KEY-ID",
      AWS_SECRET_ACCESS_KEY: "TEST-SECRET-KEY",
      AWS_SESSION_TOKEN: "TEST-SESSION-TOKEN",
      AWS_REGION: "mars-2",
    },
    expectedExitCode: 0,
    expectedOutput: `Initializing ECS deployment for 'my-cool-project'
Connected to AWS account 12345678, region mars-2
Creating ECR repository 'my-cool-project'
Creating ECR repository 'my-cool-project-test'
Initialization complete!
`,
    expectedAwsState: {
      ecr: {
        "my-cool-project": [],
        "my-cool-project-test": [],
      },
    },
  }));
});
