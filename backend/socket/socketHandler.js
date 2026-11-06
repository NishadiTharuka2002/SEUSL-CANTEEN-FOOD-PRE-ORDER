/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 3: Status & Queue Management (Socket.io Real-Time Engine)
 * DEVELOPER: A.M.S Rasanjalie (SEU/IS/22/ICT/079)
 * FILE: backend/socket/socketHandler.js
 * ====================================================================
 */

const initSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket Connected] Client ID: ${socket.id}`);

    // Join room for specific student (to receive their private order status updates)
    socket.on('join_student_room', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`Socket ${socket.id} joined user_${userId}`);
      }
    });

    // Join room for canteen staff & kitchen display board
    socket.on('join_staff_room', () => {
      socket.join('canteen_staff');
      console.log(`Socket ${socket.id} joined canteen_staff room`);
    });

    // Client listens or disconnects
    socket.on('disconnect', () => {
      console.log(`[Socket Disconnected] Client ID: ${socket.id}`);
    });
  });
};

module.exports = { initSocketIO };
