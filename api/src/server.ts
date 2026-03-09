import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { swaggerSpec } from './config/swagger';
import apiRoutes from './routes/api.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', apiRoutes);

// Connect to database and start server
connectDatabase().then(() => {
  app.listen(env.port, () => {
    console.log(`Catmon API running on port ${env.port}`);
    console.log(`Swagger docs at http://localhost:${env.port}/api/docs`);
  });
});

export default app;
