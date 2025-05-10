const express = require('express');
const dbConnection = require('./config/db');
const borrowRoutes = require('./routes/borrowbooks');
const returnRoutes = require('./routes/returnbooks'); // ✅ Import return book routes
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB Connection
dbConnection();

// Routes
app.get('/', (req, res) => res.send('Hello World!'));

app.use('/api/borrowbooks', borrowRoutes);  // 📘 Borrow book routes
app.use('/api/returnbooks', returnRoutes);  // 📕 Return book routes

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
