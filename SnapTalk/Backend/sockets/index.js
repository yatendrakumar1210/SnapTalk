const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerChatHandlers = require('./chatHandler');
const registerCallHandlers = require('./callHandler');
const registerMeetingHandlers = require('./meetingHandler');
const registerWhiteboardHandlers = require('./whiteboardHandler');

const onlineUsers = new Map(); // userId -> socketId

const initSockets = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(); // allow anonymous meeting joins if needed

      const secret = process.env.JWT_SECRET || '4297be46a1fc937a';
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id).select('_id name avatar username');
      if (user) {
        socket.user = user;
      }
      next();
    } catch (err) {
      next(); // proceed, socket.user will be undefined if invalid
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user ? socket.user._id.toString() : null;

    if (userId) {
      onlineUsers.set(userId, socket.id);
      socket.join(`user:${userId}`);

      await User.findByIdAndUpdate(userId, { status: 'Online', lastSeen: new Date() });
      io.emit('user:online', { userId, status: 'Online' });
    }

    // Register module event handlers
    registerChatHandlers(io, socket, onlineUsers);
    registerCallHandlers(io, socket, onlineUsers);
    registerMeetingHandlers(io, socket, onlineUsers);
    registerWhiteboardHandlers(io, socket, onlineUsers);

    socket.on('disconnect', async () => {
      if (userId) {
        onlineUsers.delete(userId);
        await User.findByIdAndUpdate(userId, { status: 'Offline', lastSeen: new Date() });
        io.emit('user:offline', { userId, status: 'Offline', lastSeen: new Date() });
      }
    });
  });

  return io;
};

module.exports = { initSockets, onlineUsers };
