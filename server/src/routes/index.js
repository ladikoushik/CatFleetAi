const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const machineRoutes = require('./machineRoutes');
const rentalRoutes = require('./rentalRoutes');
const customerRoutes = require('./customerRoutes');
const dealerRoutes = require('./dealerRoutes');
const branchRoutes = require('./branchRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const alertRoutes = require('./alertRoutes');

router.use('/auth', authRoutes);
router.use('/machines', machineRoutes);
router.use('/rentals', rentalRoutes);
router.use('/customers', customerRoutes);
router.use('/dealers', dealerRoutes);
router.use('/branches', branchRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/alerts', alertRoutes);

module.exports = router;
