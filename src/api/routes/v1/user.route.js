const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user.controller');

router.post('/create-income', controller.createIncome);

router.post('/update-income', controller.updateIncome);

router.post('/create-budget', controller.createBudget);

router.post('/update-budget', controller.updateBudget);
router.post('/verify-otp', controller.verifyOtp);

router.post('/update-budget', controller.updateBudget);

module.exports = router;
