const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({

    Message:{
        type: String,
        required: true,
    },
    Date:{
        type: String,
    },
    SendTO:{
        type: String,
    },
   
});

module.exports = mongoose.model('notification', notificationSchema);
