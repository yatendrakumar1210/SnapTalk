const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name username phone avatar bio status lastSeen')
      .populate('lastMessage')
      .populate('group')
      .populate('channel')
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrCreateDirectChat = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) return res.status(400).json({ success: false, message: 'Target user ID is required' });

    let conversation = await Conversation.findOne({
      type: 'direct',
      participants: { $all: [req.user._id, targetUserId] }
    })
      .populate('participants', 'name username phone avatar bio status lastSeen')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'direct',
        participants: [req.user._id, targetUserId]
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name username phone avatar bio status lastSeen');
    }

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, before } = req.query;

    const query = {
      conversation: conversationId,
      deletedFor: { $ne: req.user._id }
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('sender', 'name username avatar')
      .populate('replyTo')
      .sort({ createdAt: 1 })
      .limit(parseInt(limit));

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, type, mediaUrl, fileName, fileSize, replyTo, forwardedFrom } = req.body;

    if (!conversationId) {
      return res.status(400).json({ success: false, message: 'Conversation ID required' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      type: type || 'text',
      content: content || '',
      mediaUrl: mediaUrl || '',
      fileName: fileName || '',
      fileSize: fileSize || 0,
      replyTo: replyTo || null,
      forwardedFrom: forwardedFrom || null,
      status: 'sent'
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    const populatedMsg = await Message.findById(message._id)
      .populate('sender', 'name username avatar')
      .populate('replyTo');

    return res.status(201).json({ success: true, message: populatedMsg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only sender can edit message' });
    }

    message.content = content;
    await message.save();

    const updated = await Message.findById(message._id).populate('sender', 'name username avatar').populate('replyTo');
    return res.status(200).json({ success: true, message: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { mode } = req.body; // 'me' or 'everyone'

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    if (mode === 'everyone') {
      if (message.sender.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Only sender can delete for everyone' });
      }
      message.isDeletedForEveryone = true;
      message.content = 'This message was deleted';
      message.mediaUrl = '';
      await message.save();
    } else {
      if (!message.deletedFor.includes(req.user._id)) {
        message.deletedFor.push(req.user._id);
        await message.save();
      }
    }

    return res.status(200).json({ success: true, messageId, mode });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const toggleReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    const existingIdx = message.reactions.findIndex(r => r.user.toString() === req.user._id.toString());
    if (existingIdx > -1) {
      if (message.reactions[existingIdx].emoji === emoji) {
        message.reactions.splice(existingIdx, 1); // remove
      } else {
        message.reactions[existingIdx].emoji = emoji; // update
      }
    } else {
      message.reactions.push({ user: req.user._id, emoji });
    }

    await message.save();
    const updated = await Message.findById(message._id).populate('sender', 'name username avatar').populate('replyTo');

    return res.status(200).json({ success: true, message: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const togglePinMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    message.isPinned = !message.isPinned;
    await message.save();

    return res.status(200).json({ success: true, messageId: message._id, isPinned: message.isPinned });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const toggleStarMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });

    const idx = message.isStarredBy.indexOf(req.user._id);
    if (idx > -1) {
      message.isStarredBy.splice(idx, 1);
    } else {
      message.isStarredBy.push(req.user._id);
    }

    await message.save();
    return res.status(200).json({ success: true, messageId: message._id, isStarred: message.isStarredBy.includes(req.user._id) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const searchMessages = async (req, res) => {
  try {
    const { query, conversationId } = req.query;
    if (!query) return res.status(200).json({ success: true, messages: [] });

    const filter = {
      content: new RegExp(query, 'i'),
      deletedFor: { $ne: req.user._id }
    };

    if (conversationId) {
      filter.conversation = conversationId;
    } else {
      // restrict to conversations user is part of
      const userConvs = await Conversation.find({ participants: req.user._id }).select('_id');
      filter.conversation = { $in: userConvs.map(c => c._id) };
    }

    const messages = await Message.find(filter)
      .populate('sender', 'name username avatar')
      .populate('conversation')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getConversations,
  getOrCreateDirectChat,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  toggleReaction,
  togglePinMessage,
  toggleStarMessage,
  searchMessages
};
