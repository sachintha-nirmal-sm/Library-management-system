const express = require('express');
const router = express.Router();
const { getUsers, registerUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);

// Protected routes (all authenticated users can view)
router.get('/', protect, getUsers);

module.exports = router; 