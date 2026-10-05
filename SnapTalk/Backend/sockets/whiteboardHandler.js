const Whiteboard = require('../models/Whiteboard');

module.exports = (io, socket, onlineUsers) => {
  // Join Whiteboard Session
  socket.on('whiteboard:join', ({ meetingId }) => {
    socket.join(`whiteboard:${meetingId}`);
  });

  // Vector Draw Operation (DRAW_START, DRAW_MOVE, DRAW_END, OBJECT_CREATE, OBJECT_UPDATE, OBJECT_DELETE)
  socket.on('whiteboard:draw', ({ meetingId, operation }) => {
    socket.to(`whiteboard:${meetingId}`).emit('whiteboard:draw', operation);
  });

  // Clear Canvas
  socket.on('whiteboard:clear', ({ meetingId, pageId }) => {
    socket.to(`whiteboard:${meetingId}`).emit('whiteboard:clear', { pageId });
  });

  // Undo / Redo
  socket.on('whiteboard:undo', ({ meetingId, pageId }) => {
    socket.to(`whiteboard:${meetingId}`).emit('whiteboard:undo', { pageId });
  });

  socket.on('whiteboard:redo', ({ meetingId, pageId }) => {
    socket.to(`whiteboard:${meetingId}`).emit('whiteboard:redo', { pageId });
  });

  // Switch / Add Page
  socket.on('whiteboard:page-change', ({ meetingId, pageId, pages }) => {
    io.to(`whiteboard:${meetingId}`).emit('whiteboard:page-change', { pageId, pages });
  });

  // Teacher/Host Permission Toggle
  socket.on('whiteboard:toggle-student-drawing', ({ meetingId, enabled }) => {
    io.to(`whiteboard:${meetingId}`).emit('whiteboard:student-drawing-toggled', { enabled });
  });
};
