import {
  CreateVpcCommand,
  DescribeVpcsCommand,
  EC2Client,
} from "@aws-sdk/client-ec2";

import { Config, readConfig } from "./config";

export class Deployer {
  private readonly config: Config;

  constructor()
  {
    this.config = readConfig();
  }

  async run(args: string[]): Promise<number> {
    args = args.slice();
    const commandName = args.shift();

    if (!commandName) {
      console.error("No command specified")
      return 1;
    }

    switch (commandName) {
      case "init":
        return await this.init();
        break;
      default:
        console.error(`Invalid command: ${commandName}`);
        return 1;
    }
  }

  async init(): Promise<number> {
    console.log("Examining VPCs");
    const existingVpcsResponse = await this.getEC2Client().send(new DescribeVpcsCommand({
      Filters: [{
        Name: "tag:Name",
        Values: [this.config.appName],
      }]
    }));

    const existingVpcs = existingVpcsResponse.Vpcs || [];

    if (existingVpcs.length > 0) {
      console.log(existingVpcsResponse);
    } else {
      console.log("Creating VPC");

      const createVpcResponse = await this.getEC2Client().send(new CreateVpcCommand({
        CidrBlock: "10.0.0.0/16",
        TagSpecifications: [
          {
            ResourceType: "vpc",
            Tags: [
              { Key: "Name", Value: this.config.appName },
            ],
          },
        ],
      }));

      console.log(createVpcResponse);
    }

    return 0;
  }

  private getEC2Client(): EC2Client {
    return new EC2Client({

    });
  }
}
