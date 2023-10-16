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
