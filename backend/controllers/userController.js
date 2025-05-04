const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -cardNumber -cvv');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { username, name, email, password, phone, address, paymentMethod, cardNumber, cvv, profilePhoto } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ 
                message: userExists.email === email ? 'Email already exists' : 'Username already exists' 
            });
        }

        // Create user
        const user = await User.create({
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

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                paymentMethod: user.paymentMethod,
                role: user.role,
                profilePhoto: user.profilePhoto
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 