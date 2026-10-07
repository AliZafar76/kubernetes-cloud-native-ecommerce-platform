# Self-Healing

## 1. Overview

Kubernetes provides self-healing capabilities that help maintain the desired state of the ShopNest application.

Instead of manually monitoring and recreating failed Pods, Kubernetes controllers continuously compare the actual cluster state with the desired configuration.

When a workload fails, Kubernetes can take corrective action automatically.

---

## 2. Desired State

Kubernetes workloads are defined declaratively.

For example, a Deployment may specify that a particular application should have a desired number of replicas.

Conceptually:

```text id="x7w2p1"
Desired state
      |
      ▼
Kubernetes controller
      |
      ▼
Actual cluster state
```

If the actual state differs from the desired state, Kubernetes attempts to reconcile the difference.

---

## 3. Pod Failure Recovery

The Products API is managed by a Kubernetes Deployment.

If one of its Pods fails, the Deployment's ReplicaSet controller works to maintain the configured replica count.

Example:

```text id="7gk2sp"
Desired replicas: 3

Pod 1  → Running
Pod 2  → Failed
Pod 3  → Running

        ↓

Kubernetes creates replacement Pod

        ↓

Pod 1  → Running
Pod 2  → Running
Pod 3  → Running
```

This behavior is provided by Kubernetes controllers rather than custom application code.

---

## 4. Deployment and ReplicaSet

The self-healing flow for a Deployment is:

```text id="e8y0cr"
Deployment
    |
    ▼
ReplicaSet
    |
    ▼
Pods
```

The Deployment defines the desired workload configuration.

The ReplicaSet maintains the desired number of Pods.

If a managed Pod disappears or fails, the ReplicaSet creates a replacement to restore the desired state.

---

## 5. Liveness Probe

The liveness probe checks whether the application container is functioning correctly.

If a container repeatedly fails its liveness check according to the configured probe policy, Kubernetes can restart the container.

The basic flow is:

```text id="w1s4lz"
Liveness check
      |
      ├── Healthy → Continue running
      |
      └── Unhealthy → Kubernetes can restart
```

Liveness probes therefore help recover from application states where a running container is no longer functioning correctly.

---

## 6. Readiness Probe

The readiness probe determines whether an application instance is ready to receive traffic.

If a Pod fails its readiness check, Kubernetes does not necessarily restart the container.

Instead, the Pod is temporarily considered not ready and is removed from the Service's ready endpoints.

The flow is:

```text id="4j3f8c"
Readiness check
      |
      ├── Ready → Receives Service traffic
      |
      └── Not Ready → Removed from ready endpoints
```

When the application becomes ready again, it can be added back to the Service endpoints.

---

## 7. Liveness vs Readiness

| Feature             | Liveness Probe               | Readiness Probe                        |
| ------------------- | ---------------------------- | -------------------------------------- |
| Main purpose        | Detect unhealthy application | Detect whether traffic can be accepted |
| Failed check        | Can trigger restart          | Removes Pod from ready endpoints       |
| Application restart | Possible                     | Not necessarily                        |
| Traffic control     | Not the primary purpose      | Yes                                    |
| Main benefit        | Recovery                     | Safe traffic routing                   |

A simple interview explanation is:

> Liveness asks, "Is the application still alive?"
> Readiness asks, "Is the application ready to receive traffic?"

---

## 8. Service Traffic and Readiness

Kubernetes Services route traffic to Pods that match their selectors and are considered ready.

If a Products API Pod becomes unready:

```text id="q3h1ko"
Products Pod
     |
     ▼
Readiness check fails
     |
     ▼
Pod becomes NotReady
     |
     ▼
Removed from ready Service endpoints
     |
     ▼
Traffic goes to other ready Pods
```

This helps prevent traffic from being sent to an application instance that is not ready to serve requests.

---

## 9. Self-Healing and Services

Services provide stable networking even when individual Pods are replaced.

Pods can have changing IP addresses during their lifecycle.

Applications communicate through the Kubernetes Service rather than depending on individual Pod IP addresses.

Therefore:

```text id="0s86x2"
Service
   |
   ├── Pod A
   ├── Pod B
   └── Pod C
```

