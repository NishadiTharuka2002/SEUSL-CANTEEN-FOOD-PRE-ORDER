/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 2 & 3: Order, Slot & Status Queue
 * DEVELOPERS: W.G.G.U Weerasiri (062) & A.M.S Rasanjalie (079)
 * FILE: backend/models/Order.js
 * ====================================================================
 */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    pickupSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupSlot'
    },
    pickupTime: {
      type: String,
      required: true
    },
    pickupDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    paymentMethod: {
      type: String,
      enum: ['WALLET', 'CASH'],
      default: 'WALLET'
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED', 'FAILED'],
      default: 'PENDING'
    },
    status: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Collected', 'Cancelled'],
      default: 'Placed'
    },
    specialNotes: {
      type: String,
      default: ''
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    statusTimestamps: {
      placedAt: { type: Date, default: Date.now },
      confirmedAt: { type: Date },
      preparingAt: { type: Date },
      readyAt: { type: Date },
      collectedAt: { type: Date },
      cancelledAt: { type: Date }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
