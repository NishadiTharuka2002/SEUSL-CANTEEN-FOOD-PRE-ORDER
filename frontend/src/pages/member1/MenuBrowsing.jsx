/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 1: Food Categories & Menu Ordering Portal
 * DEVELOPER: W.H.N Tharuka (SEU/IS/22/ICT/097)
 * FILE: frontend/src/pages/member1/MenuBrowsing.jsx
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Plus, 
  Minus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Utensils, 
  Coffee, 
  CakeSlice, 
  Cookie,
  ShoppingCart,
  ArrowRight,
  Wallet,
  UserCheck,
  PlusCircle,
  GraduationCap
} from 'lucide-react';

const categoryMeta = [
  { id: 'All', label: 'All Dishes', icon: Utensils },
  { id: 'Breakfast', label: 'Breakfast', icon: Coffee, emoji: '🍳', subtitle: 'Fresh morning meals to kickstart your campus day' },
  { id: 'Lunch', label: 'Lunch Specials', icon: Flame, emoji: '🍛', subtitle: 'Wholesome rice, curries, kottu and biryani platters' },
  { id: 'Snacks', label: 'Snacks & Bakery', icon: Cookie, emoji: '🥟', subtitle: 'Golden crispy rolls, spicy cutlets and warm pastries' },
  { id: 'Beverages', label: 'Beverages', icon: Coffee, emoji: '🥤', subtitle: 'Freshly brewed Ceylon tea, juices and chilled drinks' },
  { id: 'Dessert', label: 'Desserts & Sweets', icon: CakeSlice, emoji: '🍨', subtitle: 'Sweet treats, traditional watalappan and curd' }
];

import { DEFAULT_MENU_ITEMS } from '../../data/defaultMenu';

