import * as stream from "stream";

import { Aws } from "./aws";

export interface Terminal {
  stdin: stream.Readable;
  stdout: stream.Writable;
  stderr: stream.Writable;
}

export interface Host {
  aws: Aws;
  terminal: Terminal;
}
