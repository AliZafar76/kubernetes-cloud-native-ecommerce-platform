# ShopNest System Architecture

## Overview

ShopNest is a cloud-native e-commerce platform designed to demonstrate practical application deployment and operations using Docker, Kubernetes, Helm, Prometheus, and Grafana.

The architecture separates the frontend, application API, database, caching layer, and monitoring components so that each part can be deployed and managed independently.

---

## High-Level Architecture

```text
                         ┌──────────────────────┐
                         │        User          │
                         │      Browser         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │      + Nginx          │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP
                                    ▼
                         ┌──────────────────────┐
                         │    Products API      │
                         │   Node.js/Express    │
                         └───────┬────────┬─────┘
                                 │        │
                      ┌──────────┘        └──────────┐
                      ▼                              ▼
             ┌─────────────────┐            ┌─────────────────┐
             │   PostgreSQL    │            │      Redis      │
             │   StatefulSet   │            │    Deployment   │
             │      + PVC      │            │                 │
             └─────────────────┘            └─────────────────┘


                         Monitoring Flow
                                 │
                                 ▼
                       Products API /metrics
                                 │
                                 ▼
                         ServiceMonitor
                                 │
                                 ▼
                          Prometheus
                                 │
                                 ▼
                            Grafana
```

---

## Application Components

### Frontend

The frontend is built with React and Vite.

The application is packaged into a container and served through Nginx.

Responsibilities include:

* Rendering the e-commerce user interface
* Communicating with backend APIs
* Serving static frontend assets
* Providing the user-facing application

In Kubernetes, the frontend runs as a Deployment.

---

### Products API

The Products API is a Node.js/Express service.

Responsibilities include:

* Handling product-related API requests
* Communicating with PostgreSQL
* Using Redis as a caching layer
* Exposing health endpoints
* Exposing Prometheus-compatible metrics

The service runs as a Kubernetes Deployment.

---

### PostgreSQL

PostgreSQL provides persistent relational database storage.

Unlike the stateless application components, PostgreSQL is deployed using a Kubernetes StatefulSet.

The database uses a PersistentVolumeClaim so that application data is not directly tied to the lifecycle of the PostgreSQL pod.

```text
PostgreSQL StatefulSet
        │
        ▼
PersistentVolumeClaim
        │
        ▼
Persistent Storage
```

---

### Redis

Redis is used as the application's caching layer.

It runs separately from the Products API and PostgreSQL.

The Products API communicates with Redis through the Kubernetes Redis Service rather than directly using a pod IP.

---

## Kubernetes Networking

Kubernetes Services provide stable network endpoints for the application components.

```text
Frontend Service
       │
       ▼
Frontend Pods

Products Service
       │
       ▼
Products API Pods

PostgreSQL Service
       │
       ▼
PostgreSQL Pod

Redis Service
       │
       ▼
Redis Pod
```

The application uses Kubernetes DNS and Service discovery instead of relying on changing pod IP addresses.

---

## Configuration

Application configuration is separated from application container images.

### ConfigMap

The Kubernetes ConfigMap contains non-sensitive configuration values.

### Secret

Sensitive configuration, such as the database password, is represented using a Kubernetes Secret.

The repository contains placeholder values rather than real credentials.

---

## Reliability

Several Kubernetes features are used to improve application reliability.

### Readiness Probes

Readiness probes determine whether a pod should receive application traffic.

If a pod is not ready, Kubernetes can remove it from the corresponding Service endpoints.

### Liveness Probes

Liveness probes determine whether a container is still functioning correctly.

When a liveness check repeatedly fails, Kubernetes can restart the affected container.

### Resource Management

CPU and memory requests and limits are configured for application workloads.

This provides Kubernetes with resource information needed for scheduling and autoscaling.

---

## Self-Healing

Kubernetes controllers continuously work toward the desired state defined by the application's manifests.

For example, if a Deployment requires one running Products API replica and that pod becomes unavailable, Kubernetes can create a replacement pod.

```text
Desired Replicas: 1
        │
        ▼
Products API Pod
        │
        │ Failure
        ▼
Pod Unavailable
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

---

## Autoscaling

The Products API is configured with a Horizontal Pod Autoscaler.

Current configuration:

* Minimum replicas: `1`
* Maximum replicas: `5`
* CPU utilization target: `50%`

The HPA can increase or decrease the number of Products API replicas based on CPU utilization.

```text
                    HPA
                     │
             CPU utilization
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
       Increase              Decrease
       replicas              replicas
```

---

## Observability Architecture

The Products API exposes a Prometheus-compatible `/metrics` endpoint.

The Node.js application uses `prom-client` to expose application and process metrics.

The monitoring pipeline is:

```text
Products API
     │
     │ /metrics
     ▼
Products Service
     │
     ▼
ServiceMonitor
     │
     │ scrape every 15s
     ▼
Prometheus
     │
     ▼
Grafana
```

This allows operational metrics to be collected and visualized without modifying the application workflow itself.

---

## Helm Architecture

Helm packages the Kubernetes deployment into a reusable chart.

```text
helm/shopnest/
│
├── Chart.yaml
├── values.yaml
└── templates/
      ├── Deployments
      ├── Services
      ├── ConfigMap
      ├── Secret
      ├── HPA
      └── ServiceMonitor
```

The `values.yaml` file provides configurable deployment values while the templates generate Kubernetes resources.

This makes the deployment more repeatable and easier to configure than maintaining completely independent static manifests.

---

## Deployment Flow

The overall deployment workflow is:

```text
Application Source
       │
       ▼
Docker Images
       │
       ▼
Kubernetes Resources
       │
       ▼
Services + Storage
       │
       ▼
Health Checks
       │
       ▼
Self-Healing / HPA
       │
       ▼
Prometheus Monitoring
       │
       ▼
Grafana Visualization
```

Helm can then package and deploy the Kubernetes resources as a reusable application chart.

---

## Design Principles

The architecture follows several cloud-native principles:

1. **Stateless application workloads** are managed using Deployments.
2. **Persistent database workloads** use StatefulSet and persistent storage.
3. **Services** provide stable networking and service discovery.
4. **Configuration** is separated from application images.
5. **Health probes** allow Kubernetes to distinguish healthy, unhealthy, and unready workloads.
6. **Resource definitions** support scheduling and autoscaling.
7. **Prometheus metrics** provide operational visibility.
8. **Helm** provides repeatable and parameterized Kubernetes deployments.

---

## Architecture Summary

The resulting platform combines application development with practical DevOps operations:

```text
React + Nginx
      │
      ▼
Node.js / Express
   │          │
   ▼          ▼
PostgreSQL   Redis
   │
   ▼
Persistent Storage

        Kubernetes
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
 Services  Probes    HPA
             │
             ▼
        Self-Healing
             │
             ▼
       ServiceMonitor
             │
             ▼
        Prometheus
             │
             ▼
          Grafana

             +
           Helm
```

This architecture provides a practical local implementation of cloud-native application deployment, reliability, scaling, and observability.
