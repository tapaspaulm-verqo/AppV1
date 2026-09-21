export const environment = {
  production: true,
  // Overridden at deploy time in Kubernetes (see deploy/helm/verqo — the web
  // Deployment renders this file from a ConfigMap at container start so the
  // same image works in every environment).
  apiBaseUrl: '/api/v1',
};
