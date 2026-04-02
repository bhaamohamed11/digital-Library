const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, toggleFavorite, updateReadingHistory, getFavoriteBooks, getHistoryBooks } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/favorites', protect, getFavoriteBooks);
router.put('/favorites/:bookId', protect, toggleFavorite);
router.get('/history', protect, getHistoryBooks);
router.post('/history', protect, updateReadingHistory);

module.exports = router;