import express from 'express';
import cors from 'cors';
import { initDatabase, getDbEngine } from '../server/config/db.js';
import apiRoutes from '../server/routes/apiRoutes.js';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Lazy-initialize database on cold start
let dbReadyPromise = null;
app.use(async (req, res, next) => {
  if (!dbReadyPromise) {
    dbReadyPromise = initDatabase().catch((err) => {
      console.error('[Vercel Serverless] DB init error:', err);
    });
  }
  await dbReadyPromise;
  next();
});

// Mount all API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'Vercel Serverless',
    databaseEngine: getDbEngine(),
    timestamp: new Date().toISOString()
  });
});

export default app;
