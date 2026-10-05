const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  type: { type: String, enum: ['direct', 'group', 'channel'], default: 'direct' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  name: { type: String, default: '' },
  avatar: { type: String, default: '' },
  description: { type: String, default: '' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  unreadCounts: { type: Map, of: Number, default: {} }
}, { timestamps: true });

conversationSchema.index({ participants: 1 });

module.exports = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
