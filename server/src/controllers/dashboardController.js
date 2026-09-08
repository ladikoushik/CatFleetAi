const { Machine, Rental, Customer, Alert, Maintenance } = require('../models');

// @desc Get main enterprise dashboard analytics & KPIs
// @route GET /api/dashboard
exports.getDashboardMetrics = async (req, res, next) => {
  try {
    const totalMachines = await Machine.count();
    const rentedMachines = await Machine.count({ where: { status: 'Rented' } });
    const availableMachines = await Machine.count({ where: { status: 'Available' } });
    const maintenanceMachines = await Machine.count({ where: { status: 'Maintenance' } });
    const inTransitMachines = await Machine.count({ where: { status: 'In Transit' } });

    const fleetUtilization = totalMachines > 0 
      ? Math.round((rentedMachines / totalMachines) * 100) 
      : 0;

    const activeRentalsCount = await Rental.count({ where: { status: 'Active' } });
    const totalCustomersCount = await Customer.count();

    const rentals = await Rental.findAll();
    const totalRevenue = rentals.reduce((acc, r) => acc + Number(r.totalAmount || 0), 0);

    const recentRentals = await Rental.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Customer, as: 'customer', attributes: ['companyName', 'contactName'] },
        { model: Machine, as: 'machine', attributes: ['model', 'serialNumber', 'category'] },
      ],
    });

    const urgentAlerts = await Alert.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Machine, as: 'machine', attributes: ['model', 'serialNumber'] }],
    });

    // Monthly revenue simulation data for charts
    const monthlyRevenue = [
      { month: 'Jan', revenue: 145000, rentals: 32 },
      { month: 'Feb', revenue: 168000, rentals: 38 },
      { month: 'Mar', revenue: 192000, rentals: 45 },
      { month: 'Apr', revenue: 210000, rentals: 49 },
      { month: 'May', revenue: 245000, rentals: 56 },
      { month: 'Jun', revenue: 280000, rentals: 64 },
    ];

    return res.json({
      kpis: {
        totalMachines,
        rentedMachines,
        availableMachines,
        maintenanceMachines,
        inTransitMachines,
        fleetUtilization,
        activeRentalsCount,
        totalCustomersCount,
        totalRevenue,
      },
      recentRentals,
      urgentAlerts,
      monthlyRevenue,
    });
  } catch (error) {
    next(error);
  }
};
