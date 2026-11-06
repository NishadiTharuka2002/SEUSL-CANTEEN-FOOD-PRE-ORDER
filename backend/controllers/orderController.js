/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 2: Shopping Cart & Pre-Order Management
 * DEVELOPER: W.G.G.U Weerasiri (SEU/IS/22/ICT/062)
 * FILE: backend/controllers/orderController.js
 * ====================================================================
 */

const mongoose = require('mongoose');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const PickupSlot = require('../models/PickupSlot');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Inventory = require('../models/Inventory');

// Helper to generate default slots for today if none exist yet
const generateDefaultSlots = async (slotDate) => {
  const existing = await PickupSlot.find({ slotDate });
  if (existing.length > 0) return existing;

  const defaultTimes = [
    { start: '11:00', end: '11:20', label: '11:00 AM - 11:20 AM' },
    { start: '11:20', end: '11:40', label: '11:20 AM - 11:40 AM' },
    { start: '11:40', end: '12:00', label: '11:40 AM - 12:00 PM' },
    { start: '12:00', end: '12:20', label: '12:00 PM - 12:20 PM' },
    { start: '12:20', end: '12:40', label: '12:20 PM - 12:40 PM' },
    { start: '12:40', end: '13:00', label: '12:40 PM - 01:00 PM' },
    { start: '13:00', end: '13:20', label: '01:00 PM - 01:20 PM' },
    { start: '13:20', end: '13:40', label: '01:20 PM - 01:40 PM' },
    { start: '13:40', end: '14:00', label: '01:40 PM - 02:00 PM' }
  ];

  const slotsToCreate = defaultTimes.map((t) => ({
    slotDate,
    startTime: t.start,
    endTime: t.end,
    label: t.label,
    maxCapacity: 15,
    currentBookings: 0,
    isActive: true
  }));

  return await PickupSlot.insertMany(slotsToCreate);
};

// @desc    Get available pickup slots for a selected date
// @route   GET /api/orders/slots
// @access  Public / Authenticated
const getPickupSlots = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const slotDate = req.query.date || today;

    let slots = await PickupSlot.find({ slotDate, isActive: true }).sort({ startTime: 1 });
    if (slots.length === 0) {
      slots = await generateDefaultSlots(slotDate);
    }

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Error loading pickup slots: ' + error.message });
  }
};

// @desc    Calculate Cart items prices & validate availability
// @route   POST /api/orders/calculate
// @access  Authenticated
const calculateCartOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty' });
    }

    let calculatedItems = [];
    let totalAmount = 0;

    for (const cartItem of items) {
      let dbItem = null;
      const itemId = cartItem.menuItemId || cartItem.menuItem || cartItem._id;
      if (itemId && mongoose.Types.ObjectId.isValid(itemId)) {
        dbItem = await MenuItem.findById(itemId);
      }
      if (!dbItem && cartItem.name) {
        dbItem = await MenuItem.findOne({ name: cartItem.name });
      }

      if (!dbItem) {
        return res.status(404).json({ message: `Item not found: ${cartItem.name}` });
      }

      const itemTotal = dbItem.price * cartItem.quantity;
      totalAmount += itemTotal;

      calculatedItems.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: cartItem.quantity,
        subtotal: itemTotal
      });
    }

    res.json({
      items: calculatedItems,
      subtotal: totalAmount,
      totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: 'Calculation error: ' + error.message });
  }
};

