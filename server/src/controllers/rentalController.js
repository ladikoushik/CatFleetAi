const { Rental, Customer, Machine, Branch } = require('../models');

// @desc Get all rentals
// @route GET /api/rentals
exports.getRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.findAll({
      include: [
        { model: Customer, as: 'customer' },
        { model: Machine, as: 'machine' },
        { model: Branch, as: 'branch' },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json(rentals);
  } catch (error) {
    next(error);
  }
};

// @desc Get single rental by ID
// @route GET /api/rentals/:id
exports.getRentalById = async (req, res, next) => {
  try {
    const rental = await Rental.findByPk(req.params.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Machine, as: 'machine' },
        { model: Branch, as: 'branch' },
      ],
    });

    if (!rental) {
      return res.status(404).json({ message: 'Rental contract not found' });
    }
    return res.json(rental);
  } catch (error) {
    next(error);
  }
};

// @desc Create new rental agreement
// @route POST /api/rentals
exports.createRental = async (req, res, next) => {
  try {
    const { customerId, machineId, branchId, startDate, endDate, rateType, rateValue, totalAmount, jobsiteLocation, notes } = req.body;
    
    // Auto-generate contract number
    const count = await Rental.count();
    const contractNumber = `CAT-RNT-${new Date().getFullYear()}-${(count + 1001).toString()}`;

    const rental = await Rental.create({
      contractNumber,
      customerId,
      machineId,
      branchId,
      startDate,
      endDate,
      rateType,
      rateValue,
      totalAmount,
      status: 'Active',
      jobsiteLocation,
      notes,
    });

    // Update machine status to Rented
    if (machineId) {
      const machine = await Machine.findByPk(machineId);
      if (machine) {
        await machine.update({ status: 'Rented' });
      }
    }

    return res.status(201).json(rental);
  } catch (error) {
    next(error);
  }
};

// @desc Update rental status
// @route PUT /api/rentals/:id
exports.updateRental = async (req, res, next) => {
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental contract not found' });
    }

    await rental.update(req.body);

    // If completed or cancelled, set machine back to Available
    if ((req.body.status === 'Completed' || req.body.status === 'Cancelled') && rental.machineId) {
      const machine = await Machine.findByPk(rental.machineId);
      if (machine) {
        await machine.update({ status: 'Available' });
      }
    }

    return res.json(rental);
  } catch (error) {
    next(error);
  }
};

// @desc Delete rental
// @route DELETE /api/rentals/:id
exports.deleteRental = async (req, res, next) => {
  try {
    const rental = await Rental.findByPk(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental contract not found' });
    }

    await rental.destroy();
    return res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    next(error);
  }
};
