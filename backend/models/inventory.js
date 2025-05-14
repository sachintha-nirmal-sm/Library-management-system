const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({

    ISBN:{
        type: String,
        required: true,
    },
    BookName:{
        type: String,
    },
    Author:{
        type: String,
    },
    Category:{
        type: String,
    },
    PublishedDate:{
        type: String,
    }
});

module.exports = mongoose.model('inventory', inventorySchema);
