#!/usr/bin/env ruby

# frozen_string_literal: true

require "bundler/setup"
Bundler.require(:default)

module Deployer
  def self.deploy(tag)
    infrastructure_json = ENV.fetch("DEPLOYMENT_TARGET") # TODO: Use arg instead of ENV
    infrastructure = JSON.parse(infrastructure_json, symbolize_names: true)

    puts '"Deploying"'
    puts infrastructure.inspect

    # region = infrastructure.fetch(:region)
    # repository_url = infrastructure.fetch(:repository_url)
    # cluster_name = infrastructure.fetch(:cluster_name)
    # service_name = infrastructure.fetch(:service_name)
    # subnets = infrastructure.fetch(:subnets)
    # security_groups = infrastructure.fetch(:security_groups)
    #
    # ecs_client = Aws::ECS::Client.new(region: region)
    # service = ecs_client.describe_services({ cluster: cluster_name, services: [service_name] }).services.first
    #
    # ecs_client.register_task_definition(
    #   family: service_name,
    #   network_mode: "awsvpc",
    #   container_definitions: [
    #     {
    #       name: "web",
    #       image: "#{repository_url}:#{tag}",
    #     }
    #   ],
    # )

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

Deployer.public_send(*ARGV)
