#!/bin/bash

# -----------------------------------------------------------------------------
# Argo CD installation on Ubuntu
# Maintained by: Debjyoti Shit
# Description: Argo CD installation on Ubuntu.
# -----------------------------------------------------------------------------

echo "After creating the EKS cluster, run this script to install Argo CD."

echo "Updating system packages..."
sudo apt update -y
sudo apt upgrade -y

echo "Creating Argo CD namespace..."
kubectl create namespace argocd

echo "Installing Argo CD components..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "Waiting for Argo CD pods to be ready (you can press Ctrl+C to skip)..."
watch kubectl get pods -n argocd

echo "Downloading Argo CD CLI..."
sudo curl --silent --location -o /usr/local/bin/argocd \
  https://github.com/argoproj/argo-cd/releases/download/v2.4.7/argocd-linux-amd64

echo "Making Argo CD CLI executable..."
sudo chmod +x /usr/local/bin/argocd

echo "Getting Argo CD server service..."
kubectl get svc -n argocd

echo "Patching Argo CD server service to NodePort..."
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

echo "Exposed services:"
kubectl get svc -n argocd

echo "Argo CD installation completed!"

echo "To access the Argo CD UI, use the following command to get the initial admin password and the username is 'admin':"
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
