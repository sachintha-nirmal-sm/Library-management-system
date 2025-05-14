const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Get all books
exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (err) {
        next(err);
    }
};

// Get a single book by ID or ISBN
exports.getBookByIdOrIsbn = async (req, res, next) => {
    try {
        const book = req.params.id
            ? await Book.findById(req.params.id)
            : await Book.findOne({ isbn: req.params.isbn });

        if (!book) {
            return next(new ErrorResponse(`Book not found`, 404));
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        next(err);
    }
};

// Create a new book
exports.createBook = async (req, res, next) => {
    try {
        const { title, author, isbn, description, genre, publishedYear, category, pages, bookText } = req.body;

        if (!title || !author || !isbn || !category) {
            return next(new ErrorResponse('Missing required fields', 400));
        }

        let coverImageUrl = null;
        let pdfFileUrl = null;

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
                    fs.unlinkSync(req.files['coverImage'][0].path);
                }

                if (req.files['pdfFile'] && req.files['pdfFile'][0]) {
                    const pdfResult = await cloudinary.uploader.upload(req.files['pdfFile'][0].path, {
                        folder: 'book-pdfs',
                        resource_type: 'raw',
                        format: 'pdf'
                    });
                    pdfFileUrl = pdfResult.secure_url;
                    fs.unlinkSync(req.files['pdfFile'][0].path);
                }
            } catch (uploadError) {
                console.error('Error uploading files to Cloudinary:', uploadError);
                if (req.files) {
                    if (req.files['coverImage']?.[0]?.path) {
                        fs.unlinkSync(req.files['coverImage'][0].path);
                    }
                    if (req.files['pdfFile']?.[0]?.path) {
                        fs.unlinkSync(req.files['pdfFile'][0].path);
                    }
                }
                return next(new ErrorResponse('Error uploading files', 500));
            }
        }

        const book = new Book({
            title: title.trim(),
            author: author.trim(),
            isbn: isbn.trim(),
            description: description?.trim() || 'No description available',
            publishedYear,
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
            success: true,
            data: book
        });
    } catch (err) {
        next(err);
    }
};

// Update a book
exports.updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, author, description, genre, publishedYear, category, bookText } = req.body;

        const book = await Book.findById(id);
        if (!book) {
            return next(new ErrorResponse('Book not found', 404));
        }

        if (title) book.title = title;
        if (author) book.author = author;
        if (description) book.description = description;
        if (genre) book.genre = genre;
        if (publishedYear) book.publishedYear = publishedYear;
        if (category) book.category = category;
        if (bookText) book.bookText = bookText;

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
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        next(err);
    }
};

// Delete a book
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return next(new ErrorResponse('Book not found', 404));
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// Search books
exports.searchBooks = async (req, res, next) => {
    try {
        const { title, author, genre } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (author) {
            query.author = { $regex: author, $options: 'i' };
        }
        if (genre) {
            query.genre = { $regex: genre, $options: 'i' };
        }

        const books = await Book.find(query);
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (err) {
        next(err);
    }
};
