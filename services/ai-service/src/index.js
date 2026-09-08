const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createServiceDb } = require('../../../shared/config/dbConfig');
const errorHandler = require('../../../shared/middleware/errorHandler');

const sequelize = createServiceDb('ai_db');

const COHERE_API_KEY = process.env.COHERE_API_KEY || 'ZYTTqzm572yPg2K2Vui7Fl8TF9md6rT41WF0I18z';

const app = express();
app.use(cors());
app.use(express.json());

// 0. Live Cohere AI Copilot API Endpoint
app.post('/api/ai/copilot', async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message field is required' });
    }

    const cohereRes = await fetch('https://api.cohere.com/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        preamble: 'You are CAT FleetBrain AI Copilot, an enterprise AI assistant built for Caterpillar heavy machinery dealers, rental managers, and fleet telematics analysts. Provide concise, professional, and actionable business recommendations with Caterpillar equipment insights.',
      }),
    });

    const data = await cohereRes.json();
    const answer = data.text || 'Unable to process Cohere response.';

    return res.json({
      status: 'success',
      provider: 'Cohere Command LLM API',
      answer,
      meta: data.meta,
    });
  } catch (err) {
    next(err);
  }
});

// 1. Demand Forecast API Endpoint
app.post('/api/ai/forecast', (req, res) => {
  const { region, category, monthCount = 3 } = req.body;
  res.json({
    status: 'success',
    model: 'CAT-DemandForecaster-v2.1',
    region: region || 'North America - Midwest',
    category: category || 'Excavators',
    forecast: [
      { month: 'Sep 2026', predictedDemandUnits: 48, confidenceScore: 0.94 },
      { month: 'Oct 2026', predictedDemandUnits: 55, confidenceScore: 0.91 },
      { month: 'Nov 2026', predictedDemandUnits: 62, confidenceScore: 0.88 },
    ],
  });
});

// 2. Return Date Prediction Endpoint
app.post('/api/ai/return-prediction', (req, res) => {
  const { contractNumber, currentHourMeter } = req.body;
  res.json({
    status: 'success',
    model: 'CAT-ReturnPredictor-v1.4',
    contractNumber: contractNumber || 'CAT-RNT-2026-1001',
    estimatedDelayDays: 2,
    predictedReturnDate: '2026-08-17',
    probabilityOnTime: 0.84,
  });
});

// 3. Predictive Maintenance Endpoint
app.get('/api/ai/predictive-maintenance', (req, res) => {
  res.json({
    status: 'success',
    model: 'CAT-PredictiveMaint-v3.0',
    evaluations: [
      {
        serialNumber: 'CAT-336-EXC-901',
        healthScore: 96,
        failureProbability30Days: 0.04,
        componentRisk: 'Hydraulic Cylinder Seal (Low Risk)',
        recommendedAction: 'Inspect at 500-hr standard maintenance window',
      },
      {
        serialNumber: 'CAT-14M-GRD-505',
        healthScore: 74,
        failureProbability30Days: 0.38,
        componentRisk: 'Moldboard Cylinder Pressure Valve (Moderate Risk)',
        recommendedAction: 'Schedule technician dispatch within 48 hours',
      },
    ],
  });
});

// 4. Anomaly Detection Endpoint
app.get('/api/ai/anomalies', (req, res) => {
  res.json({
    status: 'success',
    model: 'CAT-TelemetryAnomalyDetector-v1.0',
    detectedAnomalies: [
      {
        serialNumber: 'CAT-14M-GRD-505',
        anomalyType: 'Pressure Drop Deviation',
        severity: 'Warning',
        sensor: 'Moldboard Hydraulic PSI',
        confidence: 0.92,
        timestamp: new Date(),
      },
    ],
  });
});

// 5. Machine Recommendation Engine Endpoint
app.post('/api/ai/recommendations', (req, res) => {
  const { projectType, terrain, payloadRequiredTons } = req.body;
  res.json({
    status: 'success',
    model: 'CAT-FleetRecommender-v2.0',
    recommendedFleet: [
      { model: 'Cat 336 Hydraulic Excavator', matchScore: '98%', reason: 'Optimal dig depth & earthmoving efficiency' },
      { model: 'Cat 745 Articulated Dump Truck', matchScore: '94%', reason: 'Handles 41-tonne payload across muddy terrain' },
    ],
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5006;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('⚡ AI Service DB (ai_db) connected & synced.');

    app.listen(PORT, () => {
      console.log(`🚀 AI Service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start AI Service:', error.message);
  }
};

startServer();
