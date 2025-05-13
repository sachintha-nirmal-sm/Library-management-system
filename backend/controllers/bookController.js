const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private/Admin
exports.createBook = async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json({
            success: true,
            data: book
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
exports.updateBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!book) {
            return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
exports.searchBooks = async (req, res, next) => {
    try {
        const { title, author, genre } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (author) {
            query.author = { $regex: author, $options: 'i' };
        }
        if (genre) {
            query.genre = { $regex: genre, $options: 'i' };
        }

        const books = await Book.find(query);
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (err) {
        next(err);
    }
}; 