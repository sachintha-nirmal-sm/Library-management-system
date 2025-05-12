const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  bookText: {
    type: String,
    trim: true
  },
  publishedYear: {
    type: Number
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
    type: String // Cloudinary URL
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Book', bookSchema);