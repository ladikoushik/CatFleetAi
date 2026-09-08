const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Maintenance = sequelize.define('Maintenance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('Preventative', 'Corrective', 'Inspection', 'Emergency'),
    defaultValue: 'Preventative',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  scheduledDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  completionDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  status: {
    type: DataTypes.ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled'),
    defaultValue: 'Scheduled',
  },
  technician: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Maintenance;
