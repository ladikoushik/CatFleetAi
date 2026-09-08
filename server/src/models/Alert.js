const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  urgency: {
    type: DataTypes.ENUM('Critical', 'Warning', 'Info'),
    defaultValue: 'Warning',
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. "ERR-ENG-402"
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Open', 'Acknowledged', 'Resolved'),
    defaultValue: 'Open',
  },
}, {
  timestamps: true,
});

module.exports = Alert;
