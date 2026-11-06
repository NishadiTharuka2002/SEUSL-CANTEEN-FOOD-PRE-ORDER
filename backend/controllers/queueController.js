/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 3: Status & Queue Management
 * DEVELOPER: A.M.S Rasanjalie (SEU/IS/22/ICT/079)
 * FILE: backend/controllers/queueController.js
 * ====================================================================
 */

const Order = require('../models/Order');
const PickupSlot = require('../models/PickupSlot');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// @desc    Get all orders currently in the kitchen / canteen queue
// @route   GET /api/queue
// @access  Private (Staff / Kitchen / Admin)
const getLiveQueue = async (req, res) => {
  try {
    const { status, date } = req.query;
    const today = date || new Date().toISOString().split('T')[0];

    let filter = { pickupDate: today };

    if (status && status !== 'All') {
      filter.status = status;
    } else {
      // Show active non-collected orders by default
      filter.status = { $in: ['Placed', 'Confirmed', 'Preparing', 'Ready'] };
    }

    const orders = await Order.find(filter)
      .populate('user', 'name regNumber phone email')
      .populate('items.menuItem', 'name image category')
      .sort({ createdAt: 1 }); // FIFO queue order

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving queue: ' + error.message });
  }
};

// @desc    Update order status (Kitchen / Staff progression)
// @route   PATCH /api/queue/:id/status
// @access  Private (Staff / Kitchen / Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Placed', 'Confirmed', 'Preparing', 'Ready', 'Collected', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email regNumber');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Set old and new status
    const previousStatus = order.status;
    order.status = status;

    // Record timestamp
    if (status === 'Confirmed') order.statusTimestamps.confirmedAt = new Date();
    if (status === 'Preparing') order.statusTimestamps.preparingAt = new Date();
    if (status === 'Ready') order.statusTimestamps.readyAt = new Date();
    if (status === 'Collected') order.statusTimestamps.collectedAt = new Date();
    if (status === 'Cancelled') order.statusTimestamps.cancelledAt = new Date();

    await order.save();

    // Broadcast real-time status update via Socket.io
    const io = req.app.get('io');
    if (io) {
      // 1. Send update to the specific student
      io.to(`user_${order.user._id}`).emit('order_status_updated', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        previousStatus,
        status: order.status,
        updatedAt: new Date(),
        message:
          status === 'Ready'
            ? `Your order #${order.orderNumber} is READY for pickup at the canteen!`
            : `Order #${order.orderNumber} status changed to ${status}`
      });

      // 2. Broadcast queue refresh to all canteen staff
      io.to('canteen_staff').emit('queue_updated', {
        orderId: order._id,
        newStatus: order.status
      });
    }

    res.json({
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status: ' + error.message });
  }
};

// @desc    Cancel an order (Student or Staff) & process refund if eligible
// @route   PATCH /api/queue/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Cancellation policy: Only allowed if status is 'Placed' or 'Confirmed' (before meal preparation begins)
    if (!['Placed', 'Confirmed'].includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled because it is already in "${order.status}" stage.`
      });
    }

    // Student can only cancel their own order
    if (req.user.role === 'student' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    order.status = 'Cancelled';
    order.cancellationReason = cancellationReason || 'Cancelled by user';
    order.statusTimestamps.cancelledAt = new Date();

    // Release pickup slot count
    if (order.pickupSlot) {
      await PickupSlot.findByIdAndUpdate(order.pickupSlot, { $inc: { currentBookings: -1 } });
    }

    // Refund logic if paid via WALLET
    let refundProcessed = false;
    if (order.paymentMethod === 'WALLET' && order.paymentStatus === 'PAID') {
      const wallet = await Wallet.findOne({ user: order.user });
      if (wallet) {
        wallet.balance += order.totalAmount;
        await wallet.save();

        order.paymentStatus = 'REFUNDED';
        order.refundAmount = order.totalAmount;

        await Transaction.create({
          wallet: wallet._id,
          user: order.user,
          order: order._id,
          type: 'REFUND',
          amount: order.totalAmount,
          balanceAfter: wallet.balance,
          status: 'SUCCESS',
          description: `Automatic refund for cancelled order #${order.orderNumber}`
        });

        refundProcessed = true;
      }
    }

    await order.save();

    // Broadcast update
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${order.user}`).emit('order_status_updated', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: 'Cancelled',
        refundProcessed,
        refundAmount: order.refundAmount,
        message: refundProcessed
          ? `Order #${order.orderNumber} cancelled. Refund of Rs. ${order.totalAmount} credited to your wallet.`
          : `Order #${order.orderNumber} was cancelled.`
      });

      io.to('canteen_staff').emit('queue_updated', {
        orderId: order._id,
        newStatus: 'Cancelled'
      });
    }

    res.json({
      message: 'Order cancelled successfully',
      refundProcessed,
      refundAmount: order.refundAmount,
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order: ' + error.message });
  }
};

// @desc    Get queue statistics (counts per status)
// @route   GET /api/queue/stats
// @access  Private (Staff / Admin)
const getQueueStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const stats = await Order.aggregate([
      { $match: { pickupDate: today } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const formatted = {
      Placed: 0,
      Confirmed: 0,
      Preparing: 0,
      Ready: 0,
      Collected: 0,
      Cancelled: 0
    };

    stats.forEach((s) => {
      if (formatted.hasOwnProperty(s._id)) {
        formatted[s._id] = s.count;
      }
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error getting stats: ' + error.message });
  }
};

module.exports = {
  getLiveQueue,
  updateOrderStatus,
  cancelOrder,
  getQueueStats
};
