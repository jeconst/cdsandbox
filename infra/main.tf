terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
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
