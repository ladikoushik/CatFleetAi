const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Machine = sequelize.define('Machine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. "Cat 336 Excavator", "Cat D6 Dozer", "Cat 966 Loader"
  },
  category: {
    type: DataTypes.ENUM(
      'Excavators',
      'Dozers',
      'Wheel Loaders',
      'Motor Graders',
      'Articulated Trucks',
      'Generators',
      'Compactors'
    ),
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    defaultValue: 2024,
  },
  dailyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  monthlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Available', 'Rented', 'Maintenance', 'In Transit'),
    defaultValue: 'Available',
  },
  engineHours: {
    type: DataTypes.INTEGER,
    defaultValue: 120,
  },
  fuelLevel: {
    type: DataTypes.INTEGER, // percentage 0-100
    defaultValue: 85,
  },
  healthScore: {
    type: DataTypes.INTEGER, // AI Health score 0-100
    defaultValue: 95,
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: 'Main Yard',
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  specifications: {
    type: DataTypes.JSON, // e.g. { horsepower: 300, operatingWeight: '36,000 kg', bucketCapacity: '2.4 m3' }
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Machine;
