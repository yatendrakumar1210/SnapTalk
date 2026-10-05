const Group = require('../models/Group');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const createGroup = async (req, res) => {
  try {
    const { name, description, avatar, memberIds, permissions } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Group name is required' });
    }

    const uniqueMemberIds = Array.from(new Set([...(memberIds || []), req.user._id.toString()]));

    const members = uniqueMemberIds.map(id => ({
      user: id,
      role: id.toString() === req.user._id.toString() ? 'owner' : 'member',
      joinedAt: new Date()
    }));

    const conversation = await Conversation.create({
      type: 'group',
      name: name.trim(),
      avatar: avatar || '',
      description: description || '',
      participants: uniqueMemberIds
    });

    const group = await Group.create({
      name: name.trim(),
      description: description || '',
      avatar: avatar || '',
      owner: req.user._id,
      members,
      conversation: conversation._id,
      permissions: permissions || {
        sendMessages: true,
        editGroupInfo: false,
        addMembers: true,
        startCalls: true,
        useSmartboard: true
      }
    });

    conversation.group = group._id;
    await conversation.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('members.user', 'name username phone avatar bio status')
      .populate('owner', 'name username avatar');

    return res.status(201).json({ success: true, message: 'Group created successfully', group: populatedGroup, conversation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate('members.user', 'name username phone avatar bio status')
      .populate('owner', 'name username avatar');

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });
    return res.status(200).json({ success: true, group });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateGroupInfo = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, avatar, permissions } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (name) group.name = name.trim();
    if (description !== undefined) group.description = description;
    if (avatar !== undefined) group.avatar = avatar;
    if (permissions) group.permissions = { ...group.permissions, ...permissions };

    await group.save();

    // Update conversation if linked
    if (group.conversation) {
      await Conversation.findByIdAndUpdate(group.conversation, {
        name: group.name,
        avatar: group.avatar,
        description: group.description
      });
    }

    return res.status(200).json({ success: true, message: 'Group updated successfully', group });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addGroupMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const exists = group.members.some(m => m.user.toString() === userId);
    if (!exists) {
      group.members.push({ user: userId, role: 'member', joinedAt: new Date() });
      await group.save();

      await Conversation.findByIdAndUpdate(group.conversation, {
        $addToSet: { participants: userId }
      });
    }

    const updated = await Group.findById(group._id).populate('members.user', 'name username avatar');
    return res.status(200).json({ success: true, group: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeGroupMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    group.members = group.members.filter(m => m.user.toString() !== userId);
    await group.save();

    await Conversation.findByIdAndUpdate(group.conversation, {
      $pull: { participants: userId }
    });

    return res.status(200).json({ success: true, message: 'Member removed', groupId, userId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, role } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const member = group.members.find(m => m.user.toString() === userId);
    if (member) {
      member.role = role;
      await group.save();
    }

    return res.status(200).json({ success: true, message: 'Member role updated', role });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createGroup,
  getGroupDetails,
  updateGroupInfo,
  addGroupMember,
  removeGroupMember,
  updateMemberRole
};
