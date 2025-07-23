#!/bin/bash

# -----------------------------------------------------------------------------
# Terraform Installer Script
# Maintained by: Debjyoti Shit
# Description: Installs Terraform on Ubuntu server.
# -----------------------------------------------------------------------------


echo "Updating package list and installing dependencies..."
sudo apt update -y && sudo apt install -y gnupg software-properties-common curl

echo "Adding HashiCorp GPG key..."
curl -fsSL https://apt.releases.hashicorp.com/gpg | \
  gpg --dearmor | \
  sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null

echo "Verifying GPG key fingerprint..."
gpg --no-default-keyring \
  --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg \
  --fingerprint

echo "Adding HashiCorp repository to sources list..."
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
  https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
  sudo tee /etc/apt/sources.list.d/hashicorp.list > /dev/null

echo "Updating package lists after adding the HashiCorp repository..."
sudo apt update -y

echo "Installing Terraform..."
sudo apt install terraform -y

echo "Verifying Terraform installation..."
terraform -v

if command -v terraform &>/dev/null; then
  echo "Terraform installed successfully."
else
  echo "Terraform installation failed. Please check for errors above."
  exit 1
fi

echo "Terraform installation complete."
