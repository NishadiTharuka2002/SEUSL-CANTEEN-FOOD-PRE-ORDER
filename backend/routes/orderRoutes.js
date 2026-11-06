/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 2: Shopping Cart & Pre-Order Management
 * DEVELOPER: W.G.G.U Weerasiri (SEU/IS/22/ICT/062)
 * FILE: backend/routes/orderRoutes.js
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const {
  getPickupSlots,
  calculateCartOrder,
  placePreOrder,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Get pickup time slots with capacity
router.get('/slots', getPickupSlots);

// Calculate cart totals
router.post('/calculate', protect, calculateCartOrder);

// Place a new pre-order
router.post('/', protect, placePreOrder);

// Student's personal order history
router.get('/my-orders', protect, getMyOrders);

// Single order details
router.get('/:id', protect, getOrderById);

module.exports = router;
