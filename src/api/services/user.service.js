const User = require('../models/user.model');
const Otp = require('../models/passwordResetOtp');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {sendEmail} = require('../utils/email');
const {jwtSecretKey} = require('../../config/vars');

exports.createUser = async (req, res) => {
	try {
		const {fullName, email, password} = req.body;
		if (!email) {
			return res.status(httpStatus.OK).send({status: false, message: 'email is required'});
		}

		if (!password) {
			return res.status(httpStatus.OK).send({status: false, message: 'password is required'});
		}

		const tempUser = await User.findOne({email});

		if (tempUser) {
			return res.status(httpStatus.OK).send({status: false, message: 'Email already registered'});
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
			return res.status(httpStatus.OK).send({status: false, message: 'email is required'});
		}
		if (!password) {
			return res.status(httpStatus.OK).send({status: false, message: 'password is required'});
		}
		const user = await User.findOne({email});
		if (!user) {
			return res.status(httpStatus.OK).send({status: false, message: 'No user found'});
		}
		const comparePassword = await bcrypt.compare(password, user.password);
		if (comparePassword == false) {
			return res.status(httpStatus.OK).send({status: false, message: 'Invalid password'});
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
			return res.status(httpStatus.OK).send({status: false, message: 'email is required'});
		}
		const user = await User.findOne({email});
		if (!user) {
			return res.status(httpStatus.OK).send({status: false, message: 'No user found'});
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

		return res
			.status(httpStatus.CREATED)
			.send({status: true, message: 'Otp Sent to the email', data: email});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.verifyOtp = async (req, res) => {
	try {
		const {otp, email} = req.body;
		if (!email) {
			return res.status(httpStatus.OK).send({status: false, message: 'email is required'});
		}

		if (!otp) {
			return res.status(httpStatus.OK).send({status: false, message: 'otp is required'});
		}
		let currentTime = new Date().getTime();
		const savedOtp = await Otp.findOne({
			otp,
			email,
		});
		console.log(savedOtp);
		if (!savedOtp) {
			return res
				.status(httpStatus.OK)
				.send({status: false, message: 'Could not verify otp please try again'});
		}
		if (savedOtp.expiresAt < currentTime) {
			return res.status(httpStatus.OK).send({status: false, message: 'Otp Timeout'});
		}

		await Otp.findOneAndDelete({otp, email});
		return res
			.status(httpStatus.CREATED)
			.send({status: true, message: 'Otp verified', data: email});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const {password, email} = req.body;
		if (!email) {
			return res.status(httpStatus.OK).send({status: false, message: 'email is required'});
		}
		if (!password) {
			return res.status(httpStatus.OK).send({status: false, message: 'password is required'});
		}
		const user = await User.findOne({email});
		if (!user) {
			return res.status(httpStatus.OK).send({status: false, message: 'No user found'});
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
		return res
			.status(httpStatus.CREATED)
			.send({status: true, data: dataToSend, message: 'Password reset successfully'});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};
