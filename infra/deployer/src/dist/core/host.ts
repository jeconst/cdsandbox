import * as stream from "stream";

export interface Terminal {
  stdin: stream.Readable;
  stdout: stream.Writable;
  stderr: stream.Writable;
}

export interface ProcessHost {
  terminal: Terminal;
}
