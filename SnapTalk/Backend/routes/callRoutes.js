const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { logCall, getCallHistory } = require('../controllers/callController');

router.use(authMiddleware);

router.post('/log', logCall);
router.get('/history', getCallHistory);

module.exports = router;
