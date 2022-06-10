import * as stream from "stream";

import { LineReader } from "../../dist/core/line-reader";

class ScriptedReadable extends stream.Readable {
  constructor(private readonly script: Array<string | Error>) {
    super();
  }

  _read(): void {
    setImmediate(() => this._queueNextChunk());
  }

  _queueNextChunk(): void {
    const next = this.script.shift();

    if (next === undefined) {
      this.push(null); // EOF
    } else if (next instanceof Error) {
      this.destroy(next);
    } else {
      this.push(next);
    }
  }
}

describe("LineReader", () => {
  it("provides lines from a readable stream one at a time", async () => {
    const stream = new ScriptedReadable(["hello world\n", "it's me,", " justin\n"]);

    const lineReader = new LineReader(stream);

    expect(await lineReader.readLine()).toEqual("hello world");
    expect(await lineReader.readLine()).toEqual("it's me, justin");
    expect(await lineReader.readLine()).toEqual(null);
  });

  it("reads the final line without a newline", async () => {
    const stream = new ScriptedReadable(["hello\n", "world"]);

    const lineReader = new LineReader(stream);

    expect(await lineReader.readLine()).toEqual("hello");
    expect(await lineReader.readLine()).toEqual("world");
    expect(await lineReader.readLine()).toEqual(null);
  });

  it("reads all lines when they are read immediately", async () => {
    const stream = new ScriptedReadable(["one\ntwo\nthree\n"]);

    const lineReader = new LineReader(stream);

    expect(await lineReader.readLine()).toEqual("one");
    expect(await lineReader.readLine()).toEqual("two");
    expect(await lineReader.readLine()).toEqual("three");
    expect(await lineReader.readLine()).toEqual(null);
  });

  it("returns null after all lines have been read", async () => {
    const stream = new ScriptedReadable(["one\ntwo\n"]);

    const lineReader = new LineReader(stream);

    expect(await lineReader.readLine()).toEqual("one");
    expect(await lineReader.readLine()).toEqual("two");
    expect(await lineReader.readLine()).toEqual(null);
    expect(await lineReader.readLine()).toEqual(null);
  });
});
