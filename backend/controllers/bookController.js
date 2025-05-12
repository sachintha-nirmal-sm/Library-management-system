const Book = require('../models/Book');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
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
    const { title, author, isbn, description, genre, publishedYear, category, pages, bookText } = req.body;

    if (!title || !author || !isbn || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missing: {
          title: !title,
          author: !author,
          isbn: !isbn,
          category: !category
        }
      });
    }

    let coverImageUrl = null;
    let pdfFileUrl = null;

    // Handle file uploads to Cloudinary if they exist
    if (req.files) {
      try {
        if (req.files['coverImage'] && req.files['coverImage'][0]) {
          const coverResult = await cloudinary.uploader.upload(req.files['coverImage'][0].path, {
            folder: 'book-covers',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
            transformation: [
              { width: 1000, height: 1500, crop: 'fill', quality: 'auto' }
            ]
          });
          coverImageUrl = coverResult.secure_url;
          
          // Clean up temporary file
          fs.unlinkSync(req.files['coverImage'][0].path);
        }

        if (req.files['pdfFile'] && req.files['pdfFile'][0]) {
          const pdfResult = await cloudinary.uploader.upload(req.files['pdfFile'][0].path, {
            folder: 'book-pdfs',
            resource_type: 'raw',
            format: 'pdf'
          });
          pdfFileUrl = pdfResult.secure_url;
          
          // Clean up temporary file
          fs.unlinkSync(req.files['pdfFile'][0].path);
        }
      } catch (uploadError) {
        console.error('Error uploading files to Cloudinary:', uploadError);
        // Clean up temporary files in case of error
        if (req.files) {
          if (req.files['coverImage']?.[0]?.path) {
            fs.unlinkSync(req.files['coverImage'][0].path);
          }
          if (req.files['pdfFile']?.[0]?.path) {
            fs.unlinkSync(req.files['pdfFile'][0].path);
          }
        }
        return res.status(500).json({ 
          message: 'Error uploading files',
          error: uploadError.message 
        });
      }
    }

    const book = new Book({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      description: description?.trim() || "No description available",
      publishedYear: publishedYear,
      genre: genre?.trim(),
      category: category.trim(),
      pages: parseInt(pages) || 0,
      coverImage: coverImageUrl,
      pdfFile: pdfFileUrl,
      available: true,
      bookText: bookText?.trim() || ''
    });

    await book.save();
    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('Error creating book:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'ISBN already exists' });
    }
    res.status(500).json({ 
      message: 'Error creating book',
      error: error.message 
    });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { isbn } = req.params;
    const { title, author, description, genre, publishedYear, category, bookText } = req.body;

    // Find the book
    const book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update book fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (genre) book.genre = genre;
    if (publishedYear) book.publishedYear = publishedYear;
    if (category) book.category = category;
    if (bookText) book.bookText = bookText;

    // Handle file uploads if any
    if (req.files?.coverImage) {
      const coverResult = await cloudinary.uploader.upload(
        req.files.coverImage[0].path,
        {
          folder: 'book-covers',
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'],
          transformation: [
            { quality: 'auto' }
          ]
        }
      );
      book.coverImage = coverResult.secure_url;
    }

    await book.save();
    res.json({ message: 'Book updated successfully', book });
  } catch (err) {
    console.error('Error in updateBook:', err);
    res.status(500).json({
      message: 'Failed to update book',
      error: err.message
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
    
    // Find books with the specified category (case-insensitive)
    const books = await Book.find({ 
      category: { $regex: new RegExp(`^${category}$`, 'i') }
    }).sort({ createdAt: -1 }); // Sort by newest first

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

// Add a new book with file uploads
exports.addBook = async (req, res) => {
  try {
    const { title, author, isbn, description, genre, publishedYear, category, bookText } = req.body;

    // Validate required fields
    if (!title || !author || !isbn) {
      return res.status(400).json({ message: 'Title, author, and ISBN are required' });
    }

    // Upload files to Cloudinary
    let coverImageUrl = '';
    let pdfUrl = '';

    if (req.files?.coverImage) {
      const coverResult = await cloudinary.uploader.upload(
        req.files.coverImage[0].path,
        {
          folder: 'book-covers',
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'],
          transformation: [
            { quality: 'auto' }
          ]
        }
      );
      coverImageUrl = coverResult.secure_url;
    }

    if (req.files?.pdfFile) {
      const pdfResult = await cloudinary.uploader.upload(
        req.files.pdfFile[0].path,
        {
          folder: 'book-pdfs',
          resource_type: 'raw',
          format: 'pdf'
        }
      );
      pdfUrl = pdfResult.secure_url;
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      description: description || 'No description available',
      genre,
      publishedYear,
      category,
      coverImage: coverImageUrl,
      pdfFile: pdfUrl,
      status: 'available',
      bookText: bookText?.trim() || ''
    });

    await newBook.save();
    res.status(201).json({
      message: 'Book added successfully',
      book: newBook
    });
  } catch (err) {
    console.error('Error in addBook:', err);
    res.status(500).json({
      message: 'Failed to add book',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

const readBookText = (text) => {
  if (!text) return;
  // Stop any ongoing speech
  synth.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  synth.speak(utterance);
  setIsReading(true);
  utterance.onend = () => setIsReading(false);
};

const toggleBookText = () => {
  setShowBookText((prev) => {
    const newState = !prev;
    if (newState && book.bookText) {
      readBookText(book.bookText);
    } else {
      synth.cancel();
      setIsReading(false);
    }
    return newState;
  });
};