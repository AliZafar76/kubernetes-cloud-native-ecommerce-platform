# Docker Compose Deployment

## 1. Overview

ShopNest can be run locally using Docker Compose.

Docker Compose provides a simple way to run the main application components together:

* Frontend
* Products API
* PostgreSQL
* Redis

The Compose configuration is located at:

```text
docker/docker-compose.yml
```

The services communicate through a dedicated Docker network.

---

## 2. Docker Compose Architecture

The local Docker Compose architecture is:

```text
                  ┌─────────────────────┐
                  │      Frontend       │
                  │   React + Nginx     │
                  │       Port 80       │
                  └──────────┬──────────┘
                             │
                             │ /api
                             ▼
                  ┌─────────────────────┐
                  │   Products API      │
                  │   Node.js/Express   │
                  │      Port 3001      │
                  └───────┬───────┬─────┘
                          │       │
                   ┌──────▼──┐ ┌──▼─────┐
                   │Postgres │ │ Redis  │
                   │  :5432  │ │ :6379  │
                   └─────────┘ └────────┘
```

All services communicate through the Docker Compose network.

---

## 3. Services

### Frontend

The frontend is a React application served through Nginx.

Responsibilities include:

* Serving the ShopNest web application
* Handling frontend routes
* Proxying API requests through Nginx

The frontend container exposes port `80`.

---

### Products API

The Products API is a Node.js/Express service.

Responsibilities include:

* Product API endpoints
* PostgreSQL integration
* Redis integration
* Health checks
* Prometheus metrics

The API listens on port:

```text
3001
```

---

### PostgreSQL

PostgreSQL provides persistent relational data storage for the application.

The Compose deployment uses:

```text
postgres:16-alpine
```

PostgreSQL data is stored using a Docker volume so that container recreation does not remove the database files.

---

### Redis

Redis provides an in-memory data store used by the Products API.

The Compose deployment uses Redis as a separate service so the API can communicate with it through the Docker network.

---

## 4. Docker Network

The services communicate through the Docker Compose network.

Instead of using container IP addresses, services can communicate using their Compose service names.

For example, the Products API can connect to PostgreSQL using the PostgreSQL service name and the PostgreSQL container port.

This provides stable service-to-service communication within the Compose environment.

---

## 5. Environment Configuration

Environment-specific configuration is kept outside the application source code.

Local environment files are excluded from Git using `.gitignore`.

The project provides example environment configuration where required:

```text
services/products/.env.example
```

Sensitive values should be supplied through local environment configuration rather than committed to the repository.

---

## 6. PostgreSQL Persistence

PostgreSQL uses persistent storage through a Docker volume.

This means the database data is stored outside the lifecycle of the PostgreSQL container itself.

The main benefit is that restarting or recreating the container does not automatically remove the stored database data.

---

## 7. Health Checks

The Products API includes a readiness/health endpoint:

```text
/ready
```

Docker Compose uses health-check configuration to verify service health.

This helps identify whether the application service is ready to accept requests.

---

## 8. Starting the Application

From the project root:

```bash
docker compose -f docker/docker-compose.yml up -d
```

The `-d` option starts the containers in detached mode.

---

## 9. Checking Container Status

Use:

```bash
docker compose -f docker/docker-compose.yml ps
```

This displays the current state of the Compose services.

Healthy services should show an appropriate running/healthy state.

---

## 10. Viewing Logs

To view logs from all services:

```bash
docker compose -f docker/docker-compose.yml logs
```

To follow logs continuously:

```bash
docker compose -f docker/docker-compose.yml logs -f
```

Logs for an individual service can also be viewed:

```bash
docker compose -f docker/docker-compose.yml logs products-service
```

---

## 11. Testing the Products API

The Products API is exposed locally on port `3001`.

Example:

```bash
curl http://localhost:3001/api/products
```

A successful response confirms that the Products API is reachable.

The API also exposes metrics:

```bash
curl http://localhost:3001/metrics
```

---

## 12. Stopping the Application

To stop the running Compose services:

```bash
docker compose -f docker/docker-compose.yml down
```

This removes the running containers and network created by Compose.

Persistent Docker volumes should be removed separately and only when database data is intentionally being deleted.

---

## 13. Docker Compose Verification

The Docker Compose deployment was verified during project development.

The following components were successfully run together:

* PostgreSQL
* Redis
* Products API
* Frontend

The Products API returned successful responses, and the frontend was built and containerized successfully.

---

## 14. Docker Compose vs Kubernetes

Docker Compose is used for convenient local container orchestration.

Kubernetes provides the more advanced orchestration layer used by the main cloud-native deployment.

| Capability              | Docker Compose            | Kubernetes                  |
| ----------------------- | ------------------------- | --------------------------- |
| Container orchestration | Yes                       | Yes                         |
| Service networking      | Docker network            | Kubernetes Services + DNS   |
| Persistent storage      | Docker volume             | PV/PVC                      |
| Health checks           | Compose healthcheck       | Liveness/readiness probes   |
| Scaling                 | Manual Compose scaling    | Deployment + HPA            |
| Self-healing            | Limited                   | Kubernetes controllers      |
| Configuration           | Environment files         | ConfigMap                   |
| Secrets                 | Environment configuration | Kubernetes Secret           |
| Monitoring integration  | Limited                   | Prometheus + ServiceMonitor |
| Packaging               | Compose file              | Helm chart                  |

Docker Compose therefore provides the local development/container environment, while Kubernetes provides the project's cloud-native orchestration model.

---

## 15. Summary

Docker Compose provides the foundation for running ShopNest locally as a multi-container application.

The Compose environment includes the frontend, Products API, PostgreSQL and Redis services, connected through a dedicated Docker network.

Persistent PostgreSQL storage, health checks, environment configuration and service-to-service communication are included in the local deployment.

The same application architecture is then extended into Kubernetes using Deployments, StatefulSets, Services, ConfigMaps, Secrets, PersistentVolumeClaims, probes, HPA, Prometheus and Helm.
