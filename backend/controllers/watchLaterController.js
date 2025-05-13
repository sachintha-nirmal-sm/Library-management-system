const WatchLater = require('../models/WatchLater');
const Book = require('../models/Book');

// Get all watch later items
exports.getWatchLater = async (req, res) => {
  try {
    const watchLaterItems = await WatchLater.find().sort({ addedAt: -1 });
    res.json(watchLaterItems);
  } catch (error) {
    console.error('Error fetching watch later items:', error);
    res.status(500).json({ message: 'Error fetching watch later items' });
  }
};

// Add a book to watch later
exports.addToWatchLater = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if already in watch later
    const existingItem = await WatchLater.findOne({ bookId });
    if (existingItem) {
      return res.status(400).json({ message: 'Book already in watch later' });
    }

    // Create new watch later item
    const watchLaterItem = new WatchLater({
      bookId,
      title: book.title,
      author: book.author,
      genre: book.genre,
      coverImage: book.coverImage
    });

    await watchLaterItem.save();
    res.status(201).json(watchLaterItem);
  } catch (error) {
    console.error('Error adding to watch later:', error);
    res.status(500).json({ message: 'Error adding to watch later' });
  }
};

// Remove a book from watch later
exports.removeFromWatchLater = async (req, res) => {
  try {
    const { bookId } = req.params;
    const result = await WatchLater.findOneAndDelete({ bookId });
    
    if (!result) {
      return res.status(404).json({ message: 'Book not found in watch later' });
    }
    
    res.json({ message: 'Book removed from watch later' });
  } catch (error) {
    console.error('Error removing from watch later:', error);
    res.status(500).json({ message: 'Error removing from watch later' });
  }
}; 