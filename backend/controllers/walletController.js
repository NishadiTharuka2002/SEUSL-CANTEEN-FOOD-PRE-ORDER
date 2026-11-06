/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 4: Payment & Transaction Management
 * DEVELOPER: P.G.N.B Gamage (SEU/IS/22/ICT/101)
 * FILE: backend/controllers/walletController.js
 * ====================================================================
 */

const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// @desc    Get logged in student's wallet details & balance
// @route   GET /api/wallet
// @access  Private (Student)
const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });

    // Create wallet if not yet created
    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user._id,
        balance: 1000
      });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving wallet: ' + error.message });
  }
};

// @desc    Top-up student digital wallet (Mock payment gateway)
// @route   POST /api/wallet/topup
// @access  Private (Student)
const topUpWallet = async (req, res) => {
  try {
    const { amount, paymentMethodName } = req.body;
    const topUpAmount = Number(amount);

    if (isNaN(topUpAmount) || topUpAmount < 50) {
      return res.status(400).json({ message: 'Minimum top-up amount is Rs. 50' });
    }

    if (topUpAmount > 50000) {
      return res.status(400).json({ message: 'Maximum single top-up amount is Rs. 50,000' });
    }

    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id, balance: 0 });
    }

    wallet.balance += topUpAmount;
    await wallet.save();

    // Create Transaction Log
    const transaction = await Transaction.create({
      wallet: wallet._id,
      user: req.user._id,
      type: 'TOP_UP',
      amount: topUpAmount,
      balanceAfter: wallet.balance,
      status: 'SUCCESS',
      description: `Wallet top-up via ${paymentMethodName || 'Bank Card / Online Payment'}`
    });

    res.status(200).json({
      message: `Successfully topped up Rs. ${topUpAmount.toLocaleString()}`,
      newBalance: wallet.balance,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Wallet top-up failed: ' + error.message });
  }
};

// @desc    Get student transaction ledger / history
// @route   GET /api/wallet/transactions
// @access  Private (Student)
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('order', 'orderNumber totalAmount status')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions: ' + error.message });
  }
};

module.exports = {
  getWallet,
  topUpWallet,
  getTransactions
};
