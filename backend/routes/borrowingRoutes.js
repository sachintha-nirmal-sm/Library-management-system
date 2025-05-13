const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllBorrowings,
    getBorrowingById,
    createBorrowing,
    updateBorrowing,
    deleteBorrowing,
    getUserBorrowings
} = require('../controllers/borrowingController');

// Public routes
router.get('/', protect, getAllBorrowings);
router.get('/user', protect, getUserBorrowings);
router.get('/:id', protect, getBorrowingById);

// Protected routes - only admin can access
router.post('/', protect, createBorrowing);
router.put('/:id', protect, authorize('admin'), updateBorrowing);
router.delete('/:id', protect, authorize('admin'), deleteBorrowing);

module.exports = router; 