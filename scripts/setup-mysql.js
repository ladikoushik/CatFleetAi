const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'abcd',
};

const databases = ['auth_db', 'crm_db', 'fleet_db', 'rental_db', 'analytics_db', 'ai_db'];

async function setupMySQL() {
  console.log('⚡ Connecting to local MySQL server at', dbConfig.host, 'user:', dbConfig.user, '...');
  
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log('✅ Connected to MySQL successfully!');

    // 1. Create all 6 microservice database schemas
    for (const db of databases) {
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${db}\`;`);
      console.log(`📁 Database schema '${db}' created or verified.`);
    }

    await connection.end();

    // 2. Initialize Sequelize sync for each microservice DB
    console.log('🔄 Creating tables and seeding data into MySQL...');

    // Auth DB
    const authSequelize = new Sequelize('auth_db', dbConfig.user, dbConfig.password, {
      host: dbConfig.host, port: dbConfig.port, dialect: 'mysql', logging: false,
    });

    const { User } = require('../services/auth-service/src/models/User');
    // Re-bind to MySQL
    User.init(User.rawAttributes, { sequelize: authSequelize, modelName: 'User' });
    await authSequelize.sync({ force: true });
    console.log('✅ MySQL Table created: auth_db.Users');

    const seedUsers = [
      { id: crypto.randomUUID(), name: 'Alex Vance (Admin)', email: 'admin@catfleet.com', password: 'password123', role: 'Admin', companyName: 'Caterpillar HQ' },
      { id: crypto.randomUUID(), name: 'Sarah Connor (Dealer Manager)', email: 'dealer@catfleet.com', password: 'password123', role: 'Dealer_Manager', companyName: 'MacAllister CAT' },
      { id: crypto.randomUUID(), name: 'Marcus Brody (Rental Analyst)', email: 'analyst@catfleet.com', password: 'password123', role: 'Rental_Analyst', companyName: 'CAT Analytics' },
      { id: crypto.randomUUID(), name: 'David Miller (Customer)', email: 'customer@catfleet.com', password: 'password123', role: 'Customer', companyName: 'Apex Heavy Infra LLC' },
    ];
    for (const u of seedUsers) {
      await User.create(u);
    }
    console.log('🌱 Seeded auth_db.Users table in MySQL');

    // CRM DB
    const crmSequelize = new Sequelize('crm_db', dbConfig.user, dbConfig.password, {
      host: dbConfig.host, port: dbConfig.port, dialect: 'mysql', logging: false,
    });
    const { Customer, Dealer, Branch } = require('../services/crm-service/src/models');
    Customer.init(Customer.rawAttributes, { sequelize: crmSequelize, modelName: 'Customer' });
    Dealer.init(Dealer.rawAttributes, { sequelize: crmSequelize, modelName: 'Dealer' });
    Branch.init(Branch.rawAttributes, { sequelize: crmSequelize, modelName: 'Branch' });
    Dealer.hasMany(Branch, { foreignKey: 'dealerId', as: 'branches' });
    Branch.belongsTo(Dealer, { foreignKey: 'dealerId', as: 'dealer' });
    await crmSequelize.sync({ force: true });
    console.log('✅ MySQL Tables created: crm_db.Customers, Dealers, Branches');

    const customer1 = await Customer.create({
      id: crypto.randomUUID(),
      companyName: 'Apex Heavy Infrastructure LLC',
      contactName: 'David Miller',
      email: 'customer@catfleet.com',
      phone: '+1 (708) 555-0144',
      creditLimit: 250000.00,
      city: 'Indianapolis',
    });

    const dealer = await Dealer.create({
      id: crypto.randomUUID(),
      dealerCode: 'CAT-DLR-MW01',
      name: 'MacAllister Machinery CAT',
      region: 'North America - Midwest',
      contactEmail: 'rentals@macallistercat.com',
      phone: '+1 (317) 545-2151',
    });

    await Branch.create({
      id: crypto.randomUUID(),
      branchCode: 'IND-MAIN-01',
      name: 'Indianapolis Main Rental Hub',
      address: '7580 E 30th St',
      city: 'Indianapolis',
      state: 'IN',
      managerName: 'Robert Hayes',
      dealerId: dealer.id,
    });
    console.log('🌱 Seeded crm_db tables in MySQL');

    // Fleet DB
    const fleetSequelize = new Sequelize('fleet_db', dbConfig.user, dbConfig.password, {
      host: dbConfig.host, port: dbConfig.port, dialect: 'mysql', logging: false,
    });
    const { Machine, Maintenance, Alert } = require('../services/fleet-service/src/models');
    Machine.init(Machine.rawAttributes, { sequelize: fleetSequelize, modelName: 'Machine' });
    Maintenance.init(Maintenance.rawAttributes, { sequelize: fleetSequelize, modelName: 'Maintenance' });
    Alert.init(Alert.rawAttributes, { sequelize: fleetSequelize, modelName: 'Alert' });
    Machine.hasMany(Maintenance, { foreignKey: 'machineId', as: 'maintenances' });
    Maintenance.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });
    Machine.hasMany(Alert, { foreignKey: 'machineId', as: 'alerts' });
    Alert.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });
    await fleetSequelize.sync({ force: true });
    console.log('✅ MySQL Tables created: fleet_db.Machines, Maintenances, Alerts');

    const m1 = await Machine.create({
      id: crypto.randomUUID(),
      serialNumber: 'CAT-336-EXC-901',
      model: 'Cat 336 Hydraulic Excavator',
      category: 'Excavators',
      year: 2024,
      dailyRate: 1450.00,
      hourlyRate: 185.00,
      monthlyRate: 28500.00,
      status: 'Rented',
      engineHours: 412,
      fuelLevel: 78,
      healthScore: 96,
      location: 'Metro Airport Expansion Site #4',
    });

    await Machine.create({
      id: crypto.randomUUID(),
      serialNumber: 'CAT-D6-DOZ-402',
      model: 'Cat D6 XE Electric Drive Dozer',
      category: 'Dozers',
      year: 2024,
      dailyRate: 1650.00,
      hourlyRate: 210.00,
      monthlyRate: 32000.00,
      status: 'Available',
      engineHours: 188,
      fuelLevel: 94,
      healthScore: 99,
      location: 'Indianapolis Main Rental Hub',
    });

    await Alert.create({
      id: crypto.randomUUID(),
      machineId: m1.id,
      urgency: 'Warning',
      code: 'WRN-FLT-104',
      title: 'Air Filter Restriction Near Limit',
      message: 'Engine air intake differential pressure reaching 82% threshold.',
    });
    console.log('🌱 Seeded fleet_db tables in MySQL');

    // Rental DB
    const rentalSequelize = new Sequelize('rental_db', dbConfig.user, dbConfig.password, {
      host: dbConfig.host, port: dbConfig.port, dialect: 'mysql', logging: false,
    });
    const { Rental } = require('../services/rental-service/src/models/Rental');
    Rental.init(Rental.rawAttributes, { sequelize: rentalSequelize, modelName: 'Rental' });
    await rentalSequelize.sync({ force: true });
    console.log('✅ MySQL Table created: rental_db.Rentals');

    await Rental.create({
      id: crypto.randomUUID(),
      contractNumber: 'CAT-RNT-2026-1001',
      customerName: 'Apex Heavy Infrastructure LLC',
      machineModel: 'Cat 336 Hydraulic Excavator',
      startDate: '2026-07-15',
      endDate: '2026-08-15',
      rateType: 'Monthly',
      rateValue: 28500.00,
      totalAmount: 28500.00,
      status: 'Active',
      jobsiteLocation: 'Metro Airport Expansion Site #4',
    });
    console.log('🌱 Seeded rental_db tables in MySQL');

    console.log('🎉 ALL DATABASES AND TABLES CREATED IN MYSQL WORKBENCH SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup MySQL Error:', error);
    process.exit(1);
  }
}

setupMySQL();
