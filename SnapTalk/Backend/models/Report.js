const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetType: { type: String, enum: ['user', 'message', 'group', 'channel'], required: true },
  targetId: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);
