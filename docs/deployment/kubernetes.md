# Kubernetes Deployment

## 1. Overview

ShopNest is deployed on a local Kubernetes cluster using Kind.

The Kubernetes deployment provides the orchestration layer for the application and demonstrates:

* Container orchestration
* Service discovery
* Persistent storage
* Health checks
* Resource management
* Self-healing
* Horizontal Pod Autoscaling
* Configuration management
* Secret management
* Monitoring integration

The Kubernetes manifests are stored in:

```text
k8s/
```

The application workloads run in the:

```text
ecommerce
```

namespace.

---

## 2. Kubernetes Architecture

The main Kubernetes workloads are:

```text
                    Kubernetes Cluster
                           |
                      ecommerce
                       Namespace
                           |
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      Frontend         Products API       Redis
      Deployment       Deployment        Deployment
          │                │
          │                ▼
          │           PostgreSQL
          │            StatefulSet
          │                │
          │                ▼
          │               PVC
          │
          ▼
       Frontend
       Service
      NodePort
```

The Products API communicates internally with PostgreSQL and Redis through Kubernetes Services.

---

## 3. Kubernetes Namespace

ShopNest application resources are isolated in the:

```text
ecommerce
```

namespace.

This keeps application resources separate from monitoring infrastructure.

The monitoring stack runs in the:

```text
monitoring
```

namespace.

---

## 4. Frontend Deployment

The frontend is managed using a Kubernetes Deployment.

The Deployment provides:

* Pod management
* Replica management
* Rolling updates
* Self-healing

The frontend application is served through Nginx.

The frontend is exposed using a Kubernetes NodePort Service.

Current application service configuration:

```text
Frontend Service
Port: 80
NodePort: 30080
```

---

## 5. Products API Deployment

The Products API runs as a Kubernetes Deployment.

The application is built with Node.js and Express.

The Products API provides:

* Product API endpoints
* PostgreSQL connectivity
* Redis connectivity
* Health endpoint
* Prometheus metrics endpoint

The application listens on:

```text
3001
```

The Products API is exposed internally through a ClusterIP Service.

---

## 6. PostgreSQL StatefulSet

PostgreSQL is deployed using a StatefulSet because it is a stateful workload.

The StatefulSet provides stable workload identity and works with persistent storage.

PostgreSQL uses:

```text
postgres:16-alpine
```

The database is connected to a PersistentVolumeClaim so that database data is not tied to the lifecycle of an individual container.

This follows the Kubernetes design principle of using:

* Deployments for stateless application workloads
* StatefulSets for stateful workloads such as databases

---

## 7. Redis Deployment

Redis runs as a Kubernetes Deployment.

It is used as an in-memory data service for the Products API.

The Redis Service provides stable internal connectivity for the application.

Redis is exposed internally on:

```text
6379
```

---

## 8. Kubernetes Services

Kubernetes Services provide stable networking for the application components.

The main services are:

| Service          | Type      | Port | Purpose         |
| ---------------- | --------- | ---: | --------------- |
| frontend         | NodePort  |   80 | Frontend access |
| products-service | ClusterIP | 3001 | Products API    |
| postgres         | ClusterIP | 5432 | Database access |
| redis            | ClusterIP | 6379 | Redis access    |

The frontend is externally accessible through NodePort, while backend services remain internal to the Kubernetes cluster.

---

## 9. Kubernetes DNS

Kubernetes Services provide DNS-based service discovery.

Applications communicate with services using Kubernetes DNS names instead of hard-coded Pod IP addresses.

For example, the Products API can communicate with:

```text
postgres
```

and:

```text
redis
```

using their Kubernetes Service names.

This allows Pods to be recreated without requiring application configuration changes for Pod IP addresses.

---

## 10. ConfigMap

Non-sensitive application configuration is stored using a Kubernetes ConfigMap.

The ConfigMap allows configuration values to be separated from container images.

This makes configuration easier to manage between different deployment environments.

Sensitive values are not stored in the ConfigMap.

---

## 11. Secret

Sensitive configuration is stored using a Kubernetes Secret.

The project uses a Secret for the PostgreSQL database password.

The repository contains only a safe placeholder value:

```text
CHANGE_ME
```

Real local credentials are not committed to Git.

This prevents sensitive credentials from being included in the public repository.

---

## 12. Persistent Storage

PostgreSQL uses a PersistentVolumeClaim.

The PVC provides persistent storage for database data.

The storage configuration uses:

```text
Storage: 1Gi
Access Mode: RWO
```

The database workload therefore has storage that is independent of the lifecycle of its Pod.

---

## 13. Health Checks

The Kubernetes deployment uses health probes to improve application reliability.

### Liveness Probe

The liveness probe determines whether the application container is still functioning.

If the container becomes unhealthy according to the liveness configuration, Kubernetes can restart it.

### Readiness Probe

The readiness probe determines whether the application is ready to receive traffic.

If a Pod fails its readiness check, Kubernetes removes it from the Service endpoints until it becomes ready again.

This prevents traffic from being sent to an unhealthy or unready application instance.

---

## 14. Resource Requests and Limits

The application workloads define Kubernetes resource requests and limits.

Requests provide Kubernetes with the expected minimum resources required by a container.

Limits define the maximum amount of configured CPU or memory resources available to the container.

