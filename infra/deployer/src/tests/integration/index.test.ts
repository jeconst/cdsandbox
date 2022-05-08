import { runProgram } from "../../dist/index";

describe("runProgram", () => {
  it("runs the program with the given arguments", async () => {
    const exitCode = await runProgram(["info"]);
    expect(exitCode).toBe(0);
  });
});
