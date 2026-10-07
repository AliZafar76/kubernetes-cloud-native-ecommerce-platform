# Security Policy

## Overview

ShopNest is a portfolio-focused cloud-native e-commerce project built to demonstrate practical DevOps, Kubernetes, containerization and observability concepts.

Security considerations were included throughout the project, particularly around credentials, configuration and repository hygiene.

## Credential Management

Real local credentials are not committed to the repository.

Sensitive environment files are excluded through `.gitignore`, including:

* `docker/.env`
* `services/products/.env`

Example configuration files use placeholder values instead of real credentials.

For example:

```text
DB_PASSWORD=CHANGE_ME
```

## Kubernetes Secrets

Kubernetes Secret resources are used for sensitive configuration such as the PostgreSQL database password.

The repository contains safe placeholder values only.

Real credentials should be supplied separately when deploying the application.

## Repository Security Checks

Before publishing the repository, the staged content was checked to ensure that the real local database password was not present.

The repository was also checked for placeholder values such as `CHANGE_ME`.

The remaining `CHANGE_ME` values are intentional examples/placeholders in:

* `helm/shopnest/values.yaml`
* `helm/shopnest/templates/secret.yaml`
* `k8s/secret.yaml`
* `services/products/.env.example`

## Production Considerations

This project is designed as a local, production-oriented demonstration rather than a production deployment.

For a real production environment, additional security controls would be recommended, including:

* External secret management
* Encryption at rest
* TLS/HTTPS
* NetworkPolicies
* Container image vulnerability scanning
* Dependency vulnerability scanning
* Kubernetes RBAC hardening
* Pod Security Standards
* Resource quotas and limits at namespace level
* Image signing and provenance
* Centralized security logging
* Regular credential rotation
* Managed database security controls

## Reporting a Security Issue

If a security issue is discovered in this project, please avoid publicly exposing sensitive credentials or private information.

Report the issue privately to the repository owner with enough information to reproduce and understand the problem.

## Important Note

This repository does not contain production credentials.

Any credentials used during local development or testing should be considered environment-specific and must not be committed to Git.
