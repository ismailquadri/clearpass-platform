import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { db } from './config/database';
import { httpLogger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRateLimiter, loginRateLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import certificateRoutes from './routes/certificates';
import dashboardRoutes from './routes/dashboard';
import alertsRoutes from './routes/alerts';
import activityRoutes from './routes/activity';
import mdaRoutes from './routes/mda';
import partnerRoutes from './routes/partner';
import settingsRoutes from './routes/settings';
import reportsRoutes from './routes/reports';
import subscriptionRoutes from './routes/subscriptions';
import mfaRoutes from './routes/mfa';
import passwordResetRoutes from './routes/passwordReset';
import webhooksRoutes from './routes/webhooks';
import adminRoutes from './routes/admin';

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: env.isDevelopment ? false : undefined,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(httpLogger);

// Rate limiting
app.use('/api', apiRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', loginRateLimiter, authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/mda', mdaRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/mfa', mfaRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Database connection test
db.raw('SELECT 1')
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// Start server
const PORT = env.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${env.nodeEnv} mode`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});

export default app;
