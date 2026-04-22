const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/db');

// Bootstraps the API process in a predictable order:
// 1) Connect to MongoDB so route handlers have a live DB connection.
// 2) Start the HTTP server only after DB connection succeeds.
// This avoids accepting requests while the data layer is unavailable.
async function startServer() {
  try {
    // Awaiting here prevents the server from listening until Mongo is ready.
    await connectDatabase();

    // Start Express on the configured port.
    app.listen(env.port, () => {
      console.log(`Catmon API listening on port ${env.port}`);
    });
  } catch (error) {
    // If startup fails (DB/network/config), fail fast so container/process managers
    // can restart and we don't leave a half-initialized process running.
    console.error('Failed to start API', error);
    process.exit(1);
  }
}

// Entry point invocation.
startServer();
