const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const userRoutes = require('./routes/userRoutes');
const agreementRoutes = require('./routes/agreementRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const hederaRoutes = require('./routes/hederaRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/hedera', hederaRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Error handling
app.use(errorHandler);

module.exports = app;