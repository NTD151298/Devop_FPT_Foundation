# Build Docker image with specified tag
docker build -t duongtn1512/devops_fpt_learn:day2_task3 .


# Push the image to Docker Hub with custom tag
docker push duongtn1512/devops_fpt_learn:day2_task3

# Remove any existing container with the same name
docker rm -f b1

# Run the Docker image in detached mode, mapping port 3000 and setting the container name
docker run -d --name b1 duongtn1512/devops_fpt_learn:day2_task3


