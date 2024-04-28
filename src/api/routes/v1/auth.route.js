const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user.controller');

router.post('/register', controller.createUser);

router.post('/login', controller.userLogin);

router.post('/forgot-password', controller.forgotPassword);

router.post('/reset-password', controller.resetPassword);

module.exports = router;
