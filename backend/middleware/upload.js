const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const dotenv = require('dotenv');

dotenv.config();

// Create GridFS storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'uploads' // Collection name for files
    };
  }
});

const upload = multer({ storage });

module.exports = upload;