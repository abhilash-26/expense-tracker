const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user.controller');

router.post('/create-income', controller.createIncome);

router.get('/income-list', controller.getIncome);

router.post('/update-income', controller.updateIncome);

router.post('/create-budget', controller.createBudget);

router.get('/budget-list', controller.getBudget);

router.post('/update-budget', controller.updateBudget);

module.exports = router;
