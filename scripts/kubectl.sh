#!/bin/bash

# -----------------------------------------------------------------------------
# kubectl installation on Ubuntu
# Maintained by: Debjyoti Shit
# Description: Script to install kubectl on ubuntu.
# -----------------------------------------------------------------------------


echo "Updating package list..."
sudo apt update -y

echo "Installing curl if not already installed..."
sudo apt install -y curl

echo "Downloading the latest stable kubectl binary..."
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

echo "Installing kubectl..."
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

echo "Cleaning up the kubectl binary..."
rm -f kubectl

echo "Verifying kubectl installation..."
kubectl version --client

if command -v kubectl &>/dev/null; then
  echo "kubectl installed successfully."
else
  echo "kubectl installation failed. Please check for errors above."
  exit 1
fi

echo "kubectl installation complete."
