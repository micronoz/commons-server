terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.28"
    }
  }
}

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.aws_region
}

locals {
  # The name of the CloudFormation stack to be created for the VPC and related resources
  aws_vpc_stack_name = "${var.aws_resource_prefix}-vpc-stack"
  aws_nat_stack_name = "${var.aws_resource_prefix}-nat-stack"
  # The name of the CloudFormation stack to be created for the ECS service and related resources
  aws_ecs_service_stack_name = "${var.aws_resource_prefix}-svc-stack"
  aws_ecs_cluster_stack_name = "${var.aws_resource_prefix}-cluster-stack"
  aws_client_sg_stack_name   = "${var.aws_resource_prefix}-client-sg-stack"
  aws_kms_stack_name         = "${var.aws_resource_prefix}-kms-stack"
  # The name of the ECR repository to be created
  aws_ecr_repository_name = var.aws_resource_prefix
  # The name of the ECS cluster to be created
  aws_ecs_cluster_name = "${var.aws_resource_prefix}-cluster"
  # The name of the ECS service to be created
  aws_ecs_service_name = "${var.aws_resource_prefix}-service"
  # The name of the execution role to be created
  aws_ecs_execution_role_name = "${var.aws_resource_prefix}-ecs-execution-role"
}

resource "aws_ecr_repository" "main-repo" {
  name                 = local.aws_ecr_repository_name
  image_tag_mutability = "IMMUTABLE"
}
resource "aws_cloudformation_stack" "vpc" {
  name          = local.aws_vpc_stack_name
  template_body = file("cloudonaut-templates/vpc-2azs.yml")
  capabilities  = ["CAPABILITY_NAMED_IAM"]
}

resource "aws_cloudformation_stack" "nat" {
  name          = local.aws_nat_stack_name
  template_body = file("cloudonaut-templates/nat.yml")
  capabilities  = ["CAPABILITY_NAMED_IAM"]
  depends_on    = [aws_cloudformation_stack.vpc]
  parameters = {
    ParentVPCStack = local.aws_vpc_stack_name
  }
}

resource "aws_cloudformation_stack" "ecs_cluster" {
  name          = local.aws_ecs_cluster_stack_name
  template_body = file("cloudonaut-templates/cluster.yml")
  depends_on    = [aws_cloudformation_stack.vpc]
  capabilities  = ["CAPABILITY_NAMED_IAM"]

  parameters = {
    ParentVPCStack = local.aws_vpc_stack_name
    ClusterName    = local.aws_ecs_cluster_name
  }
}

output "cluster" {
  value = aws_cloudformation_stack.ecs_cluster.outputs
}

resource "aws_cloudformation_stack" "client_sg" {
  name          = local.aws_client_sg_stack_name
  template_body = file("cloudonaut-templates/client-sg.yml")
  capabilities  = ["CAPABILITY_NAMED_IAM"]
  depends_on    = [aws_cloudformation_stack.vpc]

  parameters = {
    ParentVPCStack = local.aws_vpc_stack_name
  }
}

resource "aws_cloudformation_stack" "key-store" {
  name          = local.aws_kms_stack_name
  template_body = file("cloudonaut-templates/kms-key.yml")
  capabilities  = ["CAPABILITY_NAMED_IAM"]
}

# Note: creates task definition and task definition family with the same name as the ServiceName parameter value
resource "aws_cloudformation_stack" "ecs_service" {
  name          = local.aws_ecs_service_stack_name
  template_body = file("cloudonaut-templates/service.yml")
  depends_on    = [aws_cloudformation_stack.ecs_cluster]
  capabilities  = ["CAPABILITY_NAMED_IAM"]

  parameters = {
    ServiceName        = local.aws_ecs_service_name
    ParentVPCStack     = local.aws_vpc_stack_name
    ParentClusterStack = local.aws_ecs_cluster_stack_name
    DesiredCount       = 1
    SubnetsReach       = "Private"
    AppPort            = 4000
    # Note: Since ImageUrl parameter is not specified, the Service
    # will be deployed with the nginx image when created
  }
}
