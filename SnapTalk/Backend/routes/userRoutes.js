const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  updateProfile,
  updatePrivacy,
  searchUsers,
  blockUser,
  unblockUser,
  reportTarget
} = require('../controllers/userController');

router.use(authMiddleware);

router.put('/profile', updateProfile);
router.put('/privacy', updatePrivacy);
router.get('/search', searchUsers);
router.post('/block', blockUser);
router.post('/unblock', unblockUser);
router.post('/report', reportTarget);

module.exports = router;
