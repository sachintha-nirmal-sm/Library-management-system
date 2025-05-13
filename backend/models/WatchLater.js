const mongoose = require('mongoose');

const watchLaterSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WatchLater', watchLaterSchema); 