import * as stream from "stream";

import { Environment } from "../../dist/core/environment";

class OutputStream extends stream.Writable {
  contents = "";

  _write(chunk: Buffer | string, _encoding: unknown, callback: () => void) {
    const text = chunk.toString();
    this.contents += text;
    callback();
  }
}

export class TestEnvironment implements Environment {
  stdout: OutputStream;
  stderr: OutputStream;

  constructor() {
    this.stdout = new OutputStream();
    this.stderr = new OutputStream();
  }

  output(): string | { stderr: string } | { stdout: string, stderr: string } {
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
