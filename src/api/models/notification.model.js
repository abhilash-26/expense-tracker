const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
	},
	{timestamps: true}
);

module.exports = mongoose.model('Notification', notificationSchema);
