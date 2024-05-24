const {
	createUser,
	userLogin,
	passwordChangeEmail,
	verifyOtp,
	createIncome,
	editIncome,
	createBudget,
	editBudget,
	getIncome,
	getBudget,
	createExpense,
	listExpense,
	editExpense,
	createGoal,
	listGoal,
	editGoal,
	getNotification,
	sendManualNotification,
	getUsers,
	createTransaction,
	settleTransaction,
	getMyPendingTransaction,
	getMyPaidTransactions,
} = require('../services/user.service');

const httpStatus = require('http-status');
exports.createUser = async (req, res) => {
	try {
		await createUser(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.userLogin = async (req, res) => {
	try {
		await userLogin(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.userList = async (req, res) => {
	try {
		await getUsers(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.forgotPassword = async (req, res) => {
	try {
		await passwordChangeEmail(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.verifyOtp = async (req, res) => {
	try {
		await verifyOtp(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.createIncome = async (req, res) => {
	try {
		await createIncome(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.getIncome = async (req, res) => {
	try {
		await getIncome(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.updateIncome = async (req, res) => {
	try {
		await editIncome(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.createBudget = async (req, res) => {
	try {
		await createBudget(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.getBudget = async (req, res) => {
	try {
		await getBudget(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.updateBudget = async (req, res) => {
	try {
		await editBudget(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.createExpense = async (req, res) => {
	try {
		await createExpense(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.listExpense = async (req, res) => {
	try {
		await listExpense(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.updateExpense = async (req, res) => {
	try {
		await editExpense(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.createGoal = async (req, res) => {
	try {
		await createGoal(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.listGoal = async (req, res) => {
	try {
		await listGoal(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.editGoal = async (req, res) => {
	try {
		await editGoal(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.resetPassword = async (req, res) => {
	try {
		await resetPassword(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.getNotification = async (req, res) => {
	try {
		await getNotification(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.sendManualNotification = async (req, res) => {
	try {
		await sendManualNotification(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.createTransaction = async (req, res) => {
	try {
		await createTransaction(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.settleTransaction = async (req, res) => {
	try {
		await settleTransaction(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.pendingTransaction = async (req, res) => {
	try {
		await getMyPendingTransaction(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};

exports.paidTransaction = async (req, res) => {
	try {
		await getMyPaidTransactions(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};
