# Interview Preparation

## 1. Project Introduction

### Q: Tell me about your project.

**Answer:**

ShopNest is a cloud-native e-commerce platform that I developed to demonstrate practical DevOps and Kubernetes concepts.

The application consists of a React frontend, a Node.js/Express Products API, PostgreSQL and Redis.

I first containerized the application using Docker and Docker Compose, then deployed it to Kubernetes using Deployments, a StatefulSet, Services, ConfigMaps, Secrets, PersistentVolumeClaims, health probes and Horizontal Pod Autoscaling.

For observability, I integrated Prometheus and Grafana, and I packaged the Kubernetes deployment using Helm.

The project focuses on containerization, orchestration, self-healing, autoscaling, persistent storage and monitoring.

---

# 2. Architecture Questions

## Q: What is the architecture of your project?

**Answer:**

The frontend is a React application served through Nginx.

The frontend communicates with the Products API, which is built using Node.js and Express.

The Products API communicates with PostgreSQL for persistent relational data and Redis for in-memory data operations.

In Kubernetes, the frontend, Products API and Redis use Deployments, while PostgreSQL uses a StatefulSet with persistent storage.

Kubernetes Services provide networking and service discovery.

Prometheus collects application and infrastructure metrics, while Grafana provides visualization.

---

## Q: Why did you use Kubernetes?

**Answer:**

I used Kubernetes because it provides container orchestration features that are difficult to manage manually.

In this project Kubernetes provides:

* Service discovery
* Self-healing
* Scaling
* Health checks
* Persistent storage management
* Resource management
* Declarative configuration
* Monitoring integration

It allowed me to demonstrate how a multi-container application can be managed using Kubernetes-native resources.

---

# 3. Docker Questions

## Q: Why did you use Docker?

**Answer:**

Docker packages an application together with its runtime dependencies into a consistent container image.

This makes the application easier to build, run and deploy across different environments.

In ShopNest, Docker is used to containerize the frontend and Products API, while PostgreSQL and Redis are also run as containers.

---

## Q: Why did you use Docker Compose?

**Answer:**

Docker Compose provides a convenient way to run multiple containers together during local development.

It allowed me to run the frontend, Products API, PostgreSQL and Redis as a connected application stack.

It also provided service networking, environment configuration, health checks and persistent database storage.

---

## Q: What is the difference between Docker Compose and Kubernetes in your project?

**Answer:**

Docker Compose is mainly used for the local multi-container environment.

Kubernetes provides a more advanced orchestration layer.

Kubernetes adds features such as:

* Self-healing
* Service discovery
* PersistentVolumeClaims
* Horizontal Pod Autoscaling
* Readiness and liveness probes
* Declarative workload management
* Kubernetes-native monitoring integration

---

# 4. Kubernetes Questions

## Q: Why did you use a Deployment for the frontend?

**Answer:**

The frontend is a stateless application, so a Deployment is appropriate.

The Deployment manages replicas, rolling updates and replacement of failed Pods.

The frontend does not require stable Pod identity or persistent Pod-specific storage.

---

## Q: Why did you use a Deployment for the Products API?

**Answer:**

The Products API is also stateless from the Kubernetes workload perspective.

Multiple identical API Pods can serve requests, so a Deployment is appropriate.

It also allows the API to be scaled horizontally and provides self-healing through the Deployment and ReplicaSet controllers.

---

## Q: Why did you use a StatefulSet for PostgreSQL?

**Answer:**

PostgreSQL is a stateful workload because it stores persistent application data.

A StatefulSet provides stable workload identity and works well with persistent storage.

The database also uses a PersistentVolumeClaim so the data is not tied to the lifecycle of an individual Pod.

---

## Q: What is the difference between Deployment and StatefulSet?

**Answer:**

A Deployment is generally used for stateless workloads where Pods are interchangeable.

A StatefulSet is designed for stateful workloads that may require stable identity and persistent storage.

In my project:

```text
Deployment → Frontend
Deployment → Products API
Deployment → Redis

StatefulSet → PostgreSQL
```

---

# 5. Kubernetes Networking

## Q: How do your services communicate inside Kubernetes?

**Answer:**

They communicate through Kubernetes Services.

For example, the Products API can communicate with PostgreSQL and Redis using their Kubernetes Service names instead of individual Pod IP addresses.

Kubernetes DNS resolves those Service names to stable Service endpoints.

