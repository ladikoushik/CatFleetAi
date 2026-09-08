const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'API Gateway', dir: 'services/api-gateway', port: 5000 },
  { name: 'Auth Service', dir: 'services/auth-service', port: 5001 },
  { name: 'CRM Service', dir: 'services/crm-service', port: 5002 },
  { name: 'Fleet Service', dir: 'services/fleet-service', port: 5003 },
  { name: 'Rental Service', dir: 'services/rental-service', port: 5004 },
  { name: 'Analytics Service', dir: 'services/analytics-service', port: 5005 },
  { name: 'AI Service', dir: 'services/ai-service', port: 5006 },
];

console.log('🚀 Starting All 7 CAT FleetBrain Microservices...');

const children = [];

services.forEach((svc) => {
  const servicePath = path.resolve(__dirname, '..', svc.dir);
  console.log(`[Manager] Launching ${svc.name} on port ${svc.port}...`);

  const child = spawn('node', ['src/index.js'], {
    cwd: servicePath,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, PORT: svc.port },
  });

  child.stdout.on('data', (data) => {
    console.log(`[${svc.name}] ${data.toString().trim()}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`[${svc.name} ERR] ${data.toString().trim()}`);
  });

  child.on('close', (code) => {
    console.log(`[${svc.name}] process exited with code ${code}`);
  });

  children.push(child);
});

process.on('SIGINT', () => {
  console.log('\nStopping all microservice processes...');
  children.forEach((c) => c.kill());
  process.exit();
});
