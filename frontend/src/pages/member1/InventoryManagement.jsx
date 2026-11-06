/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 1: Menu & Inventory Management
 * DEVELOPER: W.H.N Tharuka (SEU/IS/22/ICT/097)
 * FILE: frontend/src/pages/member1/InventoryManagement.jsx
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Boxes, Plus, AlertTriangle, CheckCircle, RefreshCw, Power, Image, Trash2 } from 'lucide-react';

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'menu_admin'
  const [inventoryData, setInventoryData] = useState({ totalItems: 0, lowStockCount: 0, items: [] });
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Ingredient Modal/Form state
  const [newIngredient, setNewIngredient] = useState({
    ingredientName: '',
    category: 'Grains & Rice',
    currentStock: '',
    unit: 'kg',
    minThreshold: '10'
  });

  // New Menu Item Form state with Image and Description
  const [newMenu, setNewMenu] = useState({
    name: '',
    description: '',
    category: 'Lunch',
    price: '',
    prepTimeMinutes: '10',
    image: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, menuRes] = await Promise.all([
        api.get('/menu/inventory/all'),
        api.get('/menu')
      ]);
      setInventoryData(invRes.data);
      setMenuItems(menuRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRestock = async (id, amount) => {
    try {
      await api.patch(`/menu/inventory/${id}/stock`, {
        adjustmentAmount: amount,
        type: 'ADD'
      });
      fetchData();
    } catch (err) {
      alert('Error updating stock: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleMenuAvailability = async (id) => {
    try {
      await api.patch(`/menu/${id}/toggle-status`);
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleCreateIngredient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/menu/inventory', newIngredient);
      setNewIngredient({ ingredientName: '', category: 'Grains & Rice', currentStock: '', unit: 'kg', minThreshold: '10' });
      fetchData();
      alert('Ingredient added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding ingredient');
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newMenu,
        image: newMenu.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'
      };
      await api.post('/menu', payload);
      setNewMenu({ name: '', description: '', category: 'Lunch', price: '', prepTimeMinutes: '10', image: '' });
      fetchData();
      alert('Menu item created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating menu item');
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)' }}>Canteen Stock & Menu Operations</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
          Manage ingredient stock levels, low-stock alerts, and cafeteria food items.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Boxes size={18} /> Ingredient Stock Tracker
        </button>
        <button
          className={`btn ${activeTab === 'menu_admin' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('menu_admin')}
        >
          <RefreshCw size={18} /> Food Categories & Menu Management
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <div>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="card">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Tracked Ingredients</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                {inventoryData.totalItems}
              </h3>
            </div>
            <div className="card" style={{ borderColor: inventoryData.lowStockCount > 0 ? '#f59e0b' : 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {inventoryData.lowStockCount > 0 && <AlertTriangle size={18} color="#d97706" />}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Low Stock Warnings</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: inventoryData.lowStockCount > 0 ? '#d97706' : 'var(--success)', marginTop: '4px' }}>
                {inventoryData.lowStockCount} items
              </h3>
            </div>
          </div>

          {/* Add Ingredient Form */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Add New Ingredient to Inventory</h3>
            <form onSubmit={handleCreateIngredient} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'end' }}>
              <div>
                <label className="form-label">Ingredient Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Red Onion"
                  value={newIngredient.ingredientName}
                  onChange={(e) => setNewIngredient({ ...newIngredient, ingredientName: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newIngredient.category}
                  onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
                >
                  <option value="Grains & Rice">Grains & Rice</option>
                  <option value="Meat & Poultry">Meat & Poultry</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Spices & Oil">Spices & Oil</option>
                </select>
              </div>
              <div>
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  placeholder="Quantity"
                  value={newIngredient.currentStock}
                  onChange={(e) => setNewIngredient({ ...newIngredient, currentStock: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Unit</label>
                <select
                  className="form-select"
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="liter">liter</option>
                  <option value="pcs">pcs</option>
                  <option value="packets">packets</option>
                </select>
              </div>
              <div>
                <label className="form-label">Min Alert Threshold</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  placeholder="Threshold"
                  value={newIngredient.minThreshold}
                  onChange={(e) => setNewIngredient({ ...newIngredient, minThreshold: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Add Ingredient
              </button>
            </form>
          </div>

          {/* Inventory Table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Quick Restock</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.items.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600 }}>{item.ingredientName}</td>
                  <td>{item.category}</td>
                  <td style={{ fontWeight: 700 }}>
                    {item.currentStock} {item.unit}
                  </td>
                  <td>
                    {item.minThreshold} {item.unit}
                  </td>
                  <td>
                    {item.currentStock <= item.minThreshold ? (
                      <span className="badge badge-lowstock">Low Stock</span>
                    ) : (
                      <span className="badge badge-available">Normal</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRestock(item._id, 5)}
                      >
                        +5 {item.unit}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRestock(item._id, 10)}
                      >
                        +10 {item.unit}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Menu Items Management Tab */
        <div>
          {/* Add Menu Item Form */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>Add New Dish to Canteen Menu</h3>
            <form onSubmit={handleCreateMenuItem}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Dish Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Seafood Fried Rice"
                    value={newMenu.name}
                    onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Food Category</label>
                  <select
                    className="form-select"
                    value={newMenu.category}
                    onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
                  >
                    <option value="Breakfast">🍳 Breakfast</option>
                    <option value="Lunch">🍛 Lunch</option>
                    <option value="Snacks">🥟 Snacks</option>
                    <option value="Beverages">🥤 Beverages</option>
                    <option value="Dessert">🍨 Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Price (LKR)</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    placeholder="e.g. 350"
                    value={newMenu.price}
                    onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Prep Time (mins)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 10"
                    value={newMenu.prepTimeMinutes}
                    onChange={(e) => setNewMenu({ ...newMenu, prepTimeMinutes: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Food Picture Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/... (optional)"
                    value={newMenu.image}
                    onChange={(e) => setNewMenu({ ...newMenu, image: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Dish Description & Ingredients</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Freshly prepared with..."
                    value={newMenu.description}
                    onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Add Dish to Menu
              </button>
            </form>
          </div>

          {/* Menu Items Table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Picture</th>
                <th>Dish Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Prep Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100';
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: 700 }}>{item.name}</td>
                  <td>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#334155' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--primary)' }}>Rs. {item.price}</td>
                  <td>~{item.prepTimeMinutes} mins</td>
                  <td>
                    <span className={`badge ${item.isAvailable ? 'badge-available' : 'badge-soldout'}`}>
                      {item.isAvailable ? 'Available' : 'Sold Out'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${item.isAvailable ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => handleToggleMenuAvailability(item._id)}
                    >
                      <Power size={14} /> {item.isAvailable ? 'Mark Sold Out' : 'Set Available'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