---

## Q: Why don't you use Pod IP addresses?

**Answer:**

Pod IP addresses are not stable because Pods can be recreated.

If I used a Pod IP directly, the application could stop working after the Pod was replaced.

A Kubernetes Service provides a stable endpoint and automatically routes traffic to matching ready Pods.

---

## Q: What is the difference between ClusterIP and NodePort in your project?

**Answer:**

ClusterIP is used for internal cluster communication.

NodePort exposes a Service through a port on the Kubernetes nodes.

In my project:

```text
Frontend → NodePort
Products API → ClusterIP
PostgreSQL → ClusterIP
Redis → ClusterIP
```

The frontend is the user-facing component, while the backend services remain internal.

---

# 6. ConfigMap and Secret

## Q: Why did you use ConfigMap?

**Answer:**

ConfigMap separates non-sensitive configuration from the application image.

This allows configuration to be changed without rebuilding the container image.

---

## Q: Why did you use Secret?

**Answer:**

Secrets are intended for sensitive configuration such as database credentials.

In this project, the PostgreSQL password is managed through a Kubernetes Secret.

I also ensured that real local credentials were not committed to Git.

---

# 7. Persistent Storage

## Q: Why do you need a PVC for PostgreSQL?

**Answer:**

A Pod's filesystem is tied to the Pod lifecycle.

If the PostgreSQL Pod is recreated, data stored only inside the container filesystem could be lost.

A PersistentVolumeClaim provides persistent storage that can survive Pod recreation.

---

## Q: What happens if the PostgreSQL Pod is recreated?

**Answer:**

The PostgreSQL Pod can be recreated by Kubernetes, but its persistent storage remains associated through the PersistentVolumeClaim.

The important concept is that the database Pod lifecycle and persistent data lifecycle are separate.

---

# 8. Health Checks

## Q: What is a readiness probe?

**Answer:**

A readiness probe determines whether a Pod is ready to receive traffic.

If the readiness probe fails, Kubernetes removes the Pod from the Service's ready endpoints.

The container does not necessarily restart.

---

## Q: What is a liveness probe?

**Answer:**

A liveness probe determines whether the application is still functioning.

If the liveness check continuously fails according to the configured policy, Kubernetes can restart the container.

---

## Q: What's the difference between readiness and liveness?

**Answer:**

A simple way to remember it is:

```text
Readiness → Should I send traffic here?

Liveness → Is the application still alive?
```

Readiness mainly controls traffic.

Liveness mainly supports recovery.

---

# 9. Self-Healing

## Q: How does Kubernetes self-healing work in your project?

**Answer:**

The application workloads are managed by Kubernetes controllers.

For example, if a Pod managed by the Products API Deployment fails, its ReplicaSet creates a replacement Pod to maintain the desired replica count.

Readiness and liveness probes provide additional health-based behavior.

---

## Q: Does Kubernetes automatically fix application bugs?

**Answer:**

No.

Kubernetes can restart containers or recreate Pods when infrastructure-level failures occur, but it cannot automatically fix a logical application bug.

For example, if the application contains incorrect business logic, restarting the Pod will not fix that code.

---

# 10. Scaling and HPA

## Q: How does HPA work in your project?

**Answer:**

The Products API uses a Horizontal Pod Autoscaler.

The HPA monitors CPU utilization and adjusts the desired number of replicas.

The configured values are:

```text
Minimum replicas: 1
Maximum replicas: 5
CPU target: 50%
```

If CPU utilization increases, HPA can increase replicas.

If utilization decreases, HPA can reduce replicas while respecting the configured minimum.

---

## Q: Does HPA create Pods directly?

**Answer:**

No.

HPA changes the desired replica count of the target workload.

The Deployment and ReplicaSet controllers then create or remove Pods to reach that desired count.

The flow is:

```text
HPA
 ↓
Deployment replica count
 ↓
ReplicaSet
 ↓
Pods
```

---

## Q: Why are resource requests important for HPA?

**Answer:**

CPU utilization for a resource-based HPA is evaluated relative to the configured CPU request.

Therefore, resource requests provide an important reference point for CPU-based autoscaling.

---

# 11. Monitoring

## Q: How did you implement monitoring?

**Answer:**

I used Prometheus and Grafana.

The Products API exposes Prometheus-compatible metrics through `/metrics` using the `prom-client` package.

