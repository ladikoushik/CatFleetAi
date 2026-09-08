const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, Customer, Dealer, Branch } = require('./models');
const errorHandler = require('../../../shared/middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// Customers Routes
app.get('/api/customers', async (req, res, next) => {
  try {
    const customers = await Customer.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(customers);
  } catch (err) { next(err); }
});

app.post('/api/customers', async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    return res.status(201).json(customer);
  } catch (err) { next(err); }
});

// Dealers Routes
app.get('/api/dealers', async (req, res, next) => {
  try {
    const dealers = await Dealer.findAll({
      include: [{ model: Branch, as: 'branches' }],
      order: [['name', 'ASC']],
    });
    return res.json(dealers);
  } catch (err) { next(err); }
});

app.post('/api/dealers', async (req, res, next) => {
  try {
    const dealer = await Dealer.create(req.body);
    return res.status(201).json(dealer);
  } catch (err) { next(err); }
});

// Branches Routes
app.get('/api/branches', async (req, res, next) => {
  try {
    const branches = await Branch.findAll({ include: [{ model: Dealer, as: 'dealer' }] });
    return res.json(branches);
  } catch (err) { next(err); }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('⚡ CRM Service DB (crm_db) connected & synced.');

    // Seed CRM data if empty
    const count = await Customer.count();
    if (count === 0) {
      console.log('🌱 Seeding CRM Service data...');
      const customer1 = await Customer.create({
        id: '98a12345-6789-4abc-def0-123456789044',
        companyName: 'Apex Heavy Infrastructure LLC',
        contactName: 'David Miller',
        email: 'customer@catfleet.com',
        phone: '+1 (708) 555-0144',
        creditLimit: 250000.00,
        city: 'Indianapolis',
      });

      const dealer = await Dealer.create({
        id: '98a12345-6789-4abc-def0-123456789055',
        dealerCode: 'CAT-DLR-MW01',
        name: 'MacAllister Machinery CAT',
        region: 'North America - Midwest',
        contactEmail: 'rentals@macallistercat.com',
        phone: '+1 (317) 545-2151',
      });

      await Branch.create({
        id: '98a12345-6789-4abc-def0-123456789066',
        branchCode: 'IND-MAIN-01',
        name: 'Indianapolis Main Rental Hub',
        address: '7580 E 30th St',
        city: 'Indianapolis',
        state: 'IN',
        managerName: 'Robert Hayes',
        dealerId: dealer.id,
      });
    }

    app.listen(PORT, () => {
      console.log(`🚀 CRM Service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ CRM Service DB connection failed:', error);
  }
};

startServer();
