const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes); 