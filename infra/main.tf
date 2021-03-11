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

data "aws_region" "current" {}

resource "aws_ecs_cluster" "this" {
  name = "cdsandbox"
}

resource "aws_ecr_repository" "this" {
  name                 = "cdsandbox_web"
  image_tag_mutability = "IMMUTABLE"
}

resource "aws_ecs_service" "this" {
  name          = "cdsandbox_web"
  cluster       = aws_ecs_cluster.this.id
  desired_count = 1

  deployment_controller {
    type = "EXTERNAL"
  }
}

output "deployment_target" {
  value = {
    region         = data.aws_region.current.name
    repository_url = aws_ecr_repository.this.repository_url
    cluster_name   = aws_ecs_cluster.this.name
    service_name   = aws_ecs_service.this.name
    subnets        = [for subnet in aws_subnet.public : subnet.id]

    # TODO: Add ALB and only allow ALB ingress
    security_groups = [aws_security_group.web_traffic.id]
  }
}
