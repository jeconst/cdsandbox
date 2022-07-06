import * as stream from "stream";

import { AwsClient } from "./aws";

export interface Terminal {
  stdin: stream.Readable;
  stdout: stream.Writable;
  stderr: stream.Writable;
}

export interface Host {
  terminal: Terminal;
  getAwsClient(): AwsClient;
}
