const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    author: {
        type: String,
        required: [true, 'Please add an author'],
        trim: true,
        maxlength: [100, 'Author name cannot be more than 100 characters']
    },
    isbn: {
        type: String,
        required: [true, 'Please add an ISBN'],
        unique: true,
        trim: true,
        maxlength: [13, 'ISBN cannot be more than 13 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    bookText: {
        type: String,
        trim: true
    },
    publishedYear: {
        type: Number,
        min: [1000, 'Publication year must be a valid year'],
        max: [new Date().getFullYear(), 'Publication year cannot be in the future']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        enum: ['Novel', 'Horror', 'Adventure', 'Mystery & Thriller', 'Romance', 'Fantasy', 'Education']
    },
    genre: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        default: 'no-photo.jpg'
    },
    available: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalCopies: {
        type: Number,
        required: [true, 'Please add total number of copies'],
        min: [0, 'Total copies cannot be negative']
    },
    availableCopies: {
        type: Number,
        required: [true, 'Please add available number of copies'],
        min: [0, 'Available copies cannot be negative']
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
        trim: true,
        maxlength: [50, 'Location cannot be more than 50 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure available copies cannot exceed total copies
BookSchema.pre('save', function(next) {
    if (this.availableCopies > this.totalCopies) {
        this.availableCopies = this.totalCopies;
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Book', BookSchema);
