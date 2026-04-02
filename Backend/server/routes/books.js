const express = require('express');
const router = express.Router();
const { getBooks, getBook, createBook, updateBook, deleteBook, getFeaturedBooks } = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getBooks);
router.get('/featured', getFeaturedBooks);
router.get('/:id', getBook);
router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
