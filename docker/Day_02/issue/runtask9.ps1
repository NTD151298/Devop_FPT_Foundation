# Build and run nginx container
docker build -t nginx_task9 .
docker run -d --name nginx09 -p 1999:80 nginx_task9
# Troubleshoot command line
docker logs nginx09
docker inspect nginx09
docker ps -a
docker history nginx_task9 .



