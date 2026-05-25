const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Book = require('../models/Book');
const User = require('../models/User');
const Order = require('../models/Order');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalBooks,
      totalUsers,
      totalOrders,
      pendingBooks,
      recentOrders,
      topBooks,
    ] = await Promise.all([
      Book.countDocuments({ status: 'published' }),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Book.countDocuments({ status: 'submit' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email').populate('book', 'title cover price'),
      Order.aggregate([
        { $group: { _id: '$book', totalSales: { $sum: '$price' }, count: { $sum: 1 } } },
        { $sort: { totalSales: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
        { $unwind: '$book' },
      ]),
    ]);

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$price' },
          orders: { $sum: 1 },
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 6 },
    ]);

    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      totalBooks,
      totalUsers,
      totalOrders,
      pendingBooks,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      topBooks,
      revenueData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;