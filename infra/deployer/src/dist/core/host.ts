import * as stream from "stream";

export interface Terminal {
  stdout: stream.Writable;
  stderr: stream.Writable;
}

export interface ProcessHost {
  terminal: Terminal;
}
