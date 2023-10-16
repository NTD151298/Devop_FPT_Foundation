# Create volume that will get shared
docker volume create a004
# Create 2 nginx container mount to volume a004
docker run -d --name nginx01 -v a004:/shared-data nginx
docker run -d --name nginx02 -v a004:/shared-data nginx
# Wirte text to volume a004 from nginx01 and check result at nginx02
docker exec -it nginx01 sh -c "echo 'Hello from Nginx01 Bro u got chose' > /shared-data/demo.txt"
docker exec -it nginx02 cat /shared-data/demo.txt