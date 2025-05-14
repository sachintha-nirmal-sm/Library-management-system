const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Get library data
router.get('/:userId', async (req, res) => {
  try {
    const library = await Progress.find({ userId: req.params.userId }).populate('bookId');
    res.status(200).json(library);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching library data', error });
  }
});

module.exports = router;