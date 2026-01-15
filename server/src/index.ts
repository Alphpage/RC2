import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use(config.apiPrefix, routes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📍 API available at http://localhost:${PORT}${config.apiPrefix}`);
  logger.info(`🌍 Environment: ${config.env}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
