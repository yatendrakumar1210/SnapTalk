const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  username: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: 'Hey there! I am using SnapTalk.' },
  status: { type: String, enum: ['Online', 'Offline', 'In Call', 'Busy'], default: 'Offline' },
  lastSeen: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  privacy: {
    lastSeen: { type: String, enum: ['Everyone', 'My Contacts', 'Nobody'], default: 'Everyone' },
    profilePhoto: { type: String, enum: ['Everyone', 'My Contacts', 'Nobody'], default: 'Everyone' },
    about: { type: String, enum: ['Everyone', 'My Contacts', 'Nobody'], default: 'Everyone' },
    groupInvite: { type: String, enum: ['Everyone', 'My Contacts', 'Nobody'], default: 'Everyone' }
  },
  isOtpVerified: { type: Boolean, default: true },
  otpCode: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

userSchema.index({ phone: 1 });
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
