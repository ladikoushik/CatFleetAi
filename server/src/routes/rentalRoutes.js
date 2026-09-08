const express = require('express');
const router = express.Router();
const { getRentals, getRentalById, createRental, updateRental, deleteRental } = require('../controllers/rentalController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/', protect, getRentals);
router.get('/:id', protect, getRentalById);
router.post('/', protect, authorize('Admin', 'Dealer_Manager', 'Customer'), createRental);
router.put('/:id', protect, authorize('Admin', 'Dealer_Manager', 'Rental_Analyst'), updateRental);
router.delete('/:id', protect, authorize('Admin'), deleteRental);

module.exports = router;
