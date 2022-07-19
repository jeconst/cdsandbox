import { getSystemHost } from "../../../dist/ext/system-host";
import { TestLab, TestAwsConfig } from "../../support/test-lab";

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readAwsConfig(): TestAwsConfig {
  return {
    // Note: These can be defined in local-dev.env
    accountId: getRequiredEnvVar("TEST_AWS_ACCOUNT_ID"),
    region: getRequiredEnvVar("TEST_AWS_REGION"),
    accessKeyId: getRequiredEnvVar("TEST_AWS_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnvVar("TEST_AWS_SECRET_ACCESS_KEY"),
    sessionToken: process.env["TEST_AWS_SESSION_TOKEN"],
  };
}

export class IntegrationTestLab implements TestLab {
  readonly host = getSystemHost();
  readonly awsConfig = readAwsConfig();
  private readonly originalEnvVars: Record<string, string | undefined> = {};

  setEnvironmentVariable(name: string, value: string | undefined): void {
    if (!Object.prototype.hasOwnProperty.call(this.originalEnvVars, name)) {
      this.originalEnvVars[name] = process.env[name];
    }

    if (value === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = value;
    }
  }

  cleanUp(): void {
    for (const [key, value] of Object.entries(this.originalEnvVars)) {
      this.setEnvironmentVariable(key, value);
    }
  }
}
