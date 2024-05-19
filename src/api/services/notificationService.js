const sendNotification = require('../services/firebase');
const User = require('../models/user.model');
const Goal = require('../models/goal.model');

exports.sendGoalNotification = async () => {
	try {
		const users = await User.find();
		const notificationData = users.map(async (item) => {
			const goalResult = await Goal.find({userId: item._id});
			console.log(goalResult);
		});
	} catch (error) {}
};

// module.exports = {sendGoalNotification};
