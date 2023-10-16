1. Create pod name `elephant`, requests `5Mi` memory for it and limit memory usage at `20Mi`.
2. Apply manifest `practice-resource.yaml`. What is the status of the pod? If the pod is not functioning well, troubleshoot and fix it.
3. Create a deployment with image `nginx:1.16` and 3 replicas by generating manifest file from `kubectl` and option `dry-run=client` and apply.
4. Update the version of the deployment above to `nginx:1.17`.
5. Add a new label `env:dev` to the deployment above.
6. Show revision record of the deloyment above and save into `/tmp/deployment-revision.history`
7. Create a deployment with image `httpd` and 3 replicas using `kubectl` only (not editing manifest file).
8. Create a pod with an init container `busybox:1.28` runs command `echo Hello from init container`.
9. Create a DaemonSet with image `nginx`
10. Create a Job to check connection to `google.com` using `ping`.
11. Create CronJob based on the Job above with execution time at 12:00AM everyday. 