const Book = require('../models/Book');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// Get a single book by ISBN
exports.getBookByIsbn = async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, coverImage, pdfFile } = req.body;

    if (!title || !author || !isbn) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missing: {
          title: !title,
          author: !author,
          isbn: !isbn
        }
      });
    }

    console.log('Request body:', req.body); // Debugging log

    const book = new Book({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      description: req.body.description?.trim() || "No description available",
      publishedYear: req.body.publishedYear,
      genre: req.body.genre?.trim(),
      coverImage: coverImage, // Use fileId directly
      pdfFile: pdfFile, // Use fileId directly
      available: true
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error details:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'ISBN already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { isbn } = req.params;
    const updateData = {
      title: req.body.title?.trim(),
      author: req.body.author?.trim(),
      description: req.body.description?.trim() || "No description available",
      publishedYear: req.body.publishedYear,
      genre: req.body.genre?.trim(),
      available: true
    };

    // Handle file uploads if they exist
    if (req.files) {
      if (req.files['coverImage']) {
        updateData.coverImage = req.files['coverImage'][0].filename;
      }
      if (req.files['pdfFile']) {
        updateData.pdfFile = req.files['pdfFile'][0].filename;
      }
    }

    const book = await Book.findOneAndUpdate(
      { isbn: isbn },
      updateData,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'ISBN already exists' });
    }
    res.status(500).json({ 
      message: 'Error updating book',
      error: error.message 
    });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ isbn: req.params.isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

// Update book rating
exports.updateBookRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating value' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.rating = rating;
    await book.save();

    res.status(200).json({ message: 'Rating updated successfully', book });
  } catch (error) {
    console.error('Error updating book rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get books by category
exports.getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Find books with the specified category
    const books = await Book.find({ genre: category })
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!books || books.length === 0) {
      return res.status(404).json({ 
        message: `No books found in the ${category} category` 
      });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ 
      message: 'Error fetching books by category',
      error: error.message 
    });
  }
};