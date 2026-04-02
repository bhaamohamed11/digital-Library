const Review = require('../models/Review');
const Book = require('../models/Book');

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const existing = await Review.findOne({ user: req.user._id, book: bookId });
    if (existing) return res.status(400).json({ message: 'You already reviewed this book' });

    const review = await Review.create({ user: req.user._id, book: bookId, rating, comment });

    // Update book avg rating
    const reviews = await Review.find({ book: bookId });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Book.findByIdAndUpdate(bookId, { rating: avg.toFixed(1), reviewCount: reviews.length });

    const populated = await review.populate('user', 'name avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReviews, addReview, deleteReview };
