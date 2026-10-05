const Call = require('../models/Call');

const logCall = async (req, res) => {
  try {
    const { receiverId, type, status, duration } = req.body;
    const call = await Call.create({
      caller: req.user._id,
      receiver: receiverId,
      type: type || 'audio',
      status: status || 'completed',
      duration: duration || 0
    });

    const populated = await Call.findById(call._id)
      .populate('caller', 'name username avatar')
      .populate('receiver', 'name username avatar');

    return res.status(201).json({ success: true, call: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCallHistory = async (req, res) => {
  try {
    const calls = await Call.find({
      $or: [{ caller: req.user._id }, { receiver: req.user._id }]
    })
      .populate('caller', 'name username avatar phone')
      .populate('receiver', 'name username avatar phone')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ success: true, calls });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { logCall, getCallHistory };
