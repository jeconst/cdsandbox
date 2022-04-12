import { Host } from "../core/host";

export function getSystemHost(): Host {
  return {
    stdout: process.stdout,
    stderr: process.stderr,
  };
}
