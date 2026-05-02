const express = require('express');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const agreementRoutes = require('./routes/agreementRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const hederaRoutes = require('./routes/hederaRoutes');

// Import Swagger documentation
const { specs, swaggerUi } = require('./config/swagger');

// Import performance monitoring
const { performanceMonitor, getMetrics, healthCheck } = require('./middlewares/performanceMonitor');

const helmet = require('helmet');
const morgan = require('morgan');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(performanceMonitor);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SafeLedger API Documentation'
}));

// Health check with performance data
app.get('/health', healthCheck);

// Performance metrics endpoint
app.get('/metrics', getMetrics);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/hedera', hederaRoutes);

// API Documentation redirect
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Error handling
app.use(errorHandler);

module.exports = app;