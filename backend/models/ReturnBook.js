const mongoose = require('mongoose');

const ReturnBookSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: true,
    },

    bookName: {
        type: String,
        required: true,
    },

    author: {
        type: String,
        required: true,
        
    },

    category: {
        type: String,
        required: true,
       },
    
    publishedDate: {
        type: Date,
        required: true,
        
    },
    borrowerName: {
        type: String,
        required: true,
    },

    borrowDate: {
        type: Date,
        required: true,
        
    }, 
    returnDate: {
        type: Date,
        required: true,
        
    },
});

module.exports = ReturnBook = mongoose.model("ReturnBook", ReturnBookSchema);