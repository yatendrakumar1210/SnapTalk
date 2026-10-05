const Meeting = require('../models/Meeting');

module.exports = (io, socket, onlineUsers) => {
  // Join Meeting Room
  socket.on('meeting:join', async ({ meetingId, user, passcode }) => {
    try {
      const meeting = await Meeting.findOne({ meetingId });
      if (!meeting) {
        return socket.emit('meeting:error', 'Meeting not found');
      }

      if (meeting.isLocked) {
        return socket.emit('meeting:error', 'Meeting is locked by host');
      }

      const roomName = `meeting:${meetingId}`;
      socket.join(roomName);

      const participantInfo = {
        socketId: socket.id,
        user: user || socket.user || { _id: socket.id, name: 'Guest User' },
        isMuted: false,
        isCameraOn: true,
        handRaised: false,
        isSharingScreen: false
      };

      // Broadcast new participant to other room members
      socket.to(roomName).emit('meeting:participant-joined', participantInfo);

      // Send existing participants to joining user
      const clients = await io.in(roomName).fetchSockets();
      const existingParticipants = clients
        .filter(s => s.id !== socket.id)
        .map(s => ({
          socketId: s.id,
          user: s.user || { _id: s.id, name: 'Participant' },
          isMuted: false,
          isCameraOn: true,
          handRaised: false
        }));

      socket.emit('meeting:joined', {
        meetingId,
        meeting,
        participants: existingParticipants
      });
    } catch (e) {
      console.error("Meeting join error:", e);
      socket.emit('meeting:error', 'Failed to join meeting');
    }
  });

  // Peer-to-Peer Signal Relay inside Meeting Mesh
  socket.on('meeting:signal', ({ toSocketId, signalData }) => {
    io.to(toSocketId).emit('meeting:signal', {
      fromSocketId: socket.id,
      signalData
    });
  });

  // Toggle Mute / Camera
  socket.on('meeting:toggle-audio', ({ meetingId, isMuted }) => {
    io.to(`meeting:${meetingId}`).emit('meeting:audio-toggled', {
      socketId: socket.id,
      isMuted
    });
  });

  socket.on('meeting:toggle-video', ({ meetingId, isCameraOn }) => {
    io.to(`meeting:${meetingId}`).emit('meeting:video-toggled', {
      socketId: socket.id,
      isCameraOn
    });
  });

  // Raise / Lower Hand ✋
  socket.on('meeting:raise-hand', ({ meetingId, user }) => {
    io.to(`meeting:${meetingId}`).emit('meeting:hand-raised', {
      socketId: socket.id,
      user: user || socket.user
    });
  });

  socket.on('meeting:lower-hand', ({ meetingId, socketId }) => {
    io.to(`meeting:${meetingId}`).emit('meeting:hand-lowered', {
      socketId: socketId || socket.id
    });
  });

  // Host Controls: Mute Participant / Remove Participant
  socket.on('meeting:host-mute-participant', ({ meetingId, targetSocketId }) => {
    io.to(targetSocketId).emit('meeting:force-muted');
    io.to(`meeting:${meetingId}`).emit('meeting:audio-toggled', { socketId: targetSocketId, isMuted: true });
  });

  socket.on('meeting:host-remove-participant', ({ meetingId, targetSocketId }) => {
    io.to(targetSocketId).emit('meeting:kicked');
  });

  // Screen Sharing
  socket.on('meeting:screen-share-start', ({ meetingId }) => {
    socket.to(`meeting:${meetingId}`).emit('meeting:screen-share-started', { socketId: socket.id });
  });

  socket.on('meeting:screen-share-stop', ({ meetingId }) => {
    socket.to(`meeting:${meetingId}`).emit('meeting:screen-share-stopped', { socketId: socket.id });
  });

  // Meeting Chat
  socket.on('meeting:chat-message', ({ meetingId, message }) => {
    io.to(`meeting:${meetingId}`).emit('meeting:chat-message', message);
  });

  // Leave Meeting
  socket.on('meeting:leave', ({ meetingId }) => {
    socket.leave(`meeting:${meetingId}`);
    socket.to(`meeting:${meetingId}`).emit('meeting:participant-left', { socketId: socket.id });
  });
};
