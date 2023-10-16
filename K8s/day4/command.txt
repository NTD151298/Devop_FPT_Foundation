# Cluster 
kind create cluster --name duong1

# Name space
kubectl create namespace day4-lab

# Pod and name space
kubectl run nginx-pod --namespace=day4-lab --image=nginx:alpine --restart=Never
kubectl get pod -o wide -n day4-lab

# Deployment, 2 Replicas 
kubectl create deployment nginx-deployment --namespace=day4-lab --image=nginx:alpine --replicas=2
kubectl get pod -o wide -n day4-lab

# Expose as ClusterIP Service 
kubectl expose deployment nginx-deployment --name=nginx-service --port=1000 --target-port=80 --type=ClusterIP --namespace=day4-lab
kubectl get service -o wide -n day4-lab   

# Forward to Localhost
kubectl port-forward service/nginx-service 9000:1000 --namespace=day4-lab

kubectl port-forward service/my-nginxport-service 8000:2000 --namespace=this-is-nginx-space
