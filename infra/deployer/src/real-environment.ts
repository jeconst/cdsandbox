import { Environment } from "./environment";

export function realEnvironment(): Environment {
  return {
    stdout: process.stdout,
    stderr: process.stderr,
  };
}
