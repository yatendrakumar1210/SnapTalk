const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '4297be46a1fc937a';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_4297be46a1fc937a';

const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, username } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Mobile Number, and Password are required"
      });
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    const userEmail = email && email.trim() !== '' ? email.trim().toLowerCase() : `${cleanPhone}@snaptalk.app`;
    const cleanUsername = username && username.trim() !== '' ? username.trim().toLowerCase() : `user_${cleanPhone.slice(-6)}`;

    // Check existing
    const existingUser = await User.findOne({
      $or: [{ phone: cleanPhone }, { email: userEmail }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this Mobile Number or Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

    const user = await User.create({
      name: name.trim(),
      phone: cleanPhone,
      email: userEmail,
      username: cleanUsername,
      password: hashedPassword,
      isOtpVerified: false,
      otpCode,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    await Session.create({ user: user._id, token, device: req.headers['user-agent'] || 'Web Browser' });

    return res.status(201).json({
      success: true,
      message: "Registration initiated. Verification OTP sent to mobile number.",
      otpDemo: otpCode, // sent for development/testing ease
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        username: user.username,
        role: user.role,
        isOtpVerified: user.isOtpVerified
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { phone, otpCode } = req.body;
    if (!phone || !otpCode) {
      return res.status(400).json({ success: false, message: "Phone and OTP Code are required" });
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    const user = await User.findOne({ phone: cleanPhone });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otpCode !== otpCode) {
      return res.status(400).json({ success: false, message: "Invalid OTP Code" });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    user.isOtpVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Mobile number verified successfully",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        username: user.username,
        role: user.role,
        isOtpVerified: true
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone number required" });

    const cleanPhone = phone.trim().replace(/\D/g, '');
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpDemo: otpCode
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile number or Email and Password are required"
      });
    }

    const cleanPhone = phone ? phone.trim().replace(/\D/g, '') : null;
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    const queryConditions = [];
    if (cleanPhone) queryConditions.push({ phone: cleanPhone });
    if (cleanEmail) queryConditions.push({ email: cleanEmail });
    if (cleanPhone) queryConditions.push({ email: `${cleanPhone}@snaptalk.app` });

    const user = await User.findOne({ $or: queryConditions });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials. User not found."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password."
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    user.status = 'Online';
    user.lastSeen = new Date();
    await user.save();

    await Session.create({ user: user._id, token, device: req.headers['user-agent'] || 'Web Browser' });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        privacy: user.privacy,
        status: user.status
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Mobile number is required" });

    const cleanPhone = phone.trim().replace(/\D/g, '');
    const user = await User.findOne({ phone: cleanPhone });
    if (!user) return res.status(404).json({ success: false, message: "No account found with this phone number" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Reset OTP sent to your phone number",
      otpDemo: otpCode
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { phone, otpCode, newPassword } = req.body;
    if (!phone || !otpCode || !newPassword) {
      return res.status(400).json({ success: false, message: "Phone, OTP Code, and New Password are required" });
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    const user = await User.findOne({ phone: cleanPhone });
    if (!user || user.otpCode !== otpCode) {
      return res.status(400).json({ success: false, message: "Invalid phone number or OTP code" });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully. You can now login." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      await Session.deleteOne({ token });
    }
    await User.findByIdAndUpdate(req.user._id, { status: 'Offline', lastSeen: new Date() });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logoutAll = async (req, res) => {
  try {
    await Session.deleteMany({ user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { status: 'Offline', lastSeen: new Date() });
    return res.status(200).json({ success: true, message: "Logged out from all devices" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  requestOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  profile,
  logout,
  logoutAll
};