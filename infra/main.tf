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

resource "aws_cloudwatch_log_group" "this" {
  name = "cdsandbox"
}

resource "aws_lb" "this" {
  name            = "cdsandbox"
  subnets         = [for subnet in aws_subnet.public : subnet.id]
  security_groups = [aws_security_group.load_balancer.id]
}

resource "aws_lb_target_group" "this" {
  for_each = toset(["blue", "green"])

  name        = "cdsandbox-${each.value}"
  vpc_id      = aws_vpc.this.id
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
}

resource "aws_lb_listener" "prod_http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this["blue"].arn
  }
}

resource "aws_ecs_cluster" "this" {
  name = "cdsandbox"
}

resource "aws_ecr_repository" "this" {
  name                 = "cdsandbox_web"
  image_tag_mutability = "IMMUTABLE"
}

resource "aws_ecs_task_definition" "placeholder" {
  family                   = "cdsandbox_placeholder"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = "arn:aws:iam::397731487442:role/ecsTaskExecutionRole" # FIXME

  cpu    = 256
  memory = 512

  container_definitions = jsonencode([
    {
      name         = "web"
      image        = "httpd:2.4"
      portMappings = [{ containerPort = 80 }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-region        = data.aws_region.current.name
          awslogs-group         = aws_cloudwatch_log_group.this.name
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "this" {
  name    = "cdsandbox-web"
  cluster = aws_ecs_cluster.this.id

  launch_type     = "FARGATE"
  task_definition = aws_ecs_task_definition.placeholder.arn
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.this["blue"].arn
    container_name   = "web"
    container_port   = 80
  }

  deployment_controller {
    type = "CODE_DEPLOY"
  }

  network_configuration {
    security_groups  = [aws_security_group.web_server.id]
    subnets          = [for subnet in aws_subnet.public : subnet.id]
    assign_public_ip = true
  }

  depends_on = [aws_lb.this]
}

output "deployment_target" {
  value = {
    region         = data.aws_region.current.name
    repository_url = aws_ecr_repository.this.repository_url
    cluster_name   = aws_ecs_cluster.this.name
    service_name   = aws_ecs_service.this.name
    subnets        = [for subnet in aws_subnet.public : subnet.id]
  }
}
