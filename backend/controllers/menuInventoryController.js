/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 1: Menu & Inventory Management
 * DEVELOPER: W.H.N Tharuka (SEU/IS/22/ICT/097)
 * FILE: backend/controllers/menuInventoryController.js
 * ====================================================================
 */

const MenuItem = require('../models/MenuItem');
const Inventory = require('../models/Inventory');

// ==================== MENU ITEMS CONTROLLERS ====================

// @desc    Get all menu items with category & search filter
// @route   GET /api/menu
// @access  Public
const getAllMenuItems = async (req, res) => {
  try {
    const { category, search, availableOnly } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    const items = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving menu items: ' + error.message });
  }
};

// @desc    Get single menu item by ID
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('ingredientsRequired.ingredient');
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving item: ' + error.message });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private (Staff / Admin)
const createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, image, isAvailable, prepTimeMinutes, ingredientsRequired } = req.body;

    const existing = await MenuItem.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'A menu item with this name already exists' });
    }

    const newItem = await MenuItem.create({
      name,
      description,
      category,
      price: Number(price),
      image: image || undefined,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      prepTimeMinutes: prepTimeMinutes || 10,
      ingredientsRequired: ingredientsRequired || []
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create menu item: ' + error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (Staff / Admin)
const updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update menu item: ' + error.message });
  }
};

// @desc    Toggle menu item availability status (In Stock / Out of Stock)
// @route   PATCH /api/menu/:id/toggle-status
// @access  Private (Staff / Admin)
const toggleMenuItemAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({
      message: `Item status updated to ${item.isAvailable ? 'Available' : 'Unavailable'}`,
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle status: ' + error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private (Admin)
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item: ' + error.message });
  }
};

// ==================== INVENTORY CONTROLLERS ====================

// @desc    Get all inventory stock items with low stock flags
// @route   GET /api/inventory
// @access  Private (Staff / Admin)
const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ ingredientName: 1 });
    
    // Calculate inventory statistics
    const totalItems = inventory.length;
    const lowStockCount = inventory.filter((item) => item.currentStock <= item.minThreshold).length;

    res.json({
      totalItems,
      lowStockCount,
      items: inventory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving inventory: ' + error.message });
  }
};

// @desc    Add new ingredient / stock item
// @route   POST /api/inventory
// @access  Private (Staff / Admin)
const addInventoryItem = async (req, res) => {
  try {
    const { ingredientName, category, currentStock, unit, minThreshold, costPerUnit } = req.body;

    const existing = await Inventory.findOne({ ingredientName });
    if (existing) {
      return res.status(400).json({ message: 'Ingredient already exists in inventory' });
    }

    const newItem = await Inventory.create({
      ingredientName,
      category,
      currentStock: Number(currentStock),
      unit,
      minThreshold: Number(minThreshold),
      costPerUnit: Number(costPerUnit || 0),
      lastRestockedDate: new Date()
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add inventory item: ' + error.message });
  }
};

// @desc    Update stock quantity (restock or manually adjust)
// @route   PATCH /api/inventory/:id/stock
// @access  Private (Staff / Admin)
const updateInventoryStock = async (req, res) => {
  try {
    const { adjustmentAmount, type } = req.body; // type: 'ADD' (restock) or 'SUBTRACT' (used)
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    const amount = Number(adjustmentAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid positive quantity' });
    }

    if (type === 'SUBTRACT') {
      if (item.currentStock < amount) {
        return res.status(400).json({ message: 'Insufficient stock available to subtract' });
      }
      item.currentStock -= amount;
    } else {
      item.currentStock += amount;
      item.lastRestockedDate = new Date();
    }

    await item.save();
    res.json({ message: 'Stock updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stock: ' + error.message });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Admin)
const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item: ' + error.message });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleMenuItemAvailability,
  deleteMenuItem,
  getAllInventory,
  addInventoryItem,
  updateInventoryStock,
  deleteInventoryItem
};
