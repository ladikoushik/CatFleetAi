const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/', protect, getCustomers);
router.get('/:id', protect, getCustomerById);
router.post('/', protect, authorize('Admin', 'Dealer_Manager'), createCustomer);
router.put('/:id', protect, authorize('Admin', 'Dealer_Manager'), updateCustomer);
router.delete('/:id', protect, authorize('Admin'), deleteCustomer);

module.exports = router;
