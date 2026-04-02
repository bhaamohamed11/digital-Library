const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  cover: { type: String, required: true },
  pdfUrl: { type: String, default: '' },
  category: { type: String, required: true },
  tags: [String],
  language: { type: String, default: 'Arabic' },
  pages: { type: Number, default: 0 },
  publishYear: { type: Number },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  isbn: { type: String, default: '' },
  price: { type: Number, default: 0 },
isFree: { type: Boolean, default: false },
status: { type: String, enum: ['submit', 'review', 'published'], default: 'published' },
submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
reviewNote: { type: String, default: '' },
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Book', bookSchema);
