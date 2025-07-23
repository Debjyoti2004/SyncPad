#!/bin/bash

# -----------------------------------------------------------------------------
# AWS CLI installation on Ubuntu
# Maintained by: Debjyoti Shit
# Description: Script to install AWS CLI on an instance.
# -----------------------------------------------------------------------------



echo "Updating package list and installing curl and unzip if necessary..."
sudo apt update -y
sudo apt install -y curl unzip

echo "Downloading AWS CLI installer..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

echo "Unzipping AWS CLI installer..."
unzip awscliv2.zip

echo "Installing AWS CLI..."
sudo ./aws/install

echo "Cleaning up installation files..."
rm -rf awscliv2.zip aws/

echo "Verifying AWS CLI installation..."
aws --version

if command -v aws &>/dev/null; then
  echo "AWS CLI installed successfully."
else
  echo "AWS CLI installation failed. Please check for errors above."
  exit 1
fi

echo "AWS CLI installation complete."
