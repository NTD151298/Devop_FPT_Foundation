# Install terraform on ubuntun

# Step 1: Update the System
sudo apt update 
sudo apt upgrade

# You’ll need curl and some software-properties-common packages to add the repository key and repository. Run the following commands to install them:
sudo apt install curl software-properties-common 

# Step 2: Add the HashiCorp Repository
# Terraform is developed by HashiCorp, and you need to add the HashiCorp GPG (GNU Privacy Guard) key with the following command:
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg 
Once the key is added, add the HashiCorp repository to your system:
ADVERTISEMENT

echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list 

# Step 3: Install Terraform
# After adding the repository, you can install Terraform with the following command:
sudo apt update && sudo apt install terraform 

# Step 4: Verify the Installation
# To ensure Terraform has been installed successfully, check the version with the following command:
terraform version 
