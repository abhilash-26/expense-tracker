const app = require('./src/config/express');
const {databaseConnection} = require('./src/config/mongoose');
const {sendGoalNotification} = require('./src/api/services/notificationService');
databaseConnection();

// sendGoalNotification();
