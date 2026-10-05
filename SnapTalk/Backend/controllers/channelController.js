const Channel = require('../models/Channel');
const Conversation = require('../models/Conversation');

const createChannel = async (req, res) => {
  try {
    const { name, description, avatar } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Channel name required' });

    const conversation = await Conversation.create({
      type: 'channel',
      name: name.trim(),
      avatar: avatar || '',
      description: description || '',
      participants: [req.user._id]
    });

    const channel = await Channel.create({
      name: name.trim(),
      description: description || '',
      avatar: avatar || '',
      owner: req.user._id,
      admins: [req.user._id],
      subscribers: [req.user._id],
      conversation: conversation._id
    });

    conversation.channel = channel._id;
    await conversation.save();

    return res.status(201).json({ success: true, channel, conversation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find().populate('owner', 'name avatar').populate('conversation');
    return res.status(200).json({ success: true, channels });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const subscribeChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ success: false, message: 'Channel not found' });

    if (!channel.subscribers.includes(req.user._id)) {
      channel.subscribers.push(req.user._id);
      await channel.save();

      await Conversation.findByIdAndUpdate(channel.conversation, {
        $addToSet: { participants: req.user._id }
      });
    }

    return res.status(200).json({ success: true, message: 'Subscribed to channel', channelId });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createChannel, getChannels, subscribeChannel };
