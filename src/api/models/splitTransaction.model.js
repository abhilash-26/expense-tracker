const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		transactionId: {
			type: String,
		},
		title: {
			type: String,
			required: true,
		},
		borrower: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		amount: {
			type: Number,
			required: true,
		},
		isSetteled: {
			type: Boolean,
			default: false,
		},
		declined: {
			type: Boolean,
			default: false,
		},
	},
	{timestamps: true}
);

module.exports = mongoose.model('Transaction', transactionSchema);
