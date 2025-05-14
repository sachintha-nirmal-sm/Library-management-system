const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const uploadWithValidation = require('../middleware/upload');
const {
    getAllBooks,
    getBookByIdOrIsbn,
    createBook,
    updateBook,
    deleteBook,
    searchBooks,
    getBooksByCategory,
    updateBookRating
} = require('../controllers/bookController');

// Public routes
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/category/:category', getBooksByCategory);
router.get('/:idOrIsbn', getBookByIdOrIsbn);

// Protected routes - only admin can access
router.post('/', protect, authorize('admin'), uploadWithValidation, createBook);
router.put('/:idOrIsbn', protect, authorize('admin'), uploadWithValidation, updateBook);
router.put('/rate/:id', protect, updateBookRating);
router.delete('/:idOrIsbn', protect, authorize('admin'), deleteBook);

module.exports = router;
