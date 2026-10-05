const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  avatar: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  allowComments: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Channel || mongoose.model('Channel', channelSchema);
