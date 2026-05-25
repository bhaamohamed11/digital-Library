const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, toggleFavorite, updateReadingHistory, getFavoriteBooks, getHistoryBooks, getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/favorites', protect, getFavoriteBooks);
router.put('/favorites/:bookId', protect, toggleFavorite);
router.get('/history', protect, getHistoryBooks);
router.post('/history', protect, updateReadingHistory);
router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;