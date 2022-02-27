import { spawnSync } from "child_process";
import path from "path";

const projectRoot = path.join(__dirname, "../../..");

describe("CLI", () => {
  function runCli(...args: string[]) {
    return spawnSync("node", [projectRoot, ...args]);
  }

  describe("info", () => {
    it("prints information about the deployer", () => {
      const result = runCli("info");

      expect(result.error).toBe(undefined);
      expect(result.stdout.toString()).toBe("aws-ecs-deployer v0.1.0\n");
      expect(result.stderr.toString()).toBe("");
      expect(result.status).toBe(0);
    });
  });
});
