/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 2: Shopping Cart & Pre-Order Management
 * DEVELOPER: W.G.G.U Weerasiri (SEU/IS/22/ICT/062)
 * FILE: backend/models/PickupSlot.js
 * ====================================================================
 */

const mongoose = require('mongoose');

const pickupSlotSchema = new mongoose.Schema(
  {
    slotDate: {
      type: String, // Format: YYYY-MM-DD
      required: true
    },
    startTime: {
      type: String, // Format: e.g. "11:30"
      required: true
    },
    endTime: {
      type: String, // Format: e.g. "11:45"
      required: true
    },
    label: {
      type: String, // e.g. "11:30 AM - 11:45 AM"
      required: true
    },
    maxCapacity: {
      type: Number,
      required: true,
      default: 20 // Limit to avoid crowds in canteen
    },
    currentBookings: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Virtual property to calculate remaining available slots
pickupSlotSchema.virtual('availableSlots').get(function () {
  return Math.max(0, this.maxCapacity - this.currentBookings);
});

pickupSlotSchema.virtual('isFull').get(function () {
  return this.currentBookings >= this.maxCapacity;
});

pickupSlotSchema.set('toJSON', { virtuals: true });
pickupSlotSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('PickupSlot', pickupSlotSchema);
