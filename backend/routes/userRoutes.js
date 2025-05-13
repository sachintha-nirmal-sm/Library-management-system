const express = require('express');
const router = express.Router();
const { 
    getAllUsers,
    updateUser,
    deleteUser,
    registerUser 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);

// Protected routes - only admin can access
router.get('/all', protect, authorize('admin'), (req, res, next) => {
    console.log('Admin accessing getAllUsers route:', req.user);
    next();
}, getAllUsers);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;