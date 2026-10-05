const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createCommunity, getCommunities } = require('../controllers/communityController');

router.use(authMiddleware);

router.get('/', getCommunities);
router.post('/', createCommunity);

module.exports = router;
