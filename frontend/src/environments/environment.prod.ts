// Production-oriented environment settings.
// This uses a concrete API URL since production builds do not run through
// Angular's dev proxy. Update this when deploying to your real API host.
export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:5000/api',
};
