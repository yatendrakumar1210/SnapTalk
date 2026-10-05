const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  device: { type: String, default: 'Unknown Device' },
  ip: { type: String, default: '127.0.0.1' },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

sessionSchema.index({ user: 1 });

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);
