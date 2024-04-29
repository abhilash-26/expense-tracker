const {
	createUser,
	userLogin,
	passwordChangeEmail,
	verifyOtp,
	resetPassword,
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

exports.resetPassword = async (req, res) => {
	try {
		await resetPassword(req, res);
	} catch (error) {
		res.status(httpStatus.GATEWAY_TIMEOUT).send(error.message);
	}
};
