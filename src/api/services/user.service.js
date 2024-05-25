const User = require('../models/user.model');
const Otp = require('../models/passwordResetOtp');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const {sendEmail} = require('../utils/email');
const {jwtSecretKey} = require('../../config/vars');
const Income = require('../models/income.model');
const Budget = require('../models/budget.model');
const Expense = require('../models/expense.model');
const Goal = require('../models/goal.model');
const Notification = require('../models/notification.model');
const sendNotification = require('./firebase');
const splitTransactionModel = require('../models/splitTransaction.model');

exports.createUser = async (req, res) => {
	try {
		const {fullName, email, password, fcmToken} = req.body;
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
			fcmToken,
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
			fcmToken: result.fcmToken,
			token,
		};
		return res
			.status(httpStatus.CREATED)
			.send({status: true, data: dataToSend, message: 'user register success'});
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

exports.userLogin = async (req, res) => {
	try {
		const {email, password, fcmToken} = req.body;
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
			fcmToken: fcmToken ? fcmToken : user.fcmToken,
			token,
		};
		if (fcmToken) {
			await User.findOneAndUpdate({email}, {fcmToken});
		}
		return res
			.status(httpStatus.OK)
			.send({status: true, data: dataToSend, message: 'user login success'});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.getUsers = async (req, res) => {
	try {
		const result = await User.find().select({fullName: 1, email: 1});
		return res.send({status: true, data: result});
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
		// const otp = Math.floor(Math.random(4) * 10000);
		const otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
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

exports.createIncome = async (req, res) => {
	try {
		const {income, userId} = req.body;
		const result = await Income.create({userId, income});
		return res.status(httpStatus.CREATED).send({status: true, data: result});
	} catch (error) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.send({status: false, message: error.message});
	}
};

exports.getIncome = async (req, res) => {
	try {
		const {userId} = req.query;
		if (!userId) {
			return res.send({status: false, message: 'UserId is required'});
		}
		const result = await Income.find({userId});
		return res.status(httpStatus.OK).send({status: true, data: result});
	} catch (error) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.send({status: false, message: error.message});
	}
};

exports.editIncome = async (req, res) => {
	try {
		const {income, id} = req.body;
		if (!id) {
			return res.send({status: false, message: 'Id is required'});
		}
		const result = await Income.findByIdAndUpdate(id, {income});
		if (result) {
			return res.status(httpStatus.CREATED).send({status: true, message: 'Income Updated'});
		}
		return res.send({status: false, message: 'Something went wrong'});
	} catch (error) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.send({status: false, message: error.message});
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
		return res.status(httpStatus.CREATED).send({status: true, data: result});
	} catch (error) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.send({status: false, message: error.message});
	}
};

exports.getBudget = async (req, res) => {
	try {
		const {userId} = req.query;
		const result = await Budget.find({userId});
		return res.status(httpStatus.OK).send({status: true, data: result});
	} catch (error) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.send({status: false, message: error.message});
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
			id,
			others,
		} = req.body;
		if (!id) {
			return res.send({status: false, message: 'Id is required'});
		}
		const result = await Budget.findByIdAndUpdate(id, {
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
		if (result) {
			return res.status(httpStatus.CREATED).send({status: true, message: 'Budget updated'});
		}
		return res.send({status: false, message: 'Something went wrong'});
	} catch (error) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.send({status: false, message: error.message});
	}
};

