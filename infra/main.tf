terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.42"
    }
  }

  backend "s3" {
    region         = "us-east-2"
    bucket         = "justinconstantino-terraform-state"
    dynamodb_table = "JustinConstantinoTerraformStateLock"
    key            = "cdsandbox.tfstate"
    encrypt        = true
  }
}

provider "aws" {
  region = "us-east-2"
}

module "fargate_deployment_target" {
  source = "./fargate_deployment_target"

  app_name          = "cdsandbox"
  state_key_arn     = "arn:aws:s3:::justinconstantino-terraform-state/cdsandbox.tfstate"
  vpc_id            = aws_vpc.this.id
  public_subnet_ids = [for subnet in aws_subnet.public : subnet.id]
}

output "deployment_target_attributes" {
  value = module.fargate_deployment_target.attributes
}
