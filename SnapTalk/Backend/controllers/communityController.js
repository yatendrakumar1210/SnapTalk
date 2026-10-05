const Community = require('../models/Community');

const createCommunity = async (req, res) => {
  try {
    const { name, description, avatar } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Community name required' });

    const community = await Community.create({
      name: name.trim(),
      description: description || '',
      avatar: avatar || '',
      owner: req.user._id,
      admins: [req.user._id],
      members: [req.user._id]
    });

    return res.status(201).json({ success: true, community });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find({ members: req.user._id })
      .populate('groups')
      .populate('channels')
      .populate('owner', 'name avatar');
    return res.status(200).json({ success: true, communities });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createCommunity, getCommunities };
