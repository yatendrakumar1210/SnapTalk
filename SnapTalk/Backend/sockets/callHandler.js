module.exports = (io, socket, onlineUsers) => {
  // Initiate call to user
  socket.on('call:initiate', ({ receiverId, caller, mediaType }) => {
    const targetSocketId = onlineUsers.get(receiverId.toString());
    if (targetSocketId) {
      io.to(targetSocketId).emit('call:incoming', {
        caller: caller || socket.user,
        mediaType,
        socketId: socket.id
      });
    } else {
      socket.emit('call:unavailable', { receiverId, reason: 'User is offline' });
    }
  });

  // WebRTC Offer
  socket.on('call:offer', ({ toSocketId, offer, caller }) => {
    io.to(toSocketId).emit('call:offer', {
      offer,
      callerSocketId: socket.id,
      caller
    });
  });

  // WebRTC Answer
  socket.on('call:answer', ({ toSocketId, answer }) => {
    io.to(toSocketId).emit('call:answer', {
      answer,
      answerSocketId: socket.id
    });
  });

  // WebRTC ICE Candidate
  socket.on('call:ice-candidate', ({ toSocketId, candidate }) => {
    io.to(toSocketId).emit('call:ice-candidate', {
      candidate,
      fromSocketId: socket.id
    });
  });

  // Reject / Busy Call
  socket.on('call:reject', ({ toSocketId, reason }) => {
    io.to(toSocketId).emit('call:rejected', { reason: reason || 'Call declined' });
  });

  // End Call
  socket.on('call:end', ({ toSocketId }) => {
    if (toSocketId) {
      io.to(toSocketId).emit('call:ended', { fromSocketId: socket.id });
    }
  });
};
