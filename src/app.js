const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const heroRoutes = require('./routes/hero.routes');
const aboutRoutes = require('./routes/about.routes');
const featuresRoutes = require('./routes/features.routes');
const productsRoutes = require('./routes/products.routes');
const careersRoutes = require('./routes/careers.routes');
const contactRoutes = require('./routes/contact.routes');
const bannerRoutes = require('./routes/banner.routes');
const uploadRoutes = require('./routes/upload.routes');
const settingsRoutes = require('./routes/settings.routes');

const app = express();

// Ensure DB is connected before handling any request (serverless-safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable. Please try again.' });
  }
});

// CORS — allow localhost for dev + production domain
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:3001',
];

// Allow any origins from env var
// On cPanel set: ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach(o => allowedOrigins.push(o.trim()));
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any *.vercel.app domain
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    callback(new Error('CORS not allowed'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/features', featuresRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Babu Lime API running' }));

module.exports = app;
