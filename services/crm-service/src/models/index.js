const { DataTypes } = require('sequelize');
const { createServiceDb } = require('../../../../shared/config/dbConfig');
const crypto = require('crypto');

const sequelize = createServiceDb('crm_db');

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.STRING, defaultValue: () => crypto.randomUUID(), primaryKey: true },
  companyName: { type: DataTypes.STRING, allowNull: false },
  contactName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false },
  creditLimit: { type: DataTypes.DECIMAL(12, 2), defaultValue: 100000.00 },
  city: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('Active', 'Pending', 'Suspended'), defaultValue: 'Active' },
}, { timestamps: true, hooks: { beforeCreate: (c) => { if (!c.id) c.id = crypto.randomUUID(); } } });

const Dealer = sequelize.define('Dealer', {
  id: { type: DataTypes.STRING, defaultValue: () => crypto.randomUUID(), primaryKey: true },
  dealerCode: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  region: { type: DataTypes.STRING, allowNull: false },
  contactEmail: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true, hooks: { beforeCreate: (d) => { if (!d.id) d.id = crypto.randomUUID(); } } });

const Branch = sequelize.define('Branch', {
  id: { type: DataTypes.STRING, defaultValue: () => crypto.randomUUID(), primaryKey: true },
  branchCode: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  managerName: { type: DataTypes.STRING, allowNull: false },
  dealerId: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true, hooks: { beforeCreate: (b) => { if (!b.id) b.id = crypto.randomUUID(); } } });

Dealer.hasMany(Branch, { foreignKey: 'dealerId', as: 'branches' });
Branch.belongsTo(Dealer, { foreignKey: 'dealerId', as: 'dealer' });

module.exports = { sequelize, Customer, Dealer, Branch };
