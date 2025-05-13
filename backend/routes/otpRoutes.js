const express = require('express');
const router = express.Router();
const { sendOTP } = require('../controllers/otpController');

// Public route for sending OTP
router.post('/send', sendOTP);

module.exports = router; 