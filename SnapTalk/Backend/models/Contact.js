const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customName: { type: String, trim: true },
  status: { type: String, enum: ['accepted', 'pending', 'blocked'], default: 'accepted' }
}, { timestamps: true });

contactSchema.index({ user: 1, contactUser: 1 }, { unique: true });

module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
