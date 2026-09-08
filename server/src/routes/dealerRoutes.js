const express = require('express');
const router = express.Router();
const { getDealers, getDealerById, createDealer, updateDealer, deleteDealer } = require('../controllers/dealerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/', protect, getDealers);
router.get('/:id', protect, getDealerById);
router.post('/', protect, authorize('Admin'), createDealer);
router.put('/:id', protect, authorize('Admin', 'Dealer_Manager'), updateDealer);
router.delete('/:id', protect, authorize('Admin'), deleteDealer);

module.exports = router;
