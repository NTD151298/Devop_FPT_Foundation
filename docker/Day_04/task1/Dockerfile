# Use a base image
FROM amazonlinux:2

# Install dependencies and update
RUN yum update -y && \
    yum install -y git npm postgresql15 && \
    yum clean all

# Set working directory
WORKDIR /home/ec2-user

# Clone the repository
RUN git clone https://github.com/MiguelLamas/to-do-app-pern-stack.git

# Move to the project directory
WORKDIR /home/ec2-user/to-do-app-pern-stack

# Install server dependencies and start
RUN npm install
ENV PG_USER=postgres
ENV PG_PASSWORD=passdb123
ENV PG_HOST=database-3.cp8ekwy8tfuw.us-east-1.rds.amazonaws.com
ENV PG_DATABASE=perntodo
ENV PG_PORT=5432
CMD ["node", "./server/index.js"]

# Move to the client directory
WORKDIR /home/ec2-user/to-do-app-pern-stack/client

# Install client dependencies and start
RUN npm install
RUN npm audit fix --force
RUN mkdir -p node_modules/.cache
RUN chmod -R 777 node_modules/.cache
ENV NODE_OPTIONS=--openssl-legacy-provider
CMD ["npm", "start"]
