# ShopNest Kubernetes Architecture

## Overview

ShopNest runs its application workloads inside a dedicated Kubernetes namespace.

The Kubernetes architecture separates stateless application workloads from stateful database storage and provides service discovery, health management, persistent storage, autoscaling, and self-healing.

---

## Namespace

The application resources are deployed in the:

```text
ecommerce
```

namespace.

Using a dedicated namespace keeps the application's Kubernetes resources logically separated from other cluster resources.

---

## Workload Architecture

The main application workloads are:

| Component    | Resource    | Purpose                   |
| ------------ | ----------- | ------------------------- |
| Frontend     | Deployment  | Runs React/Nginx frontend |
| Products API | Deployment  | Runs Node.js/Express API  |
| PostgreSQL   | StatefulSet | Runs persistent database  |
| Redis        | Deployment  | Provides caching          |

The distinction between Deployment and StatefulSet is intentional.

### Deployment

Deployments are used for stateless workloads such as:

* Frontend
* Products API
* Redis

These workloads can be replaced by new pods without requiring stable pod identities.

### StatefulSet

PostgreSQL uses a StatefulSet because the database is stateful and requires persistent storage.

The StatefulSet provides stable workload identity and works together with persistent storage.

---

## Kubernetes Resource Flow

```text
Namespace: ecommerce
        │
        ├── Frontend Deployment
        │       │
        │       └── Frontend Service
        │
        ├── Products Deployment
        │       │
        │       └── Products Service
        │
        ├── PostgreSQL StatefulSet
        │       │
        │       ├── PostgreSQL Service
        │       └── PersistentVolumeClaim
        │
        ├── Redis Deployment
        │       │
        │       └── Redis Service
        │
        ├── ConfigMap
        │
        ├── Secret
        │
        └── Products HPA
```

---

# Services and Networking

Kubernetes Services provide stable endpoints for application workloads.

The project uses:

| Service          | Type      | Port | Purpose                  |
| ---------------- | --------- | ---: | ------------------------ |
| frontend         | NodePort  |   80 | External/local access    |
| products-service | ClusterIP | 3001 | Internal API access      |
| postgres         | ClusterIP | 5432 | Internal database access |
| redis            | ClusterIP | 6379 | Internal Redis access    |

### ClusterIP

The Products API, PostgreSQL, and Redis use ClusterIP Services because they are primarily accessed from inside the Kubernetes cluster.

### NodePort

The frontend uses NodePort to provide a way to expose the application outside the Kubernetes cluster in the local development environment.

---

# Kubernetes DNS

Pods should not communicate using individual pod IP addresses because pod IPs can change.

Instead, the application communicates through Kubernetes Services.

For example:

```text
products-service
postgres
redis
```

These Service names can be resolved using Kubernetes DNS.

The resulting communication model is:

```text
Products API
    │
    ├──→ postgres:5432
    │
    └──→ redis:6379
```

This provides stable service discovery even when individual pods are recreated.

---

# ConfigMap

The Kubernetes ConfigMap stores non-sensitive application configuration.

This separates configuration from the container image.

Conceptually:

```text
Container Image
      +
ConfigMap
      │
      ▼
Configured Application
```

Changing non-sensitive configuration therefore does not require rebuilding the application image.

---

# Secret

Sensitive configuration is represented using a Kubernetes Secret.

The project uses a Secret for the database password.

The repository intentionally contains a placeholder:

```text
CHANGE_ME
```

rather than a real credential.

Actual local credentials are kept outside the committed source tree.

---

# Persistent Storage

PostgreSQL uses persistent storage through a PersistentVolumeClaim.

```text
PostgreSQL Pod
      │
      ▼
StatefulSet
      │
      ▼
PersistentVolumeClaim
      │
      ▼
Persistent Volume / Storage
```

The purpose is to separate database data from the temporary lifecycle of a PostgreSQL pod.

If the PostgreSQL pod is recreated, the database workload can continue using its persistent storage.

---

# Health Probes

The application uses Kubernetes health probes.

## Readiness Probe

The readiness probe determines whether a pod is ready to receive traffic.

If readiness fails:

```text
Pod
 │
 ├── Still running
 │
 └── Removed from Service endpoints
```

This prevents traffic from being sent to an application instance that is not ready.

## Liveness Probe

The liveness probe determines whether the application is still functioning.

If the liveness check repeatedly fails:

```text
Unhealthy Container
        │
        ▼
Kubernetes
        │
        ▼
Container Restart
```

---

# Resource Requests and Limits

Application containers define CPU and memory resource requirements.

### Requests

