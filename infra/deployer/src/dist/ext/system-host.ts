import { Host } from "../core/host";

import { RealAwsClient } from "./aws";

export function getSystemHost(): Host {
  return {
    terminal: {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
    },

    getAwsClient() {
      return new RealAwsClient();
    },
  };
}
