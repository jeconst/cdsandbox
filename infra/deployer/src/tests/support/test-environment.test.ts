import { TestEnvironment } from "./test-environment";

describe("TestEnvironment", () => {
  let env: TestEnvironment;

  beforeEach(() => env = new TestEnvironment());

  describe("output()", () => {
    describe("when there is stdout, and stderr is empty", () => {
      beforeEach(() => {
        env.stdout.write("hello ");
        env.stdout.write("world\n");
      });

      it("returns a string with the stdout", () => {
        expect(env.output()).toEqual("hello world\n");
      });
    });

    describe("when there is stderr, and stdout is empty", () => {
      beforeEach(() => {
        env.stderr.write("oops\n");
        env.stderr.write("something went wrong\n");
      });

      it("returns an object with a 'stderr' key", () => {
        expect(env.output()).toEqual({
          stderr: "oops\nsomething went wrong\n",
        });
      });
    });

    describe("when there is both stdout and stderr", () => {
      beforeEach(() => {
        env.stdout.write("hello ");
        env.stderr.write("oops!");
        env.stdout.write("world");
      });

      it("returns an object with 'stdout' and 'stderr' keys", () => {
        expect(env.output()).toEqual({
          stdout: "hello world",
          stderr: "oops!",
        });
      });
    });
  });
});
