const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createChannel, getChannels, subscribeChannel } = require('../controllers/channelController');

router.use(authMiddleware);

router.get('/', getChannels);
router.post('/', createChannel);
router.post('/:channelId/subscribe', subscribeChannel);

module.exports = router;
