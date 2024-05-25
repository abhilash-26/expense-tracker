const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user.controller');

router.post('/create-income', controller.createIncome);

router.get('/list', controller.userList);

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

router.post('/manual-notification', controller.sendManualNotification);

router.post('/create-transaction', controller.createTransaction);

router.post('/settle-transaction', controller.settleTransaction);

router.get('/my-request', controller.myRequest);

router.get('/pending-transaction', controller.pendingTransaction);

router.get('/paid-transaction', controller.paidTransaction);

module.exports = router;
