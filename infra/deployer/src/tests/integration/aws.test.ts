import { AwsClient } from "../../dist/core/aws";
import { CoreTestLab } from "../support/core-test-lab";
import { TestLab } from "../support/test-lab";

import { IntegrationTestLab } from "./support/integration-test-lab";

describe("AWS integration", () => {
  describeAws(() => new IntegrationTestLab());
});

describe("AWS simulation", () => {
  describeAws(() => new CoreTestLab());
});

function describeAws(testLabBuilder: () => TestLab) {
  let lab: TestLab;

  beforeEach(() => {
    lab = testLabBuilder();
  });

  afterEach(() => {
    lab.cleanUp();
  });

  describe("when the credentials are valid", () => {
    let client: AwsClient;

    beforeEach(() => {
      lab.setEnvironmentVariable("AWS_REGION", lab.awsConfig.region);
      lab.setEnvironmentVariable("AWS_ACCESS_KEY_ID", lab.awsConfig.accessKeyId);
      lab.setEnvironmentVariable("AWS_SECRET_ACCESS_KEY", lab.awsConfig.secretAccessKey);
      lab.setEnvironmentVariable("AWS_SESSION_TOKEN", lab.awsConfig.sessionToken);

      client = lab.host.getAwsClient();
    });

    describe("region", () => {
      it("returns the region", () => {
        expect(client.region).toEqual(lab.awsConfig.region);
      });
    });

    describe("getStsCallerIdentity", () => {
      it("returns the caller identity", async () => {
        const result = await client.getStsCallerIdentity();
        expect(result).toEqual({
          account: lab.awsConfig.accountId,
        });
      });
    });

    describe("ECR", () => {
      it("lists, creates, and deletes repositories", async () => {
        const describeResult = await client.describeEcrRepositories();
        expect(describeResult).toMatchObject({
          nextToken: null,
          repositories: [],
        });
      });
    });
  });

  describe("when the credentials are invalid", () => {
    let client: AwsClient;

    beforeEach(() => {
      lab.setEnvironmentVariable("AWS_REGION", lab.awsConfig.region);
      lab.setEnvironmentVariable("AWS_ACCESS_KEY_ID", lab.awsConfig.accessKeyId);
      lab.setEnvironmentVariable("AWS_SECRET_ACCESS_KEY", "INVALIDSECRET");
      lab.setEnvironmentVariable("AWS_SESSION_TOKEN", lab.awsConfig.sessionToken);

      client = lab.host.getAwsClient();
    });

    describe("region", () => {
      it("returns the configured environment variable", () => {
        expect(client.region).toEqual(lab.awsConfig.region);
      });
    });

    describe("getStsCallerIdentity", () => {
      it("throws an error", async () => {
        const error = await expectError(() => client.getStsCallerIdentity());
        expect(error).toMatchObject({ Code: "SignatureDoesNotMatch" });
      });
    });
  });

  describe("when the region is not set", () => {
    let client: AwsClient;

    beforeEach(() => {
      lab.setEnvironmentVariable("AWS_REGION", undefined);
      lab.setEnvironmentVariable("AWS_ACCESS_KEY_ID", lab.awsConfig.accessKeyId);
      lab.setEnvironmentVariable("AWS_SECRET_ACCESS_KEY", lab.awsConfig.secretAccessKey);
      lab.setEnvironmentVariable("AWS_SESSION_TOKEN", lab.awsConfig.sessionToken);

      client = lab.host.getAwsClient();
    });

    describe("region", () => {
      it("returns an empty string", () => {
        expect(client.region).toEqual("");
      });
    });

    describe("getStsCallerIdentity", () => {
      it("throws an error", async () => {
        await expectError(() => client.getStsCallerIdentity());
      });
    });
  });

  describe("when the region is invalid", () => {
    let client: AwsClient;

    beforeEach(() => {
      lab.setEnvironmentVariable("AWS_REGION", "not-a-region");
      lab.setEnvironmentVariable("AWS_ACCESS_KEY_ID", lab.awsConfig.accessKeyId);
      lab.setEnvironmentVariable("AWS_SECRET_ACCESS_KEY", lab.awsConfig.secretAccessKey);
      lab.setEnvironmentVariable("AWS_SESSION_TOKEN", lab.awsConfig.sessionToken);

      client = lab.host.getAwsClient();
    });

    describe("getStsCallerIdentity", () => {
      it("throws an error", async () => {
        await expectError(() => client.getStsCallerIdentity());
      });
    });
  });
}

async function expectError<T>(func: () => Promise<T>): Promise<Error> {
  try {
    await func();
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    return err as Error;
  }

  throw new Error("Expected error to be thrown, but was not");
}
