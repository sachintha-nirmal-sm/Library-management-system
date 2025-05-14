const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
   if (!process.env.JWT_EXPIRE) {
     console.warn('⚠️ JWT_EXPIRE is not set. Defaulting to 30d.');
   }
   return jwt.sign(
     { id },
     process.env.JWT_SECRET,
     { expiresIn: process.env.JWT_EXPIRE || '1h' }
   );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { userId, username, name, email, password, phone, address, paymentMethod, cardNumber, cvv, profilePhoto } = req.body;

        console.log('Checking for existing user with email:', email);

        // Check if user exists
        const userExists = await User.findOne({ email });
        console.log('User exists check result:', userExists);

        if (userExists) {
            console.log('Email already exists:', email);
            return res.status(400).json({ 
                message: 'Email already exists'
            });
        }

        // Create user
        const user = await User.create({
            userId,
            username,
            name,
            email,
            password,
            phone,
            address,
            paymentMethod,
            cardNumber,
            cvv,
            profilePhoto
        });

        console.log('New user created successfully:', user.email);

        if (user) {
            res.status(201).json({
                _id: user._id,
                userId: user.userId,
                username: user.username,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                paymentMethod: user.paymentMethod,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({
            _id: user._id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
            // token: generateToken(user._id),
            token: user.getSignedJwtToken(),
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 