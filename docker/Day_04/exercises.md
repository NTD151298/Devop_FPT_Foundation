# 1. Create a named volume called "data_volume" and mount it to a container. Verify that data is persisted even after the container is removed.

# 2. Mount a directory from your host machine to a container using a bind mount. Modify files from both the host and the container to observe changes.
   
# 3. Use the docker volume inspect command to view metadata and configuration details of a volume.

# 4. Identify and remove volumes that are no longer in use to free up storage space.

# 5. Backup the contents of a volume to your local machine and then restore it to a new volume.

# 6. Create a container with a tmpfs mount to store temporary data in memory. Observe how the data is lost when the container stops.

# 7. Write a docker-compose.yml file that defines a service using volumes, then launch multiple containers to share data.

# 8. Launch a container that uses multiple volumes for different parts of its filesystem.

# 9. Create two containers, migrate data from one to the other using volumes, and ensure minimal downtime.

# 10. Launch multiple instances of a container and share data using the same volume between them.
