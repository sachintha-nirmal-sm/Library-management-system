const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

    ISBN:{
        type: String,
        required: true,
    },
    BookName:{
        type: String,
    },
    BorrowerName:{
        type: String,
    },
    BorrowDate:{
        type: String,
    },
    ReturnDate:{
        type: String,
    },
    OverdueDays:{
        type: Number,
    },
    TotalFine:{
        type: Number,
    }
});

module.exports = mongoose.model('payment', paymentSchema);
