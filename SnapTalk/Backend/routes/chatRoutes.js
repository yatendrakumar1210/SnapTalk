const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/chatController');

router.use(authMiddleware);

router.get('/conversations', getConversations);
router.post('/direct', getOrCreateDirectChat);
router.get('/messages/search', searchMessages);
router.get('/messages/:conversationId', getMessages);
router.post('/messages', sendMessage);
router.put('/messages/:messageId', editMessage);
router.post('/messages/:messageId/delete', deleteMessage);
router.post('/messages/:messageId/reaction', toggleReaction);
router.post('/messages/:messageId/pin', togglePinMessage);
router.post('/messages/:messageId/star', toggleStarMessage);

module.exports = router;
