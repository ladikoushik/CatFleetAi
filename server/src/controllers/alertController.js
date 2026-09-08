const { Alert, Machine } = require('../models');

// @desc Get all machine alerts
// @route GET /api/alerts
exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.findAll({
      include: [{ model: Machine, as: 'machine' }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(alerts);
  } catch (error) {
    next(error);
  }
};

// @desc Update alert status (Acknowledge/Resolve)
// @route PUT /api/alerts/:id
exports.updateAlertStatus = async (req, res, next) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    await alert.update({ status: req.body.status || 'Acknowledged' });
    return res.json(alert);
  } catch (error) {
    next(error);
  }
};
