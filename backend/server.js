/**
 * ====================================================================
 * SOUTH EASTERN UNIVERSITY OF SRI LANKA
 * SWT22022 Practical for Internet Application Development
 * PROJECT: University Canteen Pre-order & Queue Management System
 * GROUP: Group U
 * FILE: backend/server.js
 * ====================================================================
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const { initSocketIO } = require('./socket/socketHandler');

// Import routes for all modules
const authRoutes = require('./routes/authRoutes');
const menuInventoryRoutes = require('./routes/menuInventoryRoutes'); // Member 1: W.H.N Tharuka
const orderRoutes = require('./routes/orderRoutes');                 // Member 2: W.G.G.U Weerasiri
const queueRoutes = require('./routes/queueRoutes');                 // Member 3: A.M.S Rasanjalie
const walletRoutes = require('./routes/walletRoutes');               // Member 4: P.G.N.B Gamage
const analyticsFeedbackRoutes = require('./routes/analyticsFeedbackRoutes'); // Member 5: K.G.C.S Thilakarathna

// Initialize express & http server
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Attach io instance to express app so controllers can trigger real-time events
app.set('io', io);
initSocketIO(io);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register Module API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuInventoryRoutes);            // Module 1
app.use('/api/orders', orderRoutes);                  // Module 2
app.use('/api/queue', queueRoutes);                   // Module 3
app.use('/api/wallet', walletRoutes);                 // Module 4
app.use('/api/analytics', analyticsFeedbackRoutes);   // Module 5

// Root health-check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'SEUSL University Canteen Pre-Order & Queue Management System',
    group: 'Group U',
    modules: [
      'Module 1: Menu & Inventory Management (W.H.N Tharuka)',
      'Module 2: Shopping Cart & Pre-Order (W.G.G.U Weerasiri)',
      'Module 3: Order Status & Queue Real-time (A.M.S Rasanjalie)',
      'Module 4: Payments & Digital Wallet (P.G.N.B Gamage)',
      'Module 5: Analytics & Admin Dashboard (K.G.C.S Thilakarathna)'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  SEUSL Canteen Pre-order & Queue System Server Active  `);
  console.log(`  Port: ${PORT} | Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});

module.exports = app;
