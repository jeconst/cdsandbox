import { Host } from "../core/host";

export function getSystemHost(): Host {
  return {
    terminal: {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
    },
  };
}
