# Khai báo cấu hình AWS provider
provider "aws" {
  region = "ap-southeast-1"
}
# Gọi tài nguyên của VPC
# module "web_connect" {
#   source = "./modules/aws-web-connect"
#   # Other module parameters
# }

# Tạo máy chủ EC2
resource "aws_instance" "main" {
  ami           = "ami-0df7a207adb9748c7"    # AMI ID của Ubuntu
  instance_type = "t2.micro"                 # Instance type của tôi
  key_name      = aws_key_pair.fast.key_name # Key pair của tôi
  #  subnet_id              = module.web_connect.subnet_id           # Reference subnet from the module
  #  vpc_security_group_ids = [module.web_connect.security_group_id] # Reference security group from the module
  # User data để cài đặt Docker và Docker Compose
  user_data = file("scripts/user-data.sh")

  # Gắn security group đã tạo vào instance
  # vpc_security_group_ids = [lap4.sg.ssh_80_443_ICMP.id] # Có ssh/80/443/ping

  tags = {
    Name = "Day4-lap"
  }
}

# Để tạo key pair, ta sử dụng resource aws_key_pair trong tệp Terraform.
resource "aws_key_pair" "fast" {
  key_name   = "new_key.pub"           # Tên key pair 
  public_key = file("key/new_key.pub") # Đường dẫn đến file public key
}
