/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 4: Payment & Transaction Management
 * DEVELOPER: P.G.N.B Gamage (SEU/IS/22/ICT/101)
 * FILE: backend/models/Wallet.js
 * ====================================================================
 */

const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED'],
      default: 'ACTIVE'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);
