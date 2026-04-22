const express = require('express');

const router = express.Router();

// Lightweight liveness endpoint used by:
// - local dev checks,
// - container orchestrators,
// - uptime monitors.
// It intentionally avoids DB calls so it can answer quickly and consistently.
router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'catmon-api' });
});

module.exports = router;
