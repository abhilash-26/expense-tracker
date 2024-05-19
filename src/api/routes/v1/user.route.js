const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user.controller');

router.post('/create-income', controller.createIncome);

router.get('/income-list', controller.getIncome);

router.post('/update-income', controller.updateIncome);

router.post('/create-budget', controller.createBudget);

router.get('/budget-list', controller.getBudget);

router.post('/update-budget', controller.updateBudget);

router.post('/create-expense', controller.createExpense);

router.get('/list-expense', controller.listExpense);

router.post('/edit-expense', controller.updateExpense);

router.post('/create-goal', controller.createGoal);

router.get('/list-goal', controller.listGoal);

router.post('/edit-goal', controller.editGoal);

router.get('/notification', controller.getNotification);

module.exports = router;