A Kubernetes ServiceMonitor tells Prometheus how to discover and scrape those metrics.

Grafana uses Prometheus as its datasource for visualization.

---

## Q: What is a ServiceMonitor?

**Answer:**

A ServiceMonitor is a Kubernetes monitoring resource used by the Prometheus Operator to define how a Service should be monitored.

In my project it selects the Products Service and tells Prometheus to scrape:

```text
/metrics
```

every 15 seconds.

---

## Q: Why do you need `/metrics`?

**Answer:**

Prometheus collects metrics from HTTP endpoints that expose Prometheus-compatible metric data.

The Products API exposes `/metrics`, allowing Prometheus to collect application and Node.js process metrics.

---

## Q: How did you verify monitoring?

**Answer:**

I verified the Products API `/metrics` endpoint directly from the running Pod.

I also verified the Prometheus monitoring stack and observed 15 healthy scrape targets during testing.

Grafana was successfully accessed through Kubernetes port-forwarding.

---

# 12. Helm

## Q: Why did you use Helm?

**Answer:**

Helm provides packaging and release management for Kubernetes applications.

Instead of maintaining every deployment configuration independently, I created a reusable Helm chart containing Kubernetes templates and configurable values.

This makes deployment configuration easier to manage and update.

---

## Q: Does Helm replace Kubernetes?

**Answer:**

No.

Helm does not replace Kubernetes.

Helm generates and manages Kubernetes resources.

The relationship is:

```text
Helm
 ↓
Kubernetes manifests
 ↓
Kubernetes API
 ↓
Kubernetes resources
```

---

## Q: What is `values.yaml`?

**Answer:**

`values.yaml` contains configurable values used by Helm templates.

For example, replica counts, resource settings, Service configuration and monitoring settings can be controlled through Helm values.

---

## Q: What is the purpose of `helm lint`?

**Answer:**

`helm lint` validates the Helm chart structure and checks for common chart problems.

I used it to validate the ShopNest chart before deployment.

---

## Q: How did you test your Helm chart?

**Answer:**

I deployed the chart into a separate `helm-test` namespace.

I installed a test release and then upgraded it with different configuration values.

This verified both Helm installation and upgrade behavior without disturbing the main application namespace.

---

# 13. Troubleshooting Questions

## Q: If a Pod is in CrashLoopBackOff, what would you do?

**Answer:**

I would not immediately delete the Pod.

First I would check:

```bash
kubectl get pods -n ecommerce
kubectl describe pod <pod-name> -n ecommerce
kubectl logs <pod-name> -n ecommerce
kubectl logs <pod-name> --previous -n ecommerce
```

I would inspect the events, container state and logs to identify the root cause.

Then I would apply the smallest appropriate fix and verify the result.

---

## Q: If the frontend is working but products are not loading, how would you troubleshoot?

**Answer:**

I would break the request path into layers:

```text
Frontend
 ↓
Nginx/API proxy
 ↓
Products Service
 ↓
Products API
 ↓
PostgreSQL / Redis
```

I would check the Products API first, then the Service and endpoints, followed by database and Redis connectivity.

This prevents me from changing unrelated components without evidence.

---

## Q: If a Pod is Running but users cannot access the application, what would you check?

**Answer:**

A Running Pod does not automatically mean the application is reachable.

I would check:

1. Readiness status
2. Service configuration
3. Service selectors
4. Service endpoints
5. Container port
6. Application logs
7. Network path

Useful commands include:

```bash
kubectl get pods -n ecommerce
kubectl get svc -n ecommerce
kubectl get endpoints -n ecommerce
kubectl describe svc <service-name> -n ecommerce
```

---

# 14. Security Questions

## Q: How did you protect credentials in Git?

**Answer:**

Real local credentials were kept outside the committed source.

Sensitive environment files are excluded through `.gitignore`.

Kubernetes and Helm configurations use safe placeholder values such as:

```text
CHANGE_ME
```

I also checked the staged repository to ensure that the real local database password was not committed.

---

## Q: Is Kubernetes Secret encrypted by default in Git?

**Answer:**

No.

A Kubernetes Secret is not a replacement for secure secret management.

In a real production environment, I would consider solutions such as external secret management or a dedicated secret-management system.

For this portfolio project, I ensured that real credentials were not committed to the repository.

---

# 15. Project Challenges

## Q: What was one challenge you faced during the project?

