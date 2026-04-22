const mongoose = require('mongoose');
const env = require('./env');

// Opens a single shared Mongoose connection used by the entire API process.
// This is called during startup before the HTTP listener begins accepting traffic.
async function connectDatabase() {
  // Mongoose handles internal connection pooling and reconnect behavior.
  await mongoose.connect(env.mongodbUri);
}

module.exports = { connectDatabase };
