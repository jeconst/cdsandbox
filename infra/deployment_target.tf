resource "aws_ecs_cluster" "this" {
  name = "cdsandbox"
}

resource "aws_ecs_service" "this" {
  name          = "cdsandbox_web"
  cluster       = aws_ecs_cluster.this.id
  desired_count = 1

  deployment_controller {
    type = "EXTERNAL"
  }
}
