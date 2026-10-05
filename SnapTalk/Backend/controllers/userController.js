const User = require('../models/User');
const Report = require('../models/Report');

const updateProfile = async (req, res) => {
  try {
    const { name, username, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (avatar !== undefined) user.avatar = avatar;

    if (username && username.trim() !== user.username) {
      const cleanUsername = username.trim().toLowerCase();
      const existing = await User.findOne({ username: cleanUsername });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Username is already taken' });
      }
      user.username = cleanUsername;
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updatePrivacy = async (req, res) => {
  try {
    const { lastSeen, profilePhoto, about, groupInvite } = req.body;
    const user = await User.findById(req.user._id);

    if (lastSeen) user.privacy.lastSeen = lastSeen;
    if (profilePhoto) user.privacy.profilePhoto = profilePhoto;
    if (about) user.privacy.about = about;
    if (groupInvite) user.privacy.groupInvite = groupInvite;

    await user.save();
    return res.status(200).json({ success: true, message: 'Privacy settings updated', privacy: user.privacy });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      return res.status(200).json({ success: true, users: [] });
    }

    const cleanQuery = query.trim();
    const regex = new RegExp(cleanQuery, 'i');

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { phone: regex },
        { username: regex },
        { name: regex },
        { email: regex }
      ]
    }).select('name username phone avatar bio status lastSeen privacy');

    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) return res.status(400).json({ success: false, message: 'Target user ID required' });

    const user = await User.findById(req.user._id);
    if (!user.blockedUsers.includes(targetUserId)) {
      user.blockedUsers.push(targetUserId);
      await user.save();
    }
    return res.status(200).json({ success: true, message: 'User blocked successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const unblockUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const user = await User.findById(req.user._id);
    user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== targetUserId);
    await user.save();
    return res.status(200).json({ success: true, message: 'User unblocked successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const reportTarget = async (req, res) => {
  try {
    const { targetType, targetId, reason, reportedUserId } = req.body;
    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ success: false, message: 'Target type, target ID and reason are required' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser: reportedUserId || null,
      targetType,
      targetId,
      reason,
      status: 'Pending'
    });

    return res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateProfile,
  updatePrivacy,
  searchUsers,
  blockUser,
  unblockUser,
  reportTarget
};
