require('dotenv').config();

module.exports = {
	mongoUrl: process.env.MONGO_URL,
	port: process.env.PORT,
	jwtSecretKey: process.env.JWTSECRETKEY,
	fromEmail: process.env.EMAIL,
	emailPassword: process.env.EMAILPASSWORD,
};
