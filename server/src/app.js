import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';
import { stats as getStats } from './controllers/certificateController.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Public verification routes
app.use('/api/verify', verifyRoutes);

// Protected certificate routes
app.use('/api/certificates', requireAuth, certificateRoutes);

// Protected statistics route
app.get('/api/stats', requireAuth, getStats);

// Central error handler
app.use(errorHandler);

export default app;
