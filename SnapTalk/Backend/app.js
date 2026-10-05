const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

const { connectDB } = require("./config/db");
const { initSockets } = require("./sockets");
const errorHandler = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimiter");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const chatRoutes = require("./routes/chatRoutes");
const groupRoutes = require("./routes/groupRoutes");
const communityRoutes = require("./routes/communityRoutes");
const channelRoutes = require("./routes/channelRoutes");
const callRoutes = require("./routes/callRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const statusRoutes = require("./routes/statusRoutes");
const fileRoutes = require("./routes/fileRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Initialize WebSockets
initSockets(server);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : true,
  credentials: true
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static file serving for uploads & dist
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// API Routes
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/admin', adminRoutes);

// React frontend SPA fallback
app.get('/{*path}', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(__dirname, '../Frontend/dist/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('SnapTalk API Server is Running.');
    }
  });
});

// Centralized error handler
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 SnapTalk Server is running on port ${PORT}`);
});

module.exports = { app, server };
