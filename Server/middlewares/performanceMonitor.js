const logger = require('../utils/logger');

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  const startHrTime = process.hrtime.bigint();

  // Capture original res.end
  const originalEnd = res.end;
  
  res.end = function (chunk, encoding) {
    // Calculate response time
    const endTime = Date.now();
    const endHrTime = process.hrtime.bigint();
    const responseTime = endTime - startTime;
    const preciseTime = Number(endHrTime - startHrTime) / 1000000; // Convert to milliseconds

    // Log performance metrics
    const performanceData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: Math.round(preciseTime * 100) / 100, // Round to 2 decimal places
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString(),
      contentLength: res.get('Content-Length') || 0
    };

    // Log slow requests (> 1 second)
    if (responseTime > 1000) {
      logger.warn('Slow request detected', performanceData);
    } else {
      logger.info('Request completed', performanceData);
    }

    // Store metrics for monitoring
    if (!global.performanceMetrics) {
      global.performanceMetrics = {
        totalRequests: 0,
        averageResponseTime: 0,
        slowRequests: 0,
        errorRequests: 0,
        requestsPerMinute: 0,
        lastMinuteRequests: 0
      };
    }

    const metrics = global.performanceMetrics;
    metrics.totalRequests++;
    
    // Update average response time
    metrics.averageResponseTime = 
      (metrics.averageResponseTime * (metrics.totalRequests - 1) + responseTime) / metrics.totalRequests;

    // Count slow requests
    if (responseTime > 1000) {
      metrics.slowRequests++;
    }

    // Count error requests
    if (res.statusCode >= 400) {
      metrics.errorRequests++;
    }

    // Call original end
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Metrics endpoint
const getMetrics = (req, res) => {
  const metrics = global.performanceMetrics || {
    totalRequests: 0,
    averageResponseTime: 0,
    slowRequests: 0,
    errorRequests: 0,
    requestsPerMinute: 0,
    lastMinuteRequests: 0
  };

  // Add system metrics
  const systemMetrics = {
    ...metrics,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    timestamp: new Date().toISOString()
  };

  res.json(systemMetrics);
};

// Health check with performance data
const healthCheck = (req, res) => {
  const metrics = global.performanceMetrics || {};
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  // Determine health status
  const isHealthy = 
    (metrics.errorRequests || 0) / (metrics.totalRequests || 1) < 0.1 && // Error rate < 10%
    (metrics.averageResponseTime || 0) < 2000 && // Average response time < 2 seconds
    memoryUsage.heapUsed < memoryUsage.heapTotal * 0.9; // Memory usage < 90%

  const healthData = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100) + '%'
    },
    performance: {
      totalRequests: metrics.totalRequests || 0,
      averageResponseTime: Math.round(metrics.averageResponseTime || 0) + ' ms',
      slowRequests: metrics.slowRequests || 0,
      errorRequests: metrics.errorRequests || 0,
      errorRate: metrics.totalRequests ? 
        Math.round((metrics.errorRequests / metrics.totalRequests) * 100) + '%' : '0%'
    }
  };

  res.status(isHealthy ? 200 : 503).json(healthData);
};

module.exports = {
  performanceMonitor,
  getMetrics,
  healthCheck
};
