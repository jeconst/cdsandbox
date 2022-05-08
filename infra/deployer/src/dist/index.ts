import { Program } from "./core/program";
import { getSystemHost } from "./ext/system-host";

export async function runProgram(args: string[]): Promise<number> {
  const program = new Program(getSystemHost());
  return await program.run(args);
}
