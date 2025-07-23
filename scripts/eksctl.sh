#!/bin/bash

# -----------------------------------------------------------------------------
# eksctl installation on Ubuntu
# Maintained by: Debjyoti Shit
# Description: Script to install eksctl on an instance.
# -----------------------------------------------------------------------------


echo "Updating package list and installing curl and tar..."
sudo apt update -y
sudo apt install -y curl tar

echo "Downloading the latest eksctl binary..."
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp

echo "Moving eksctl to /usr/local/bin..."
sudo mv /tmp/eksctl /usr/local/bin

echo "Cleaning up extracted files..."
rm -f /tmp/eksctl_$(uname -s)_amd64.tar.gz

echo "Verifying eksctl installation..."
eksctl version

if command -v eksctl &>/dev/null; then
  echo "eksctl installed successfully."
else
  echo "eksctl installation failed. Please check for errors above."
  exit 1
fi

echo "eksctl installation complete."
