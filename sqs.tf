resource "aws_sqs_queue" "my_queue" {
  name = "${var.project_name}-${var.environment}-queue"
}