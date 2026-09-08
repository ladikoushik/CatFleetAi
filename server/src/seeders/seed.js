const { sequelize, User, Customer, Dealer, Branch, Machine, Rental, Maintenance, Alert, Operator, MachineHistory } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🔄 Syncing Database and wiping existing records...');
    await sequelize.sync({ force: true });

    console.log('👥 Creating Users with Role-Based Access...');
    const users = await User.bulkCreate([
      {
        name: 'Alex Vance (Admin)',
        email: 'admin@catfleet.com',
        password: 'password123',
        role: 'Admin',
        phone: '+1 (800) 228-4680',
        companyName: 'Caterpillar Corporate Fleet HQ',
      },
      {
        name: 'Sarah Connor (Dealer Manager)',
        email: 'dealer@catfleet.com',
        password: 'password123',
        role: 'Dealer_Manager',
        phone: '+1 (312) 555-0199',
        companyName: 'MacAllister Machinery - Midwest',
      },
      {
        name: 'Marcus Brody (Rental Analyst)',
        email: 'analyst@catfleet.com',
        password: 'password123',
        role: 'Rental_Analyst',
        phone: '+1 (415) 555-0182',
        companyName: 'CAT Fleet Analytics Operations',
      },
      {
        name: 'David Miller (Customer)',
        email: 'customer@catfleet.com',
        password: 'password123',
        role: 'Customer',
        phone: '+1 (708) 555-0144',
        companyName: 'Apex Heavy Infra LLC',
      },
    ], { individualHooks: true });

    console.log('🏢 Creating Caterpillar Dealers and Branches...');
    const dealer1 = await Dealer.create({
      dealerCode: 'CAT-DLR-MW01',
      name: 'MacAllister Machinery CAT',
      region: 'North America - Midwest',
      contactEmail: 'rentals@macallistercat.com',
      phone: '+1 (317) 545-2151',
    });

    const dealer2 = await Dealer.create({
      dealerCode: 'CAT-DLR-TX02',
      name: 'HOLT CAT Texas',
      region: 'North America - South',
      contactEmail: 'support@holtcat.com',
      phone: '+1 (210) 648-1111',
    });

    const branch1 = await Branch.create({
      branchCode: 'IND-MAIN-01',
      name: 'Indianapolis Main Rental Hub',
      address: '7580 E 30th St',
      city: 'Indianapolis',
      state: 'IN',
      phone: '+1 (317) 545-2151',
      managerName: 'Robert Hayes',
      dealerId: dealer1.id,
    });

    const branch2 = await Branch.create({
      branchCode: 'SAT-HUB-02',
      name: 'San Antonio Central Yard',
      address: '3302 South W.W. White Rd',
      city: 'San Antonio',
      state: 'TX',
      phone: '+1 (210) 648-1111',
      managerName: 'Elena Rostova',
      dealerId: dealer2.id,
    });

    console.log('🚜 Creating Caterpillar Machines Fleet...');
    const machines = await Machine.bulkCreate([
      {
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
        latitude: 39.717,
        longitude: -86.294,
        branchId: branch1.id,
        specifications: { horsepower: '302 HP', operatingWeight: '37,200 kg', maxDigDepth: '8.2 m' },
      },
      {
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
        latitude: 39.768,
        longitude: -86.158,
        branchId: branch1.id,
        specifications: { horsepower: '215 HP', bladeCapacity: '5.7 m3', operatingWeight: '22,900 kg' },
      },
      {
        serialNumber: 'CAT-966-LDR-108',
        model: 'Cat 966 Wheel Loader',
        category: 'Wheel Loaders',
        year: 2023,
        dailyRate: 1250.00,
        hourlyRate: 160.00,
        monthlyRate: 24000.00,
        status: 'Rented',
        engineHours: 890,
        fuelLevel: 62,
        healthScore: 88,
        location: 'I-69 Highway Expansion Mile 42',
        latitude: 40.050,
        longitude: -85.670,
        branchId: branch1.id,
        specifications: { horsepower: '321 HP', bucketCapacity: '4.2 m3', operatingWeight: '23,200 kg' },
      },
      {
        serialNumber: 'CAT-14M-GRD-505',
        model: 'Cat 14M Motor Grader',
        category: 'Motor Graders',
        year: 2023,
        dailyRate: 1350.00,
        hourlyRate: 175.00,
        monthlyRate: 26000.00,
        status: 'Maintenance',
        engineHours: 1420,
        fuelLevel: 45,
        healthScore: 74,
        location: 'San Antonio Central Yard Workshop',
        latitude: 29.424,
        longitude: -98.493,
        branchId: branch2.id,
        specifications: { horsepower: '238 HP', moldboardWidth: '4.3 m', operatingWeight: '21,300 kg' },
      },
      {
        serialNumber: 'CAT-745-TRK-882',
        model: 'Cat 745 Articulated Dump Truck',
        category: 'Articulated Trucks',
        year: 2024,
        dailyRate: 1800.00,
        hourlyRate: 230.00,
        monthlyRate: 35000.00,
        status: 'Available',
        engineHours: 95,
        fuelLevel: 100,
        healthScore: 100,
        location: 'San Antonio Central Yard',
        latitude: 29.424,
        longitude: -98.493,
        branchId: branch2.id,
        specifications: { payload: '41 Tonnes', engineModel: 'Cat C18 ACERT', power: '504 HP' },
      },
      {
        serialNumber: 'CAT-XQ2000-GEN-301',
        model: 'Cat XQ2000 Mobile Power Module Generator',
        category: 'Generators',
        year: 2023,
        dailyRate: 950.00,
        hourlyRate: 120.00,
        monthlyRate: 18500.00,
        status: 'Available',
        engineHours: 560,
        fuelLevel: 90,
        healthScore: 94,
        location: 'Indianapolis Main Rental Hub',
        latitude: 39.768,
        longitude: -86.158,
        branchId: branch1.id,
        specifications: { rating: '2000 kVA', voltage: '480V', fuelCapacity: '4731 L' },
      },
    ]);

    console.log('🏗️ Creating Customers...');
    const customer1 = await Customer.create({
      companyName: 'Apex Heavy Infrastructure LLC',
      contactName: 'David Miller',
      email: 'customer@catfleet.com',
      phone: '+1 (708) 555-0144',
      creditLimit: 250000.00,
      industry: 'Highway & Bridge Civil Works',
      address: '1200 Industrial Parkway',
      city: 'Indianapolis',
    });

    const customer2 = await Customer.create({
      companyName: 'Vanguard Mining & Energy Group',
      contactName: 'Samantha Vance',
      email: 's.vance@vanguardmining.com',
      phone: '+1 (713) 555-8822',
      creditLimit: 500000.00,
      industry: 'Quarry & Earthmoving Solutions',
      address: '880 Energy Tower Way',
      city: 'Houston',
    });

    console.log('📄 Creating Active Rental Contracts...');
    await Rental.create({
      contractNumber: 'CAT-RNT-2026-1001',
      customerId: customer1.id,
      machineId: machines[0].id, // Cat 336 Excavator
      branchId: branch1.id,
      startDate: '2026-07-15',
      endDate: '2026-08-15',
      rateType: 'Monthly',
      rateValue: 28500.00,
      totalAmount: 28500.00,
      status: 'Active',
      jobsiteLocation: 'Metro Airport Expansion Site #4, Indianapolis IN',
      notes: 'Includes Cat Grade 3D Assistance package and telemetry stream.',
    });

    await Rental.create({
      contractNumber: 'CAT-RNT-2026-1002',
      customerId: customer2.id,
      machineId: machines[2].id, // Cat 966 Loader
      branchId: branch1.id,
      startDate: '2026-07-20',
      endDate: '2026-08-20',
      rateType: 'Daily',
      rateValue: 1250.00,
      totalAmount: 38750.00,
      status: 'Active',
      jobsiteLocation: 'I-69 Highway Expansion Mile 42',
      notes: 'Customer requested 24/7 priority field technician support.',
    });

    console.log('⚠️ Creating Diagnostic Alerts & Maintenance Logs...');
    await Alert.create({
      machineId: machines[3].id, // Motor Grader
      urgency: 'Critical',
      code: 'ERR-HYD-502',
      title: 'Hydraulic Pressure Drop Detected',
      message: 'Telemetry detected a 18% hydraulic line pressure loss in Moldboard Cylinder #2.',
      status: 'Open',
    });

    await Alert.create({
      machineId: machines[0].id, // Excavator
      urgency: 'Warning',
      code: 'WRN-FLT-104',
      title: 'Air Filter Restriction Threshold Near Limit',
      message: 'Engine air intake filter differential pressure reaching 82% threshold.',
      status: 'Open',
    });

    await Maintenance.create({
      machineId: machines[3].id,
      type: 'Corrective',
      title: 'Replace Hydraulic Moldboard Seal & Flush Fluid',
      description: 'Scheduled technician dispatch to inspect cylinder O-rings and pressure valves.',
      scheduledDate: '2026-08-06',
      cost: 1420.00,
      status: 'In Progress',
      technician: 'Marcus Vance (Cat Certified Level 3)',
    });

    console.log('📊 Seeding Telemetry History Logs...');
    await MachineHistory.create({
      machineId: machines[0].id,
      engineTemp: 89,
      fuelLevel: 78,
      hourMeter: 412,
      latitude: 39.717,
      longitude: -86.294,
      hydraulicPressure: 4150,
    });

    console.log('✅ CAT FleetBrain AI Seed Data populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
