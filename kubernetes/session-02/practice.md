1. How many nodes are part of this cluster?
2. What is the Internal IP address of the controlplane node in this cluster?
3. What is the network interface configured for cluster connectivity on the controlplane node?
4. What is the MAC address of the interface on the controlplane node?
5. What are the IP addresses assigned to worker nodes?
6. Create 2 nginx pods and create a ClusterIP service to load balance between the created nginx pods.
7. Make sure the set up above is working
8. Extra: Create a pod with 2 containers, with at least 1 nginx container. From the other container, prove that we can establish connection to the nginx container via localhost with port 80.