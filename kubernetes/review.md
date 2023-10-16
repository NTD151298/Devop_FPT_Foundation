# DevOps Foundation - Kubernetes: Module Review

## Review current program
- Pros:
  - Cover a wide range of Kubernetes concepts
  - Many pre-provided materials
  - Good support from FA team
- Cons:
  - Many concepts are still narrow: Kubernetes core components, Kubernetes Networking
  - Need to prepare and provide many practice exercise. Some topics are not covered: Kubernetes Core components (kube-api-server, kube-scheduler, kubelet, ...) and Load Balancer (Ingress resource, Ingress Controller) due to environment limitation: `kind` does not support Load Balancer.
  - Quality of pre-provided slides from FA team is not good, need to edit and update a lot.
  - Slow responses from FA team: Final project is not notified

## Go/NoGo vote
- Go:
  - Update lecture slides to be easier to understand and more practical, less theoritical
  - Prepare more in-depth knowledge on each concepts, especially the ones listed above.
  - Prepare more practice exercises and situation exercises:
    - For K8s core components:
      - Provide some pre-prepared image, manifest files with wrong configurations for students and ask them to troubleshoot.
      - Delete some core components to see what happens and provide troubleshooting approach.
    - For Load Balancer:
      - Prepare a GKE cluster and create a LB on it
- NoGo:
  - Old slides contain too many unnecessary options
  - Slides and provided plan for students are not matched:
    - No RBAC concepts in slides
    - Order of topics in plan and slides are not alike
    - Content of provided plan is not suitable, and not the same with slides:
  => All of these NoGo points should be updated.

## Timeline for training
- Duration: 3 hours
- Start: 6:30pm
- Session: 45mins per session with 3 sessions
- Break: 10mins

## New structure propose
- New slides are provided, but need to be improved by following Go and NoGo points.
- Module updates, excepts the points in Go and NoGo points:
  - Add Static Pod
- Practice exercises should be updated and have more situation exercises.

## Final project update
- Lecturer should prepare a final project covering every components in Kubernetes that have been taught in a related way.
  
  For example:
  - Create a cluster from scratch
  - Deploy a backend Deployment, a frontend pod and a LB a front of it.