const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
	},
	{timestamps: true}
);

module.exports = mongoose.model('Expense', expenseSchema);
