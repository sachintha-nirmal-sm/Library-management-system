const mongoose = require('mongoose');

const BorrowingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['borrowed', 'returned', 'overdue'],
        default: 'borrowed'
    },
    fine: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate fine if book is returned late
BorrowingSchema.pre('save', function(next) {
    if (this.status === 'returned' && this.returnDate > this.dueDate) {
        const daysLate = Math.ceil((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
        this.fine = daysLate * 1; // $1 per day late
    }
    next();
});

// Update status to overdue if due date has passed
BorrowingSchema.pre('save', function(next) {
    if (this.status === 'borrowed' && new Date() > this.dueDate) {
        this.status = 'overdue';
    }
    next();
});

module.exports = mongoose.model('Borrowing', BorrowingSchema); 