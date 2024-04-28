const nodemailer = require('nodemailer');
// const {emailConfig} = require('../../../config/vars');
// const logger = require('../../../config/logger');

exports.sendEmail = async (email, otp) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'krabhilash226@gmail.com',
				pass: 'fwzp lseo txjo qljb',
			},
			secure: false,
		});

		// verify connection configuration
		transporter.verify((error) => {
			if (error) {
				console.log('error with email connection', error);
			}
		});
		const mailOptions = {
			from: 'sotp96774@gmail.com',
			to: email,
			subject: 'Hey there here is your OTP ',
			text: `Your OTP is ${otp}`,
		};
		await transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				// logger.info(error);
				return error;
			} else {
				// logger.info(info.response);
				return info.response;
			}
		});
	} catch (error) {
		return error.message;
	}
};
