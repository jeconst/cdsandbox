import { ProcessHost } from "../core/host";

export function getSystemHost(): ProcessHost {
  return {
    terminal: {
      stdout: process.stdout,
      stderr: process.stderr,
    },
  };
}
