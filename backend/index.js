const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
//const dbConnection = require('./config/db');

// Load environment variables
dotenv.config();

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes');

require('dotenv').config(); 

const inventorysroutes = require("./routes/inventorys");
const paymentsroutes = require("./routes/payments");
const notificationsroutes = require("./routes/notifications");

const borrowRoutes = require('./routes/borrowbooks');
const returnRoutes = require('./routes/returnbooks');
const otpRoutes = require('./routes/otp');

const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const upload = require('./middleware/upload');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');


// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;




// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));
app.use("/api/inventorys",inventorysroutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check / root
app.get('/', (req, res) => res.send('Hello World!'));

// Route imports and usage
const bookRoutes = require('./routes/bookRoutes');
const watchLaterRoutes = require('./routes/watchLaterRoutes');

const borrowRoutes = require('./routes/borrowbooks');
const returnRoutes = require('./routes/returnbooks');
const inventoryRoutes = require('./routes/inventorys');
const paymentsRoutes = require('./routes/payments');
const notificationsRoutes = require('./routes/notifications');

const otpRoutes = require('./routes/otpRoutes');
const watchLaterRoutes = require('./routes/watchLaterRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected...');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Unified DB connection (if needed for other services)
dbConnection();

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/borrowbooks', borrowRoutes);
app.use('/api/returnbooks', returnRoutes);

const libraryRoutes = require('./routes/libraryRoutes');

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/watch-later', watchLaterRoutes);
app.use('/api/borrowbooks', borrowRoutes);
app.use('/api/returnbooks', returnRoutes);

// Inventory, Payments, Notifications, OTP APIs


app.use('/api/inventorys', inventoryRoutes);

app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use('/api/send-otp', otpRoutes);
app.use('/api/watch-later', watchLaterRoutes);

// Health check / root
app.get('/', (req, res) => res.send('Hello World!'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    app.use('/api/library', libraryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });

});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;
  }
);
