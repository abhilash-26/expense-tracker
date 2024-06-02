const app = require('./src/config/express');
const {databaseConnection} = require('./src/config/mongoose');
databaseConnection();
