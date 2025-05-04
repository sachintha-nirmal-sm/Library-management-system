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
  publishedYear: {
    type: Number
  },
  genre: {
    type: String,
    trim: true
  },
  coverImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploads.files' // Reference to GridFS collection
  },
  pdfFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploads.files' // Reference to GridFS collection
  },
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 1 // Set default to the minimum allowed value
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