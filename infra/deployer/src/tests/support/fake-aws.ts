import { Aws, AwsConnectionInfo, AwsState } from "../../dist/core/aws";

export class FakeAws implements Aws {
  private state: AwsState = {
    ecr: {},
  };

  getState(): AwsState {
    return this.state;
  }

  getConnectionInfo(): AwsConnectionInfo {
    return {
      accountId: "12345678",
      accountName: "Test Account",
      region: "mars-2",
    };
  }

  createEcrRepository(name: string): void {
    this.state.ecr[name] = [];
  }
}
