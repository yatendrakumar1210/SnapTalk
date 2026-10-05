const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createMeeting,
  getMeetingDetails,
  verifyPasscode,
  getActiveMeetings,
  endMeeting
} = require('../controllers/meetingController');

router.use(authMiddleware);

router.post('/', createMeeting);
router.get('/active', getActiveMeetings);
router.get('/:meetingId', getMeetingDetails);
router.post('/:meetingId/verify-passcode', verifyPasscode);
router.post('/:meetingId/end', endMeeting);

module.exports = router;
