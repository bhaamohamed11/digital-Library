const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites').populate('readingHistory.book');
  res.json(user);
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, avatar: updated.avatar, token: generateToken(updated._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const bookId = req.params.bookId;
    const idx = user.favorites.indexOf(bookId);
    if (idx > -1) {
      user.favorites.splice(idx, 1);
    } else {
      user.favorites.push(bookId);
    }
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateReadingHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { bookId, progress } = req.body;
    const existing = user.readingHistory.find(h => h.book.toString() === bookId);
    if (existing) {
      existing.progress = progress;
      existing.lastRead = Date.now();
    } else {
      user.readingHistory.unshift({ book: bookId, progress, lastRead: Date.now() });
    }
    await user.save();
    res.json({ message: 'History updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFavoriteBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHistoryBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('readingHistory.book');
    const books = user.readingHistory.map(h => h.book).filter(Boolean);
    res.json(books || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, toggleFavorite, updateReadingHistory, getFavoriteBooks, getHistoryBooks };