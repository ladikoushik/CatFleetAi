const { Branch, Dealer, Machine } = require('../models');

// @desc Get all branches
// @route GET /api/branches
exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.findAll({
      include: [
        { model: Dealer, as: 'dealer' },
        { model: Machine, as: 'machines' },
      ],
    });
    return res.json(branches);
  } catch (error) {
    next(error);
  }
};

// @desc Create branch
// @route POST /api/branches
exports.createBranch = async (req, res, next) => {
  try {
    const branch = await Branch.create(req.body);
    return res.status(201).json(branch);
  } catch (error) {
    next(error);
  }
};

// @desc Delete branch
// @route DELETE /api/branches/:id
exports.deleteBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    await branch.destroy();
    return res.json({ message: 'Branch removed successfully' });
  } catch (error) {
    next(error);
  }
};
