/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 1: Menu & Inventory Management
 * DEVELOPER: W.H.N Tharuka (SEU/IS/22/ICT/097)
 * FILE: backend/routes/menuInventoryRoutes.js
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleMenuItemAvailability,
  deleteMenuItem,
  getAllInventory,
  addInventoryItem,
  updateInventoryStock,
  deleteInventoryItem
} = require('../controllers/menuInventoryController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to view menu
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);

// Staff and Admin routes to manage menu items
router.post('/', protect, authorize('staff', 'admin'), createMenuItem);
router.put('/:id', protect, authorize('staff', 'admin'), updateMenuItem);
router.patch('/:id/toggle-status', protect, authorize('staff', 'admin'), toggleMenuItemAvailability);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);

// Inventory routes (Staff and Admin only)
router.get('/inventory/all', protect, authorize('staff', 'admin', 'kitchen'), getAllInventory);
router.post('/inventory', protect, authorize('staff', 'admin'), addInventoryItem);
router.patch('/inventory/:id/stock', protect, authorize('staff', 'admin', 'kitchen'), updateInventoryStock);
router.delete('/inventory/:id', protect, authorize('admin'), deleteInventoryItem);

module.exports = router;
