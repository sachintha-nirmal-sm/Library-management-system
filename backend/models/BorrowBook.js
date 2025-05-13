const mongoose = require("mongoose");

const BorrowBookSchema = new mongoose.Schema({
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
  userId: {
    type: String,
    required: true,
  },

  borrowerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
    
  },
  borrowDate: {
    type: Date,
    required: true,
    
  },
});



module.exports = BorrowBook = mongoose.model("BorrowBook", BorrowBookSchema);
