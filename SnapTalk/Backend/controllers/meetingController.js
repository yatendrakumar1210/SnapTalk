const Meeting = require('../models/Meeting');
const Whiteboard = require('../models/Whiteboard');

const createMeeting = async (req, res) => {
  try {
    const { title, passcode, waitingRoomEnabled, mode } = req.body;
    const meetingId = `meet-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;

    const meeting = await Meeting.create({
      meetingId,
      title: title || 'SnapTalk Collaboration Room',
      host: req.user._id,
      passcode: passcode || '',
      waitingRoomEnabled: waitingRoomEnabled || false,
      mode: mode || 'normal',
      status: 'active'
    });

    // Create associated whiteboard
    await Whiteboard.create({
      meetingId,
      pages: [{ id: 'page_1', title: 'Board 1', elements: [] }],
      activePageId: 'page_1',
      studentDrawingEnabled: true
    });

    const populated = await Meeting.findById(meeting._id).populate('host', 'name username avatar');
    return res.status(201).json({ success: true, meeting: populated, joinUrl: `/app/meetings/${meetingId}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMeetingDetails = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findOne({ meetingId })
      .populate('host', 'name username avatar')
      .populate('coHosts', 'name username avatar');

    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });
    return res.status(200).json({ success: true, meeting });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPasscode = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { passcode } = req.body;

    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    if (meeting.passcode && meeting.passcode !== passcode) {
      return res.status(400).json({ success: false, message: 'Invalid passcode' });
    }

    return res.status(200).json({ success: true, verified: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getActiveMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ status: 'active' })
      .populate('host', 'name username avatar')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, meetings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const endMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    if (meeting.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only host can end meeting' });
    }

    meeting.status = 'ended';
    meeting.endedAt = new Date();
    await meeting.save();

    return res.status(200).json({ success: true, message: 'Meeting ended' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMeeting,
  getMeetingDetails,
  verifyPasscode,
  getActiveMeetings,
  endMeeting
};
