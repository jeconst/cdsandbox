import { EventEmitter, once } from "events";
import * as readline from "readline";
import { Readable } from "stream";

export class LineReader {
  private readonly lines: string[] = [];
  private closed = false;
  private eventEmitter = new EventEmitter();

  constructor(inputStream: Readable) {
    const rl = readline.createInterface({ input: inputStream });

    rl.on("line", line => {
      this.lines.push(line);
      this.eventEmitter.emit("activity");
    });

    rl.on("close", () => {
      this.closed = true;
      this.eventEmitter.emit("activity");
    });
  }

  async readLine(): Promise<string | null> {
    if (this.lines.length === 0 && !this.closed) {
      await once(this.eventEmitter, "activity");
    }

    return this.lines.shift() ?? null;
  }
}
