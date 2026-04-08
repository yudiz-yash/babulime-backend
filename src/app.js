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

// CORS — open to all origins (public website API; admin routes are JWT-protected)
app.use(cors({ origin: true, credentials: true }));

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
