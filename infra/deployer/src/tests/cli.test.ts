import { Cli } from "../dist/core/cli";

import { TestEnvironment } from "./support/test-environment";

describe("CLI", () => {
  let env: TestEnvironment;
  let cli: Cli;

  beforeEach(() => {
    env = new TestEnvironment();
    cli = new Cli(env);
  });

  describe("info", () => {
    it("prints the version", async () => {
      const exitCode = await cli.run(["info"]);

      expect(exitCode).toBe(0);
      expect(env.output()).toMatch(/aws-ecs-deployer v\d+\.\d+\.\d+\n/);
    });
  });

  describe("init", () => {
    it("prints a message", async () => {
      const exitCode = await cli.run(["init"]);

      expect(exitCode).toBe(0);
      expect(env.output()).toEqual("Initializing\n");
    });
  });

  describe("when not given a command", () => {
    it("prints an error and exits", async () => {
      const exitCode = await cli.run([]);

      expect(exitCode).toBe(1);
      expect(env.output()).toEqual({ stderr: "No command specified\n" });
    });
  });

  describe("when given an unrecognized command", () => {
    it("prints an error and exits", async () => {
      const exitCode = await cli.run(["foobar"]);

      expect(exitCode).toBe(1);
      expect(env.output()).toEqual({ stderr: "Invalid command: foobar\n" });
    });
  });
});
