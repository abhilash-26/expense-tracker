const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		rent: {
			type: Number,
		},
		electricityBill: {
			type: Number,
		},
		phoneBill: {
			type: Number,
		},
		internetBill: {
			type: Number,
		},
		studentLoan: {
			type: Number,
		},
		grocery: {
			type: Number,
		},
		gym: {
			type: Number,
		},
		dineOut: {
			type: Number,
		},
		savings: {
			type: Number,
		},
		subscriptions: {
			type: Number,
		},
		others: {
			type: Number,
		},
	},
	{timestamps: true}
);

module.exports = mongoose.model('Budget', budgetSchema);
