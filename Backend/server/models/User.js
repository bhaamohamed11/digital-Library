const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin', 'reviewer'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  readingHistory: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    lastRead: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }
  }],
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') return next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
  if (typeof next === 'function') next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
