const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { updateBookRating } = require('../controllers/bookController');
const uploadWithValidation = require('../middleware/upload');

// GET all books
router.get('/', bookController.getAllBooks);

// GET books by category
router.get('/category/:category', bookController.getBooksByCategory);

// GET a single book by ISBN
router.get('/:isbn', bookController.getBookByIsbn);

// POST create a new book with file upload handling
router.post('/', uploadWithValidation, bookController.createBook);

// PUT update a book with file upload handling
router.put('/:isbn', uploadWithValidation, bookController.updateBook);

// Add a route to update book rating
router.put('/rate/:id', updateBookRating);

// DELETE a book
router.delete('/:isbn', bookController.deleteBook);

module.exports = router;