const Contact = require('../models/Contact');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id, status: 'accepted' })
      .populate('contactUser', 'name username phone avatar bio status lastSeen privacy')
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, contacts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addContact = async (req, res) => {
  try {
    const { contactUserId, phone, username, customName } = req.body;
    let targetUser = null;

    if (contactUserId) {
      targetUser = await User.findById(contactUserId);
    } else if (phone) {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      targetUser = await User.findOne({ phone: cleanPhone });
    } else if (username) {
      targetUser = await User.findOne({ username: username.trim().toLowerCase() });
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot add yourself as a contact' });
    }

    let contact = await Contact.findOne({ user: req.user._id, contactUser: targetUser._id });
    if (!contact) {
      contact = await Contact.create({
        user: req.user._id,
        contactUser: targetUser._id,
        customName: customName || targetUser.name,
        status: 'accepted'
      });
    }

    // Also check or create direct conversation
    let conversation = await Conversation.findOne({
      type: 'direct',
      participants: { $all: [req.user._id, targetUser._id] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'direct',
        participants: [req.user._id, targetUser._id]
      });
    }

    const populated = await Contact.findById(contact._id).populate('contactUser', 'name username phone avatar bio status lastSeen');

    return res.status(201).json({ success: true, message: 'Contact added successfully', contact: populated, conversationId: conversation._id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const removeContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    await Contact.deleteOne({ _id: contactId, user: req.user._id });
    return res.status(200).json({ success: true, message: 'Contact removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getContacts, addContact, removeContact };
