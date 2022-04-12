import * as stream from "stream";

import { Host } from "../../dist/core/host";

class OutputStream extends stream.Writable {
  contents = "";

  _write(chunk: Buffer | string, _encoding: unknown, callback: () => void) {
    const text = chunk.toString();
    this.contents += text;
    callback();
  }
}

export type TerminalOutput =
  | string
  | { stderr: string }
  | { stdout: string, stderr: string }

export class TestHost implements Host {
  stdout: OutputStream;
  stderr: OutputStream;

  constructor() {
    this.stdout = new OutputStream();
    this.stderr = new OutputStream();
  }

  output(): TerminalOutput {
    if (!this.stderr.contents) {
      return this.stdout.contents;
    }

    if (this.stdout.contents) {
      return {
        stdout: this.stdout.contents,
        stderr: this.stderr.contents,
      };
    } else {
      return { stderr: this.stderr.contents };
    }
  }
}
