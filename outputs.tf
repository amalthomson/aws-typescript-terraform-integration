output "sqs_queue_url" {
  value       = aws_sqs_queue.my_queue.url
  description = "URL of the SQS queue"
}

output "api_gateway_url" {
  value       = "${aws_api_gateway_deployment.api_deployment.invoke_url}${aws_api_gateway_resource.api_resource.path}"
  description = "URL of the API Gateway endpoint"
}