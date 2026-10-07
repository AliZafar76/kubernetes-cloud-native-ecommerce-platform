# Verification and Testing

## 1. Overview

ShopNest was verified progressively throughout development.

The testing approach focused on confirming that the major application, Kubernetes, Helm and monitoring components work as intended.

The verification process covered:

* Frontend build and linting
* Docker Compose services
* Products API
* Kubernetes workloads
* Kubernetes networking
* Persistent storage
* Health probes
* Horizontal Pod Autoscaler
* Prometheus monitoring
* Grafana
* Helm chart validation
* Helm deployment
* Repository security

---

## 2. Frontend Verification

The React frontend was checked using the project's configured npm scripts.

### Lint

```bash
npm --prefix frontend run lint
```

The frontend lint check completed successfully.

### Production build

```bash
npm --prefix frontend run build
```

The production build completed successfully.

This verifies that the frontend source can be compiled into a production build.

---

## 3. Docker Image Verification

The frontend Docker image was built successfully using:

```bash
docker build -t shopnest-frontend:test ./frontend
```

The successful image build verified the frontend Dockerfile and production build process.

Temporary testing containers were removed after verification.

---

## 4. Docker Compose Verification

Docker Compose was used to run the local application environment.

The main services were verified:

* PostgreSQL
* Redis
* Products API
* Frontend

Check the Compose services using:

```bash
docker compose -f docker/docker-compose.yml ps
```

The PostgreSQL, Redis and Products API services reached healthy/running states during verification.

---

## 5. Products API Verification

The Products API was tested directly using:

```bash
curl http://localhost:3001/api/products
```

The API returned a successful response.

The Products API also exposes:

```text
/ready
/metrics
```

The `/metrics` endpoint was verified from the running Kubernetes Products API Pod.

---

## 6. Kubernetes Workload Verification

The Kubernetes workloads were checked using:

```bash
kubectl get pods -n ecommerce
```

The main application workloads reached the Running state:

* Frontend
* Products API
* PostgreSQL
* Redis

Deployments were also checked using:

```bash
kubectl get deployments -n ecommerce
```

PostgreSQL was verified through its StatefulSet:

```bash
kubectl get statefulset -n ecommerce
```

---

## 7. Kubernetes Service Verification

Application Services were checked using:

```bash
kubectl get svc -n ecommerce
```

The verified services include:

| Service          | Type      | Port |
| ---------------- | --------- | ---: |
| frontend         | NodePort  |   80 |
| products-service | ClusterIP | 3001 |
| postgres         | ClusterIP | 5432 |
| redis            | ClusterIP | 6379 |

The backend services use ClusterIP for internal Kubernetes communication.

---

## 8. Kubernetes DNS Verification

Kubernetes Service-based communication was verified as part of the application deployment.

The Products API uses Kubernetes Service names to communicate with internal dependencies rather than relying on individual Pod IP addresses.

Relevant Services include:

```text
postgres
redis
products-service
```

This allows Pod replacement without requiring application configuration to be updated for changing Pod IP addresses.

---

## 9. Persistent Storage Verification

PostgreSQL persistent storage was checked using:

```bash
kubectl get pvc -n ecommerce
```

The PostgreSQL PVC reached:

```text
STATUS: Bound
```

The configured storage was:

```text
1Gi
```

with:

```text
RWO
```

access mode.

This verifies that PostgreSQL has persistent Kubernetes storage attached.

---

## 10. Health Probe Verification

The application deployment includes Kubernetes health probes.

Readiness probes were used to control whether Pods should receive Service traffic.

Liveness probes were used to support container recovery when the application becomes unhealthy.

Probe configuration can be inspected using:

```bash
kubectl describe pod <pod-name> -n ecommerce
```

The verification process confirmed that the workloads were able to reach healthy Running states.

---

## 11. Horizontal Pod Autoscaler Verification

The Products API HPA was checked using:

```bash
kubectl get hpa -n ecommerce
```

The configured values are:

```text
Minimum replicas: 1
Maximum replicas: 5
CPU target: 50%
```

During verification, CPU utilization remained below the configured target, so the workload remained at a low replica count.

This confirms the HPA configuration without claiming a specific load-test scaling result.

---

## 12. Monitoring Verification

The monitoring stack was verified in the `monitoring` namespace.

Check monitoring workloads:

```bash
kubectl get pods -n monitoring
```

The monitoring stack included:

* Prometheus
* Grafana
* Prometheus Operator
* Alertmanager
* Node Exporter

The Products API metrics endpoint was directly verified:

```bash
kubectl exec -n ecommerce <products-pod-name> -- \
  wget -qO- http://localhost:3001/metrics
```

Prometheus reported:

```text
15 healthy scrape targets
```

during the verification process.

---

## 13. ServiceMonitor Verification

