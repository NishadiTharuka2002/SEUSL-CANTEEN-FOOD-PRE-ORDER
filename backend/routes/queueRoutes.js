/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 3: Status & Queue Management
 * DEVELOPER: A.M.S Rasanjalie (SEU/IS/22/ICT/079)
 * FILE: backend/routes/queueRoutes.js
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const {
  getLiveQueue,
  updateOrderStatus,
  cancelOrder,
  getQueueStats
} = require('../controllers/queueController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Staff/Kitchen queue endpoints
router.get('/', protect, authorize('staff', 'kitchen', 'admin'), getLiveQueue);
router.get('/stats', protect, authorize('staff', 'kitchen', 'admin'), getQueueStats);
router.patch('/:id/status', protect, authorize('staff', 'kitchen', 'admin'), updateOrderStatus);

// Order cancellation (Student or Staff)
router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router;
