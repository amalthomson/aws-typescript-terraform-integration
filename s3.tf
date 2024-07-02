resource "aws_s3_bucket" "integration_bucket" {
  bucket = "aws-serverless-tsc-integration-${random_string.bucket_suffix.result}"
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}