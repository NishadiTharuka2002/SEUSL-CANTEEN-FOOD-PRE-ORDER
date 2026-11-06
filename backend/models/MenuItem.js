/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 1: Menu & Inventory Management
 * DEVELOPER: W.H.N Tharuka (SEU/IS/22/ICT/097)
 * FILE: backend/models/MenuItem.js
 * ====================================================================
 */

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: true,
      enum: ['Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Dessert'],
      default: 'Lunch'
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    prepTimeMinutes: {
      type: Number,
      default: 10,
      min: 1
    },
    calories: {
      type: Number,
      default: 0
    },
    ingredientsRequired: [
      {
        ingredient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Inventory'
        },
        name: String,
        quantityNeeded: {
          type: Number,
          default: 1
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
