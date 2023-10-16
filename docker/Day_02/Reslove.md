Sure, here's how you can complete each of the tasks:

**Task 1:**
Create a Dockerfile for a Python application that prints a message. 
Build the image and run a container from it.

Dockerfile:
```Dockerfile
# Use the official Python image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the Python script into the container
COPY script.py .

# Run the Python script
CMD ["python", "script.py"]
```

Create a file named `script.py` in the same directory as the Dockerfile:
```python
print("Hello from Python!")
```

Build the image and run a container:
```bash
docker build -t python-app .
docker run python-app
```

**Task 2:**
Build an image with multiple tags and push it to Docker Hub.

```bash
# Build the image with multiple tags
docker build -t your-dockerhub-username/my-image:latest -t 
your-dockerhub-username/my-image:v1.0 .

# Log in to Docker Hub
docker login

# Push the image to Docker Hub
docker push your-dockerhub-username/my-image:latest
docker push your-dockerhub-username/my-image:v1.0
```

**Task 3:**
Create a multi-stage Dockerfile for a Node.js app. 
Build the app and copy only the necessary files to the final image.

Dockerfile:
```Dockerfile
# Build stage
FROM node:14 AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:14-slim
WORKDIR /app
COPY --from=builder /app/dist /app
CMD ["node", "app.js"]
```

**Task 4:**
Push an image to Docker Hub, then pull and run it on a different machine.

```bash
# Push the image to Docker Hub
docker push your-dockerhub-username/my-image:latest

# On the different machine, pull the image and run a container
docker pull your-dockerhub-username/my-image:latest
docker run your-dockerhub-username/my-image:latest
```

**Task 5:**
Build a custom Nginx image with a customized homepage.

Dockerfile:
```Dockerfile
# Use the official Nginx image
FROM nginx:latest

# Copy custom HTML file to Nginx directory
COPY custom-index.html /usr/share/nginx/html/index.html
```

Create a file named `custom-index.html` in the same directory 
as the Dockerfile:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Custom Homepage</title>
</head>
<body>
    <h1>Welcome to my custom homepage!</h1>
</body>
</html>
```

Build the custom Nginx image and run a container:
```bash
docker build -t custom-nginx .
docker run -d -p 8080:80 custom-nginx
```

**Task 6:**
Run an Nginx container in detached mode, map a local port, 
and access the Nginx welcome page.

```bash
docker run -d -p 8080:80 nginx
```

Access the Nginx welcome page by opening a web browser and 
navigating to `http://localhost:8080`.

**Task 7:**
Run an Ubuntu container interactively, access its shell, and 
execute basic commands.

```bash
docker run -it ubuntu

# Inside the container shell
ls
pwd
apt-get update
apt-get install nano
exit
```

**Task 8:**
Run a container with environment variables set using the `-e` 
flag and `ENV` instruction. Access these variables from within 
the container.

```bash
docker run -e MY_VARIABLE=my_value ubuntu

# Inside the container shell
echo $MY_VARIABLE
```

**Task 9:**
Build a Docker image using the Dockerfile in the `issue` 
directory, then run a container using that image. Troubleshoot 
if necessary.

```bash
cd issue
docker build -t my-issue-image .
docker run my-issue-image
```

**Task 10:**
Run a container, stop it, and then remove it.

```bash
docker run -it ubuntu
# Inside the container
exit

# Find the container ID
docker ps -a

# Stop the container
docker stop CONTAINER_ID

# Remove the container
docker rm CONTAINER_ID
```

**Task 11:**
Build an image with a custom HTML file, run a container from 
the image, and copy a file from the host to the container.

Dockerfile:
```Dockerfile
# Use the official Nginx image
FROM nginx:latest

# Copy custom HTML file to Nginx directory
COPY custom.html /usr/share/nginx/html/
```

Create a file named `custom.html` in the same directory as 
the Dockerfile:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Custom HTML</title>
Certainly, here's the continuation of the task explanations:

```html
</head>
<body>
    <h1>This is a custom HTML page.</h1>
</body>
</html>
```

Build the custom Nginx image and run a container:

```bash
docker build -t custom-html-nginx .
docker run -d -p 8080:80 custom-html-nginx
```

