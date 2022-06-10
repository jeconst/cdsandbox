import { TestHost } from "./test-host";

describe("TestHost", () => {
  describe("testProgram", () => {
    it("validates the exit code", async () => {
      const host = new TestHost();

      const test = host.testProgram({
        input: { command: "invalid" },
        expectedExitCode: 0,
        expectedOutput: "",
      });

      await expect(test).rejects.toMatchObject({
        matcherResult: { expected: 0, actual: 1 },
      });
    });

    it("validates the output", async () => {
      const host = new TestHost();

      const test = host.testProgram({
        input: { command: "info" },
        expectedExitCode: 0,
        expectedOutput: "Yada yada",
      });

      await expect(test).rejects.toThrow();
    });
  });
});
