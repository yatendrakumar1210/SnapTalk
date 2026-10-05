const mongoose = require('mongoose');

const whiteboardSchema = new mongoose.Schema({
  meetingId: { type: String, required: true, index: true },
  pages: [{
    id: { type: String, required: true },
    title: { type: String, default: 'Board' },
    elements: { type: Array, default: [] }
  }],
  activePageId: { type: String, default: 'page_1' },
  studentDrawingEnabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Whiteboard || mongoose.model('Whiteboard', whiteboardSchema);
