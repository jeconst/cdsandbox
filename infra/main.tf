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
  vpc_id            = aws_vpc.this.id
  public_subnet_ids = [for subnet in aws_subnet.public : subnet.id]
}

resource "aws_iam_user" "github" {
  name = "cdsandbox-github"
}

resource "aws_iam_user_policy_attachment" "github_deployer_access" {
  user       = aws_iam_user.github.name
  policy_arn = module.fargate_deployment_target.deployer_access_policy_arn
}

resource "aws_iam_user_policy" "github_tfstate_access" {
  user = aws_iam_user.github.name
  name = "tfstate-cdsandbox"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # TODO: Avoid duplication of state bucket name and key
      {
        Effect   = "Allow"
        Action   = "s3:ListBucket"
        Resource = "arn:aws:s3:::justinconstantino-terraform-state"
      },
      {
        Effect   = "Allow"
        Action   = "s3:GetObject"
        Resource = "arn:aws:s3:::justinconstantino-terraform-state/cdsandbox.tfstate"
      },
    ]
  })
}

output "deployment_target_attributes" {
  value = module.fargate_deployment_target.attributes
}
