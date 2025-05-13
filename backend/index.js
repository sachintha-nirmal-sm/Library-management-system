const express = require('express');
require('dotenv').config();               // Load environment variables
const dbConnection = require('./config/db'); // Unified DB connection import

// Route imports
const borrowRoutes = require('./routes/borrowbooks');
const returnRoutes = require('./routes/returnbooks');
const inventoryRoutes = require('./routes/inventorys');
const paymentsRoutes = require('./routes/payments');
const notificationsRoutes = require('./routes/notifications');
const otpRoutes = require('./routes/otp');

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB Connection
dbConnection();

// Health check / root
app.get('/', (req, res) => res.send('Hello World!'));

// Borrow/Return Book APIs
app.use('/api/borrowbooks', borrowRoutes);
app.use('/api/returnbooks', returnRoutes);

// Inventory, Payments, Notifications, OTP APIs
app.use('/api/inventorys', inventoryRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/send-otp', otpRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
