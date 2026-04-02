const express = require('express');
const router = express.Router();
const { protect, reviewerOnly } = require('../middleware/auth');
const Book = require('../models/Book');

// جيب الكتب اللي محتاجة مراجعة
router.get('/books', protect, reviewerOnly, async (req, res) => {
  try {
    const books = await Book.find({ status: { $in: ['submit', 'review'] } });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// غير status الكتاب
router.put('/books/:id', protect, reviewerOnly, async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote },
      { new: true }
    );
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;