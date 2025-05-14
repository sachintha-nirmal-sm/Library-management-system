const twilio = require('twilio');
const crypto = require('crypto');

// Initialize Twilio client (commented out for development)
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// For development, we'll use a mock client
const client = {
    messages: {
        create: async ({ to, from, body }) => {
            console.log('Mock SMS:', { to, from, body });
            return { sid: 'MOCK_SID' };
        }
    }
};

// In-memory storage for OTPs
const otpStore = new Map();

// Generate a 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send OTP to phone number
const sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        console.log('Received request to send OTP to:', phoneNumber);

        if (!phoneNumber) {
            console.log('Phone number is missing');
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Format phone number to E.164 format if needed
        const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
        console.log('Formatted phone number:', formattedPhoneNumber);

        // Generate OTP
        const otp = generateOTP();
        console.log('Generated OTP:', otp);

        // Store OTP with timestamp
        otpStore.set(formattedPhoneNumber, {
            otp,
            timestamp: Date.now(),
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        console.log('Attempting to send SMS...');
        // Send SMS using Twilio
        const message = await client.messages.create({
            body: `Your OTP for payment verification is: ${otp}. Valid for 5 minutes.`,
            from: twilioPhoneNumber,
            to: formattedPhoneNumber
        });

        console.log('SMS sent successfully:', message.sid);

        res.status(200).json({ 
            message: 'OTP sent successfully',
            expiresIn: 5 * 60 // 5 minutes in seconds
        });
    } catch (error) {
        console.error('Detailed error sending OTP:', {
            message: error.message,
            code: error.code,
            status: error.status,
            moreInfo: error.moreInfo
        });
        res.status(500).json({ 
            message: 'Failed to send OTP',
            error: error.message
        });
    }
};

// Verify OTP
const verifyOTP = (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

        if (!formattedPhoneNumber || !otp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' });
        }

        const storedOTP = otpStore.get(formattedPhoneNumber);

        if (!storedOTP) {
            return res.status(400).json({ message: 'OTP not found or expired' });
        }

        if (Date.now() > storedOTP.expiresAt) {
            otpStore.delete(formattedPhoneNumber);
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (storedOTP.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Clear the OTP after successful verification
        otpStore.delete(formattedPhoneNumber);

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

module.exports = {
    sendOTP,
    verifyOTP
}; 