Requests tell Kubernetes the minimum resources required by a container for scheduling purposes.

### Limits

Limits define the maximum amount of a resource a container can consume.

Conceptually:

```text
Container
   │
   ├── CPU Request
   ├── CPU Limit
   ├── Memory Request
   └── Memory Limit
```

These resource definitions also provide the CPU utilization information required by the Horizontal Pod Autoscaler.

---

# Horizontal Pod Autoscaler

The Products API has an HPA configured with:

```text
Minimum replicas: 1
Maximum replicas: 5
Target CPU:       50%
```

The HPA monitors CPU utilization and adjusts the number of Products API replicas when required.

```text
                    HPA
                     │
                     ▼
             Products Deployment
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        Pod 1      Pod 2      Pod 3
```

The number of replicas can increase or decrease according to the observed resource utilization.

---

# Self-Healing

Kubernetes continuously attempts to maintain the desired state defined by workload controllers.

For example, if a Products API Deployment requires one replica:

```text
Desired:
1 Products Pod

Actual:
1 Products Pod
```

If the pod fails:

```text
Desired:
1

Actual:
0
```

The Deployment controller detects the difference and creates a replacement.

```text
Pod Failure
     │
     ▼
Deployment Controller
     │
     ▼
Replacement Pod
     │
     ▼
Desired State Restored
```

This is one of the key operational capabilities demonstrated by the project.

---

# Labels and Selectors

Kubernetes labels identify resources and selectors connect related resources.

For example, a Service can select Products API pods using labels such as:

```text
app: products
```

Conceptually:

```text
Products Pods
   │
   ├── app=products
   ├── app=products
   └── app=products
          │
          ▼
   Products Service
```

This allows a Service to route traffic to the appropriate set of pods.

The same label/selector mechanism is also used by the Products ServiceMonitor.

---

# Monitoring Integration

The Products API exposes:

```text
/metrics
```

A Kubernetes ServiceMonitor identifies the Products Service as a monitoring target.

```text
Products Pods
     │
     ▼
Products Service
     │
     ▼
ServiceMonitor
     │
     ▼
Prometheus
```

The ServiceMonitor is configured to scrape the metrics endpoint at a 15-second interval.

---

# Helm Integration

The same Kubernetes architecture is packaged into:

```text
helm/shopnest
```

Helm templates represent resources such as:

* Deployments
* StatefulSet
* Services
* ConfigMap
* Secret
* HPA
* ServiceMonitor

Configuration is centralized in:

```text
helm/shopnest/values.yaml
```

This allows deployment values to be changed without manually editing every Kubernetes manifest.

---

# Kubernetes Deployment Lifecycle

The application's Kubernetes lifecycle can be represented as:

```text
Container Images
       │
       ▼
Kubernetes Namespace
       │
       ▼
Deployments / StatefulSet
       │
       ▼
Services
       │
       ├── Service Discovery
       │
       └── Internal Networking
       │
       ▼
Health Probes
       │
       ▼
Resource Management
       │
       ▼
HPA
       │
       ▼
Self-Healing
       │
       ▼
Monitoring
```

---

# Verification Commands

Useful commands for inspecting the application:

### Namespace

```bash
kubectl get all -n ecommerce
```

### Pods

```bash
kubectl get pods -n ecommerce
```

### Services

```bash
kubectl get svc -n ecommerce
```

### Deployments

```bash
kubectl get deployments -n ecommerce
```

### StatefulSet

```bash
kubectl get statefulset -n ecommerce
```

### PersistentVolumeClaims

```bash
kubectl get pvc -n ecommerce
```

### HPA

```bash
kubectl get hpa -n ecommerce
```

### ConfigMap and Secret

```bash
kubectl get configmap,secret -n ecommerce
```

### ServiceMonitor

```bash
kubectl get servicemonitor -A
```

---

# Architecture Summary

The Kubernetes implementation demonstrates how different Kubernetes resources work together:

```text
Namespace
   │
   ├── Deployment ─────── Frontend
   │
   ├── Deployment ─────── Products API
   │
   ├── StatefulSet ────── PostgreSQL
   │         │
   │         └─────────── PVC
   │
   ├── Deployment ─────── Redis
   │
   ├── Services ───────── Networking
   │
   ├── ConfigMap ──────── Configuration
   │
   ├── Secret ─────────── Sensitive Configuration
   │
   ├── Probes ─────────── Health Management
   │
   └── HPA ────────────── Autoscaling
```

This architecture provides the foundation for running the ShopNest application as a cloud-native workload while demonstrating practical Kubernetes concepts used in DevOps engineering.
