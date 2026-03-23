const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Handle JSON parsing errors specifically
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON format. Please check your input.';
  } else if (err.message.includes('Unexpected token')) {
    status = 400;
    message = 'Invalid data format. Please check your phone number format.';
  }

  // Handle specific error cases
  if (err.message === 'User with this phone number already exists') {
    status = 409; // Conflict
  } else if (err.message === 'Invalid phone number or password') {
    status = 401; // Unauthorized
  } else if (err.message === 'User not found') {
    status = 404; // Not Found
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;