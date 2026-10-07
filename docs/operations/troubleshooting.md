# Troubleshooting

## 1. Overview

Troubleshooting in ShopNest follows a structured Kubernetes-first approach.

When an application component is not working, the investigation should move from:

```text
Pod
  ↓
Logs
  ↓
Events
  ↓
Service
  ↓
Configuration
  ↓
Storage
  ↓
Resources
  ↓
Application dependency
```

The goal is to identify the actual failure point instead of immediately restarting or recreating resources.

---

## 2. Check Overall Application State

Start by checking the Pods in the application namespace:

```bash
kubectl get pods -n ecommerce
```

This provides a quick overview of whether the main workloads are:

* Running
* Pending
* CrashLoopBackOff
* Error
* Completed
* NotReady

Then check the Deployments:

```bash
kubectl get deployments -n ecommerce
```

Check the StatefulSet:

```bash
kubectl get statefulset -n ecommerce
```

---

## 3. Pod Not Running

If a Pod is not running, inspect its details:

```bash
kubectl describe pod <pod-name> -n ecommerce
```

The most important sections to inspect include:

* Events
* Container state
* Restart count
* Readiness status
* Liveness status
* Resource information
* Image information

The Events section is particularly useful for identifying scheduling, image and volume-related problems.

---

## 4. Pod Logs

Application logs are one of the first places to investigate when a container starts but the application is not working correctly.

Use:

```bash
kubectl logs <pod-name> -n ecommerce
```

For a specific container:

```bash
kubectl logs <pod-name> \
  -c <container-name> \
  -n ecommerce
```

For a previously terminated container:

```bash
kubectl logs <pod-name> \
  --previous \
  -n ecommerce
```

Logs can reveal:

* Application startup errors
* Database connection failures
* Redis connection failures
* Configuration problems
* Runtime exceptions

---

## 5. Pod Events

Kubernetes events provide information about what the cluster is doing with a resource.

Check recent events using:

```bash
kubectl get events \
  -n ecommerce \
  --sort-by=.lastTimestamp
```

Events can reveal problems such as:

* Failed scheduling
* Image pull failures
* Failed mounts
* Probe failures
* Container restarts
* Resource constraints

---

## 6. CrashLoopBackOff

`CrashLoopBackOff` means a container is repeatedly starting and then failing.

A typical investigation is:

```text id="4b5w8n"
CrashLoopBackOff
      ↓
kubectl describe pod
      ↓
Check events
      ↓
kubectl logs
      ↓
Identify application/configuration error
      ↓
Fix configuration or application issue
      ↓
Pod restarts successfully
```

Useful commands:

```bash
kubectl get pods -n ecommerce
```

```bash
kubectl logs <pod-name> -n ecommerce
```

```bash
kubectl logs <pod-name> --previous -n ecommerce
```

```bash
kubectl describe pod <pod-name> -n ecommerce
```

---

## 7. ImagePullBackOff

If a Pod cannot download its container image, inspect the Pod:

```bash
kubectl describe pod <pod-name> -n ecommerce
```

Look at the Events section for image-related errors.

Common causes include:

* Incorrect image name
* Incorrect image tag
* Image unavailable
* Registry authentication problem
* Network access problem

The solution is to correct the image configuration or registry access rather than repeatedly restarting the Pod.

---

## 8. Readiness Probe Failure

If a Pod is running but not receiving traffic, check its readiness status:

```bash
kubectl get pods -n ecommerce
```

Then inspect the Pod:

```bash
kubectl describe pod <pod-name> -n ecommerce
```

A readiness failure means the application is not considered ready to receive normal Service traffic.

The investigation should include:

* Health endpoint
* Application logs
* Port configuration
* Environment variables
* Required dependencies

---

## 9. Liveness Probe Failure

A liveness failure can cause Kubernetes to restart the affected container.

Inspect the Pod:

```bash
kubectl describe pod <pod-name> -n ecommerce
```

Check the container logs:

```bash
kubectl logs <pod-name> -n ecommerce
```

Possible causes include:

* Application deadlock
* Application startup problem
* Incorrect probe path
* Incorrect port
* Application dependency problem

Probe configuration should be checked before changing or disabling the probe.

---

## 10. Service Not Reachable

If an application cannot communicate with another service, first inspect the Services:

```bash
kubectl get svc -n ecommerce
```

Then inspect the specific Service:

```bash
kubectl describe svc <service-name> -n ecommerce
```

Check the endpoints:

```bash
kubectl get endpoints -n ecommerce
```

The Service selector should match the labels on the intended Pods.

Conceptually:

```text id="w7s3ce"
Service selector
      |
      ▼
Pod labels
      |
      ▼
Ready endpoints
```

If there are no endpoints, the problem may be caused by incorrect selectors or Pods that are not ready.

---

## 11. Kubernetes DNS Problems

ShopNest services communicate internally using Kubernetes Service names.

If DNS-based communication fails, check the Service first:

```bash
kubectl get svc -n ecommerce
```

Then verify that the target Service exists and has ready endpoints.

Typical internal service names include:

```text id="m1c7dv"
postgres
redis
products-service
frontend
```

Applications should use Service names rather than individual Pod IP addresses.

---

## 12. PostgreSQL Connection Problems

If the Products API cannot connect to PostgreSQL, investigate in this order:

```text id="f7m8k2"
Products API
      ↓
Environment configuration
      ↓
PostgreSQL Service
      ↓
PostgreSQL Pod
      ↓
PersistentVolumeClaim
```

Check PostgreSQL:

```bash
kubectl get pods -n ecommerce
```

Check the Service:

```bash
kubectl get svc postgres -n ecommerce
```

