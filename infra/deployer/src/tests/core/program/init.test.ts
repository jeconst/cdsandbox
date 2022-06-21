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
    env: {
      AWS_REGION: "us-east-2",
      AWS_ACCESS_KEY_ID: "TEST-KEY-ID",
      AWS_SECRET_ACCESS_KEY: "TEST-SECRET-KEY",
      AWS_SESSION_TOKEN: "TEST-SESSION-TOKEN",
    },
    expectedExitCode: 0,
    expectedOutput: `Initializing ECS deployment for 'my-cool-project'
Connected to AWS account 12345678 (Test Account), region us-east-2
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
