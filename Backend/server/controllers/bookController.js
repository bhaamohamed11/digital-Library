const Book = require('../models/Book');

const getBooks = async (req, res) => {
  try {
    const { search, category, language, minRating, sort, page = 1, limit = 12, featured } = req.query;
    const query = { status: 'published' };

    if (search) {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { author: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
  ];
}
    if (category && category !== 'all') query.category = category;
    if (language) query.language = language;
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (featured === 'true') query.featured = true;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      rating: { rating: -1 },
      title: { title: 1 },
      downloads: { downloads: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    const total = await Book.countDocuments(query);
    const books = await Book.find(query).sort(sortBy).skip((page - 1) * limit).limit(Number(limit));

    res.json({ books, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    book.downloads += 1;
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({ featured: true, status: 'published' }).limit(8);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook, getFeaturedBooks };