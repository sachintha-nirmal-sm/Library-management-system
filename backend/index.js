const express = require('express');

require('dotenv').config(); 

const dbconnection = require('./config/db');
const inventorysroutes = require("./routes/inventorys");
const paymentsroutes = require("./routes/payments");
const notificationsroutes = require("./routes/notifications");

const borrowRoutes = require('./routes/borrowbooks');
const returnRoutes = require('./routes/returnbooks');
const otpRoutes = require('./routes/otp');

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));
app.use("/api/inventorys",inventorysroutes);

// DB Connection
dbConnection();

// Health check / root
app.get('/', (req, res) => res.send('Hello World!'));

// Borrow/Return Book APIs
app.use('/api/borrowbooks', borrowRoutes);
app.use('/api/returnbooks', returnRoutes);

// Inventory, Payments, Notifications, OTP APIs
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/send-otp', otpRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
