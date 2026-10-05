const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['text', 'image', 'video'], default: 'text' },
  content: { type: String, default: '' },
  mediaUrl: { type: String, default: '' },
  bgColor: { type: String, default: '#2563EB' },
  viewers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    viewedAt: { type: Date, default: Date.now }
  }],
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    index: { expires: 0 }
  }
}, { timestamps: true });

statusSchema.index({ user: 1 });

module.exports = mongoose.models.Status || mongoose.model('Status', statusSchema);
