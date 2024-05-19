const serviceAccount = require('../../config/privateKey.json');
const Notification = require('../models/notification.model');
const axios = require('axios');
const sendNotification = async () => {
	const title = 'test title';
	const body = 'test body';
	const dataAndroid = JSON.stringify({
		to: 'cXB1idDdQQSH67k5rS1R3G:APA91bFMOdQYbIEZwYWscx4HbmNfpKWXrnbq2rtjA0_2CEmsInEQmRfW8bZSg6_8eWYqrafS_YsBynmZvcOT-1puS-pE_tUuWJmuT8_ehxICTs9qQOTwV1KkeZg7txsSAl2G5VWkLWiw',
		notification: {
			title: title,
			body: body,
		},
		data: {
			body: body,
			title: title,
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
		userId: '662dda01c6078243472f363a',
		body,
		title,
	});

	console.log(result.data);
};

module.exports = sendNotification;
