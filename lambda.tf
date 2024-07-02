resource "null_resource" "lambda_dependencies" {
  triggers = {
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = <<EOT
      npm install
      npm run build
      mkdir -p ${path.module}/dist
      cp -R node_modules ${path.module}/dist/
      cp -R src ${path.module}/dist/
    EOT
    working_dir = path.module
  }
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/dist"
  output_path = "${path.module}/lambda_function.zip"
  depends_on  = [null_resource.lambda_dependencies]
}

resource "aws_lambda_function" "sqs_consumer" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "${var.project_name}-${var.environment}-sqs-consumer"
  role             = aws_iam_role.lambda_role.arn
  handler          = "src/index.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime          = "nodejs18.x"

  environment {
    variables = {
      country = aws_ssm_parameter.country.name
    }
  }

  depends_on = [null_resource.lambda_dependencies]
}

resource "aws_lambda_event_source_mapping" "sqs_event_source" {
  event_source_arn = aws_sqs_queue.my_queue.arn
  function_name    = aws_lambda_function.sqs_consumer.arn
  batch_size       = 10
}