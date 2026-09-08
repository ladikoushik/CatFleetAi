const { Machine, Branch, Dealer, Maintenance, Alert, MachineHistory } = require('../models');
const { Op } = require('sequelize');

// @desc Get all machines with optional search, status, and category filter
// @route GET /api/machines
exports.getMachines = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const where = {};

    if (category && category !== 'All') {
      where.category = category;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { model: { [Op.like]: `%${search}%` } },
        { serialNumber: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
      ];
    }

    const machines = await Machine.findAll({
      where,
      include: [
        { model: Branch, as: 'branch', include: [{ model: Dealer, as: 'dealer' }] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json(machines);
  } catch (error) {
    next(error);
  }
};

// @desc Get single machine details with maintenance, telemetry logs, and alerts
// @route GET /api/machines/:id
exports.getMachineById = async (req, res, next) => {
  try {
    const machine = await Machine.findByPk(req.params.id, {
      include: [
        { model: Branch, as: 'branch', include: [{ model: Dealer, as: 'dealer' }] },
        { model: Maintenance, as: 'maintenances' },
        { model: Alert, as: 'alerts' },
        { model: MachineHistory, as: 'historyLogs', limit: 10, order: [['createdAt', 'DESC']] },
      ],
    });

    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }

    return res.json(machine);
  } catch (error) {
    next(error);
  }
};

// @desc Create a new machine
// @route POST /api/machines
exports.createMachine = async (req, res, next) => {
  try {
    const machine = await Machine.create(req.body);
    return res.status(201).json(machine);
  } catch (error) {
    next(error);
  }
};

// @desc Update a machine
// @route PUT /api/machines/:id
exports.updateMachine = async (req, res, next) => {
  try {
    const machine = await Machine.findByPk(req.params.id);
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }

    await machine.update(req.body);
    return res.json(machine);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a machine
// @route DELETE /api/machines/:id
exports.deleteMachine = async (req, res, next) => {
  try {
    const machine = await Machine.findByPk(req.params.id);
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }

    await machine.destroy();
    return res.json({ message: 'Machine removed successfully' });
  } catch (error) {
    next(error);
  }
};
