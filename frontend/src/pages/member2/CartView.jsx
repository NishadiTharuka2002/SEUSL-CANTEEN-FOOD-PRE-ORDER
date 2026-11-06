/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 2: Shopping Cart & Pre-Order Management
 * DEVELOPER: W.G.G.U Weerasiri (SEU/IS/22/ICT/062)
 * FILE: frontend/src/pages/member2/CartView.jsx
 * ====================================================================
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const CartView = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)' }}>Your Food Pre-Order Cart</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
          Review selected meals, adjust quantities, and proceed to pickup slot reservation.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <ShoppingBag size={56} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Your cart is currently empty</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
            Browse through the canteen menu to add meals and reserve your pickup slot.
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Menu Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Order Items ({cartItems.length})</h3>
              <button onClick={clearCart} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>
                Clear All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={item.menuItemId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                      alt={item.name}
                      style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</h4>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Rs. {item.price} each
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Quantity Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px' }}>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0 8px', fontWeight: 700, fontSize: '0.9rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span style={{ fontWeight: 800, minWidth: '80px', textAlign: 'right' }}>
                      Rs. {item.price * item.quantity}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>Rs. {subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Canteen Handling Fee</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>FREE</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total Amount</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                Rs. {subtotal}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              <span>Choose Pickup Slot</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;
