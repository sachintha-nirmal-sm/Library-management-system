const express = require('express');
const router = express.Router();
const watchLaterController = require('../controllers/watchLaterController');

// Get all watch later items
router.get('/', watchLaterController.getWatchLater);

// Add a book to watch later
router.post('/', watchLaterController.addToWatchLater);

// Remove a book from watch later
router.delete('/:bookId', watchLaterController.removeFromWatchLater);

module.exports = router; 