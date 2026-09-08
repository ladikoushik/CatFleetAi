const express = require('express');
const router = express.Router();
const { getBranches, createBranch, deleteBranch } = require('../controllers/branchController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/', protect, getBranches);
router.post('/', protect, authorize('Admin', 'Dealer_Manager'), createBranch);
router.delete('/:id', protect, authorize('Admin'), deleteBranch);

module.exports = router;
