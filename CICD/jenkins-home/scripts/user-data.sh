#!/bin/bash

# Cài đặt Container Engine
sudo apt-get update  # Cập nhật danh sách gói phần mềm
sudo apt-get install -y ca-certificates curl gnupg lsb-release  # Cài đặt các gói cần thiết

# Tải và cài đặt khóa GPG của Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Thêm kho lưu trữ Docker vào danh sách các kho lưu trữ ứng dụng
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cài đặt Docker
sudo apt-get install docker.io -y  # Cài đặt Docker
systemctl enable docker.service  # Kích hoạt Docker để khởi động cùng hệ thống
systemctl start docker.service  # Khởi động dịch vụ Docker
sudo apt-get install docker-compose -y # Cài đặt Docker compose

# Cấu hình Docker daemon
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

# Quản lý Docker dưới dạng người dùng không phải root
# Tạo nhóm docker
sudo groupadd docker
# Thêm người dùng của bạn vào nhóm docker
sudo usermod -a -G docker $USER
# Đăng xuất và đăng nhập lại để nhóm của bạn được đánh giá lại
newgrp docker

sudo systemctl enable docker  # Kích hoạt Docker để khởi động cùng hệ thống
sudo systemctl daemon-reload  # Tải lại danh sách dịch vụ
sudo systemctl restart docker  # Khởi động lại dịch vụ Docker với cấu hình mới

# Let jenkins container successfully call docker 
sudo chmod 777 /var/run/docker.sock

# Viết dockerfile config jenkins để nó có docker cli và plugin cần thiết
# echo 'FROM jenkins/jenkins:lts
# USER root
# 
# RUN apt-get update -qq -y && \
#     apt-get install yq unzip wget -qqy apt-transport-https ca-certificates curl gnupg2 software-properties-common -y 
# 
# RUN apt-get update && apt-get install -y lsb-release
# RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
#   https://download.docker.com/linux/debian/gpg
# RUN echo "deb [arch=$(dpkg --print-architecture) \
#   signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
#   https://download.docker.com/linux/debian \
#   $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
# RUN apt-get update && apt-get install -y docker-ce-cli
# 
# # install terraform 1.4.4
# RUN wget https://releases.hashicorp.com/terraform/1.4.4/terraform_1.4.4_linux_amd64.zip && \
#     unzip terraform_1.4.4_linux_amd64.zip && \
#     mv terraform /usr/local/bin/
# 
# RUN apt update -y && \
#     apt install ansible -y
# 
# RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
#     chmod +x kubectl && \
#     mv kubectl /usr/local/bin
# 
# ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false
# # ENV CASC_JENKINS_CONFIG /var/jenkins_home/jenkins.yaml
# # COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
# # RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
# # COPY jenkins.yaml /var/jenkins_home/jenkins.yaml
# # Install CLI tools for Jenkins to interact with external systems
# # Then restrict the Jenkins to use its user only
# RUN usermod -aG docker jenkins
# USER jenkins
# ' > /home/ubuntu/Dockerfile
# 
# 
# # Viết dcoker ompose để auto build và deploy jenkins mói được build
# echo "version: '3.7'
# services:
#   jenkins:
#     build:
#       context: ./  # Thư mục chứa Dockerfile
#       dockerfile: Dockerfile  # Tên Dockerfile
#     image: jenkins/jenkins:latest  # Đặt tên cho image
#     ports:
#       - \"8080:8080\"
#       - \"50000:50000\"
#     networks:
#       - cisystem
#     volumes:
#       - /var/run/docker.sock:/var/run/docker.sock
#       - /usr/bin/docker:/usr/bin/docker
#     # env_file: ./secrets.env
#     restart: always
# 
# networks:
#   cisystem:
# 
# volumes:
#   my_jenkins_home:" > /home/ubuntu/compose.yaml

