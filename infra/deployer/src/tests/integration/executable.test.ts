import { spawnSync } from "child_process";
import path from "path";

const cliPath = path.join(__dirname, "../../../build/dist/bin.js");

describe("CLI executable", () => {
  function runCli(...args: string[]) {
    return spawnSync("node", [cliPath, ...args]);
  }

  describe("info", () => {
    it("prints information about the deployer", () => {
      const result = runCli("info");

      expect(result.error).toBe(undefined);
      expect(result.stderr.toString()).toBe("");
      expect(result.stdout.toString()).toBe("aws-ecs-deployer v0.1.0\n");
      expect(result.status).toBe(0);
    });
  });
});
