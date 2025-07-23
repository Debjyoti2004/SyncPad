#!/bin/bash

# -----------------------------------------------------------------------------
# Trivy Installer Script
# Maintained by: Debjyoti Shit
# Description: Installs Trivy on Ubuntu server.
# -----------------------------------------------------------------------------


echo "Updating package list and installing necessary dependencies..."
sudo apt-get update -y
sudo apt-get install wget apt-transport-https gnupg lsb-release -y

echo "Adding Trivy repository key..."
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null

echo "Adding Trivy repository to sources list..."
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list

echo "Updating package lists with Trivy repository..."
sudo apt-get update -y

echo "Installing Trivy..."
sudo apt-get install trivy -y

echo "Verifying Trivy installation..."
trivy --version

if command -v trivy &>/dev/null; then
  echo "Trivy installation completed successfully."
else
  echo "Trivy installation failed. Please check for errors above."
  exit 1
fi

echo "Trivy installation is complete!"
