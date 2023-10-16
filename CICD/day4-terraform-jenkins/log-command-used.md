# Install docker on ec2-redhats aws
sudo yum update
sudo yum search docker
sudo yum info docker
sudo yum install docker
sudo usermod -a -G docker ec2-user
sudo id ec2-user
sudo newgrp docker
sudo wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) 
sudo sudo mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
sudo sudo chmod -v +x /usr/local/bin/docker-compose
sudo systemctl enable docker 
sudo systemctl start docker 
sudo systemctl status docker 

------------------------------------------------------------------------------------------------------------------------------------------
# Install docker on ec2-deban aws
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
# Install the Docker packages
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Manage Docker as a non-root user
# Create the docker group
sudo groupadd docker
# Add your user to the docker group
sudo usermod -aG docker $USER
# Log out and log back in so that your group membership is re-evaluated
newgrp docker
# Verify that you can run docker commands without sudo
docker run hello-world
------------------------------------------------------------------------------------------------------------------------------------------

# Cài đặt Container Engine debian linux
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
sudo chmod 777 /var/run/docker.sock # Cho container nếu có gọi được docker host daemon thì toàn quền sủ dụng nó

# Uninstall Docker Engine
sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd

# aws cli
aws sts get-caller-identity
aws configure list
aws configure 

# teraform
terraform init
terraform apply --auto-approve
terraform destroy --auto-approve
terraform plan
terraform validate

"${file("key/new_key.pub")}" 

docker-compose up

pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo "To build alot and fast"
            }
        }
        stage('Test') {
            steps {
                echo "Linh test main now"
            }
        }
        stage('Deploy') {
            steps {
                echo "Here come the money"
            }
        }
    }
}

# Change ip addr when create ec2 instance
ssh -i "key/new_key.pem" ubuntu@13.212.182.3
ssh -i "key/new_key.pem" ubuntu@ec2-54-165-68-228.compute-1.amazonaws.com