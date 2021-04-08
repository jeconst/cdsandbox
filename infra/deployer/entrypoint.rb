#!/usr/bin/env ruby

# frozen_string_literal: true

require "bundler/setup"
Bundler.require(:default)

module Deployer
  class << self
    def deploy(tag, infrastructure_json)
      infrastructure = JSON.parse(infrastructure_json, symbolize_names: true)

      region = infrastructure.fetch(:region)
      repository_url = infrastructure.fetch(:repository_url)
      application_name = infrastructure.fetch(:application_name)
      deployment_group_name = infrastructure.fetch(:deployment_group_name)
      log_group_name = infrastructure.fetch(:log_group_name)

      ecs_client = Aws::ECS::Client.new(region: region)
      code_deploy_client = Aws::CodeDeploy::Client.new(region: region)

      task_definition_arn = register_task_definition(
        ecs_client: ecs_client,
        family: application_name,
        repository_url: repository_url,
        tag: tag,
        log_group_name: log_group_name,
      )

      create_deployment(
        code_deploy_client: code_deploy_client,
        application_name: application_name,
        deployment_group_name: deployment_group_name,
        task_definition_arn: task_definition_arn,
      )
    end

    private

    def register_task_definition(ecs_client:, family:, repository_url:, tag:, log_group_name:)
      response = ecs_client.register_task_definition({
        family: family,
        requires_compatibilities: ["FARGATE"],
        network_mode: "awsvpc",
        execution_role_arn: "arn:aws:iam::397731487442:role/ecsTaskExecutionRole", # TODO: pass from TF
        cpu: "256",
        memory: "512",
        container_definitions: [
          {
            name: "web",
            image: "#{repository_url}:#{tag}",
            port_mappings: [
              { container_port: 80, protocol: "tcp" },
            ],
            log_configuration: {
              log_driver: "awslogs",
              options: {
                "awslogs-region" => ecs_client.config.region,
                "awslogs-group" => log_group_name,
                "awslogs-stream-prefix" => "ecs",
              },
            },
          },
        ],
      })

      task_definition = response.task_definition
      puts "Created task definition #{task_definition.family}:#{task_definition.revision}"

      task_definition.task_definition_arn
    end

    def create_deployment(code_deploy_client:, application_name:, deployment_group_name:, task_definition_arn:)
      app_spec = {
        version: "0.0",
        Resources: [
          TargetService: {
            Type: "AWS::ECS::Service",
            Properties: {
              TaskDefinition: task_definition_arn,
              LoadBalancerInfo: {
                ContainerName: "web",
                ContainerPort: 80,
              },
              PlatformVersion: "LATEST",
            },
          }
        ]
      }

      puts code_deploy_client.create_deployment({
        application_name: application_name,
        deployment_group_name: deployment_group_name,
        revision: {
          revision_type: "AppSpecContent",
          app_spec_content: {
            content: JSON.generate(app_spec),
          },
        },
      })
    end
  end
end

Deployer.public_send(*ARGV)
