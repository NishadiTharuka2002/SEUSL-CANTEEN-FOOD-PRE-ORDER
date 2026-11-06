/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 4: Payment & Transaction Management
 * DEVELOPER: P.G.N.B Gamage (SEU/IS/22/ICT/101)
 * FILE: backend/models/Transaction.js
 * ====================================================================
 */

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    type: {
      type: String,
      enum: ['TOP_UP', 'PAYMENT', 'REFUND'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'PENDING', 'FAILED'],
      default: 'SUCCESS'
    },
    description: {
      type: String,
      default: ''
    },
    paymentGatewayReference: {
      type: String,
      default: () => 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
