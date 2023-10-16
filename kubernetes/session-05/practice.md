1. Create a pod with image `nginx`  and configure a volume to store logs folder `/log`  at `/var/log/webapp` on the host.
2. Create a PV name `pv-log`, storage `100Mi`, access mode `ReadWriteMany`, hostPath `pv/log`, reclaim policy `Retain`.
3. Create a PVC name `claim-log-1`, storage request `50Mi`, access modes `ReadWriteOnce`.
4. Investigate the state of the created PV and PVC.
5. Explain the state of PV and PVC, troubleshoot if the PVC is not bound to PV. Delete and recreate if needed.
6. Create a new pod with any image to use the created PVC at `/data`
7. Create a StatefulSet with image `postgres` with volumeClaimTemplate request `1Gi` storage and mountPath `/var/lib/postgresql/data`.
8. Create a Secret from `others/secret.env`, a ConfigMap from `others/config.env`, then create a pod with image `httpd` and inject the secret and the configmap as environment variables.