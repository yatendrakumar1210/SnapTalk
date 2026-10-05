const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createStatus, getFeedStatuses, markStatusViewed, deleteStatus } = require('../controllers/statusController');

router.use(authMiddleware);

router.get('/', getFeedStatuses);
router.post('/', createStatus);
router.post('/:statusId/view', markStatusViewed);
router.delete('/:statusId', deleteStatus);

module.exports = router;
