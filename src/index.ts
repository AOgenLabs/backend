// Backend Server for AO Process Builder
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

// Import routes
import automationRoutes from './routes/automationRoutes';
import aoRoutes from './routes/aoRoutes';
import { ErrorResponse, HealthResponse } from './types';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/automations', automationRoutes);
app.use('/api', aoRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const healthResponse: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString()
  };
  res.json(healthResponse);
});

// Serve React app for any other routes
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  
  const errorResponse: ErrorResponse = {
    error: true,
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };
  
  res.status(500).json(errorResponse);
});

// Start the server
app.listen(PORT, () => {
  console.log(`AO Process Builder API running on port ${PORT}`);
});

export default app;
