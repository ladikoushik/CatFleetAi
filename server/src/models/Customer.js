const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creditLimit: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 100000.00,
  },
  industry: {
    type: DataTypes.STRING,
    defaultValue: 'Heavy Construction',
  },
  status: {
    type: DataTypes.ENUM('Active', 'Pending', 'Suspended'),
    defaultValue: 'Active',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Customer;
