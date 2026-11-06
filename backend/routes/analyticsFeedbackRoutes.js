/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 5: Analytics & Admin Dashboard
 * DEVELOPER: K.G.C.S Thilakarathna (SEU/IS/22/ICT/107)
 * FILE: backend/routes/analyticsFeedbackRoutes.js
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  submitFeedback,
  getAllFeedback
} = require('../controllers/analyticsFeedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin Analytics Dashboard
router.get('/dashboard', protect, authorize('admin', 'staff'), getDashboardAnalytics);

// Student submits feedback
router.post('/feedback', protect, submitFeedback);

// View customer feedback (accessible to students, staff, and admin)
router.get('/feedback', protect, getAllFeedback);

module.exports = router;
