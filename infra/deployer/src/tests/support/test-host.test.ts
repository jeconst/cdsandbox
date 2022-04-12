import { TestHost } from "./test-host";

describe("TestHost", () => {
  let host: TestHost;

  beforeEach(() => host = new TestHost());

  describe("output()", () => {
    describe("when there is stdout, and stderr is empty", () => {
      beforeEach(() => {
        host.stdout.write("hello ");
        host.stdout.write("world\n");
      });

      it("returns a string with the stdout", () => {
        expect(host.output()).toEqual("hello world\n");
      });
    });

    describe("when there is stderr, and stdout is empty", () => {
      beforeEach(() => {
        host.stderr.write("oops\n");
        host.stderr.write("something went wrong\n");
      });

      it("returns an object with a 'stderr' key", () => {
        expect(host.output()).toEqual({
          stderr: "oops\nsomething went wrong\n",
        });
      });
    });

    describe("when there is both stdout and stderr", () => {
      beforeEach(() => {
        host.stdout.write("hello ");
        host.stderr.write("oops!");
        host.stdout.write("world");
      });

      it("returns an object with 'stdout' and 'stderr' keys", () => {
        expect(host.output()).toEqual({
          stdout: "hello world",
          stderr: "oops!",
        });
      });
    });
  });
});
