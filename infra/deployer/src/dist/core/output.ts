import * as stream from "stream";

export class Output {
  constructor(
    private readonly outputStream: stream.Writable,
    private readonly errorStream: stream.Writable,
  ) {}

  info(message: string) {
    this.outputStream.write(message + "\n");
  }

  error(message: string) {
    this.errorStream.write(message + "\n");
  }
}
