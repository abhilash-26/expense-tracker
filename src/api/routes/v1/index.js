const express = require('express');
const router = express.Router();
const userRoute = require('./user.route');

router.use('/status', (req, res) => {
	res.send('Ok!');
});

router.use('/auth', userRoute);

module.exports = router;
