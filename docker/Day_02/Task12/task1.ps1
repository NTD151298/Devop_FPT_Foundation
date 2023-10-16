# Build my application with tag my repo in docker hub and path in the file that have docker conten
docker build -t duongtn1512/devops_fpt_learn:day2_task1 -t duongtn1512/devops_fpt_learn:day2_task2 -f Task1.Dockerfile .
# Make sure we login in docker hub repo duongtn1512
docker login
# Push to our repo 
docker push duongtn1512/devops_fpt_learn:day2_task1
docker push duongtn1512/devops_fpt_learn:day2_task2
# Run it again to make sure it pull from docker hub repo of our
docker run duongtn1512/devops_fpt_learn:day2_task1
