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

sudo systemctl enable docker  # Kích hoạt Docker để khởi động cùng hệ thống
sudo systemctl daemon-reload  # Tải lại danh sách dịch vụ
sudo systemctl restart docker  # Khởi động lại dịch vụ Docker với cấu hình mới
sudo chmod 777 /var/run/docker.sock # Cho container nếu có gọi được docker host daemon thì toàn quền sủ dụng nó

# Viết docker file để xây jenkins custom image và image cũng có docker cli để dùng docker daemon của host
cat > /home/ubuntu/Dockerfile <<EOL
# Sử dụng Jenkins LTS image làm base
FROM jenkins/jenkins:lts

# Chuyển sang quyền root để cài đặt Docker
USER root

# Cài đặt các gói cần thiết
RUN apt-get update  
RUN apt-get install -y ca-certificates curl gnupg

# Tạo thư mục /etc/apt/keyrings và cài đặt Docker's GPG key
RUN install -m 0755 -d /etc/apt/keyrings  
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg  
RUN chmod a+r /etc/apt/keyrings/docker.gpg

# Thêm repository Docker vào Apt sources
RUN echo \
    "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
# Cập nhật danh sách gói và cài đặt Docker (ví dụ: docker-ce)
RUN apt-get update 
RUN apt-get install -y docker-ce-cli

# Quay lại quyền người dùng jenkins mặc định
USER jenkins

EOL

# Viết file docker compose build docker file tạo thành image và deploy jenkins container
cat > /home/ubuntu/compose.yaml <<EOL
version: '3.7'
services:
  jenkins:
    container_name: jenkins  # Đặt tên container là "jenkins"
    build: ./  # Sử dụng context hiện tại để build image.
    image: duongtn1512/jenkins_docker:after_FPT_training  # Tên image sau khi build
    ports:
      - "8080:8080"  # Kết nối cổng máy host (bên trái) với cổng container (bên phải).
      - "50000:50000"  # Cổng khác (nếu cần).
    networks:
      - day4-terraform  # Sử dụng network "day4-terraform" (bạn có thể thay tên mạng tại đây).
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock  # Chia sẻ truy cập vào Docker socket.
      - /usr/bin/docker:/usr/bin/docker  # Chia sẻ thực thi Docker.
    restart: always  # Luôn khởi động container khi Docker daemon khởi động lại.

networks:
  day4-terraform:  # Đặt tên mạng (có thể đổi tên mạng tại đây).

volumes:
  my_jenkins_home:
EOL

docker-compose -f /home/ubuntu/compose.yaml up -d

 
# Quản lý Docker dưới dạng người dùng không phải root
# Tạo nhóm docker
# sudo groupadd docker
# Thêm người dùng của bạn vào nhóm docker
# sudo usermod -a -G docker $USER
# Đăng xuất và đăng nhập lại để nhóm của bạn được đánh giá lại
# newgrp docker

# Install jenkins Long Term Support
# curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
# echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
# sudo apt-get update
# sudo apt-get install jenkins -y

# Installation of Java (jenkins nees java to run)
# sudo apt update
# sudo apt install fontconfig openjdk-17-jre 
# java -version
# sudo snap install openjdk
# openjdk version "17.0.8" 2023-07-18
# OpenJDK Runtime Environment (build 17.0.8+7-Debian-1deb12u1)
# OpenJDK 64-Bit Server VM (build 17.0.8+7-Debian-1deb12u1, mixed mode, sharing)

# Start jenkins
# sudo systemctl enable jenkins
# sudo systemctl start jenkins

