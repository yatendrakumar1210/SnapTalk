const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyOTP,
  requestOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  profile,
  logout,
  logoutAll
} = require('../controllers/authController');

const authMiddleware = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/register", authLimiter, registerUser);
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/request-otp", authLimiter, requestOTP);
router.post("/login", authLimiter, loginUser);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

router.get("/profile", authMiddleware, profile);
router.post("/logout", authMiddleware, logout);
router.post("/logout-all", authMiddleware, logoutAll);

module.exports = router;
