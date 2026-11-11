import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initDatabase, getDbEngine } from './config/db.js';
import apiRoutes from './routes/apiRoutes.js';
import {
  getCurrentNetworkState,
  pushTelemetryPoint
} from './controllers/networkController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Attach io to express app for use in controllers
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Disaster Management & Emergency Network EOC Server',
    databaseEngine: getDbEngine(),
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if present
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`[Static] Serving frontend static assets from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Send initial network state immediately
  socket.emit('initial_state', {
    networkState: getCurrentNetworkState(),
    serverTime: new Date().toISOString()
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Background Telemetry Pulse Generator
// Emits real-time network telemetry updates every 3 seconds
setInterval(() => {
  const state = getCurrentNetworkState();
  
  if (state.isSimulated) {
    let latency, loss, bw;
    
    if (state.primaryLinkStatus === 'Active') {
      latency = +(2.0 + Math.random() * 0.7).toFixed(1);
      loss = 0.0;
      bw = +(930 + Math.random() * 25).toFixed(0);
    } else {
      latency = +(345 + Math.random() * 25).toFixed(1);
      loss = +(1.5 + Math.random() * 1.5).toFixed(1);
      bw = +(4.6 + Math.random() * 0.7).toFixed(1);
    }

    state.latencyMs = latency;
    state.packetLossPct = loss;
    state.bandwidthMbps = bw;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const point = {
      time: timeStr,
      latency,
      packetLoss: loss,
      bandwidth: bw,
      link: state.primaryLinkStatus === 'Active' ? 'Primary' : 'Backup'
    };

    pushTelemetryPoint(point);

    io.emit('telemetry_tick', {
      state,
      point
    });
  }
}, 3000);

// Initialize DB and Start Server
async function startServer() {
  try {
    await initDatabase();
    server.listen(PORT, () => {
      console.log('====================================================');
      console.log(`  EOC DISASTER MANAGEMENT NETWORK SERVER RUNNING   `);
      console.log(`  Port:      http://localhost:${PORT}             `);
      console.log(`  API:       http://localhost:${PORT}/api         `);
      console.log(`  Database:  ${getDbEngine()}                     `);
      console.log('====================================================');
    });
  } catch (err) {
    console.error('[FATAL] Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
