terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.33"
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

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

resource "aws_cloudwatch_log_group" "this" {
  name = "cdsandbox"
}

resource "aws_cloudwatch_log_resource_policy" "events" {
  policy_name = "cdsandbox-events"
  policy_document = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "events.amazonaws.com" }
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Resource = "${aws_cloudwatch_log_group.this.arn}:*"
      }
    ]
  })
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

  lifecycle {
    ignore_changes = [default_action] # Managed by CodeDeploy
  }
}

resource "aws_ecs_cluster" "this" {
  name = "cdsandbox"

  # FIXME
  # capacity_providers = ["FARGATE"]
  #
  # default_capacity_provider_strategy {
  #   capacity_provider = "FARGATE"
  # }
}

resource "aws_ecr_repository" "app" {
  name                 = "cdsandbox/cdsandbox"
  image_tag_mutability = "IMMUTABLE"
}

resource "aws_ecr_repository" "test" {
  name                 = "cdsandbox/cdsandbox-test"
  image_tag_mutability = "IMMUTABLE"
}

resource "aws_ecs_task_definition" "placeholder" {
  family                   = "cdsandbox-placeholder"
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

  # TODO: Can it be created without a placeholder task definition?
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

  lifecycle {
    ignore_changes = [task_definition, load_balancer] # Managed by CodeDeploy
  }
}

resource "aws_iam_role" "codedeploy" {
  name = "cdsandbox-codedeploy"

  managed_policy_arns = ["arn:aws:iam::aws:policy/AWSCodeDeployRoleForECS"]

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = ["codedeploy.amazonaws.com"] }
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_codedeploy_app" "this" {
  name             = "cdsandbox-web"
  compute_platform = "ECS"
}

resource "aws_codedeploy_deployment_group" "this" {
  app_name               = aws_codedeploy_app.this.name
  deployment_group_name  = "main"
  service_role_arn       = aws_iam_role.codedeploy.arn
  deployment_config_name = "CodeDeployDefault.ECSAllAtOnce"

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

  blue_green_deployment_config {
    deployment_ready_option {
      action_on_timeout = "CONTINUE_DEPLOYMENT"
    }

    terminate_blue_instances_on_deployment_success {
      action                           = "TERMINATE"
      termination_wait_time_in_minutes = 5
    }
  }

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }

  ecs_service {
    cluster_name = aws_ecs_cluster.this.name
    service_name = aws_ecs_service.this.name
  }

  load_balancer_info {
    target_group_pair_info {
      prod_traffic_route {
        listener_arns = [aws_lb_listener.prod_http.arn]
      }

      target_group {
        name = aws_lb_target_group.this["blue"].name
      }

      target_group {
        name = aws_lb_target_group.this["green"].name
      }
    }
  }
}

resource "aws_cloudwatch_event_rule" "codedeploy" {
  name        = "cdsandbox-codedeploy"
  description = "Deployment events for cdsandbox"

  event_pattern = <<-EOF
    {
      "source": ["aws.codedeploy"]
    }
  EOF
}

resource "aws_cloudwatch_event_target" "codedeploy_log" {
  rule = aws_cloudwatch_event_rule.codedeploy.name
  arn  = aws_cloudwatch_log_group.this.arn
}

output "deployment_target" {
  value = {
    region                      = data.aws_region.current.name
    registry_url                = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/cdsandbox"
    image_name                  = "cdsandbox"
    codedeploy_application_name = aws_codedeploy_app.this.name
    deployment_group_name       = aws_codedeploy_deployment_group.this.deployment_group_name
    log_group_name              = aws_cloudwatch_log_group.this.name
  }
}
