import { TestHost } from "./support/test-host";

let host: TestHost;
beforeEach(() => {
  host = new TestHost();
});

describe("CLI", () => {
  describe("info", () => {
    it("prints the version", () => host.testCli({
      args: ["info"],
      expectedExitCode: 0,
      expectedOutput: /aws-ecs-deployer v\d+\.\d+\.\d+\n/,
    }));
  });

  describe("init", () => {
    it.todo("initializes the ECR repository");
    it("prints a message", () => host.testCli({
      args: ["init"],
      expectedExitCode: 0,
      expectedOutput: "Initializing\n",
      expectedAwsState: {
        ecr: {},
      },
    }));
  });

  describe("when not given a command", () => {
    it("prints an error and exits", () => host.testCli({
      args: [],
      expectedExitCode: 1,
      expectedOutput: { stderr: "No command specified\n" },
    }));
  });

  describe("when given an unrecognized command", () => {
    it("prints an error and exits", () => host.testCli({
      args: ["foobar"],
      expectedExitCode: 1,
      expectedOutput: { stderr: "Invalid command: foobar\n" },
    }));
  });
});
