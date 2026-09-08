const { DataTypes } = require('sequelize');
const { createServiceDb } = require('../../../../shared/config/dbConfig');
const crypto = require('crypto');

const sequelize = createServiceDb('fleet_db');

const Machine = sequelize.define('Machine', {
  id: {
    type: DataTypes.STRING,
    defaultValue: () => crypto.randomUUID(),
    primaryKey: true,
  },
  serialNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  model: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, defaultValue: 2024 },
  dailyRate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  hourlyRate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  monthlyRate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('Available', 'Rented', 'Maintenance', 'Reserved'),
    defaultValue: 'Available',
  },
  engineHours: { type: DataTypes.INTEGER, defaultValue: 0 },
  fuelLevel: { type: DataTypes.INTEGER, defaultValue: 100 },
  healthScore: { type: DataTypes.INTEGER, defaultValue: 100 },
  location: { type: DataTypes.STRING, allowNull: false },
  latitude: { type: DataTypes.FLOAT, allowNull: true },
  longitude: { type: DataTypes.FLOAT, allowNull: true },
  specifications: { type: DataTypes.JSON, allowNull: true },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (m) => { if (!m.id) m.id = crypto.randomUUID(); }
  }
});

const Maintenance = sequelize.define('Maintenance', {
  id: {
    type: DataTypes.STRING,
    defaultValue: () => crypto.randomUUID(),
    primaryKey: true,
  },
  machineId: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  scheduledDate: { type: DataTypes.DATEONLY, allowNull: false },
  completedDate: { type: DataTypes.DATEONLY, allowNull: true },
  status: { type: DataTypes.ENUM('Scheduled', 'In_Progress', 'Completed'), defaultValue: 'Scheduled' },
  cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (m) => { if (!m.id) m.id = crypto.randomUUID(); }
  }
});

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.STRING,
    defaultValue: () => crypto.randomUUID(),
    primaryKey: true,
  },
  machineId: { type: DataTypes.STRING, allowNull: false },
  severity: { type: DataTypes.ENUM('Critical', 'Warning', 'Info'), defaultValue: 'Warning' },
  message: { type: DataTypes.STRING, allowNull: false },
  isResolved: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (m) => { if (!m.id) m.id = crypto.randomUUID(); }
  }
});

Machine.hasMany(Maintenance, { foreignKey: 'machineId', as: 'maintenances' });
Maintenance.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

Machine.hasMany(Alert, { foreignKey: 'machineId', as: 'alerts' });
Alert.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

module.exports = { sequelize, Machine, Maintenance, Alert };
