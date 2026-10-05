const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['message', 'call', 'meeting_invite', 'group_invite', 'mention', 'reaction'], required: true },
  title: { type: String, required: true },
  body: { type: String, default: '' },
  data: { type: Object, default: {} },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
