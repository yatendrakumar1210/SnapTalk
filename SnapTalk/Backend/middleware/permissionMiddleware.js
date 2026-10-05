const Group = require('../models/Group');
const Meeting = require('../models/Meeting');

const checkGroupPermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      const groupId = req.params.groupId || req.body.groupId;
      if (!groupId) return next();

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ success: false, message: 'Group not found' });
      }

      const userIdStr = req.user._id.toString();
      const isOwner = group.owner.toString() === userIdStr;
      const member = group.members.find(m => m.user.toString() === userIdStr);

      if (!member && !isOwner) {
        return res.status(403).json({ success: false, message: 'Not a group member' });
      }

      const role = isOwner ? 'owner' : member.role;
      if (role === 'owner' || role === 'admin') {
        return next();
      }

      if (permissionKey && !group.permissions[permissionKey]) {
        return res.status(403).json({
          success: false,
          message: `Permission denied: ${permissionKey} disabled for members.`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};

module.exports = { checkGroupPermission };
