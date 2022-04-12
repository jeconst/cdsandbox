import * as stream from "stream";

export interface Host {
  stdout: stream.Writable;
  stderr: stream.Writable;
}
