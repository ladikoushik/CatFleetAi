const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rental = sequelize.define('Rental', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  contractNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  rateType: {
    type: DataTypes.ENUM('Hourly', 'Daily', 'Monthly'),
    defaultValue: 'Daily',
  },
  rateValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Active', 'Completed', 'Cancelled'),
    defaultValue: 'Active',
  },
  jobsiteLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Rental;