Check the PVC:

```bash
kubectl get pvc -n ecommerce
```

Check PostgreSQL logs:

```bash
kubectl logs postgres-0 -n ecommerce
```

Also verify that the database host, port and credentials match the application's configuration.

---

## 13. Redis Connection Problems

If the Products API cannot connect to Redis, check:

```bash
kubectl get pods -n ecommerce
```

Then:

```bash
kubectl get svc redis -n ecommerce
```

Check Redis logs:

```bash
kubectl logs <redis-pod-name> -n ecommerce
```

Also verify that the Products API is configured to use the Redis Service name and correct port.

---

## 14. PersistentVolumeClaim Problems

If PostgreSQL cannot start because of storage issues, inspect the PVC:

```bash
kubectl get pvc -n ecommerce
```

A healthy PVC should normally show:

```text
STATUS: Bound
```

For more information:

```bash
kubectl describe pvc <pvc-name> -n ecommerce
```

Possible storage problems include:

* PVC remains Pending
* Storage class problem
* Volume mount failure
* Insufficient storage
* Access mode incompatibility

---

## 15. Resource Problems

If a Pod remains Pending, check:

```bash
kubectl describe pod <pod-name> -n ecommerce
```

Resource-related scheduling problems may appear in the Events section.

Check resource configuration:

```bash
kubectl describe deployment <deployment-name> -n ecommerce
```

Resource requests and limits should be reviewed when investigating CPU or memory-related issues.

---

## 16. HPA Troubleshooting

Check the HPA:

```bash
kubectl get hpa -n ecommerce
```

For detailed information:

```bash
kubectl describe hpa products-hpa -n ecommerce
```

Also check the Products API resource configuration:

```bash
kubectl describe deployment products -n ecommerce
```

Important things to verify include:

* Minimum replicas
* Maximum replicas
* CPU target
* Current CPU utilization
* Resource requests
* Desired replica count

The HPA should not be expected to scale beyond its configured maximum.

---

## 17. Frontend Troubleshooting

If the frontend is not accessible, check:

```bash
kubectl get pods -n ecommerce
```

Then:

```bash
kubectl get svc frontend -n ecommerce
```

Check the frontend Pod logs:

```bash
kubectl logs <frontend-pod-name> -n ecommerce
```

Because the frontend is served through Nginx, Nginx configuration should also be considered when troubleshooting API proxying.

---

## 18. API Troubleshooting

If the frontend loads but product data is unavailable, separate the problem into two layers:

```text id="h7a2r1"
Frontend
   |
   ▼
Nginx/API request
   |
   ▼
Products Service
   |
   ▼
Products API
   |
   ├── PostgreSQL
   └── Redis
```

Check the Products API first:

```bash
kubectl get pods -n ecommerce
```

Then inspect logs:

```bash
kubectl logs <products-pod-name> -n ecommerce
```

Then check the Service:

```bash
kubectl get svc products-service -n ecommerce
```

This helps determine whether the problem is in the frontend, networking or backend application.

---

## 19. Monitoring Troubleshooting

Check monitoring Pods:

```bash
kubectl get pods -n monitoring
```

Check Prometheus:

```bash
kubectl get pods -n monitoring | grep prometheus
```

Check Grafana:

```bash
kubectl get pods -n monitoring | grep grafana
```

Check the ServiceMonitor:

```bash
kubectl get servicemonitor -n monitoring
```

The Products API metrics endpoint can also be checked from inside the application Pod:

```bash
kubectl exec -n ecommerce <products-pod-name> -- \
  wget -qO- http://localhost:3001/metrics
```

This confirms whether the application is exposing Prometheus-compatible metrics.

---

## 20. Helm Troubleshooting

If a Helm deployment fails, first validate the chart:

```bash
helm lint helm/shopnest
```

Render the templates:

```bash
helm template shopnest helm/shopnest
```

Check the release:

```bash
helm status shopnest -n ecommerce
```

Check release history:

```bash
helm history shopnest -n ecommerce
```

If necessary, inspect the generated Kubernetes resources and compare them with the intended configuration.

---

## 21. Recommended Troubleshooting Order

A useful general troubleshooting sequence is:

```text id="r8n2kp"
1. Check Pod status
        ↓
2. Check Pod events
        ↓
3. Check application logs
        ↓
4. Check readiness/liveness probes
        ↓
5. Check Services and endpoints
        ↓
6. Check ConfigMap/Secret
        ↓
7. Check storage
        ↓
8. Check resources/HPA
        ↓
9. Check application dependencies
        ↓
10. Apply the smallest required fix
```

This approach reduces unnecessary changes and helps isolate the actual failure.

---

## 22. Important Troubleshooting Principle

Do not immediately delete and recreate everything when something fails.

For example:

```text id="h8s4n0"
Problem
  ↓
Observe
  ↓
Collect evidence
  ↓
Identify root cause
  ↓
Apply targeted fix
  ↓
Verify
```

This is more reliable than repeatedly restarting resources without understanding the failure.

---

## 23. Summary

ShopNest troubleshooting follows Kubernetes-native diagnostic practices.

The most important tools are:

* `kubectl get`
* `kubectl describe`
* `kubectl logs`
* `kubectl get events`
* `kubectl get svc`
* `kubectl get endpoints`
* `kubectl get pvc`
* `kubectl get hpa`
* `helm lint`
* `helm template`
* `helm status`

The general troubleshooting strategy is to start with observable evidence, identify the failing layer, make the smallest appropriate change, and then verify the result.

This approach is useful both for day-to-day Kubernetes operations and for explaining incident investigation during DevOps interviews.
