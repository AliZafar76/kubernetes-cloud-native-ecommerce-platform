# Monitoring Architecture

## 1. Overview

ShopNest uses Prometheus and Grafana to provide monitoring and observability for the Kubernetes-based application.

The monitoring stack runs in a dedicated `monitoring` namespace, while the ShopNest application workloads run in the `ecommerce` namespace.

The monitoring architecture is designed to provide visibility into:

* Application metrics
* Kubernetes and node metrics
* Resource utilization
* Application health
* Prometheus scrape targets
* Grafana-based visualization

---

## 2. Monitoring Architecture

The monitoring flow can be summarized as:

```text
ShopNest Application
        |
        | /metrics
        v
Products Service
        |
        | ServiceMonitor
        v
Prometheus
        |
        | Prometheus datasource
        v
Grafana
```

Kubernetes and node-level metrics are also collected by the monitoring stack.

---

## 3. Prometheus

Prometheus is responsible for collecting and storing time-series metrics.

The project uses Prometheus as the primary monitoring and metrics collection component.

Prometheus discovers monitoring targets through Kubernetes monitoring resources, including the `ServiceMonitor` configured for the Products API.

Prometheus was verified with healthy scrape targets during project testing.

---

## 4. Application Metrics

The Products API exposes a Prometheus-compatible metrics endpoint:

```text
/metrics
```

The Node.js application uses the `prom-client` package to expose application and Node.js process metrics.

Example metric categories include:

* CPU usage
* Memory usage
* Node.js process metrics
* Event-loop related metrics
* Default application process metrics

The endpoint was directly verified from the running Products pod.

---

## 5. ServiceMonitor

ShopNest uses a Prometheus `ServiceMonitor` to connect the Products Service with Prometheus.

The ServiceMonitor:

* Selects the Products Service using Kubernetes labels
* Targets the `ecommerce` namespace
* Scrapes the `/metrics` endpoint
* Uses the service's HTTP port
* Scrapes metrics every 15 seconds

The ServiceMonitor is defined in:

```text
k8s/products-servicemonitor.yaml
```

The Helm chart also contains a configurable ServiceMonitor template.

---

## 6. Grafana

Grafana provides the visualization layer for the monitoring system.

Grafana connects to Prometheus as its metrics datasource and can be used to visualize:

* Kubernetes resource metrics
* Node metrics
* Application metrics
* CPU and memory utilization
* Prometheus target health
* Time-series monitoring data

Grafana was successfully accessed through Kubernetes port-forwarding during project verification.

The Prometheus datasource is provisioned by the monitoring stack rather than manually configured through the Grafana UI.

---

## 7. Kubernetes Monitoring Stack

The monitoring namespace contains the main observability components, including:

* Prometheus
* Grafana
* Prometheus Operator
* Alertmanager
* Node Exporter

The monitoring stack runs separately from the application workloads.

This separation keeps application resources in the `ecommerce` namespace and monitoring infrastructure in the `monitoring` namespace.

---

## 8. Node and Kubernetes Metrics

Node Exporter provides node-level system metrics to Prometheus.

The monitoring stack also provides visibility into Kubernetes components and cluster resources.

This allows the project to observe infrastructure-level information in addition to application-level metrics.

---

## 9. Monitoring Verification

The monitoring implementation was verified using several checks.

### Products metrics endpoint

The Products API `/metrics` endpoint was successfully accessed from the running pod.

### Prometheus targets

Prometheus reported healthy scrape targets during verification.

A total of:

```text
15 healthy scrape targets
```

were observed during the monitoring verification.

### Grafana

Grafana was successfully accessed using Kubernetes port-forwarding.

Example:

```bash
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
```

Grafana was then available locally at:

```text
http://localhost:3000
```

---

## 10. Monitoring Namespace

Monitoring resources are isolated in the dedicated namespace:

```text
monitoring
```

Application resources remain in:

```text
ecommerce
```

This namespace separation provides a cleaner Kubernetes architecture and makes the application and observability components easier to manage independently.

---

## 11. Helm Integration

Monitoring configuration is also integrated with the ShopNest Helm chart.

The ServiceMonitor can be enabled or disabled through Helm values.

This allows the same chart to be deployed in environments where Prometheus monitoring is available or unavailable.

Example configuration:

```yaml
serviceMonitor:
  enabled: true
```

The Helm chart therefore packages application deployment and its monitoring integration together.

---

## 12. Observability Flow

The complete monitoring flow is:

```text
Products API
     |
     | exposes /metrics
     v
Products Kubernetes Service
     |
     | selected by ServiceMonitor
     v
Prometheus
     |
     | metrics datasource
     v
Grafana
     |
     v
Monitoring Dashboards
```

This architecture separates:

* Metric generation
* Metric collection
* Metric storage/querying
* Metric visualization

---

## 13. Design Benefits

The monitoring architecture provides several benefits:

### Visibility

Application and infrastructure metrics can be observed instead of relying only on application logs.

### Kubernetes integration

Prometheus integrates with Kubernetes service discovery and monitoring resources.

### Separation of concerns

The application and monitoring stack run in separate namespaces.

### Helm portability

Monitoring configuration can be packaged with the application Helm chart.

### Extensibility

The monitoring architecture can later be extended with:

* Custom Grafana dashboards
* Alert rules
* Application-specific metrics
* Centralized logging
* Distributed tracing
* Advanced alerting

---

## 14. Future Improvements

Possible future improvements include:

* Custom ShopNest Grafana dashboards
* Prometheus alerting rules
* Alertmanager notification channels
* More application-specific business metrics
* Centralized logging
* Distributed tracing
* Long-term metrics storage
* Production-grade monitoring configuration

These are considered future enhancements and are not represented as currently implemented features.

---

## 15. Summary

The ShopNest monitoring architecture uses Prometheus and Grafana to provide observability for the Kubernetes application.

The Products API exposes Prometheus-compatible metrics through `/metrics`, while a Kubernetes `ServiceMonitor` connects the application metrics to Prometheus.

Grafana provides the visualization layer, and the monitoring infrastructure runs separately from the application workloads in the `monitoring` namespace.

This provides a clean foundation for Kubernetes observability while keeping the architecture extensible for future production-oriented improvements.
