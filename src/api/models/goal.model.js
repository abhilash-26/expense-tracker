const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
		},
		description: {
			type: String,
		},
	},
	{timestamps: true}
);

module.exports = mongoose.model('Goal', goalSchema);
