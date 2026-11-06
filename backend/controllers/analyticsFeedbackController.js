/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 5: Analytics & Admin Dashboard
 * DEVELOPER: K.G.C.S Thilakarathna (SEU/IS/22/ICT/107)
 * FILE: backend/controllers/analyticsFeedbackController.js
 * ====================================================================
 */

const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

// @desc    Get comprehensive sales, peak-hour, and popular items analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin / Staff)
const getDashboardAnalytics = async (req, res) => {
  try {
    // 1. Overall revenue & orders
    const nonCancelledOrders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalOrdersCount = await Order.countDocuments();
    const completedOrdersCount = await Order.countDocuments({ status: 'Collected' });
    const cancelledOrdersCount = await Order.countDocuments({ status: 'Cancelled' });

    const totalRevenue = nonCancelledOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
    const averageOrderValue = nonCancelledOrders.length > 0 ? (totalRevenue / nonCancelledOrders.length).toFixed(2) : 0;

    // 2. Student count
    const totalStudents = await User.countDocuments({ role: 'student' });

    // 3. Top-selling dishes
    const topDishesAggregation = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    // 4. Peak-hour analysis (Orders by pickup slot label)
    const peakHoursAggregation = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: '$pickupTime',
          orderCount: { $sum: 1 },
          slotRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { orderCount: -1 } }
    ]);

    // 5. Category breakdown
    const categoryAggregation = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'itemDetails'
        }
      },
      { $unwind: '$itemDetails' },
      {
        $group: {
          _id: '$itemDetails.category',
          count: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' }
        }
      }
    ]);

    // 6. Average customer rating
    const ratings = await Feedback.find();
    const averageRating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : '5.0';

    res.json({
      summary: {
        totalRevenue,
        totalOrdersCount,
        completedOrdersCount,
        cancelledOrdersCount,
        averageOrderValue: Number(averageOrderValue),
        totalStudents,
        averageRating: Number(averageRating),
        totalReviews: ratings.length
      },
      topSellingDishes: topDishesAggregation,
      peakHours: peakHoursAggregation,
      categoryDistribution: categoryAggregation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error compiling analytics: ' + error.message });
  }
};

// @desc    Submit student review & rating
// @route   POST /api/analytics/feedback
// @access  Private (Student)
const submitFeedback = async (req, res) => {
  try {
    const { orderId, menuItemId, rating, comment, serviceAspect } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const newFeedback = await Feedback.create({
      user: req.user._id,
      order: orderId || undefined,
      menuItem: menuItemId || undefined,
      rating: Number(rating),
      comment,
      serviceAspect: serviceAspect || 'General'
    });

    res.status(201).json({
      message: 'Thank you for your feedback!',
      feedback: newFeedback
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit feedback: ' + error.message });
  }
};

// @desc    Get all feedback and reviews
// @route   GET /api/analytics/feedback
// @access  Private (Admin / Staff)
const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find()
      .populate('user', 'name regNumber email')
      .populate('menuItem', 'name category')
      .sort({ createdAt: -1 });

    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving feedback: ' + error.message });
  }
};

module.exports = {
  getDashboardAnalytics,
  submitFeedback,
  getAllFeedback
};
