const Status = require('../models/Status');
const Contact = require('../models/Contact');

const createStatus = async (req, res) => {
  try {
    const { type, content, mediaUrl, bgColor } = req.body;
    if (!content && !mediaUrl) {
      return res.status(400).json({ success: false, message: 'Status content or media required' });
    }

    const statusItem = await Status.create({
      user: req.user._id,
      type: type || 'text',
      content: content || '',
      mediaUrl: mediaUrl || '',
      bgColor: bgColor || '#2563EB'
    });

    const populated = await Status.findById(statusItem._id).populate('user', 'name username avatar');
    return res.status(201).json({ success: true, status: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getFeedStatuses = async (req, res) => {
  try {
    const userContacts = await Contact.find({ user: req.user._id, status: 'accepted' }).select('contactUser');
    const contactIds = userContacts.map(c => c.contactUser);
    const allUserIds = [req.user._id, ...contactIds];

    const statuses = await Status.find({ user: { $in: allUserIds } })
      .populate('user', 'name username avatar')
      .populate('viewers.user', 'name username avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, statuses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markStatusViewed = async (req, res) => {
  try {
    const { statusId } = req.params;
    const statusItem = await Status.findById(statusId);
    if (!statusItem) return res.status(404).json({ success: false, message: 'Status not found' });

    const alreadyViewed = statusItem.viewers.some(v => v.user.toString() === req.user._id.toString());
    if (!alreadyViewed) {
      statusItem.viewers.push({ user: req.user._id, viewedAt: new Date() });
      await statusItem.save();
    }

    return res.status(200).json({ success: true, statusId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    await Status.deleteOne({ _id: statusId, user: req.user._id });
    return res.status(200).json({ success: true, message: 'Status deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createStatus, getFeedStatuses, markStatusViewed, deleteStatus };
