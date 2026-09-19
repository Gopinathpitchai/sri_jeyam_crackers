const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Static files (Images)
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// API Routes - Registered for both /api/* and /* to seamlessly handle Vercel serverless rewrites
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const uploadRouter = require('./routes/upload');
const settingsRouter = require('./routes/settings');
const statusRouter = require('./routes/status');

app.use('/api/auth', authRouter);
app.use('/auth', authRouter);

app.use('/api/products', productsRouter);
app.use('/products', productsRouter);

app.use('/api/orders', ordersRouter);
app.use('/orders', ordersRouter);

app.use('/api/upload', uploadRouter);
app.use('/upload', uploadRouter);

app.use('/api/settings', settingsRouter);
app.use('/settings', settingsRouter);

app.use('/api/status', statusRouter);
app.use('/status', statusRouter);

// Root health check
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    app: 'Sri Jeyam Crackers API',
    time: new Date().toISOString()
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);
app.get('/api', healthHandler);
app.get('/', healthHandler);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error: ' + (err.message || 'Unknown error') });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Sri Jeyam Crackers Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
