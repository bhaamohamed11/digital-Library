const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  nameAr: { type: String, default: '' },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '📚' },
  color: { type: String, default: '#7C3AED' },
  gradient: { type: String, default: 'from-purple-600 to-indigo-600' },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