Resource configuration also provides the metrics required for CPU-based Horizontal Pod Autoscaling.

---

## 15. Horizontal Pod Autoscaler

The Products API uses a Horizontal Pod Autoscaler.

The HPA configuration is:

```text
Minimum replicas: 1
Maximum replicas: 5
Target CPU utilization: 50%
```

The HPA automatically adjusts the number of Products API Pods based on CPU utilization.

Conceptually:

```text
Low CPU usage
      |
      ▼
Fewer replicas
      |
      ▼
Higher traffic / CPU usage
      |
      ▼
More replicas
      |
      ▼
Maximum 5 replicas
```

This demonstrates Kubernetes-based horizontal scaling.

---

## 16. Self-Healing

Kubernetes controllers continuously maintain the desired state of the application.

For example, if a Pod managed by a Deployment fails, Kubernetes creates a replacement Pod to maintain the desired replica count.

This provides self-healing behavior without manually recreating failed Pods.

Combined with readiness and liveness probes, the application can recover from common container and Pod failures.

---

## 17. Labels and Selectors

Kubernetes labels are used to identify application resources.

Services use selectors to discover the appropriate Pods.

For example, the Products Service selects Pods using the Products application label.

This creates a loose connection between:

```text
Service
   |
   ▼
Pod labels
```

Instead of directly referencing individual Pod names or IP addresses.

---

## 18. Monitoring Integration

The Kubernetes deployment integrates with the project's monitoring architecture.

The Products API exposes:

```text
/metrics
```

Prometheus collects these metrics through a Kubernetes `ServiceMonitor`.

The ServiceMonitor is configured to:

* Select the Products Service
* Target the `ecommerce` namespace
* Scrape the `/metrics` endpoint
* Scrape metrics every 15 seconds

Monitoring infrastructure runs separately in the `monitoring` namespace.

---

## 19. Kubernetes Deployment Flow

The deployment process can be summarized as:

```text
Container Images
       |
       ▼
Kubernetes Manifests
       |
       ▼
Namespace
       |
       ▼
Deployments / StatefulSet
       |
       ▼
Services
       |
       ▼
ConfigMap + Secret
       |
       ▼
Persistent Storage
       |
       ▼
Health Checks
       |
       ▼
HPA
       |
       ▼
Monitoring
```

This creates the complete Kubernetes runtime environment for ShopNest.

---

## 20. Deployment Commands

Create the application namespace:

```bash
kubectl create namespace ecommerce
```

Apply the Kubernetes manifests:

```bash
kubectl apply -f k8s/
```

Check application Pods:

```bash
kubectl get pods -n ecommerce
```

Check Services:

```bash
kubectl get svc -n ecommerce
```

Check Deployments:

```bash
kubectl get deployments -n ecommerce
```

Check StatefulSet:

```bash
kubectl get statefulset -n ecommerce
```

Check PersistentVolumeClaims:

```bash
kubectl get pvc -n ecommerce
```

Check HPA:

```bash
kubectl get hpa -n ecommerce
```

---

## 21. Deployment Verification

The Kubernetes deployment was verified during project development.

The application workloads reached the Running state, including:

* Frontend
* Products API
* PostgreSQL
* Redis

The PostgreSQL PersistentVolumeClaim reached the Bound state.

The Products API returned successful responses through its Kubernetes Service.

The monitoring stack also successfully discovered healthy Prometheus targets.

---

## 22. Useful Troubleshooting Commands

Check Pod details:

```bash
kubectl describe pod <pod-name> -n ecommerce
```

Check Pod logs:

```bash
kubectl logs <pod-name> -n ecommerce
```

Check Service details:

```bash
kubectl describe svc <service-name> -n ecommerce
```

Check HPA details:

```bash
kubectl describe hpa <hpa-name> -n ecommerce
```

Check recent namespace events:

```bash
kubectl get events -n ecommerce --sort-by=.lastTimestamp
```

These commands are useful for diagnosing scheduling, networking, health-check and application issues.

---

## 23. Kubernetes Design Principles Used

The ShopNest Kubernetes deployment demonstrates several important Kubernetes principles:

### Declarative configuration

Resources are defined as YAML manifests describing the desired state.

### Stateless workloads

Frontend, Products API and Redis are managed using Deployments.

### Stateful workloads

PostgreSQL is managed using a StatefulSet and persistent storage.

### Service discovery

Kubernetes Services provide stable internal networking and DNS.

### Health-based traffic management

Readiness probes control whether Pods receive traffic.

### Self-healing

Kubernetes controllers recreate failed workload Pods.

### Autoscaling

HPA adjusts Products API replicas according to CPU utilization.

### Configuration separation

ConfigMap and Secret separate configuration from application images.

### Observability

Prometheus and Grafana provide monitoring and visualization.

---

## 24. Summary

Kubernetes provides the primary orchestration layer for ShopNest.

The application uses Deployments for stateless workloads, a StatefulSet with persistent storage for PostgreSQL, Services for networking, ConfigMap and Secret for configuration, probes for health management, resource requests and limits for resource control, and HPA for automatic scaling.

Prometheus and Grafana extend the deployment with monitoring and observability.

Together, these components demonstrate a production-oriented Kubernetes architecture while remaining suitable for local development and portfolio demonstration.
