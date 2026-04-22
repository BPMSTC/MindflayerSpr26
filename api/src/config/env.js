const dotenv = require('dotenv');

// Loads values from `.env` into `process.env` for local development.
// In hosted environments, platform-provided environment variables are used.
dotenv.config();

// Centralized environment configuration object.
// Keeping all env parsing/defaulting in one place reduces repeated logic and
// avoids magic strings spread across the codebase.
const env = {
  // API port to listen on.
  port: Number(process.env.PORT || 5000),

  // Mongo connection string. Defaults to local DB for developer convenience.
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/catmon',

  // Allowed browser origin for CORS.
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:4200',
};

module.exports = env;
