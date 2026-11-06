/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 4: Payment & Transaction Management
 * DEVELOPER: P.G.N.B Gamage (SEU/IS/22/ICT/101)
 * FILE: backend/routes/walletRoutes.js
 * ====================================================================
 */

const express = require('express');
const router = express.Router();
const {
  getWallet,
  topUpWallet,
  getTransactions
} = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWallet);
router.post('/topup', protect, topUpWallet);
router.get('/transactions', protect, getTransactions);

module.exports = router;
