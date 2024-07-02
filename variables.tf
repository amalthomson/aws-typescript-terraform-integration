variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  default     = "aws-serverless-tsc-integration"
}

variable "environment" {
  description = "Environment (e.g., dev, prod)"
  default     = "dev"
}