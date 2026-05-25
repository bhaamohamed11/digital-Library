const express = require('express');
const router = express.Router();
const { getBooks, getBook, createBook, updateBook, deleteBook, getFeaturedBooks } = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/auth');
const Book = require('../models/Book');

router.get('/', getBooks);
router.get('/featured', getFeaturedBooks);
router.get('/authors/all', async (req, res) => {
  try {
    const authors = await Book.aggregate([
      { $match: {} },
      { $group: {
        _id: '$author',
        bookCount: { $sum: 1 },
        cover: { $first: '$cover' },
        category: { $first: '$category' },
        rating: { $avg: '$rating' }
      }},
      { $sort: { bookCount: -1 } }
    ]);
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', getBook);
router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;