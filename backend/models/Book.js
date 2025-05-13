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
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    genre: {
        type: String,
        required: [true, 'Please add a genre'],
        enum: [
            'Fiction',
            'Non-Fiction',
            'Science Fiction',
            'Mystery',
            'Romance',
            'Fantasy',
            'Biography',
            'History',
            'Science',
            'Technology',
            'Self-Help',
            'Poetry',
            'Drama',
            'Comedy',
            'Horror',
            'Thriller',
            'Adventure',
            'Children',
            'Young Adult',
            'Other'
        ]
    },
    isbn: {
        type: String,
        required: [true, 'Please add an ISBN'],
        unique: true,
        trim: true,
        maxlength: [13, 'ISBN cannot be more than 13 characters']
    },
    publisher: {
        type: String,
        required: [true, 'Please add a publisher'],
        trim: true,
        maxlength: [100, 'Publisher name cannot be more than 100 characters']
    },
    publicationYear: {
        type: Number,
        required: [true, 'Please add a publication year'],
        min: [1000, 'Publication year must be a valid year'],
        max: [new Date().getFullYear(), 'Publication year cannot be in the future']
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
    coverImage: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure available copies cannot exceed total copies
BookSchema.pre('save', function(next) {
    if (this.availableCopies > this.totalCopies) {
        this.availableCopies = this.totalCopies;
    }
    next();
});

module.exports = mongoose.model('Book', BookSchema); 