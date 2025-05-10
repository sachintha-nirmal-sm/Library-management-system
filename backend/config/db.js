const mongoose = require('mongoose');

const dburl = "mongodb+srv://snirmalsm:dbuser@library.qapvjlz.mongodb.net/?retryWrites=true&w=majority&appName=Library";

mongoose.set("strrictQuery",true,"userNewUrlParser" ,true);

const connection = async () => {
   try{
    await mongoose.connect(dburl);
    console.log("MongoDB connected successfully");
   }catch (e){
    console.error(e.message);
    process.exit();
   }

};

module .exports = connection;