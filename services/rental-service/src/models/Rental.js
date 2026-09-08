const { DataTypes } = require('sequelize');
const { createServiceDb } = require('../../../../shared/config/dbConfig');
const crypto = require('crypto');

const sequelize = createServiceDb('rental_db');

const Rental = sequelize.define('Rental', {
  id: { type: DataTypes.STRING, defaultValue: () => crypto.randomUUID(), primaryKey: true },
  contractNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  customerId: { type: DataTypes.STRING, allowNull: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  machineId: { type: DataTypes.STRING, allowNull: true },
  machineModel: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY, allowNull: false },
  rateType: { type: DataTypes.ENUM('Daily', 'Hourly', 'Monthly'), defaultValue: 'Daily' },
  rateValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('Pending', 'Active', 'Completed', 'Cancelled'), defaultValue: 'Pending' },
  jobsiteLocation: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true, hooks: { beforeCreate: (r) => { if (!r.id) r.id = crypto.randomUUID(); } } });

module.exports = { sequelize, Rental };
