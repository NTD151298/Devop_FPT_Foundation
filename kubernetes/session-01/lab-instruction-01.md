# Lab 01: Set up Kubernetes cluster

*This lab will guide you step by step to boostrap your own Kubernetes cluster*.

## Pre-requisite

The following materials are required to complete this lab:
- A Linux virtual machine with
  - At least 2 vCPU and 4GB memory
  - Internet connection
  
  NOTE: This guide will use Ubuntu as an example.

## Instructions
*NOTE: This lab will require you have the `root` privileage to install tools.*

We will use `kind`, a lightweight open-source tool for running a Kubernetes cluster locally, using Docker containers as cluster nodes. Let's go!

- Install `kubectl`, the client tool to interact with Kubernetes cluster:
  
  Reference: [Official Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/).
  ```bash
  # Download the latest release with the command
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

  # Install kubectl
  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  ```
  
- Install `docker`, a component acts as an interface for `kind` to work with container runtime interface:

  Reference: [Docker official documentation](https://docs.docker.com/engine/install/ubuntu/).

  ```bash
  # Remove old versions and install dependencies
  sudo apt-get remove docker docker-engine docker.io containerd runc
  sudo apt-get update
  sudo apt-get install \
      ca-certificates \
      curl \
      gnupg
  
  # Add Docker’s official GPG key
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg

  # Set up the repository
  echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  # Update package manager and install Docker `latest` version
  sudo apt-get update
  sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  ```

- Install `kind`:

  Reference: [kind Official documentation](https://kind.sigs.k8s.io/docs/user/quick-start/).

  ```bash
  curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.18.0/kind-linux-amd64
  chmod +x ./kind
  sudo mv ./kind /usr/local/bin/kind
  ```

- Bootstrap a new cluster:

  ```bash
  kind create cluster
  ```

- Create a new Pod:
  ```bash
  kubectl run nginx --image nginx:alpine
  ```