const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const { User, sequelize } = require('./models/User');
const errorHandler = require('../../../shared/middleware/errorHandler');
const { protect } = require('../../../shared/middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, companyName: user.companyName },
    process.env.JWT_SECRET || 'cat_fleetbrain_super_secret_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Login Route
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ where: { email } });
    if (user && (await user.validPassword(password))) {
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        token: generateToken(user),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    next(error);
  }
});

// Register Route
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email address already exists' });
    }

    const newUser = await User.create({
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: role || 'Customer',
      companyName: companyName || '',
      phone: phone || '',
    });

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      companyName: newUser.companyName,
      token: generateToken(newUser),
    });
  } catch (error) {
    console.error('Registration Error:', error);
    next(error);
  }
});

// Get Profile
app.get('/api/auth/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('⚡ Auth Service DB (auth_db) connected & synced.');

    // Seed default users if empty
    const count = await User.count();
    if (count === 0) {
      console.log('🌱 Seeding Auth Service users...');
      const seedUsers = [
        { id: crypto.randomUUID(), name: 'Alex Vance (Admin)', email: 'admin@catfleet.com', password: 'password123', role: 'Admin', companyName: 'Caterpillar HQ' },
        { id: crypto.randomUUID(), name: 'Sarah Connor (Dealer Manager)', email: 'dealer@catfleet.com', password: 'password123', role: 'Dealer_Manager', companyName: 'MacAllister CAT' },
        { id: crypto.randomUUID(), name: 'Marcus Brody (Rental Analyst)', email: 'analyst@catfleet.com', password: 'password123', role: 'Rental_Analyst', companyName: 'CAT Analytics' },
        { id: crypto.randomUUID(), name: 'David Miller (Customer)', email: 'customer@catfleet.com', password: 'password123', role: 'Customer', companyName: 'Apex Heavy Infra LLC' },
      ];
      for (const u of seedUsers) {
        await User.create(u);
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 Auth Service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Auth Service DB connection failed:', error);
  }
};

startServer();
