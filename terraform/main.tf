provider "aws" {
  region = var.aws_region
}

resource "aws_key_pair" "SyncPad" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
  
}

resource "aws_default_vpc" "default" {
  
}

resource "aws_security_group" "SyncPad_multi_port_sg" {
  name        = "SyncPad_multi_port_sg"
  description = "Allow multiple TCP ports"
  vpc_id      = aws_default_vpc.default.id

  ingress {
    description = "Allow NodePort range"
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }

  ingress {
    description = "SMTPS"
    from_port   = 465
    to_port     = 465
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }

  ingress {
    description = "Application Backend Port"
    from_port   = 4001
    to_port     = 4001
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }
  ingress {
    description = "Application WebSocket Port"
    from_port   = 4002
    to_port     = 4002
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }

  ingress {
    description = "Application Frontend Port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }

  ingress{
    description = "Jenkins Port"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }
  ingress{
    description = "SonarQube Port"
    from_port   = 9000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }

  ingress {
    description = "SMTP"
    from_port   = 25
    to_port     = 25
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }

  ingress {
    description = "Custom TCP 6443"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.allowed_ip]
  }

  tags = {
    Name        = "SyncPad-multi-port-sg"
    Environment = var.environment
    Owner       = var.owner
  }
}

resource "aws_instance" "web_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = aws_key_pair.SyncPad.key_name

  security_groups = [aws_security_group.SyncPad_multi_port_sg.name]

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name        = "web-server"
    Environment = var.environment
    Owner       = var.owner
  }
}
