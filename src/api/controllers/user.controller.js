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

exports.resetPassword = async (req, res) => {
	try {
		await resetPassword(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};
