const { Customer, Rental } = require('../models');

// @desc Get all customers
// @route GET /api/customers
exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
      include: [{ model: Rental, as: 'rentals' }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(customers);
  } catch (error) {
    next(error);
  }
};

// @desc Get customer by ID
// @route GET /api/customers/:id
exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{ model: Rental, as: 'rentals' }],
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    return res.json(customer);
  } catch (error) {
    next(error);
  }
};

// @desc Create customer
// @route POST /api/customers
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    return res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

// @desc Update customer
// @route PUT /api/customers/:id
exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.update(req.body);
    return res.json(customer);
  } catch (error) {
    next(error);
  }
};

// @desc Delete customer
// @route DELETE /api/customers/:id
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.destroy();
    return res.json({ message: 'Customer removed successfully' });
  } catch (error) {
    next(error);
  }
};
