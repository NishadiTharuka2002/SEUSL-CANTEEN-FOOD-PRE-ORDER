/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 1: Menu & Inventory Management
 * DEVELOPER: W.H.N Tharuka (SEU/IS/22/ICT/097)
 * FILE: backend/models/Inventory.js
 * ====================================================================
 */

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    ingredientName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Vegetables', 'Grains & Rice', 'Meat & Poultry', 'Dairy', 'Spices & Oil', 'Packaging'],
      default: 'Grains & Rice'
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'liter', 'ml', 'pcs', 'packets'],
      default: 'kg'
    },
    minThreshold: {
      type: Number,
      required: true,
      default: 10
    },
    costPerUnit: {
      type: Number,
      default: 0
    },
    lastRestockedDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Virtual property to alert if stock is below threshold
inventorySchema.virtual('isLowStock').get(function () {
  return this.currentStock <= this.minThreshold;
});

inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Inventory', inventorySchema);
