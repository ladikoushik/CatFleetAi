const express = require('express');
const router = express.Router();
const { getAlerts, updateAlertStatus } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAlerts);
router.put('/:id', protect, updateAlertStatus);

module.exports = router;
