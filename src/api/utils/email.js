const nodemailer = require('nodemailer');
const {fromEmail, emailPassword} = require('../../config/vars');
// const logger = require('../../../config/logger');

exports.sendEmail = async (email, otp) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: fromEmail,
				pass: emailPassword,
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
			from: fromEmail,
			to: email,
			subject: 'password reset otp',
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
