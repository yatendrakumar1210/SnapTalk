const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'admin', 'moderator', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now }
}, { _id: false });

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  avatar: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [memberSchema],
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  permissions: {
    sendMessages: { type: Boolean, default: true },
    editGroupInfo: { type: Boolean, default: false }, // only admins by default
    addMembers: { type: Boolean, default: true },
    startCalls: { type: Boolean, default: true },
    useSmartboard: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.models.Group || mongoose.model('Group', groupSchema);
