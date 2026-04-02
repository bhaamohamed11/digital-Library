const Order = require('../models/Order');
const Book = require('../models/Book');

const createOrder = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // تأكد إن المستخدم مشتراش الكتاب قبل كده
    const existing = await Order.findOne({ user: req.user._id, book: book._id });
    if (existing) return res.status(400).json({ message: 'Already purchased' });

    const order = await Order.create({
      user: req.user._id,
      book: book._id,
      price: book.price,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('book');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders };