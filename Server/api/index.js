const express = require('express');
const cors = require('cors');

// Import routes
const userRoutes = require('../routes/userRoutes');
const agreementRoutes = require('../routes/agreementRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const hederaRoutes = require('../routes/hederaRoutes');

// Import middleware
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimiter = require('../middlewares/rateLimiter');
const errorHandler = require('../middlewares/errorHandler');
const { performanceMonitor, getMetrics, healthCheck } = require('../middlewares/performanceMonitor');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(performanceMonitor);

// Health check
app.get('/health', healthCheck);

// Performance metrics endpoint
app.get('/metrics', getMetrics);

// API Routes
app.use('/users', userRoutes);
app.use('/agreements', agreementRoutes);
app.use('/payments', paymentRoutes);
app.use('/hedera', hederaRoutes);

// Error handling
app.use(errorHandler);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SafeLedger API Server',
    version: '1.0.0',
    status: 'running'
  });
});

module.exports = app;
