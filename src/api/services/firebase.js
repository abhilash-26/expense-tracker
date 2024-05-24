const serviceAccount = require('../../config/privateKey.json');
const Notification = require('../models/notification.model');
const axios = require('axios');
const sendNotification = async (message, title, userFcm, userId, transactionId) => {
	const messageTitle = title || 'test title';
	const body = message || 'test body';
	const dataAndroid = JSON.stringify({
		to: userFcm,
		notification: {
			title: messageTitle,
			body: body,
		},
		data: {
			body: body,
			title: messageTitle,
			transaction_id: '4',
			click_action: 'FLUTTER_NOTIFICATION_CLICK',
		},
		priority: 'high',
	});

	var config = {
		method: 'post',
		url: 'https://fcm.googleapis.com/fcm/send',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `key=${serviceAccount}`,
		},
		data: dataAndroid,
	};

	const result = await axios(config);

	await Notification.create({
		userId: userId,
		body,
		title,
		transactionId,
	});

	console.log(result.data);
};

module.exports = sendNotification;
