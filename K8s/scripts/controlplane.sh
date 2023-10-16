#!/bin/bash
echo "|x| Setting controlplane"

IP_ADDR=$(ip addr show enp0s3 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
kubeadm init --apiserver-cert-extra-sans=controlplane --apiserver-advertise-address $IP_ADDR --pod-network-cidr=10.244.0.0/16

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/calico.yaml 

# sed "s/kubeadm join/$(kubeadm token create --print-join-command)/g" /vagrant/scripts/worker.sh

cat <<EOT > /vagrant/scripts/worker.sh
echo "|x| Setting worker node"
$(kubeadm token create --print-join-command)
EOT
