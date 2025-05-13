const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all borrowings
// @route   GET /api/borrowings
// @access  Private/Admin
exports.getAllBorrowings = async (req, res, next) => {
    try {
        const borrowings = await Borrowing.find()
            .populate('user', 'username name email')
            .populate('book', 'title author isbn');
        
        res.status(200).json({
            success: true,
            count: borrowings.length,
            data: borrowings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single borrowing
// @route   GET /api/borrowings/:id
// @access  Private
exports.getBorrowingById = async (req, res, next) => {
    try {
        const borrowing = await Borrowing.findById(req.params.id)
            .populate('user', 'username name email')
            .populate('book', 'title author isbn');

        if (!borrowing) {
            return next(new ErrorResponse(`Borrowing not found with id of ${req.params.id}`, 404));
        }

        // Make sure user is borrowing owner or admin
        if (borrowing.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.user.id} is not authorized to view this borrowing`, 401));
        }

        res.status(200).json({
            success: true,
            data: borrowing
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new borrowing
// @route   POST /api/borrowings
// @access  Private
exports.createBorrowing = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        // Check if book exists and has available copies
        const book = await Book.findById(req.body.book);
        if (!book) {
            return next(new ErrorResponse(`Book not found with id of ${req.body.book}`, 404));
        }

        if (book.availableCopies <= 0) {
            return next(new ErrorResponse('Book is not available for borrowing', 400));
        }

        // Create borrowing
        const borrowing = await Borrowing.create(req.body);

        // Update book's available copies
        book.availableCopies -= 1;
        await book.save();

        res.status(201).json({
            success: true,
            data: borrowing
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update borrowing
// @route   PUT /api/borrowings/:id
// @access  Private/Admin
exports.updateBorrowing = async (req, res, next) => {
    try {
        let borrowing = await Borrowing.findById(req.params.id);

        if (!borrowing) {
            return next(new ErrorResponse(`Borrowing not found with id of ${req.params.id}`, 404));
        }

        // If returning book, update available copies
        if (req.body.status === 'returned' && borrowing.status !== 'returned') {
            const book = await Book.findById(borrowing.book);
            book.availableCopies += 1;
            await book.save();
        }

        borrowing = await Borrowing.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('user', 'username name email')
          .populate('book', 'title author isbn');

        res.status(200).json({
            success: true,
            data: borrowing
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete borrowing
// @route   DELETE /api/borrowings/:id
// @access  Private/Admin
exports.deleteBorrowing = async (req, res, next) => {
    try {
        const borrowing = await Borrowing.findById(req.params.id);

        if (!borrowing) {
            return next(new ErrorResponse(`Borrowing not found with id of ${req.params.id}`, 404));
        }

        // If book was not returned, update available copies
        if (borrowing.status !== 'returned') {
            const book = await Book.findById(borrowing.book);
            book.availableCopies += 1;
            await book.save();
        }

        await borrowing.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user borrowings
// @route   GET /api/borrowings/user
// @access  Private
exports.getUserBorrowings = async (req, res, next) => {
    try {
        const borrowings = await Borrowing.find({ user: req.user.id })
            .populate('book', 'title author isbn');

        res.status(200).json({
            success: true,
            count: borrowings.length,
            data: borrowings
        });
    } catch (err) {
        next(err);
    }
}; 