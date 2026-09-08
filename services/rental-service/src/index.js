const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, Rental } = require('./models/Rental');
const errorHandler = require('../../../shared/middleware/errorHandler');
const { serviceCall } = require('../../../shared/utils/httpClient');

const app = express();
app.use(cors());
app.use(express.json());

const FLEET_SERVICE_URL = process.env.FLEET_SERVICE_URL || 'http://localhost:5003';

// Get Rentals
app.get('/api/rentals', async (req, res, next) => {
  try {
    const rentals = await Rental.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(rentals);
  } catch (err) { next(err); }
});

app.get('/api/rentals/:id', async (req, res, next) => {
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental contract not found' });
    return res.json(rental);
  } catch (err) { next(err); }
});

// Create Rental Contract
app.post('/api/rentals', async (req, res, next) => {
  try {
    const count = await Rental.count();
    const contractNumber = `CAT-RNT-${new Date().getFullYear()}-${(count + 1001).toString()}`;

    const rental = await Rental.create({
      contractNumber,
      ...req.body,
      status: 'Active',
    });

    // Inter-service REST call to Fleet Service to mark machine as Rented
    if (req.body.machineId) {
      serviceCall(`${FLEET_SERVICE_URL}/api/machines/${req.body.machineId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Rented' }),
      }).catch((e) => console.log('Fleet status update notified asynchronously'));
    }

    return res.status(201).json(rental);
  } catch (err) { next(err); }
});

// Update Rental Contract Status
app.put('/api/rentals/:id', async (req, res, next) => {
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental contract not found' });

    await rental.update(req.body);

    if ((req.body.status === 'Completed' || req.body.status === 'Cancelled') && rental.machineId) {
      serviceCall(`${FLEET_SERVICE_URL}/api/machines/${rental.machineId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Available' }),
      }).catch((e) => console.log('Fleet status update notified asynchronously'));
    }

    return res.json(rental);
  } catch (err) { next(err); }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5004;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('⚡ Rental Service DB (rental_db) connected & synced.');

    // Seed default rental contracts if empty
    const count = await Rental.count();
    if (count === 0) {
      console.log('🌱 Seeding Rental Service contracts...');
      await Rental.create({
        id: '98a12345-6789-4abc-def0-123456789077',
        contractNumber: 'CAT-RNT-2026-1001',
        customerName: 'Apex Heavy Infrastructure LLC',
        machineModel: 'Cat 336 Hydraulic Excavator',
        startDate: '2026-07-15',
        endDate: '2026-08-15',
        rateType: 'Monthly',
        rateValue: 28500.00,
        totalAmount: 28500.00,
        status: 'Active',
        jobsiteLocation: 'Metro Airport Expansion Site #4',
      });
    }

    app.listen(PORT, () => {
      console.log(`🚀 Rental Service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Rental Service DB connection failed:', error);
  }
};

startServer();
