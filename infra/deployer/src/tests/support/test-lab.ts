import { Host } from "../../dist/core/host";

export type TestAwsConfig = {
  region: string;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string | undefined;
};

export type TestLab = {
  host: Host;
  awsConfig: TestAwsConfig;

  setEnvironmentVariable(name: string, value: string | undefined): void;
  cleanUp(): void;
};
