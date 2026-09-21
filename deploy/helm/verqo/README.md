# Deploying Verqo to Kubernetes

```
helm upgrade --install verqo ./deploy/helm/verqo \
  --namespace verqo --create-namespace \
  --set image.registry=<your-registry> \
  --set image.api.tag=<git-sha-or-semver> \
  --set image.web.tag=<git-sha-or-semver> \
  -f values-<environment>.yaml
```

Before the first install in a namespace, create the two Secrets this chart
expects (see `examples/secrets-example.yaml` for the exact shape):

- `verqo-db-credentials` — the managed PostgreSQL connection string.
- `verqo-app-secrets` — the JWT signing key and the Aadhaar-hash pepper.

This chart deliberately does not deploy PostgreSQL in-cluster — see
`docs/ARCHITECTURE.md` for why a managed database (Cloud SQL / RDS / Azure
Database for PostgreSQL, regional HA) is the "easy maintainable, minimum
downtime" choice for this rebuild.

Structural note: every file under `templates/` was validated as well-formed
YAML by stripping Go template directives and parsing the result (this
sandbox couldn't install the `helm` binary itself — its install path,
`proxy.golang.org`, isn't reachable through the sandbox's network egress
policy). Run `helm lint` and `helm template` for real before a production
install, same as you'd want to for any chart.
