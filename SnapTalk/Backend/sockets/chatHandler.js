const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

module.exports = (io, socket, onlineUsers) => {
  // Join conversation room
  socket.on('conversation:join', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on('conversation:leave', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  // Sending message real-time
  socket.on('message:send', async (data) => {
    const { conversationId, message } = data;
    io.to(`conversation:${conversationId}`).emit('message:new', message);

    // Notify non-room participants
    try {
      const conv = await Conversation.findById(conversationId);
      if (conv) {
        conv.participants.forEach(participantId => {
          const pid = participantId.toString();
          const targetSocket = onlineUsers.get(pid);
          if (targetSocket) {
            io.to(targetSocket).emit('conversation:updated', { conversationId, lastMessage: message });
          }
        });
      }
    } catch (e) {
      console.error("Socket message notify error:", e);
    }
  });

  // Typing indicator
  socket.on('typing:start', ({ conversationId, user }) => {
    socket.to(`conversation:${conversationId}`).emit('typing:start', { conversationId, user: user || socket.user });
  });

  socket.on('typing:stop', ({ conversationId, userId }) => {
    socket.to(`conversation:${conversationId}`).emit('typing:stop', { conversationId, userId: userId || socket.user?._id });
  });

  // Recording audio indicator
  socket.on('recording:start', ({ conversationId, user }) => {
    socket.to(`conversation:${conversationId}`).emit('recording:start', { conversationId, user: user || socket.user });
  });

  socket.on('recording:stop', ({ conversationId, userId }) => {
    socket.to(`conversation:${conversationId}`).emit('recording:stop', { conversationId, userId: userId || socket.user?._id });
  });

  // Reactions & edits real-time sync
  socket.on('message:react', ({ conversationId, message }) => {
    io.to(`conversation:${conversationId}`).emit('message:updated', message);
  });
};
