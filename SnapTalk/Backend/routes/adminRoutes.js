const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getDashboardStats,
  getUsersAdmin,
  getReportsAdmin,
  updateReportStatus,
  deleteUserAdmin
} = require('../controllers/adminController');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', getDashboardStats);
router.get('/users', getUsersAdmin);
router.get('/reports', getReportsAdmin);
router.put('/reports/:reportId', updateReportStatus);
router.delete('/users/:userId', deleteUserAdmin);

module.exports = router;
