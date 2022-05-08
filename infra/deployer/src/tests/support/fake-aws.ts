import { Aws, AwsState } from "../../dist/core/aws";

export class FakeAws implements Aws {
  getState(): AwsState {
    return {
      ecr: {},
    };
  }
}
