import dotenv from 'dotenv';
dotenv.config();

const mongoUsername = process.env.MONGO_DB_USERNAME || 'dbuser';
const mongoPassword = process.env.MONGO_DB_PASSWORD || 'password123';
const mongoHost = process.env.MONGO_DB_HOST || 'database';
const mongoPort = process.env.MONGO_DB_PORT || '27017';
const mongoDatabase = process.env.MONGO_DB_DATABASE || 'catmon_db';
const mongoParameters = process.env.MONGO_DB_PARAMETERS || '?authSource=admin';

export const env = {
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'catmon-secret-key',
  mongoUri: process.env.MONGODB_URI ||
    `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}${mongoParameters}`,
  nodeEnv: process.env.NODE_ENV || 'development'
};
