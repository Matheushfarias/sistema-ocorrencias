// Firebase Cloud Functions entry point
import * as functions from 'firebase-functions';
import express, { type Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { registerRoutes } from '../server/routes';
import { createServer } from 'http';

const app = express();

// Enable CORS for all origins (Firebase Hosting will handle this)
app.use(cors({ origin: true }));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Create a dummy HTTP server for route registration
const dummyServer = createServer(app);

// Register all routes
registerRoutes(dummyServer, app).then(() => {
  console.log('Routes registered for Firebase Functions');
}).catch(err => {
  console.error('Error registering routes:', err);
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error('Error:', err);
  res.status(status).json({ message });
});

// Export the Express app as a Firebase Cloud Function
export const api = functions.https.onRequest(app);
