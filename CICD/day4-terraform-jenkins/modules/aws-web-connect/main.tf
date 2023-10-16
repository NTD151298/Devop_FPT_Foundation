# VPC
resource "aws_vpc" "lap" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "Day4-VPC"
  }
}
#  Public subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.lap.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  tags = {
    Name = "Day4-Subnet"
  }
}
#  NACL tường lửa cho subnet
resource "aws_network_acl" "allow_all" {
  vpc_id     = aws_vpc.lap.id
  subnet_ids = [aws_subnet.public.id]
  egress {
    rule_no    = 100
    action     = "allow"
    protocol   = "tcp"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 65535
  }
  ingress {
    rule_no    = 100
    action     = "allow"
    protocol   = "tcp"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 65535
  }
  tags = {
    Name = "Day4-NACL"
  }
}
#  Internet gateway
resource "aws_internet_gateway" "lap" {
  vpc_id = aws_vpc.lap.id
  tags = {
    Name = "Day4-Gate"
  }
}
#  Route table
resource "aws_route_table" "lap" {
  vpc_id = aws_vpc.lap.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.lap.id
  }
  tags = {
    Name = "Day4-Route"
  }
}
#  Map route table to subnet
resource "aws_route_table_association" "PubToInt" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.lap.id
}
# SG
resource "aws_security_group" "lap" {
  vpc_id      = aws_vpc.lap.id
  description = "Security group for example EC2 instance"
  # Các quy tắc truy cập cho SG
  ingress { # SSH
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress { # HTTP
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress { # HTTPS
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress { # ICMP
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "Day4-SG"
  }
}

