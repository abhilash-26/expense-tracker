const express = require('express');
const router = express.Router();
const authRoute = require('./auth.route');
const userRoute = require('./user.route');

// Health check route
router.use('/status', (req, res) => {
	res.send('Ok!');
});

router.use('/auth', authRoute);

router.use('/user', userRoute);

module.exports = router;
