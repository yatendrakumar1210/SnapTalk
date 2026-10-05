const User = require('../models/User');
const Message = require('../models/Message');
const Group = require('../models/Group');
const Meeting = require('../models/Meeting');
const Call = require('../models/Call');
const Report = require('../models/Report');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: { $in: ['Online', 'In Call'] } });
    const totalMessages = await Message.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalMeetings = await Meeting.countDocuments();
    const activeMeetings = await Meeting.countDocuments({ status: 'active' });
    const totalCalls = await Call.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalMessages,
        totalGroups,
        totalMeetings,
        activeMeetings,
        totalCalls,
        pendingReports
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getReportsAdmin = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email phone')
      .populate('reportedUser', 'name email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, reports });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body; // 'Pending', 'Reviewed', 'Resolved', 'Rejected'

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    report.status = status;
    await report.save();

    return res.status(200).json({ success: true, report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ success: true, message: 'User account deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsersAdmin,
  getReportsAdmin,
  updateReportStatus,
  deleteUserAdmin
};
