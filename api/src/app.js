const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const healthRoutes = require('./routes/health.routes');

const app = express();

// CORS controls which frontend origins can call this API from the browser.
// `credentials: true` keeps the app ready for cookie/session auth later.
// `env.clientOrigin` lets us switch origin per environment without code changes.
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);

// Parse JSON request bodies so controllers can access `req.body` safely.
app.use(express.json());

// Mount all API routes under `/api` so frontend can use a stable base URL.
// Example health check path becomes GET /api/health.
app.use('/api', healthRoutes);

// Exporting app (instead of listening here) keeps startup/test concerns separated.
module.exports = app;
