const Category = require('../models/Category');
const Book = require('../models/Book');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const withCounts = await Promise.all(categories.map(async (cat) => {
      const count = await Book.countDocuments({ category: cat.name });
      return { ...cat.toObject(), bookCount: count };
    }));
    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const exists = await Category.findOne({ name: req.body.name });
    if (exists) return res.status(400).json({ message: 'Category already exists' });
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };