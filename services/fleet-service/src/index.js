const express = require('express');
const cors = require('cors');
const { Op } = require('sequelize');
require('dotenv').config();

const { sequelize, Machine, Maintenance, Alert } = require('./models');
const errorHandler = require('../../../shared/middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// Fleet Machines Routes
app.get('/api/machines', async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const where = {};

    if (category && category !== 'All') where.category = category;
    if (status && status !== 'All') where.status = status;
    if (search) {
      where[Op.or] = [
        { model: { [Op.like]: `%${search}%` } },
        { serialNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    const machines = await Machine.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.json(machines);
  } catch (err) { next(err); }
});

app.get('/api/machines/:id', async (req, res, next) => {
  try {
    const machine = await Machine.findByPk(req.params.id, {
      include: [
        { model: Maintenance, as: 'maintenances' },
        { model: Alert, as: 'alerts' },
      ],
    });
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    return res.json(machine);
  } catch (err) { next(err); }
});

app.post('/api/machines', async (req, res, next) => {
  try {
    const machine = await Machine.create(req.body);
    return res.status(201).json(machine);
  } catch (err) { next(err); }
});

app.put('/api/machines/:id', async (req, res, next) => {
  try {
    const machine = await Machine.findByPk(req.params.id);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    await machine.update(req.body);
    return res.json(machine);
  } catch (err) { next(err); }
});

app.delete('/api/machines/:id', async (req, res, next) => {
  try {
    const machine = await Machine.findByPk(req.params.id);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    await machine.destroy();
    return res.json({ message: 'Machine asset removed' });
  } catch (err) { next(err); }
});

// Diagnostic Alerts Routes
app.get('/api/alerts', async (req, res, next) => {
  try {
    const alerts = await Alert.findAll({
      include: [{ model: Machine, as: 'machine' }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(alerts);
  } catch (err) { next(err); }
});

app.put('/api/alerts/:id', async (req, res, next) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    await alert.update({ status: req.body.status || 'Acknowledged' });
    return res.json(alert);
  } catch (err) { next(err); }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5003;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('⚡ Fleet Service DB (fleet_db) connected & synced.');

    // Seed Fleet machines if empty
    const count = await Machine.count();
    if (count === 0) {
      console.log('🌱 Seeding Fleet Service machines...');
      const m1 = await Machine.create({
        id: '98a12345-6789-4abc-def0-123456789011',
        serialNumber: 'CAT-336-EXC-901',
        model: 'Cat 336 Hydraulic Excavator',
        category: 'Excavators',
        year: 2024,
        dailyRate: 1450.00,
        hourlyRate: 185.00,
        monthlyRate: 28500.00,
        status: 'Rented',
        engineHours: 412,
        fuelLevel: 78,
        healthScore: 96,
        location: 'Metro Airport Expansion Site #4',
      });

      const m2 = await Machine.create({
        id: '98a12345-6789-4abc-def0-123456789022',
        serialNumber: 'CAT-D6-DOZ-402',
        model: 'Cat D6 XE Electric Drive Dozer',
        category: 'Dozers',
        year: 2024,
        dailyRate: 1650.00,
        hourlyRate: 210.00,
        monthlyRate: 32000.00,
        status: 'Available',
        engineHours: 188,
        fuelLevel: 94,
        healthScore: 99,
        location: 'Indianapolis Main Rental Hub',
      });

      await Alert.create({
        id: '98a12345-6789-4abc-def0-123456789033',
        machineId: m1.id,
        urgency: 'Warning',
        code: 'WRN-FLT-104',
        title: 'Air Filter Restriction Near Limit',
        message: 'Engine air intake differential pressure reaching 82% threshold.',
      });
    }

    app.listen(PORT, () => {
      console.log(`🚀 Fleet Service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Fleet Service DB connection failed:', error);
  }
};

startServer();