**Answer:**

One practical challenge was connecting the different layers of the application correctly as the project moved from Docker Compose to Kubernetes.

The application required correct coordination between:

* Services
* DNS
* PostgreSQL
* Redis
* ConfigMaps
* Secrets
* Persistent storage
* Health probes

I approached the problem layer by layer rather than changing everything at once.

---

## Q: What did you learn from this project?

**Answer:**

The project helped me understand that DevOps is not only about writing YAML files.

I learned how application architecture, containers, networking, storage, health checks, scaling, monitoring and deployment packaging work together.

The biggest learning was understanding the relationship between Kubernetes resources instead of studying each resource in isolation.

---

# 16. DevOps Interview Questions

## Q: What is the purpose of CI/CD?

**Answer:**

CI/CD automates the process of building, testing and delivering software.

Continuous Integration focuses on frequently integrating and validating code changes.

Continuous Delivery or Deployment focuses on automatically delivering validated changes to an environment.

CI/CD reduces manual deployment work and provides a repeatable software delivery process.

---

## Q: What is Infrastructure as Code?

**Answer:**

Infrastructure as Code means defining infrastructure and configuration in version-controlled files instead of creating everything manually.

Kubernetes YAML manifests and Helm charts are examples of declarative infrastructure configuration.

---

## Q: What is the difference between monitoring and observability?

**Answer:**

Monitoring focuses on collecting and tracking known system signals such as CPU, memory and application metrics.

Observability is broader. It focuses on understanding the internal state of a system from its external outputs, commonly through metrics, logs and traces.

This project primarily demonstrates metrics-based monitoring using Prometheus and Grafana.

---

# 17. Strong Project Summary

A concise interview summary is:

> I built a cloud-native e-commerce platform called ShopNest using React, Node.js, PostgreSQL and Redis. I containerized the application with Docker, deployed it to Kubernetes using Deployments and a StatefulSet, implemented Services, ConfigMaps, Secrets, persistent storage, health probes, self-healing and HPA-based autoscaling. I then added Prometheus and Grafana for observability and packaged the Kubernetes deployment with Helm. The project was built as a practical demonstration of Kubernetes and DevOps concepts and was verified locally using Kind.

---

# 18. Interview Answer Strategy

When answering project questions, use this structure:

```text
1. What did you implement?
        ↓
2. Why did you use it?
        ↓
3. How does it work?
        ↓
4. How did you verify it?
```

For example:

```text
I used an HPA
      ↓
because I wanted automatic horizontal scaling
      ↓
it monitors CPU utilization and changes desired replicas
      ↓
I verified its configuration using kubectl get hpa
```

This structure keeps answers practical instead of purely theoretical.

---

# 19. Final Interview Checklist

Before discussing the project in an interview, be comfortable explaining:

### Docker

* Images
* Containers
* Dockerfile
* Docker Compose
* Container networking
* Volumes

### Kubernetes

* Pod
* Deployment
* ReplicaSet
* StatefulSet
* Service
* ClusterIP
* NodePort
* DNS
* ConfigMap
* Secret
* PVC
* Readiness probe
* Liveness probe
* Resource requests/limits
* HPA
* Self-healing

### Monitoring

* Prometheus
* Grafana
* `/metrics`
* prom-client
* ServiceMonitor
* Scrape targets

### Helm

* Chart
* Chart.yaml
* values.yaml
* Templates
* `helm lint`
* `helm template`
* `helm install`
* `helm upgrade`
* Helm release

### Operations

* `kubectl get`
* `kubectl describe`
* `kubectl logs`
* Kubernetes events
* Service endpoints
* HPA troubleshooting
* Pod troubleshooting

---

# 20. Final Takeaway

The most important thing to communicate in an interview is not that the project contains many Kubernetes resources.

The important point is that each resource has a specific purpose:

```text
Deployment
→ Stateless workloads

StatefulSet
→ PostgreSQL

Service
→ Stable networking

ConfigMap
→ Non-sensitive configuration

Secret
→ Sensitive configuration

PVC
→ Persistent storage

Probes
→ Health and traffic control

HPA
→ Automatic scaling

Prometheus
→ Metrics collection

Grafana
→ Visualization

Helm
→ Kubernetes packaging and release management
```

Understanding these relationships demonstrates practical DevOps knowledge rather than memorization of Kubernetes commands.
