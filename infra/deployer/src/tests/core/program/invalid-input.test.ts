import { TestHost } from "../../support/test-host";

let host: TestHost;
beforeEach(() => {
  host = new TestHost();
});

describe("invalid input handling", () => {
  describe("when not given any input", () => {
    it("prints an error and exits", () => host.testProgram({
      rawInput: "",
      expectedExitCode: 1,
      expectedOutput: { stderr: "No command specified\n" },
    }));
  });

  describe("when given invalid JSON", () => {
    it("prints an error and exits", () => host.testProgram({
      rawInput: "{ foo",
      expectedExitCode: 1,
      expectedOutput: { stderr: "Invalid JSON\n" },
    }));
  });

  describe("when not given an object", () => {
    it("prints an error and exits", () => host.testProgram({
      rawInput: "123",
      expectedExitCode: 1,
      expectedOutput: { stderr: "Expected object\n" },
    }));
  });

  describe("when given an object with no command", () => {
    it("prints an error and exits", () => host.testProgram({
      rawInput: "{}",
      expectedExitCode: 1,
      expectedOutput: { stderr: "Expected object to have `command`\n" },
    }));
  });

  describe("when given an object with a non-string command", () => {
    it("prints an error and exits", () => host.testProgram({
      rawInput: '{ "command": 123 }',
      expectedExitCode: 1,
      expectedOutput: { stderr: "Expected command to be a string\n" },
    }));
  });

  describe("when given an invalid command", () => {
    it("prints an error and exits", () => host.testProgram({
      input: { command: "foobar" },
      expectedExitCode: 1,
      expectedOutput: { stderr: "Invalid command: foobar\n" },
    }));
  });
});
