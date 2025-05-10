const mongoose = require('mongoose');

const dburl = process.env.DB_URL; // Use environment variable for database URL

mongoose.set("strrictQuery", true, "userNewUrlParser", true);

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