resource "aws_ssm_parameter" "country" {
  name      = "/country"
  type      = "String"
  value     = "India, Dubai or UK"
  overwrite = true
}