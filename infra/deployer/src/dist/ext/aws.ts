import { Aws as AwsInterface, AwsState, AwsConnectionInfo } from "../core/aws";

export class Aws implements AwsInterface {
  getState(): AwsState {
    throw new Error("Method not implemented.");
  }

  getConnectionInfo(): AwsConnectionInfo {
    throw new Error("Method not implemented.");
  }

  createEcrRepository(name: string): void {
    throw new Error("Method not implemented.");
  }
}
