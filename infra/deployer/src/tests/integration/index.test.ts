import { runCli } from "../../dist/index";

describe("runCli", () => {
  it("runs the CLI with the given arguments", async () => {
    const exitCode = await runCli(["info"]);
    expect(exitCode).toBe(0);
  });
});