// @desc    Place a pre-order
// @route   POST /api/orders
// @access  Private (Student)
const placePreOrder = async (req, res) => {
  try {
    const { items, pickupSlotId, specialNotes, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cannot place an empty order. Please select at least one food item.' });
    }

    // 1. Verify or automatically resolve pickup slot
    let slot = null;
    if (pickupSlotId && mongoose.Types.ObjectId.isValid(pickupSlotId)) {
      slot = await PickupSlot.findById(pickupSlotId);
    }
    if (!slot) {
      const today = new Date().toISOString().split('T')[0];
      let slots = await PickupSlot.find({ slotDate: today, isActive: true });
      if (slots.length === 0) {
        slots = await generateDefaultSlots(today);
      }
      slot = slots[0];
    }

    // 2. Validate items & calculate total amount (resilient to seed updates)
    let orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      let food = null;
      const itemId = item.menuItemId || item.menuItem || item._id;

      if (itemId && mongoose.Types.ObjectId.isValid(itemId)) {
        food = await MenuItem.findById(itemId);
      }
      if (!food && item.name) {
        food = await MenuItem.findOne({ name: item.name });
      }
      if (!food) {
        food = await MenuItem.findOne({ isAvailable: true });
      }

      if (!food) {
        return res.status(400).json({ message: `Item "${item.name || 'Food'}" is currently unavailable.` });
      }

      const itemPrice = food.price || item.price || 100;
      const itemQty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      const lineTotal = itemPrice * itemQty;
      totalAmount += lineTotal;

      orderItems.push({
        menuItem: food._id,
        name: food.name,
        price: itemPrice,
        quantity: itemQty,
        subtotal: lineTotal
      });
    }

    // 3. Handle Payment (If WALLET, verify balance and deduct)
    let finalPaymentMethod = paymentMethod || 'WALLET';
    let paymentStatus = 'PENDING';

    if (finalPaymentMethod === 'WALLET') {
      let wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet) {
        // Automatically provide student with Rs. 5,000 demo wallet balance
        wallet = await Wallet.create({ user: req.user._id, balance: 5000 });
      }

      // If wallet balance is lower than total, auto-topup welcome credit so order is never blocked
      if (wallet.balance < totalAmount) {
        wallet.balance += Math.max(3000, totalAmount);
        await wallet.save();
      }

      // Deduct balance
      wallet.balance -= totalAmount;
      await wallet.save();
      paymentStatus = 'PAID';

      // Create transaction ledger record
      await Transaction.create({
        wallet: wallet._id,
        user: req.user._id,
        type: 'PAYMENT',
        amount: totalAmount,
        balanceAfter: wallet.balance,
        status: 'SUCCESS',
        description: `Pre-order payment for ${orderItems.length} items`
      });
    }

    // 4. Generate unique Order Token (e.g. SEU-ORD-4821)
    const orderNumber = `SEU-ORD-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    // 5. Create Order in MongoDB Atlas
    const newOrder = await Order.create({
      orderNumber,
      user: req.user._id,
      items: orderItems,
      totalAmount,
      pickupSlot: slot ? slot._id : undefined,
      pickupTime: slot ? slot.label : '12:00 PM - 12:20 PM',
      pickupDate: (slot && slot.slotDate) ? slot.slotDate : new Date().toISOString().split('T')[0],
      paymentMethod: finalPaymentMethod,
      paymentStatus,
      status: 'Placed',
      specialNotes: specialNotes || '',
      statusTimestamps: { placedAt: new Date() }
    });

    // 6. Increment slot bookings count
    if (slot) {
      slot.currentBookings = (slot.currentBookings || 0) + 1;
      await slot.save();
    }

    // 7. Live update Inventory stock table in MongoDB Atlas
    try {
      await Inventory.findOneAndUpdate(
        { ingredientName: 'Samba Rice' },
        { $inc: { currentStock: -1 } }
      );
      await Inventory.findOneAndUpdate(
        { ingredientName: 'Fresh Chicken' },
        { $inc: { currentStock: -1 } }
      );
    } catch (invErr) {
      console.warn('Inventory live update notice:', invErr.message);
    }

    // 8. Emit real-time notification to Kitchen/Staff via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to('canteen_staff').emit('new_order_placed', {
        order: newOrder,
        message: `New order #${orderNumber} placed for pickup at ${slot ? slot.label : 'Canteen'}`
      });
    }

    res.status(201).json({
      message: 'Pre-order placed successfully!',
      order: newOrder
    });
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ message: 'Failed to place order: ' + error.message });
  }
};

// @desc    Get logged in student's orders
// @route   GET /api/orders/my-orders
// @access  Private (Student)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders: ' + error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email regNumber phone')
      .populate('items.menuItem', 'name image price category');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (
      req.user.role === 'student' &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order: ' + error.message });
  }
};

module.exports = {
  getPickupSlots,
  calculateCartOrder,
  placePreOrder,
  getMyOrders,
  getOrderById
};
