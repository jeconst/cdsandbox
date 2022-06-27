import { Host } from "../core/host";
import { Aws } from "./aws";

export function getSystemHost(): Host {
  return {
    aws: new Aws(),
    terminal: {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
    },
  };
}
