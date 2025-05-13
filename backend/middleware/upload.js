const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

// Configure temporary storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Validate PDF file
const validatePDF = async (file) => {
  try {
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdfParse(dataBuffer);
    return data && data.numpages > 0;
  } catch (error) {
    console.error('PDF validation error:', error);
    return false;
  }
};

// Configure Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Different parameters for images and PDFs
    if (file.mimetype.startsWith('image/')) {
      return {
        folder: 'book-covers',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        resource_type: 'image',
        transformation: [
          { width: 1000, height: 1500, crop: 'fill', quality: 'auto' }
        ]
      };
    } else if (file.mimetype === 'application/pdf') {
      return {
        folder: 'book-pdfs',
        resource_type: 'raw',
        format: 'pdf'
      };
    }
  }
});

// Create multer upload instance with fields configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: async (req, file, cb) => {
    // Accept images and PDFs
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (file.mimetype === 'application/pdf') {
      // For PDFs, we'll validate after the file is saved
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
    }
  }
});

// Create the fields middleware
const uploadFields = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]);

// Add PDF validation middleware
const uploadWithValidation = async (req, res, next) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    // Validate PDF if it exists
    if (req.files && req.files['pdfFile'] && req.files['pdfFile'][0]) {
      const isValid = await validatePDF(req.files['pdfFile'][0]);
      if (!isValid) {
        // Clean up the invalid file
        fs.unlinkSync(req.files['pdfFile'][0].path);
        return res.status(400).json({ message: 'Invalid PDF file. Please upload a valid PDF document.' });
      }
    }

    next();
  });
};

module.exports = uploadWithValidation;