exports.createExpense = async (req, res) => {
	try {
		const {category, amount, userId} = req.body;
		const result = await Expense.create({
			userId,
			category,
			amount,
		});
		return res
			.status(httpStatus.CREATED)
			.send({status: true, data: result, message: 'Expense created'});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.listExpense = async (req, res) => {
	try {
		const {userId} = req.query;
		if (!userId) {
			return res.send({status: false, message: 'User Id is required'});
		}
		const result = await Expense.find({userId});
		return res.status(httpStatus.OK).send({status: true, data: result});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.editExpense = async (req, res) => {
	try {
		const {category, amount, id} = req.body;
		if (!id) {
			return res.send({status: 'false', message: 'id is required'});
		}
		const result = await Expense.findByIdAndUpdate(id, {category, amount}, {rawResult: true});
		return res.status(httpStatus.CREATED).send({status: true, message: 'Expense Updated'});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.createGoal = async (req, res) => {
	try {
		const {amount, name, date, description, userId} = req.body;
		const result = await Goal.create({
			userId,
			name,
			amount,
			date,
			description,
		});
		return res
			.status(httpStatus.CREATED)
			.send({status: true, data: result, message: 'Goal created'});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.listGoal = async (req, res) => {
	try {
		const {userId} = req.query;
		if (!userId) {
			return res.send({status: false, message: 'User Id is required'});
		}
		const result = await Goal.find({userId});
		return res.status(httpStatus.OK).send({status: true, data: result});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.editGoal = async (req, res) => {
	try {
		const {name, amount, date, description, id} = req.body;
		if (!id) {
			return res.send({status: 'false', message: 'id is required'});
		}
		const result = await Goal.findByIdAndUpdate(id, {name, amount, date, description});
		return res.status(httpStatus.CREATED).send({status: true, message: 'Goal Updated'});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.getNotification = async (req, res) => {
	try {
		const {userId} = req.query;
		const notification = await Notification.find({userId});
		return res.send({status: true, data: notification});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.sendManualNotification = async (req, res) => {
	try {
		const users = await User.find();
		users.map(async (item) => {
			const goalResult = await Goal.find({userId: item._id});
			if (goalResult.length > 0) {
				let total = 0;
				goalResult.forEach(async (gl) => {
					const yearDiff = gl.date.getFullYear() - gl.createdAt.getFullYear();
					const monthDiff = gl.date.getMonth() - gl.createdAt.getMonth();
					const totalDiff = yearDiff * 12 + monthDiff;
					const sAmount = gl.amount / (totalDiff > 0 ? totalDiff : 1);
					total += sAmount;
					if (item.fcmToken) {
						const message = `You need to save ${sAmount} this month`;
						const title = gl.name;
						const userId = item._id;
						await sendNotification(message, title, item.fcmToken, userId);
					}
				});
				const message = `You need to save a total of ${total} this month`;
				const title = 'Goal';
				const userId = item._id;
				if (item.fcmToken) {
					await sendNotification(message, title, item.fcmToken, userId);
				}
			}
		});

		return res.send({status: true, message: 'Notification sent'});
	} catch (error) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({status: false, message: error.message});
	}
};

exports.createTransaction = async (req, res) => {
	try {
		const {users, userId, amount, title} = req.body;
		const splitAmount = amount / (users.length + 1);
		users.forEach(async (item) => {
			const result = await splitTransactionModel.create({
				borrower: userId,
				userId: item,
				amount: splitAmount,
				title,
			});
			if (result) {
				const tempUser = await User.findById(item);
				const borrower = await User.findById(userId);
				const message = `You owe ${splitAmount} to ${borrower.fullName}`;
				const title = 'New Payment Detail';
				const transactionId = result._id;
				if (tempUser.fcmToken) {
					await sendNotification(message, title, tempUser.fcmToken, tempUser._id, transactionId);
				}
			}
		});
		return res.send({status: true, message: 'Transaction Created'});
	} catch (error) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.send({status: false, message: error.message});
	}
};

exports.settleTransaction = async (req, res) => {
	try {
		const {transactionId} = req.body;
		const result = await splitTransactionModel.findByIdAndUpdate(
			transactionId,
			{isSetteled: 1},
			{new: true}
		);
		if (result.isSetteled) {
			const tempUser = await User.findById(result.userId);
			const borrower = await User.findById(result.borrower);
			const message = `${tempUser.fullName} has paid you`;
			const title = 'Transaction settled';
			const transactionId = result._id;
			if (borrower.fcmToken) {
				await sendNotification(message, title, tempUser.fcmToken, tempUser._id, transactionId);
			}
			return res.send({status: true, message: 'Transaction Settled'});
		}
		return res.send({status: false, message: 'Transaction not found'});
	} catch (error) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.send({status: false, message: error.message});
	}
};

exports.getMyPaidTransactions = async (req, res) => {
	try {
		const {userId} = req.query;
		const paidTransaction = await splitTransactionModel
			.find({userId, isSetteled: true})
			.populate('userId', 'fullName')
			.populate('borrower', 'fullName');
		return res.send({status: 1, data: paidTransaction});
	} catch (error) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.send({status: false, message: error.message});
	}
};

exports.getMyPendingTransaction = async (req, res) => {
	try {
		const {userId} = req.query;
		const pendingTransaction = await splitTransactionModel
			.find({userId, isSetteled: false})
			.populate('userId', 'fullName')
			.populate('borrower', 'fullName');

		return res.send({status: 1, data: pendingTransaction});
	} catch (error) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.send({status: false, message: error.message});
	}
};
