#!/bin/bash

# -----------------------------------------------------------------------------
# Docker and SonarQube installation on Ubuntu
# Maintained by: Debjyoti Shit
# Description: Script to install Docker on an EC2 instance and configure permissions.
# -----------------------------------------------------------------------------


echo "Updating package list..."
sudo apt update -y

echo "Installing Docker..."
sudo apt install docker.io -y

echo "Adding users to the docker group..."
sudo usermod -aG docker ubuntu 
sudo usermod -aG docker jenkins 

echo "You need to log out and log back in or start a new session to apply group changes."

echo "Setting permissions for Docker socket..."
sudo chmod 660 /var/run/docker.sock
sudo chown root:docker /var/run/docker.sock

echo "Restarting Docker service..."
sudo systemctl restart docker

echo "Verifying Docker installation..."
docker --version

echo "Running SonarQube container..."
docker run -d --name sonar -p 9000:9000 sonarqube:lts-community

echo "Docker and SonarQube installation complete!"