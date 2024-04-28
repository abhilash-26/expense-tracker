const User = require('../models/user.model');
const Otp = require('../models/passwordResetOtp');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {sendEmail} = require('../utils/email');
const {jwtSecretKey} = require('../../config/vars');
const Income = require('../models/income.model');
const Budget = require('../models/budget.model');

exports.createUser = async (req, res) => {
	try {
		const {fullName, email, password} = req.body;
		if (!email) {
			return res.status(httpStatus.BAD_REQUEST).send({status: false, message: 'email is required'});
		}

		if (!password) {
			return res
				.status(httpStatus.BAD_REQUEST)
				.send({status: false, message: 'password is required'});
		}

		const tempUser = await User.findOne({email});

		if (tempUser) {
			return res
				.status(httpStatus.CONFLICT)
				.send({status: false, message: 'Email already registered'});
		}

		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(password, salt);

		const result = await User.create({
			fullName,
			email,
			password: hash,
		});
		const userData = {
			id: result._id,
			email: result.email,
			name: result.fullName,
		};
		var token = jwt.sign(userData, jwtSecretKey);
		const dataToSend = {
			email: result.email,
			fullName: result.fullName,
			id: result._id,
			token,
		};
		return res
			.status(httpStatus.CREATED)
			.send({status: true, data: dataToSend, message: 'user register success'});
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
};

exports.userLogin = async (req, res) => {
	try {
		const {email, password} = req.body;
		if (!email) {
			return res.status(httpStatus.BAD_REQUEST).send({status: false, message: 'email is required'});
		}
		if (!password) {
			return res
				.status(httpStatus.BAD_REQUEST)
				.send({status: false, message: 'password is required'});
		}
		const user = await User.findOne({email});
		if (!user) {
			return res.status(httpStatus.NOT_FOUND).send({status: false, message: 'No user found'});
		}
		const comparePassword = await bcrypt.compare(password, user.password);
		if (comparePassword == false) {
			return res.status(httpStatus.FORBIDDEN).send({status: false, message: 'Invalid password'});
		}
		const userData = {
			id: user._id,
			email: user.email,
			name: user.fullName,
		};
		var token = jwt.sign(userData, jwtSecretKey);
		const dataToSend = {
			email: user.email,
			fullName: user.fullName,
			id: user._id,
			token,
		};
		return res
			.status(httpStatus.OK)
			.send({status: true, data: dataToSend, message: 'user login success'});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.passwordChangeEmail = async (req, res) => {
	try {
		const {email} = req.body;
		if (!email) {
			return res.status(httpStatus.BAD_REQUEST).send({status: false, message: 'email is required'});
		}
		const user = await User.findOne({email});
		if (!user) {
			return res.status(httpStatus.NOT_FOUND).send({status: false, message: 'No user found'});
		}
		const otp = Math.floor(Math.random(4) * 10000);
		let currentTime = new Date();
		var expiryTime = new Date(currentTime.getTime() + 30 * 60000);

		const otpDocument = await Otp.create({
			otp,
			email,
			expiresAt: expiryTime,
		});
		const result = await sendEmail(email, otp);

		return res.status(httpStatus.CREATED).send({status: true, message: 'Otp Sent', data: result});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.verifyOtp = async (req, res) => {
	try {
		const {otp, email, password} = req.body;
		console.log('testtttttttttttttttt');
		if (!email) {
			return res.status(httpStatus.BAD_REQUEST).send({status: false, message: 'email is required'});
		}
		if (!password) {
			return res
				.status(httpStatus.BAD_REQUEST)
				.send({status: false, message: 'password is required'});
		}
		if (!otp) {
			return res.status(httpStatus.BAD_REQUEST).send({status: false, message: 'otp is required'});
		}
		let currentTime = new Date().getTime();
		const savedOtp = await Otp.findOne({
			otp,
			email,
		});
		console.log(savedOtp);
		if (!savedOtp) {
			return res
				.status(httpStatus.NOT_FOUND)
				.send({status: false, message: 'Could not verify otp please try again'});
		}
		if (savedOtp.expiresAt < currentTime) {
			return res.status(httpStatus.REQUEST_TIMEOUT).send({status: false, message: 'Otp Timeout'});
		}
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);
		const updatedUser = await User.findOneAndUpdate(
			{email: email},
			{
				password: hashPassword,
			}
		);
		const dataToSend = {
			email: updatedUser.email,
			name: updatedUser.fullName,
		};
		await Otp.findOneAndDelete({otp, email});
		return res.status(httpStatus.CREATED).send({status: true, data: dataToSend});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.createIncome = async (req, res) => {
	try {
		const {income, userId} = req.body;
		const result = await Income.create({userId, income});
		res.status(httpStatus.CREATED).send({status: true, data: result});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.editIncome = async (req, res) => {
	try {
		const {income, userId} = req.body;
		const result = await Income.updateOne({userId}, {income});
		res.status(httpStatus.CREATED).send({status: true, message: 'Income Updated'});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.createBudget = async (req, res) => {
	try {
		const {
			rent,
			electricityBill,
			phoneBill,
			internetBill,
			studentLoan,
			grocery,
			gym,
			dineOut,
			savings,
			subscriptions,
			others,
			userId,
		} = req.body;
		const result = await Budget.create({
			userId,
			rent,
			electricityBill,
			phoneBill,
			internetBill,
			studentLoan,
			grocery,
			gym,
			dineOut,
			savings,
			subscriptions,
			others,
		});
		res.status(httpStatus.CREATED).send({status: true, data: result});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.getBudget = async (req, res) => {
	try {
		const id = req.query;
		const result = await Budget.findById(id);
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.editBudget = async (req, res) => {
	try {
		const {
			rent,
			electricityBill,
			phoneBill,
			internetBill,
			studentLoan,
			grocery,
			gym,
			dineOut,
			savings,
			subscriptions,
			userId,
			others,
		} = req.body;
		const result = await Budget.updateOne(
			{userId},
			{
				rent,
				electricityBill,
				phoneBill,
				internetBill,
				studentLoan,
				grocery,
				gym,
				dineOut,
				savings,
				subscriptions,
				others,
			}
		);
		res.status(httpStatus.CREATED).send({status: true, message: 'Budget updated'});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};
