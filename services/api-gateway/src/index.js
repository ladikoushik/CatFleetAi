const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Target Microservices URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
const CRM_SERVICE = process.env.CRM_SERVICE_URL || 'http://localhost:5002';
const FLEET_SERVICE = process.env.FLEET_SERVICE_URL || 'http://localhost:5003';
const RENTAL_SERVICE = process.env.RENTAL_SERVICE_URL || 'http://localhost:5004';
const ANALYTICS_SERVICE = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:5005';
const AI_SERVICE = process.env.AI_SERVICE_URL || 'http://localhost:5006';

console.log('⚡ API Gateway Proxy Map Configured:');
console.log(` -> /api/auth      => ${AUTH_SERVICE}`);
console.log(` -> /api/customers => ${CRM_SERVICE}`);
console.log(` -> /api/dealers   => ${CRM_SERVICE}`);
console.log(` -> /api/branches  => ${CRM_SERVICE}`);
console.log(` -> /api/machines  => ${FLEET_SERVICE}`);
console.log(` -> /api/alerts    => ${FLEET_SERVICE}`);
console.log(` -> /api/rentals   => ${RENTAL_SERVICE}`);
console.log(` -> /api/dashboard => ${ANALYTICS_SERVICE}`);
console.log(` -> /api/ai        => ${AI_SERVICE}`);

// Proxy Route Definitions using pathFilter to preserve full /api/* URL paths
app.use(
  createProxyMiddleware({
    pathFilter: '/api/auth',
    target: AUTH_SERVICE,
    changeOrigin: true,
  })
);

app.use(
  createProxyMiddleware({
    pathFilter: ['/api/customers', '/api/dealers', '/api/branches'],
    target: CRM_SERVICE,
    changeOrigin: true,
  })
);

app.use(
  createProxyMiddleware({
    pathFilter: ['/api/machines', '/api/alerts'],
    target: FLEET_SERVICE,
    changeOrigin: true,
  })
);

app.use(
  createProxyMiddleware({
    pathFilter: '/api/rentals',
    target: RENTAL_SERVICE,
    changeOrigin: true,
  })
);

app.use(
  createProxyMiddleware({
    pathFilter: '/api/dashboard',
    target: ANALYTICS_SERVICE,
    changeOrigin: true,
  })
);

app.use(
  createProxyMiddleware({
    pathFilter: '/api/ai',
    target: AI_SERVICE,
    changeOrigin: true,
  })
);

// Gateway Health Status Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'CAT FleetBrain AI Enterprise API Gateway',
    version: '2.0.0-microservices',
    architecture: 'Database-per-Service Microservices',
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CAT API Gateway listening on port ${PORT}`);
});
