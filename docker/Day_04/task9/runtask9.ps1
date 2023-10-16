# Start the source container nginx01 with volume a001 mounted to /data
docker run -d --name nginx01 -v a001:/data nginx
# Create the destination container nginx02 using the volume from nginx01
docker run -d --name nginx02 --volumes-from=nginx01 nginx
