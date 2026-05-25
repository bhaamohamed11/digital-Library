const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.post('/:bookId', protect, createOrder);

module.exports = router;