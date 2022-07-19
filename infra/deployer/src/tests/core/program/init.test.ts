import { CoreTestLab } from "../../support/core-test-lab";

let lab: CoreTestLab;
beforeEach(() => {
  lab = new CoreTestLab();
});

describe("init command", () => {
  it("initializes the ECR repository", () => lab.testProgram({
    input: {
      command: "init",
      config: {
        projectName: "my-cool-project",
      },
    },
    env: {
      AWS_ACCESS_KEY_ID: lab.awsConfig.accessKeyId,
      AWS_SECRET_ACCESS_KEY: lab.awsConfig.secretAccessKey,
      AWS_REGION: lab.awsConfig.region,
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
