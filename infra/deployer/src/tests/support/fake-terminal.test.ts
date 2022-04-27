import { FakeTerminal } from "./fake-terminal";

describe("FakeTerminal", () => {
  let fakeTerminal: FakeTerminal;
  beforeEach(() => {
    fakeTerminal = new FakeTerminal();
  });

  describe("output()", () => {
    describe("when there is stdout, and stderr is empty", () => {
      beforeEach(() => {
        fakeTerminal.stdout.write("hello ");
        fakeTerminal.stdout.write("world\n");
      });

      it("returns a string with the stdout", () => {
        expect(fakeTerminal.output()).toEqual("hello world\n");
      });
    });

    describe("when there is stderr, and stdout is empty", () => {
      beforeEach(() => {
        fakeTerminal.stderr.write("oops\n");
        fakeTerminal.stderr.write("something went wrong\n");
      });

      it("returns an object with a 'stderr' key", () => {
        expect(fakeTerminal.output()).toEqual({
          stderr: "oops\nsomething went wrong\n",
        });
      });
    });

    describe("when there is both stdout and stderr", () => {
      beforeEach(() => {
        fakeTerminal.stdout.write("hello ");
        fakeTerminal.stderr.write("oops!");
        fakeTerminal.stdout.write("world");
      });

      it("returns an object with 'stdout' and 'stderr' keys", () => {
        expect(fakeTerminal.output()).toEqual({
          stdout: "hello world",
          stderr: "oops!",
        });
      });
    });
  });
});
