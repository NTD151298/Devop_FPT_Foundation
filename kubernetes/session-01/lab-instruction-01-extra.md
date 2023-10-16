# Lab 01: Extra - Set up Kubernetes cluster with kubeadm

*This guide will provide step-by-step instructions to help you create a Kubernetes cluster using `kubeadm`.*
## Pre-requisite

- Linhx VM with:
  - At least 4GB of memory and 2 vCPU
  - Internet access
  - OS: `Ubuntu 20.04 or 22.04` 
  - User with `root` privileage 

## Instruction
To bootstrap a Kubernetes cluster with `kubeadm`, the following steps should be performed:
- Install `kubeadm`, `kubelet`, `kubectl`:
  - `kubeadm`: administration tool to initiate Kubernetes cluster
  - `kubelet`: Linux process run as a `systemd` service to manage pods on a node
  - `kubectl`: client tool to communicate with Kubernetes cluster
- Prepare common settings for Kubernetes nodes
- Prepare `containerd` container runtime:
  - `containerd`: container runtime in charge of creating containers based on requirements received from `kubelet`.
- Boostrap a Kubernetes cluster with `kubeadm`. The following components will be created:
  - `api-server`: acts as a front-end for external user to interact with our cluster or other components in the cluster communicate with each others.
  - `etcd`: key-value database stores our cluster's state.
  - `kube-proxy`: responsible for managing network routing between different pods within a Kubernetes cluster.
  - `kube-scheduler`: choose node for created Pod based on filters or constraints.
  - `kube-controller-manager`: watch cluster's state and move the cluster from current state to desired state.
  - `coredns`: manage DNS in the cluster. 
    
    **NOTE**: Cluster CoreDNS will not be created until cluster container network interface or CNI is configured correctly. We will set up `flannel` CNI right behind this step.
- Install `flannel` container network interface or CNI
  - Container network interface (CNI) is responsible for configuring the network interfaces and routing tables of the individual containers within a pod
- Create a simple pod


Below are detailed instructions:
- [Reference](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl) - Install `kubeadm`, `kubectl`, `kubelet`:
  ```bash
  # Update `apt` package manager and install dependencies:
  sudo apt-get update
  sudo apt-get install -y apt-transport-https ca-certificates curl

  # Download Google public signing key:
  sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg

  # Add `Kubernetes` repository:
  echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

  # Update `apt` package manager and install tools:
  sudo apt-get update
  sudo apt-get install -y kubelet kubeadm kubectl
  sudo apt-mark hold kubelet kubeadm kubectl
  ```

  NOTE: `/etc/apt/keyrings` directory might not exist, create one if you need to and make it world-readable but writable only by admins.

- [Reference](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#install-and-configure-prerequisites) - Prepare common settings for Kubernetes nodes:
  ```bash
  # These settings should be OK without any issues
  cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
  overlay
  br_netfilter
  EOF

  sudo modprobe overlay
  sudo modprobe br_netfilter

  # sysctl params required by setup, params persist across reboots
  cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
  net.bridge.bridge-nf-call-iptables  = 1
  net.bridge.bridge-nf-call-ip6tables = 1
  net.ipv4.ip_forward                 = 1
  EOF

  # Apply sysctl params without reboot
  sudo sysctl --system

  # Verify that the br_netfilter, overlay modules are loaded
  lsmod | grep br_netfilter
  lsmod | grep overlay
  sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
  ```

- [Reference](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#installing-containerd) - Prepare `containerd` container runtime:
  ```bash
  # Download `container` binary file
  wget https://github.com/containerd/containerd/releases/download/v1.7.0/containerd-1.7.0-linux-amd64.tar.gz
  sudo tar Cxzvf /usr/local containerd-1.7.0-linux-amd64.tar.gz

  # Download `containerd` service file and use `systemctl` to manage `containerd` service
  sudo mkdir -p /usr/local/lib/systemd/system
  sudo wget -O /usr/local/lib/systemd/system/containerd.service https://raw.githubusercontent.com/containerd/containerd/main/containerd.service

  systemctl daemon-reload
  systemctl enable --now containerd
  
  # Install `runc`, a dependency required by `containerd`
  wget https://github.com/opencontainers/runc/releases/download/v1.1.7/runc.amd64
  sudo install -m 755 runc.amd64 /usr/local/sbin/runc

  # Install CNI plugins, a denpendency required by `containerd` so that it can work with other CNI add-ons.  
  sudo mkdir -p /opt/cni/bin
  wget https://github.com/containernetworking/plugins/releases/download/v1.2.0/cni-plugins-linux-amd64-v1.2.0.tgz
  sudo tar Cxzvf /opt/cni/bin cni-plugins-linux-amd64-v1.2.0.tgz

  # Generate default config file 
  sudo sh -c "containerd config default > /etc/containerd/config.toml"

  # Configure `systemd` cgroup driver by setting `SystemdCgroup` in `/etc/containerd/config.toml` to `true`:
  sudo sed -i 's:SystemdCgroup = false:SystemdCgroup = true:g' /etc/containerd/config.toml

  # Apply new driver configuration
  sudo systemctl restart containerd
  ```

- [Reference](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#initializing-your-control-plane-node) - Boostrap Kubernetes cluster:
  ```bash
  # Boostrap our cluster, pod CIDR range of 10.244.0.0/16 is required by `flannel` CNI add-on below
  sudo kubeadm init --pod-network-cidr 10.244.0.0/16

  # Configure `kubectl` so that it can communicate with our created cluster
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

- [Reference](https://github.com/flannel-io/flannel#deploying-flannel-with-kubectl) - Install `flannel` CNI add-on:
  ```bash
  kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
  ```

- Create a simple pod:
  ```bash
  kubectl create my-nginx --image nginx:alpine
  kubectl get pod -A
  ```

In case of malfunctional Kubernetes cluster, this might help to clean up:
  ```bash
  kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
  sudo kudeadm reset
  sudo sh -c "iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X"
  ```
