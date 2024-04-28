const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		income: [
			{
				incomeType: {
					type: String,
				},
				incomeAmount: {
					type: Number,
				},
			},
		],
	},
	{timestamps: true}
);

/**
 * Methods
 */

module.exports = mongoose.model('Income', incomeSchema);
