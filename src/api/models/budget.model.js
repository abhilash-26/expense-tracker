const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		rent: {
			type: Number,
			// required: true,
		},
		electricityBill: {
			type: Number,
			// required: true,
		},
		phoneBill: {
			type: Number,
			// required: true,
		},
		internetBill: {
			type: Number,
			// required: true,
		},
		studentLoan: {
			type: Number,
			// required: true,
		},
		grocery: {
			type: Number,
			// required: true,
		},
		gym: {
			type: Number,
			// required: true,
		},
		dineOut: {
			type: Number,
			// required: true,
		},
		savings: {
			type: Number,
			// required: true,
		},
		subscriptions: {
			type: Number,
			// required: true,
		},
		others: {
			type: Number,
			// required: true,
		},
	},
	{timestamps: true}
);

/**
 * Methods
 */

module.exports = mongoose.model('Budget', budgetSchema);
