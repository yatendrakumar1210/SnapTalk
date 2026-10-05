const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true, unique: true, index: true },
  title: { type: String, default: 'SnapTalk Meeting' },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coHosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  passcode: { type: String, default: '' },
  isLocked: { type: Boolean, default: false },
  waitingRoomEnabled: { type: Boolean, default: false },
  mode: { type: String, enum: ['normal', 'online_class', 'study_room', 'team'], default: 'normal' },
  activeParticipants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    socketId: { type: String },
    name: { type: String },
    isMuted: { type: Boolean, default: false },
    isCameraOn: { type: Boolean, default: true },
    handRaised: { type: Boolean, default: false },
    isSharingScreen: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now }
  }],
  waitingParticipants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    socketId: { type: String },
    name: { type: String },
    requestedAt: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['scheduled', 'active', 'ended'], default: 'active' },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  recordingUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
