import { LiveAwsClient } from "../../dist/ext/aws";

type EnvVars = Record<string, string | undefined>

function captureEnvironmentVariables(): EnvVars {
  return Object.fromEntries(Object.entries(process.env));
}

function setEnvironmentVariables(vars: EnvVars) {
  for (const [key, value] of Object.entries(vars)) {
    process.env[key] = value;
  }
}

type AwsEnvironmentConfig = {
  region: string;
  accountId: string,
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string | undefined;
};

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

let savedEnv: EnvVars;
beforeAll(() => savedEnv = captureEnvironmentVariables());
afterAll(() => setEnvironmentVariables(savedEnv));

describe("LiveAwsClient", () => {
  let client: LiveAwsClient;
  let config: AwsEnvironmentConfig;

  describe("when the credentials are valid", () => {
    beforeEach(() => {
      config = {
        // Note: These can be defined in local-dev.env
        accountId: getRequiredEnvVar("TEST_AWS_ACCOUNT_ID"),
        region: getRequiredEnvVar("TEST_AWS_REGION"),
        accessKeyId: getRequiredEnvVar("TEST_AWS_ACCESS_KEY_ID"),
        secretAccessKey: getRequiredEnvVar("TEST_AWS_SECRET_ACCESS_KEY"),
        sessionToken: process.env["TEST_AWS_SESSION_TOKEN"],
      };

      setEnvironmentVariables({
        AWS_REGION: config.region,
        AWS_ACCESS_KEY_ID: config.accessKeyId,
        AWS_SECRET_ACCESS_KEY: config.secretAccessKey,
        AWS_SESSION_TOKEN: config.sessionToken,
      });

      client = new LiveAwsClient();
    });

    describe("region", () => {
      it("returns the region", () => {
        expect(client.region).toEqual(config.region);
      });
    });

    describe("getStsCallerIdentity", () => {
      it("returns the caller identity", async () => {
        const result = await client.getStsCallerIdentity();
        expect(result).toEqual({
          account: config.accountId,
        });
      });
    });
  });

  describe("when the credentials are invalid", () => {
    it("throws an error", () => {
    });
  });
});
