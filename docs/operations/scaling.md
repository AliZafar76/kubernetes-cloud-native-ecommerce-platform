# Scaling

## 1. Overview

ShopNest demonstrates both manual and automatic Kubernetes scaling.

Two scaling approaches are used:

1. Manual scaling through Kubernetes commands
2. Automatic scaling through Horizontal Pod Autoscaler (HPA)

Manual scaling is useful when an administrator wants direct control over the number of replicas.

HPA is useful when the application should automatically adjust replicas according to resource utilization.

---

## 2. Manual Scaling

Kubernetes Deployments can be scaled manually by changing the desired replica count.

Example:

```bash
kubectl scale deployment products \
  --replicas=3 \
  -n ecommerce
```

This changes the Products API Deployment to three replicas.

The Deployment controller then creates or removes Pods until the desired replica count is reached.

---

## 3. Checking Replicas

Current Products API Pods can be checked using:

```bash
kubectl get pods -n ecommerce
```

The Deployment configuration can be checked using:

```bash
kubectl get deployment products -n ecommerce
```

A more detailed view is available with:

```bash
kubectl describe deployment products -n ecommerce
```

---

## 4. Horizontal Pod Autoscaler

ShopNest uses a Horizontal Pod Autoscaler for the Products API.

The HPA automatically adjusts the number of Products API replicas according to CPU utilization.

Current configuration:

```text
Minimum replicas: 1
Maximum replicas: 5
Target CPU utilization: 50%
```

The HPA is configured to maintain CPU utilization around the defined target while staying within the minimum and maximum replica limits.

---

## 5. HPA Configuration

The HPA can be inspected using:

```bash
kubectl get hpa -n ecommerce
```

Example configuration concept:

```text
products-hpa
    |
    ├── Min replicas: 1
    ├── Max replicas: 5
    └── Target CPU: 50%
```

The HPA uses the resource metrics available for the Products API Pods.

---

## 6. Resource Requests and HPA

CPU-based HPA depends on resource configuration.

The Products API Deployment defines CPU resource requests and limits.

The CPU utilization used by the HPA is evaluated relative to the configured CPU request.

This is why resource requests are an important part of the autoscaling configuration.

---

## 7. Scaling Flow

The automatic scaling process can be summarized as:

```text
Application workload
        |
        ▼
CPU utilization changes
        |
        ▼
Kubernetes metrics
        |
        ▼
HPA evaluates target
        |
        ▼
Desired replica count calculated
        |
        ▼
Products Deployment
        |
        ▼
Pods increased or decreased
```

For example:

```text
Higher workload
      ↓
Higher CPU usage
      ↓
HPA detects increased utilization
      ↓
Replica count increases
```

When demand decreases:

```text
Lower workload
      ↓
Lower CPU usage
      ↓
HPA detects reduced utilization
      ↓
Replica count can decrease
```

---

## 8. Manual Scaling vs HPA

| Feature          | Manual Scaling           | HPA                  |
| ---------------- | ------------------------ | -------------------- |
| Scaling decision | Administrator            | Kubernetes           |
| Trigger          | Manual command           | Resource utilization |
| Automatic        | No                       | Yes                  |
| Minimum replicas | Administrator controlled | Configured           |
| Maximum replicas | Administrator controlled | Configured           |
| Best use         | Direct control/testing   | Dynamic workload     |

Manual scaling and HPA demonstrate two different approaches to Kubernetes workload management.

---

## 9. Scaling Verification

The Products API HPA was verified in the Kubernetes environment.

The HPA reported:

```text
Minimum replicas: 1
Maximum replicas: 5
CPU target: 50%
```

During verification, the current CPU utilization was below the target, so the application remained at a low replica count.

This is expected behavior because HPA does not need to create additional Pods when resource utilization remains below the scaling target.

---

## 10. Useful Commands

Check HPA:

```bash
kubectl get hpa -n ecommerce
```

Detailed HPA information:

```bash
kubectl describe hpa products-hpa -n ecommerce
```

Check Deployment:

```bash
kubectl get deployment products -n ecommerce
```

Check Pods:

```bash
kubectl get pods -n ecommerce
```

Watch Pods:

```bash
kubectl get pods -n ecommerce -w
```

Manually scale:

```bash
kubectl scale deployment products \
  --replicas=3 \
  -n ecommerce
```

Return to one replica:

```bash
kubectl scale deployment products \
  --replicas=1 \
  -n ecommerce
```

---

## 11. Important HPA Behavior

HPA does not directly create Pods.

Instead, it changes the desired replica count of the target workload.

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

The Deployment and ReplicaSet controllers are responsible for creating or removing Pods to match the desired state.

---

## 12. Scaling and Self-Healing

Scaling and self-healing are related but different Kubernetes capabilities.

### Scaling

Scaling changes the number of application replicas.

Example:

```text
1 Pod → 3 Pods
```

### Self-healing

Self-healing replaces failed Pods to maintain the desired replica count.

Example:

```text
3 desired Pods
      ↓
1 Pod fails
      ↓
Kubernetes creates replacement
      ↓
3 Pods restored
```

Therefore:

* HPA manages **how many replicas are needed**
* Deployment controllers maintain **the desired number of running replicas**

---

## 13. Design Benefits

The scaling architecture provides:

### Flexibility

Administrators can manually change replicas when required.

### Automatic scaling

HPA can react to increased resource utilization.

### Resource efficiency

The application can remain at a lower replica count when demand is low.

### Resilience

Multiple replicas allow the application to continue serving traffic when individual Pods fail.

### Kubernetes-native scaling

Scaling is handled through Kubernetes controllers rather than custom application logic.

---

## 14. Future Improvements

The current project uses CPU-based HPA.

Possible future improvements include:

* Memory-based autoscaling
* Custom application metrics
* Request-rate based scaling
* Load testing
* More advanced autoscaling policies
* Production-grade workload tuning

These are future improvements and are not represented as currently implemented features.

---

## 15. Summary

ShopNest demonstrates both manual and automatic Kubernetes scaling.

Manual scaling allows the replica count to be changed directly using `kubectl scale`.

The Products API also uses an HPA configured with:

```text
Min replicas: 1
Max replicas: 5
CPU target: 50%
```

The HPA adjusts the desired replica count according to CPU utilization, while the Deployment and ReplicaSet controllers ensure that the desired number of Pods is maintained.

This demonstrates an important Kubernetes operational pattern: combining declarative workload management, self-healing and automatic horizontal scaling.
