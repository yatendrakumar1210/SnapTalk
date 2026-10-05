const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  caller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['audio', 'video'], default: 'audio' },
  status: { type: String, enum: ['incoming', 'outgoing', 'missed', 'completed', 'rejected', 'busy'], default: 'outgoing' },
  duration: { type: Number, default: 0 }, // seconds
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
}, { timestamps: true });

callSchema.index({ caller: 1 });
callSchema.index({ receiver: 1 });

module.exports = mongoose.models.Call || mongoose.model('Call', callSchema);
