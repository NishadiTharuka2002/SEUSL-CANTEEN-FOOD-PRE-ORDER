/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 5: Analytics & Admin Dashboard
 * DEVELOPER: K.G.C.S Thilakarathna (SEU/IS/22/ICT/107)
 * FILE: backend/models/Feedback.js
 * ====================================================================
 */

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    serviceAspect: {
      type: String,
      enum: ['Food Quality', 'Queue Wait Time', 'Staff Friendliness', 'Packaging', 'General'],
      default: 'Food Quality'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
