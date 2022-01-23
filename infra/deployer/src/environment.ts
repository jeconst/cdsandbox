import * as stream from "stream";

export interface Environment {
  stdout: stream.Writable;
  stderr: stream.Writable;
}
