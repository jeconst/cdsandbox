import { runProgram } from "./core/program";
import { getSystemHost } from "./ext/system-host";

export async function run(): Promise<number> {
  return await runProgram(getSystemHost());
}
