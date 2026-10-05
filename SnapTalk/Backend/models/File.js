const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.File || mongoose.model('File', fileSchema);
