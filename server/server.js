import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDatabase } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import dietRoutes from './routes/dietRoutes.js';
import bmiRoutes from './routes/bmiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS Middleware Configuration ─────────────────────────────────────
const corsOrigin = process.env.CORS_ORIGIN;
if (corsOrigin) {
  const allowedOrigins = corsOrigin.split(',').map((origin) => origin.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('CORS policy: Origin not allowed'));
        }
      },
      credentials: true,
    })
  );
} else {
  app.use(cors());
}

app.use(express.json());

// ── Static Frontend Serving (Production / Render) ─────────────────────
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// ── Health Check ───────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Fitness Bot API is running 🏋️' });
});

// ── API Routes ─────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/bmi', bmiRoutes);

// ── Client-Side SPA Fallback Handler ──────────────────────────────────
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// ── 404 Handler ────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
});

// ── Global Error Handler ───────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────────
const start = async () => {
  try {
    // Initialize SQLite database
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`\n🚀 Fitness Bot server running on port ${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

