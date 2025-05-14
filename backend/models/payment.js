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
    },
    Status:{
        type: String,
        default: "Unpaid",
    },
    paymentMethod:{
        type: String,
    },
    paymentSlip:{
        type: String,
    },

});

module.exports = mongoose.model('payment', paymentSchema);
