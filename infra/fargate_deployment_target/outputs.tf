output "attributes" {
  value = {
    region                      = data.aws_region.current.name
    registry_url                = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/cdsandbox"
    image_name                  = "cdsandbox"
    ecs_task_execution_role_arn = aws_iam_role.ecs_task_execution.arn
    codedeploy_application_name = aws_codedeploy_app.this.name
    deployment_group_name       = aws_codedeploy_deployment_group.this.deployment_group_name
    log_group_name              = aws_cloudwatch_log_group.this.name
  }
}

output "deployer_access_policy_arn" {
  value = aws_iam_policy.deployer_access.arn
}
