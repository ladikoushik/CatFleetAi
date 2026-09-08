const { Dealer, Branch, Machine } = require('../models');

// @desc Get all dealers with associated branches
// @route GET /api/dealers
exports.getDealers = async (req, res, next) => {
  try {
    const dealers = await Dealer.findAll({
      include: [{ model: Branch, as: 'branches', include: [{ model: Machine, as: 'machines' }] }],
      order: [['name', 'ASC']],
    });
    return res.json(dealers);
  } catch (error) {
    next(error);
  }
};

// @desc Get dealer by ID
// @route GET /api/dealers/:id
exports.getDealerById = async (req, res, next) => {
  try {
    const dealer = await Dealer.findByPk(req.params.id, {
      include: [{ model: Branch, as: 'branches', include: [{ model: Machine, as: 'machines' }] }],
    });
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }
    return res.json(dealer);
  } catch (error) {
    next(error);
  }
};

// @desc Create dealer
// @route POST /api/dealers
exports.createDealer = async (req, res, next) => {
  try {
    const dealer = await Dealer.create(req.body);
    return res.status(201).json(dealer);
  } catch (error) {
    next(error);
  }
};

// @desc Update dealer
// @route PUT /api/dealers/:id
exports.updateDealer = async (req, res, next) => {
  try {
    const dealer = await Dealer.findByPk(req.params.id);
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    await dealer.update(req.body);
    return res.json(dealer);
  } catch (error) {
    next(error);
  }
};

// @desc Delete dealer
// @route DELETE /api/dealers/:id
exports.deleteDealer = async (req, res, next) => {
  try {
    const dealer = await Dealer.findByPk(req.params.id);
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    await dealer.destroy();
    return res.json({ message: 'Dealer removed successfully' });
  } catch (error) {
    next(error);
  }
};
