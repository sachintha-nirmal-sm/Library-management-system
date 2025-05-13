const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// Add debug logs to check token and user role
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.log('No token provided');
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            console.log('User not found');
            return next(new ErrorResponse('No user found with this id', 404));
        }

        next();
    } catch (err) {
        console.log('Token verification failed:', err);
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log(`User role ${req.user.role} is not authorized to access this route`);
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    };
};

module.exports = { protect, authorize };