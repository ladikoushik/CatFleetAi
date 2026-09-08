const express = require('express');
const router = express.Router();
const { getMachines, getMachineById, createMachine, updateMachine, deleteMachine } = require('../controllers/machineController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/', getMachines);
router.get('/:id', getMachineById);
router.post('/', protect, authorize('Admin', 'Dealer_Manager'), createMachine);
router.put('/:id', protect, authorize('Admin', 'Dealer_Manager'), updateMachine);
router.delete('/:id', protect, authorize('Admin'), deleteMachine);

module.exports = router;
