1. How many services in the cluster?
2. What is the range of IP addresses configured for PODs on this cluster?
3. What is the IP Range configured for the services within the cluster?
4. Create 1 pod with `nginx:alpine` image and 1 pod with `httpd` image and assign same labels to them
5. Create 1 ClusterIP service to expose 2 created pods on service port `8080` and test the connection
6. Develop a manifest file to create 1 pod with `busybox` image and shell commands to run `curl <IP of the created service in #3>:8080` after every 3 second
7. Wait for 10 seconds and get the logs of the `busybox` pod above.
8. Create 1 NodePort service to expose 2 created pods on node port `30080` and test the connection
