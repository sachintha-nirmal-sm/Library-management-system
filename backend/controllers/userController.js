const User = require('../models/User');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/users/all
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const { username, name, email, phone, address } = req.body;

    // Check if user exists
    let user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorResponse('Email already in use', 400));
        }
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return next(new ErrorResponse('Username already in use', 400));
        }
    }

    // Update user
    user = await User.findByIdAndUpdate(
        req.params.id,
        { username, name, email, phone, address },
        { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    await user.deleteOne();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
    const { username, name, email, password, phone, address, paymentMethod, cardNumber, cvv, profilePhoto } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse('Email already exists', 400));
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
        profilePhoto: user.profilePhoto
    });
});