If Pod B fails and is replaced:

```text id="f55w7x"
Service
   |
   ├── Pod A
   ├── New Pod B
   └── Pod C
```

The Service continues providing a stable endpoint for clients.

---

## 10. Self-Healing and Stateful Workloads

PostgreSQL is deployed using a StatefulSet with persistent storage.

If the PostgreSQL Pod needs to be recreated, its persistent storage remains associated with the workload through the PersistentVolumeClaim.

This separates the database's storage lifecycle from the individual Pod lifecycle.

The important distinction is:

```text id="k7q2n0"
Pod lifecycle
      ≠
Persistent data lifecycle
```

The Pod can be recreated while persistent data remains stored on the attached persistent volume.

---

## 11. Self-Healing and HPA

Self-healing and autoscaling solve different problems.

### Self-healing

Maintains the desired state when workloads fail.

```text id="g1a5bx"
Pod failure
   ↓
Replacement Pod
```

### HPA

Changes the desired replica count based on resource utilization.

```text id="d4b8vn"
Higher CPU
   ↓
HPA increases desired replicas
```

Both mechanisms can work together.

---

## 12. Verification

Kubernetes workload state can be checked using:

```bash id="xk2jv5"
kubectl get pods -n ecommerce
```

Detailed Pod information:

```bash id="z9gq7p"
kubectl describe pod <pod-name> -n ecommerce
```

Check Deployment:

```bash id="3o8vcs"
kubectl get deployment -n ecommerce
```

Check ReplicaSet:

```bash id="s3x6ma"
kubectl get replicaset -n ecommerce
```

Check recent events:

```bash id="m0r5nc"
kubectl get events -n ecommerce --sort-by=.lastTimestamp
```

These commands help identify Pod failures, probe failures, scheduling problems and replacement activity.

---

## 13. Failure Recovery Concept

A simplified failure-recovery flow is:

```text id="t5z6jp"
Application Pod
      |
      ▼
Failure / unhealthy state
      |
      ▼
Kubernetes detects state change
      |
      ├── Liveness failure
      │       ↓
      │   Container restart
      │
      └── Pod failure
              ↓
         ReplicaSet creates replacement
              |
              ▼
         New Pod becomes Ready
              |
              ▼
         Service sends traffic
```

This demonstrates Kubernetes' reconciliation-based architecture.

---

## 14. Design Benefits

The self-healing architecture provides:

### Automatic recovery

Common Pod failures can be handled without manual intervention.

### Desired-state enforcement

Kubernetes continuously works toward the configured desired state.

### Safer traffic routing

Readiness checks prevent unready Pods from receiving normal Service traffic.

### Application resilience

Multiple replicas can continue serving requests when an individual Pod fails.

### Stable networking

Services continue providing stable endpoints while Pods are recreated.

### Persistent data protection

Stateful workloads can use persistent storage independently of Pod lifecycle.

---

## 15. Limitations

Kubernetes self-healing does not guarantee that every application failure will be automatically solved.

For example:

* A logical application bug may continue after a restart.
* Incorrect configuration can repeatedly cause failures.
* Database corruption requires application or database-level recovery.
* External dependencies can remain unavailable.
* Persistent storage failures may require additional operational recovery.

Self-healing should therefore be considered one part of the overall reliability strategy.

---

## 16. Future Improvements

Possible future improvements include:

* More detailed application health checks
* Custom alerting rules
* Advanced failure testing
* Centralized logging
* Distributed tracing
* Automated incident notifications
* Production-grade backup and disaster recovery

These are future improvements and are not represented as currently implemented features.

---

## 17. Summary

ShopNest uses Kubernetes' declarative and controller-based architecture to provide self-healing behavior.

Deployments and ReplicaSets maintain the desired number of application Pods, while liveness probes can trigger container recovery and readiness probes control whether Pods receive Service traffic.

PostgreSQL uses a StatefulSet with persistent storage so that Pod recreation does not inherently remove database data.

Together, Deployments, ReplicaSets, Services, probes, StatefulSets and persistent storage provide the foundation for resilient application operation.
