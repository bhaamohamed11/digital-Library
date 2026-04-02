const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/my-orders', protect, getMyOrders);
router.post('/:bookId', protect, createOrder);

module.exports = router;