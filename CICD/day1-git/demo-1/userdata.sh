#!/bin/bash

# Use `set` command for debug
set -x

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

sudo yum update

yum install httpd -y
service httpd start
chkconfig httpd on

yum install postgresql15 -y

export TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

cat > /var/www/html/index.html <<EOL
<html>
<h1>Welcome to FPT Academy</h1>
<h1>Server Metadata: </h1>
<h2>Hostname: $(curl -H "X-aws-ec2-metadata-token: $TOKEN" -v http://169.254.169.254/latest/meta-data/hostname) </h2>
<h2>PrivateIP: $(curl -H "X-aws-ec2-metadata-token: $TOKEN" -v http://169.254.169.254/latest/meta-data/local-ipv4) </h2>
<h2>PublicIP: $(curl -H "X-aws-ec2-metadata-token: $TOKEN" -v http://169.254.169.254/latest/meta-data/public-ipv4) </h2>
</html>
EOL

# Debug: sudo tail -f  /var/log/cloud-init-output.log 
# Demo git lab