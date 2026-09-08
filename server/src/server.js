const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, User } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// API Base Routes
app.use('/api', routes);

// System Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'CAT FleetBrain AI Enterprise API',
    version: '1.0.0',
    timestamp: new Date(),
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('⚡ Connected to Database via Sequelize ORM successfully.');
    
    // Sync models
    await sequelize.sync({ alter: false });

    // Check if initial users exist, auto-seed if database is empty
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('🌱 Empty database detected! Running initial seeder...');
      const seedDatabase = require('./seeders/seed');
    }

    app.listen(PORT, () => {
      console.log(`🚀 CAT FleetBrain AI Backend Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();