The Products API monitoring integration uses a ServiceMonitor.

The ServiceMonitor can be checked using:

```bash
kubectl get servicemonitor -n monitoring
```

The ServiceMonitor targets the Products application in the `ecommerce` namespace and scrapes:

```text
/metrics
```

at a configured interval of:

```text
15s
```

---

## 14. Grafana Verification

Grafana was successfully accessed through Kubernetes port-forwarding.

Command:

```bash
kubectl port-forward \
  -n monitoring \
  svc/monitoring-grafana 3000:80
```

Grafana was then accessible locally at:

```text
http://localhost:3000
```

The Prometheus datasource was provisioned by the monitoring stack.

---

## 15. Helm Verification

The Helm chart was validated using:

```bash
helm lint helm/shopnest
```

The chart passed linting successfully.

The chart was also rendered using:

```bash
helm template shopnest helm/shopnest
```

The generated Kubernetes manifests were inspected to verify that the expected resources and safe placeholder configuration were produced.

---

## 16. Helm Deployment Verification

An isolated Helm release was deployed in:

```text
helm-test
```

using:

```bash
helm install shopnest-test helm/shopnest \
  --namespace helm-test \
  --set frontend.service.nodePort=30081 \
  --set serviceMonitor.enabled=false
```

The release was subsequently upgraded using:

```bash
helm upgrade shopnest-test helm/shopnest \
  --namespace helm-test \
  --set frontend.replicaCount=2 \
  --set frontend.service.nodePort=30081 \
  --set serviceMonitor.enabled=false
```

The Helm release successfully reached revision 2.

The deployed workloads reached healthy states after the required database schema migration was applied to the isolated test database.

---

## 17. Frontend Proxy Verification

The frontend Nginx configuration was verified by sending an API request through the frontend path:

```bash
curl -v http://localhost/api/products
```

The request returned HTTP `200`.

This verified the frontend-to-Products-API proxy path in the tested environment.

---

## 18. Security Verification

Repository content was checked to ensure that the local database password was not committed.

The staged repository was checked using:

```bash
git grep --cached -n "ecommerce_pass"
```

No committed occurrence of the real local password was found.

The repository was also checked for placeholder values:

```bash
git grep --cached -n "CHANGE_ME"
```

The remaining `CHANGE_ME` values are intentional safe placeholders used in:

* Kubernetes Secret configuration
* Helm values
* Environment example configuration

Real local credentials remain outside the committed source.

---

## 19. Git Working Tree Verification

Before the final documentation commit, the repository should be checked with:

```bash
git status --short
```

A final review of staged changes can be performed using:

```bash
git diff --cached --stat
```

Check for whitespace errors:

```bash
git diff --cached --check
```

These checks help ensure that the final repository does not contain accidental files or formatting problems.

---

## 20. Verification Summary

The following major project areas were successfully verified:

| Area                    | Verification              |
| ----------------------- | ------------------------- |
| Frontend lint           | Passed                    |
| Frontend build          | Passed                    |
| Frontend Docker build   | Passed                    |
| Docker Compose          | Verified                  |
| Products API            | HTTP response verified    |
| Kubernetes Pods         | Running                   |
| Kubernetes Services     | Verified                  |
| PostgreSQL PVC          | Bound                     |
| Health probes           | Configured and verified   |
| HPA                     | Configured and verified   |
| Prometheus              | Healthy targets verified  |
| Products metrics        | `/metrics` verified       |
| ServiceMonitor          | Configured and discovered |
| Grafana                 | Accessible                |
| Helm lint               | Passed                    |
| Helm rendering          | Verified                  |
| Helm deployment         | Verified                  |
| Helm upgrade            | Verified                  |
| Repository secret check | Passed                    |

---

## 21. Testing Limitations

The current verification focuses on functional, configuration and infrastructure validation.

The project does not claim:

* Production-scale load testing
* Multi-node production cluster testing
* Cloud deployment validation
* Disaster recovery testing
* Production traffic benchmarks
* Production availability/SLA results

These areas can be added as future improvements if the project is deployed in a production-like environment.

---

## 22. Final Verification Philosophy

The project follows a practical verification approach:

```text
Build
  ↓
Run
  ↓
Inspect
  ↓
Verify
  ↓
Document
```

Each major infrastructure layer was checked independently before moving toward final project documentation.

This provides evidence that the portfolio project is not only a collection of Kubernetes YAML files, but a working cloud-native application with containerization, orchestration, persistence, scaling and observability.

---

## 23. Conclusion

ShopNest successfully demonstrates a complete local cloud-native deployment workflow.

The application was validated across Docker Compose and Kubernetes, with Helm providing reusable deployment packaging and Prometheus/Grafana providing observability.

The verification process confirms the major implemented features while clearly separating current capabilities from future production improvements.
