const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Operator = sequelize.define('Operator', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  certificationLevel: {
    type: DataTypes.STRING, // e.g. "Cat Master Certified", "Level 2 Heavy Equipment"
    defaultValue: 'Heavy Machinery Certified',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'On Leave', 'In Training'),
    defaultValue: 'Active',
  },
}, {
  timestamps: true,
});

module.exports = Operator;
