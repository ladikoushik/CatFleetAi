const sequelize = require('../config/database');
const User = require('./User');
const Customer = require('./Customer');
const Dealer = require('./Dealer');
const Branch = require('./Branch');
const Machine = require('./Machine');
const Rental = require('./Rental');
const Maintenance = require('./Maintenance');
const Alert = require('./Alert');
const Notification = require('./Notification');
const Operator = require('./Operator');
const MachineHistory = require('./MachineHistory');

// Dealer <-> Branch
Dealer.hasMany(Branch, { foreignKey: 'dealerId', as: 'branches', onDelete: 'CASCADE' });
Branch.belongsTo(Dealer, { foreignKey: 'dealerId', as: 'dealer' });

// Branch <-> Machine
Branch.hasMany(Machine, { foreignKey: 'branchId', as: 'machines' });
Machine.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// Customer <-> Rental
Customer.hasMany(Rental, { foreignKey: 'customerId', as: 'rentals' });
Rental.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

// Machine <-> Rental
Machine.hasMany(Rental, { foreignKey: 'machineId', as: 'rentals' });
Rental.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

// Branch <-> Rental
Branch.hasMany(Rental, { foreignKey: 'branchId', as: 'rentals' });
Rental.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// Machine <-> Maintenance
Machine.hasMany(Maintenance, { foreignKey: 'machineId', as: 'maintenances', onDelete: 'CASCADE' });
Maintenance.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

// Machine <-> Alert
Machine.hasMany(Alert, { foreignKey: 'machineId', as: 'alerts', onDelete: 'CASCADE' });
Alert.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

// Machine <-> Operator
Machine.hasMany(Operator, { foreignKey: 'machineId', as: 'operators' });
Operator.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

// Machine <-> MachineHistory (Telemetry logs)
Machine.hasMany(MachineHistory, { foreignKey: 'machineId', as: 'historyLogs', onDelete: 'CASCADE' });
MachineHistory.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

// User <-> Notification
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Customer,
  Dealer,
  Branch,
  Machine,
  Rental,
  Maintenance,
  Alert,
  Notification,
  Operator,
  MachineHistory,
};
