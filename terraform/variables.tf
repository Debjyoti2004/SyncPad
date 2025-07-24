variable "aws_region" {
  description = "AWS region to deploy in"
  type        = string
}
variable "public_key_path" {
  description = "Path to the public key file for the EC2 key pair."
  type        = string
}
variable "key_name" {
  description = "The name of the key pair to use for the EC2 instance."
  type        = string
}
variable "allowed_ip" {
  description = "Allowed IP range for SSH/HTTP/HTTPS"
  type        = string
}
variable "environment" {
  description = "Environment tag (e.g. dev, prod)"
  type        = string
  default     = "dev"
}
variable "owner" {
  description = "Owner (Debjyoti) tag for the resources"
  type        = string
  default     = "dev-team"
}
variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
}
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}