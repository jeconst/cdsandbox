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
      cluster_name = infrastructure.fetch(:cluster_name)
      service_name = infrastructure.fetch(:service_name)
      subnets = infrastructure.fetch(:subnets)

      ecs_client = Aws::ECS::Client.new(region: region)

      task_definition_arn = register_task_definition(
        ecs_client: ecs_client,
        family: service_name,
        repository_url: repository_url,
        tag: tag,
      )

      update_service(
        service_name: service_name,
        task_definition_arn: task_definition_arn,
      )
    end

    private

    def register_task_definition(ecs_client:, family:, repository_url:, tag:)
      response = ecs_client.register_task_definition(
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
            # log_configuration: TODO
            # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html
          },
        ],
      )

      task_definition = response.task_definition
      puts "Created task definition #{task_definition.family}:#{task_definition.revision}"

      task_definition.task_definition_arn
    end

    def update_service(service_name:, task_definition_arn:)
      # ecs_client.create_task_set({
      #   service: service_name,
      #   cluster: cluster_name,
      #   launch_type: "FARGATE",
      #   task_definition: "arn:aws:ecs:us-east-2:397731487442:task-definition/fargate-test-web:7", # FIXME
      #   network_configuration: {
      #     awsvpc_configuration: {
      #       subnets: subnets,
      #       security_groups: security_groups,
      #       assign_public_ip: "ENABLED", # FIXME
      #     },
      #   },
      #   scale: { value: 100, unit: "PERCENT" },
      #   # load_balancers: [
      #   #   {
      #   #     target_group_arn: "String",
      #   #     load_balancer_name: "String",
      #   #     container_name: "String",
      #   #     container_port: 1,
      #   #   },
      #   # ],
      #   # client_token: "String",
      #   # tags: [
      #   #   {
      #   #     key: "TagKey",
      #   #     value: "TagValue",
      #   #   },
      #   # ],
      # })
    end
  end
end

Deployer.public_send(*ARGV)
