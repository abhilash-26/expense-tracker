const mongoose = require('mongoose');

const otp = new mongoose.Schema(
	{
		otp: {
			type: Number,
			required: true,
		},
		email: {
			type: String,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{timestamps: true}
);
module.exports = mongoose.model('Otp', otp);