const MenuBrowsing = () => {
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [walletBalance, setWalletBalance] = useState(null);
  
  // Per-item selected order quantities (allows student to choose exact quantity: 1, 2, 3...)
  const [itemQuantities, setItemQuantities] = useState({});

  const { addToCart, totalItemsCount, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      const { data } = await api.get('/menu', { params });
      if (data && data.length > 0) {
        setMenuItems(data);
      } else {
        let fallback = DEFAULT_MENU_ITEMS;
        if (selectedCategory !== 'All') {
          fallback = fallback.filter((i) => i.category === selectedCategory);
        }
        if (searchTerm) {
          fallback = fallback.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setMenuItems(fallback);
      }
      setLoading(false);
    } catch (error) {
      console.warn('Backend loading notice, using verified default dishes:', error.message);
      let fallback = DEFAULT_MENU_ITEMS;
      if (selectedCategory !== 'All') {
        fallback = fallback.filter((i) => i.category === selectedCategory);
      }
      if (searchTerm) {
        fallback = fallback.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      setMenuItems(fallback);
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    if (user && user.role === 'student') {
      try {
        const { data } = await api.get('/wallet');
        setWalletBalance(data.balance);
      } catch (err) {
        console.error('Wallet balance fetch error:', err);
      }
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchWallet();
  }, [user]);

  // Adjust order quantity for a specific food item
  const handleQuantityChange = (itemId, delta) => {
    setItemQuantities((prev) => {
      const current = prev[itemId] || 1;
      const updated = Math.max(1, current + delta);
      return { ...prev, [itemId]: updated };
    });
  };

  const handleCustomQuantityInput = (itemId, value) => {
    const parsed = parseInt(value, 10);
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: isNaN(parsed) || parsed < 1 ? 1 : parsed
    }));
  };

  const handleAddToCart = (item) => {
    const qty = itemQuantities[item._id] || 1;
    addToCart(item, qty);
    setToastMessage(`Added ${qty}x "${item.name}" to cart (Rs. ${item.price * qty})!`);
    setItemQuantities((prev) => ({ ...prev, [item._id]: 1 }));
    setTimeout(() => setToastMessage(''), 3000);
  };

  const categoriesToDisplay = selectedCategory === 'All'
    ? ['Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Dessert']
    : [selectedCategory];

  return (
    <div style={{ paddingBottom: '90px' }}>
      
      {/* ======================================================== */}
      {/* 1. STUDENT HEADER & WALLET BALANCE BANNER                */}
      {/* ======================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        color: '#ffffff',
        padding: '30px 20px',
        boxShadow: 'var(--shadow)'
      }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.85, fontSize: '0.82rem', fontWeight: 700 }}>
              <GraduationCap size={18} color="#60a5fa" />
              <span>SEUSL CANTEEN FOOD PRE-ORDERING PORTAL</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px' }}>
              Daily Canteen Menu & Ordering
            </h1>
            <p style={{ opacity: 0.85, fontSize: '0.88rem', marginTop: '4px' }}>
              Select your required dishes, set quantities, and proceed to pickup slot selection.
            </p>
          </div>

          {/* User Digital Card Info if Logged In */}
          {user && user.role === 'student' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '14px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>STUDENT CARD</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user?.name || 'Student'}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>{user?.regNumber || 'Registered Student'}</div>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.25)', paddingLeft: '18px' }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>WALLET BALANCE</div>
                <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#6ee7b7' }}>
                  Rs. {walletBalance?.toLocaleString() || '0'}
                </div>
              </div>

              <Link to="/wallet" className="btn btn-secondary btn-sm" style={{ background: '#ffffff', color: '#1e3a8a', padding: '6px 12px' }}>
                <PlusCircle size={15} /> Top-Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Toast Feedback */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          background: '#10b981',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1000,
          fontWeight: 700,
          fontSize: '0.95rem'
        }}>
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MENU BROWSING & CATEGORIES SECTION                    */}
      {/* ======================================================== */}
      <div className="container" style={{ marginTop: '28px' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)' }}>
            Canteen Daily Menu by Category
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
            Select items, choose quantities, and place your pre-order to skip the lunch rush.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{
          background: '#ffffff',
          padding: '16px 20px',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          marginBottom: '30px',
          boxShadow: 'var(--shadow)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* Category Navigation Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
              {categoryMeta.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      borderRadius: '20px',
                      padding: '8px 16px',
                      whiteSpace: 'nowrap',
                      fontWeight: 700
                    }}
                  >
                    <IconComp size={15} />
                    <span>{cat.emoji ? `${cat.emoji} ` : ''}{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Search & Cart Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '38px', borderRadius: '20px' }}
                  placeholder="Search food, beverage or dessert..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {user?.role === 'student' && (
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '20px', padding: '9px 18px', whiteSpace: 'nowrap' }}
                >
                  <ShoppingCart size={16} />
                  <span>Cart ({totalItemsCount})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            🍲 Loading hot canteen dishes and categories...
          </div>
        ) : menuItems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <AlertCircle size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h3>No matching food items found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
              Try selecting another category or clear your search keyword.
            </p>
          </div>
        ) : (
          /* ======================================================== */
          /* 3. CATEGORIES & FOOD ITEMS WITH QUANTITY PICKER          */
          /* ======================================================== */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
            {categoriesToDisplay.map((catKey) => {
              const catItems = menuItems.filter((i) => i.category === catKey);
              if (catItems.length === 0) return null;

              const meta = categoryMeta.find((m) => m.id === catKey) || {
                label: catKey,
                emoji: '🍽️',
                subtitle: 'Delicious canteen offerings'
              };

              return (
                <section key={catKey}>
                  {/* Category Title Heading */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    borderBottom: '2px solid var(--border)',
                    paddingBottom: '12px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.6rem' }}>{meta.emoji}</span>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {meta.label}
                        </h3>
                        <span style={{
                          background: '#eff6ff',
                          color: 'var(--primary)',
                          padding: '3px 10px',
                          borderRadius: '14px',
                          fontSize: '0.78rem',
                          fontWeight: 800
                        }}>
                          {catItems.length} options
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                        {meta.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Food Cards Grid */}
                  <div className="grid-cards">
                    {catItems.map((item) => {
                      const qty = itemQuantities[item._id] || 1;

                      return (
                        <div
                          key={item._id}
                          className="card"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            padding: 0,
                            border: '1px solid var(--border)',
                            borderRadius: '14px',
                            background: '#ffffff',
                            position: 'relative'
                          }}
                        >
                          {/* Food Picture */}
                          <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                              alt={item.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                            />
                            
                            {/* Availability Badge */}
                            <span
                              className={`badge ${item.isAvailable ? 'badge-available' : 'badge-soldout'}`}
                              style={{ position: 'absolute', top: '12px', right: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}
                            >
                              {item.isAvailable ? 'Available' : 'Sold Out'}
                            </span>

                            {/* Category Badge */}
                            <span
                              className="badge"
                              style={{
                                position: 'absolute',
                                bottom: '12px',
                                left: '12px',
                                background: 'rgba(15, 23, 42, 0.8)',
                                color: '#ffffff',
                                backdropFilter: 'blur(4px)'
                              }}
                            >
                              {item.category}
                            </span>
                          </div>

                          {/* Food Details */}
                          <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.35', marginBottom: '6px' }}>
                              {item.name}
                            </h4>

                            <p style={{
                              color: 'var(--text-muted)',
                              fontSize: '0.84rem',
                              lineHeight: '1.45',
                              marginBottom: '16px',
                              flexGrow: 1
                            }}>
                              {item.description}
                            </p>

                            {/* Price & Prep Time */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                              <div>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>
                                  Price
                                </span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>
                                  Rs. {item.price}
                                </span>
                              </div>

                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <Clock size={15} /> ~{item.prepTimeMinutes} mins
                              </span>
                            </div>

                            {/* Quantity Selector & Add to Cart */}
                            <div style={{
                              paddingTop: '12px',
                              borderTop: '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px'
                            }}>
                              {user?.role === 'student' ? (
                                <>
                                  {/* Quantity Picker (- / qty / +) */}
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    background: '#f8fafc',
                                    overflow: 'hidden'
                                  }}>
                                    <button
                                      type="button"
                                      onClick={() => handleQuantityChange(item._id, -1)}
                                      disabled={!item.isAvailable || qty <= 1}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '6px 10px',
                                        cursor: qty <= 1 ? 'not-allowed' : 'pointer',
                                        opacity: qty <= 1 ? 0.4 : 1
                                      }}
                                      title="Decrease quantity"
                                    >
                                      <Minus size={14} />
                                    </button>

                                    <input
                                      type="number"
                                      min="1"
                                      max="50"
                                      value={qty}
                                      onChange={(e) => handleCustomQuantityInput(item._id, e.target.value)}
                                      disabled={!item.isAvailable}
                                      style={{
                                        width: '36px',
                                        textAlign: 'center',
                                        border: 'none',
                                        background: 'none',
                                        fontWeight: 800,
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                      }}
                                    />

                                    <button
                                      type="button"
                                      onClick={() => handleQuantityChange(item._id, 1)}
                                      disabled={!item.isAvailable}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '6px 10px',
                                        cursor: 'pointer'
                                      }}
                                      title="Increase quantity"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>

                                  {/* Add to Cart with Total */}
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleAddToCart(item)}
                                    disabled={!item.isAvailable}
                                    style={{
                                      flexGrow: 1,
                                      borderRadius: '8px',
                                      padding: '8px 12px',
                                      fontSize: '0.82rem'
                                    }}
                                  >
                                    <Plus size={15} /> Add {qty > 1 ? `(${qty})` : ''}
                                  </button>
                                </>
                              ) : (
                                <Link
                                  to="/login"
                                  className="btn btn-secondary btn-sm"
                                  style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem' }}
                                >
                                  Sign In to Order
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. FLOATING CART CHECKOUT BAR                            */}
      {/* ======================================================== */}
      {user?.role === 'student' && totalItemsCount > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '2px solid #2563eb',
          color: '#ffffff',
          padding: '14px 24px',
          zIndex: 999,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.2)'
        }}>
          <div className="container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: '#2563eb',
                borderRadius: '50%',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingCart size={22} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in your cart
                </div>
                <div style={{ fontSize: '0.85rem', color: '#93c5fd' }}>
                  Total: <strong style={{ color: '#ffffff', fontSize: '1rem' }}>Rs. {subtotal}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{
                padding: '12px 24px',
                fontSize: '0.95rem',
                borderRadius: '10px',
                background: '#2563eb'
              }}
            >
              <span>Choose Pickup Slot & Order</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBrowsing;
