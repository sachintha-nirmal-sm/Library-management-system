const mongoose = require('mongoose');

const dburl = "mongodb+srv://snirmalsm:dbuser@library.qapvjlz.mongodb.net/?retryWrites=true&w=majority&appName=Library";

mongoose.set('strictQuery', true,"useNewUrlPaeser,true");

const connection = async() => {

    try{
        await mongoose.connect(dburl);
        console.log("MongoDB Connected");
    }catch(e) {
        console.error(e.message);
        process.exit();
    }
};

module.exports = connection;