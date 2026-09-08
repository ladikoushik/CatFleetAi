const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MachineHistory = sequelize.define('MachineHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  engineTemp: {
    type: DataTypes.INTEGER, // Celsius
    defaultValue: 88,
  },
  fuelLevel: {
    type: DataTypes.INTEGER, // percentage
    defaultValue: 80,
  },
  hourMeter: {
    type: DataTypes.INTEGER,
    defaultValue: 150,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  hydraulicPressure: {
    type: DataTypes.INTEGER, // PSI
    defaultValue: 4200,
  },
}, {
  timestamps: true,
});

module.exports = MachineHistory;
