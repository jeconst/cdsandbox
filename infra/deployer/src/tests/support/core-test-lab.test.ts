import { CoreTestLab } from "./core-test-lab";

describe("CoreTestLab", () => {
  describe("testProgram", () => {
    it("validates the exit code", async () => {
      const lab = new CoreTestLab();

      const test = lab.testProgram({
        input: { command: "invalid" },
        expectedExitCode: 0,
        expectedOutput: "",
      });

      await expect(test).rejects.toMatchObject({
        matcherResult: { expected: 0, actual: 1 },
      });
    });

    it("validates the output", async () => {
      const lab = new CoreTestLab();

      const test = lab.testProgram({
        input: { command: "info" },
        expectedExitCode: 0,
        expectedOutput: "Yada yada",
      });

      await expect(test).rejects.toThrow();
    });
  });
});
