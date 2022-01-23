import { Deployer } from "../deployer";

import { TestEnvironment } from "./support/test-environment";

describe("Deployer", () => {
  let env: TestEnvironment;
  let deployer: Deployer;

  beforeEach(() => {
    env = new TestEnvironment();
    deployer = new Deployer(env);
  });

  describe("init", () => {
    it("prints a message", async () => {
      const exitCode = await deployer.run(["init"]);

      expect(exitCode).toBe(0);
      expect(env.output()).toEqual("Initializing\n");
    });
  });

  describe("when not given a command", () => {
    it("prints an error and exits", async () => {
      const exitCode = await deployer.run([]);

      expect(exitCode).toBe(1);
      expect(env.output()).toEqual({ stderr: "No command specified\n" });
    });
  });

  describe("when given an unrecognized command", () => {
    it("prints an error and exits", async () => {
      const exitCode = await deployer.run(["foobar"]);

      expect(exitCode).toBe(1);
      expect(env.output()).toEqual({ stderr: "Invalid command: foobar\n" });
    });
  });
});
