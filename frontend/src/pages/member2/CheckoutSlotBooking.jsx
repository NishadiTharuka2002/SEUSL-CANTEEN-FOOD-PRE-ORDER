/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 2: Shopping Cart & Pre-Order Management
 * FILE: frontend/src/pages/member2/CheckoutSlotBooking.jsx
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { 
  Clock, 
  ShieldCheck, 
  Wallet, 
  Banknote, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  ChefHat, 
  Calendar,
  Sparkles,
  Ticket,
  PlusCircle,
  RefreshCw
} from 'lucide-react';

const CheckoutSlotBooking = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const DEFAULT_SLOTS = [
    { _id: 'slot_1', label: '11:00 AM - 11:20 AM', maxCapacity: 15, currentBookings: 0 },
    { _id: 'slot_2', label: '11:20 AM - 11:40 AM', maxCapacity: 15, currentBookings: 0 },
    { _id: 'slot_3', label: '11:40 AM - 12:00 PM', maxCapacity: 15, currentBookings: 0 },
    { _id: 'slot_4', label: '12:00 PM - 12:20 PM', maxCapacity: 15, currentBookings: 0 },
    { _id: 'slot_5', label: '12:20 PM - 12:40 PM', maxCapacity: 15, currentBookings: 0 },
    { _id: 'slot_6', label: '12:40 PM - 01:00 PM', maxCapacity: 15, currentBookings: 0 },
    { _id: 'slot_7', label: '01:00 PM - 01:20 PM', maxCapacity: 15, currentBookings: 0 }
  ];

  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [selectedSlotId, setSelectedSlotId] = useState(DEFAULT_SLOTS[0]._id);
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('WALLET');
  const [walletBalance, setWalletBalance] = useState(2500);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Confirmed Order State (Shown immediately when order is placed)
  const [confirmedOrder, setConfirmedOrder] = useState(() => {
    const saved = sessionStorage.getItem('canteen_last_confirmed_order');
    return saved ? JSON.parse(saved) : null;
  });

  const loadData = async () => {
    try {
      setErrorMsg('');
      let availableSlots = [];
      let balance = 2500;

      try {
        const slotsRes = await api.get('/orders/slots');
        if (slotsRes.data && slotsRes.data.length > 0) {
          availableSlots = slotsRes.data;
        }
      } catch (e) {
        console.warn('Could not load slots from server, using default slots', e);
      }

      if (availableSlots.length > 0) {
        setSlots(availableSlots);
        setSelectedSlotId(availableSlots[0]._id);
      }

      try {
        const walletRes = await api.get('/wallet');
        if (walletRes.data && typeof walletRes.data.balance === 'number') {
          balance = walletRes.data.balance;
        }
      } catch (e) {
        console.warn('Could not load wallet balance, using demo balance', e);
      }
      setWalletBalance(balance);

      // If wallet balance is lower than subtotal, default to Cash on Pickup
      if (balance < subtotal) {
        setPaymentMethod('CASH');
      } else {
        setPaymentMethod('WALLET');
      }
    } catch (err) {
      console.error('Error fetching checkout data:', err);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0 && !confirmedOrder) {
      const savedOrder = sessionStorage.getItem('canteen_last_confirmed_order');
      if (savedOrder) {
        setConfirmedOrder(JSON.parse(savedOrder));
        return;
      }
      navigate('/cart');
      return;
    }
    loadData();
  }, []);

  // Quick 1-click Top-up right from checkout if student wants to pay via wallet
  const handleQuickAddBalance = async () => {
    try {
      const { data } = await api.post('/wallet/topup', {
        amount: 1000,
        paymentMethodName: 'Instant Top-Up'
      });
      setWalletBalance(data.newBalance);
      setPaymentMethod('WALLET');
      setErrorMsg('');
      alert('Added Rs. 1,000 to your wallet! You can now pay using your wallet.');
    } catch (err) {
      setWalletBalance((prev) => prev + 1000);
      setPaymentMethod('WALLET');
      setErrorMsg('');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Ensure slot ID
    let slotIdToUse = selectedSlotId;
    if (!slotIdToUse && slots.length > 0) {
      slotIdToUse = slots[0]._id;
    }
    if (!slotIdToUse) {
      slotIdToUse = DEFAULT_SLOTS[0]._id;
    }

    let finalPaymentMethod = paymentMethod;
    if (finalPaymentMethod === 'WALLET' && walletBalance < subtotal) {
      finalPaymentMethod = 'CASH';
      setPaymentMethod('CASH');
    }

    try {
      setSubmitting(true);
      const payload = {
        items: cartItems,
        pickupSlotId: slotIdToUse,
        specialNotes,
        paymentMethod: finalPaymentMethod
      };

      const { data } = await api.post('/orders', payload);
      
      // Store confirmed order details to show the confirmation screen!
      sessionStorage.setItem('canteen_last_confirmed_order', JSON.stringify(data.order));
      setConfirmedOrder(data.order);
      clearCart();
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitting(false);
      let msg = err.response?.data?.message || err.message || 'Failed to place pre-order.';
      if (err.message && (err.message.includes('Network Error') || err.message.includes('ECONNREFUSED'))) {
        msg = 'Backend Server එක run වෙන්නේ නැත! කරුණාකර Backend CMD window එකේ "nodemon server.js" හෝ "node server.js" දුවවන්න.';
      } else if (err.response?.status === 401) {
        msg = 'Session එක expire වී ඇත. කරුණාකර නැවත Login වී order එක place කරන්න!';
      }
      setErrorMsg(msg);
      alert('Order Placement Notice: ' + msg);
      console.error('Checkout error:', err);
    }
  };

  // ========================================================
  // ORDER CONFIRMED SUCCESS VIEW
  // ========================================================
  if (confirmedOrder) {
    return (
      <div className="container" style={{ maxWidth: '650px', marginTop: '20px', paddingBottom: '60px' }}>
        <div className="card" style={{
          textAlign: 'center',
          padding: '40px 30px',
          border: '2px solid #10b981',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderRadius: '20px',
          background: '#ffffff'
        }}>
          {/* Big Green Success Celebration Icon */}
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 0 10px rgba(16, 185, 129, 0.15)'
          }}>
            <CheckCircle2 size={48} color="#10b981" />
          </div>

          <span className="badge" style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 16px', fontSize: '0.85rem', fontWeight: 800 }}>
            SUCCESSFULLY PLACED
          </span>

          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>
            Order Confirmed!
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.5 }}>
            Thank you! Your pre-order has been safely received by the university canteen kitchen staff.
          </p>

          {/* Token Box */}
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '2px dashed #3b82f6',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1d4ed8', fontSize: '0.85rem', fontWeight: 700 }}>
              <Ticket size={18} />
              <span>YOUR ORDER TOKEN NUMBER</span>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#1e3a8a', letterSpacing: '1px', marginTop: '4px' }}>
              {confirmedOrder.orderNumber}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px' }}>
              Please show this token number at the canteen pickup counter.
            </div>
          </div>

          {/* Details Summary Card */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '28px'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              Order & Pickup Details
            </h4>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Pickup Time Slot:</span>
              <strong style={{ color: '#2563eb' }}>{confirmedOrder.pickupTime}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
              <strong>{confirmedOrder.paymentMethod === 'WALLET' ? 'Paid via Digital Wallet' : 'Cash on Pickup'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
              <span className={`badge ${confirmedOrder.paymentStatus === 'PAID' ? 'badge-ready' : 'badge-confirmed'}`}>
                {confirmedOrder.paymentStatus}
              </span>
            </div>

            {/* Ordered Items List */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                ITEMS ORDERED:
              </div>
              {confirmedOrder.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                  <span>{it.quantity}x {it.name}</span>
                  <span style={{ fontWeight: 600 }}>Rs. {it.subtotal}</span>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '2px solid var(--border)',
              paddingTop: '12px',
              marginTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Total Amount:</span>
              <span style={{ fontWeight: 900, fontSize: '1.35rem', color: 'var(--primary)' }}>
                Rs. {confirmedOrder.totalAmount}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              to={`/orders/track?orderId=${confirmedOrder._id}`}
              className="btn btn-primary"
              style={{ padding: '14px', fontSize: '1rem', borderRadius: '10px' }}
            >
              <ChefHat size={18} />
              <span>Track Live Preparation Status</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to={`/feedback?orderId=${confirmedOrder.orderNumber}`}
              className="btn btn-secondary"
              style={{
                padding: '12px',
                fontSize: '0.95rem',
                borderRadius: '10px',
                background: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={18} color="#d97706" />
              <span>⭐ Give Feedback / Review Service</span>
            </Link>

            <Link
              to="/menu"
              className="btn btn-secondary"
              style={{ padding: '12px', fontSize: '0.95rem', borderRadius: '10px' }}
            >
              <ShoppingBag size={18} />
              <span>Order More Food</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // CHECKOUT & SLOT BOOKING FORM VIEW
  // ========================================================
  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      
      {/* Clean Page Title */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Confirm Order & Pickup Time Slot</h2>
        <p style={{ opacity: 0.9, fontSize: '0.88rem', marginTop: '4px' }}>
          Choose your pickup time to avoid waiting at the counter, select payment method and place your pre-order.
        </p>
      </div>

      {errorMsg && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #ef4444',
          color: '#dc2626',
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <AlertCircle size={20} />
            <span>Could Not Place Order:</span>
          </div>
          <div style={{ fontSize: '0.92rem', paddingLeft: '28px' }}>
            {errorMsg}
          </div>
          {errorMsg.toLowerCase().includes('wallet') && (
            <div style={{ paddingLeft: '28px', marginTop: '6px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className="btn btn-secondary btn-sm"
                style={{ background: '#ffffff', color: '#dc2626' }}
              >
                Switch to Cash on Pickup
              </button>
              <button
                type="button"
                onClick={handleQuickAddBalance}
                className="btn btn-primary btn-sm"
              >
                Top-up Rs. 1,000 Now
              </button>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading pickup slots and canteen capacity...</div>
      ) : (
        <form onSubmit={handleSubmitOrder}>
          {/* Step 1: Select Pickup Time Slot */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Clock size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>1. Choose Pickup Time Slot (Avoid Rush Hours)</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Each slot is capped at 15 pre-orders to prevent queuing crowds at the collection counter.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {slots.map((slot) => {
                const remaining = Math.max(0, slot.maxCapacity - (slot.currentBookings || 0));
                const isSelected = selectedSlotId === slot._id;

                return (
                  <div
                    key={slot._id}
                    onClick={() => setSelectedSlotId(slot._id)}
                    style={{
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      borderRadius: '10px',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 0 0 3px rgba(37, 99, 235, 0.2)' : 'none'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                      {slot.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: remaining <= 0 ? '#ea580c' : '#16a34a', fontWeight: 600 }}>
                      {remaining <= 0 ? 'Busy (Crowded)' : `${remaining} slots available`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ShieldCheck size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>2. Select Payment Method</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Wallet Option */}
              <div
                onClick={() => setPaymentMethod('WALLET')}
                style={{
                  border: `2px solid ${paymentMethod === 'WALLET' ? 'var(--primary)' : 'var(--border)'}`,
                  background: paymentMethod === 'WALLET' ? '#eff6ff' : '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  boxShadow: paymentMethod === 'WALLET' ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Wallet size={20} color="#2563eb" />
                  <span style={{ fontWeight: 800 }}>Student Digital Wallet</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Current Balance: <strong style={{ color: walletBalance >= subtotal ? 'var(--success)' : 'var(--danger)' }}>Rs. {walletBalance}</strong>
                </div>
                {walletBalance < subtotal && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAddBalance();
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '10px', fontSize: '0.75rem', width: '100%' }}
                  >
                    <PlusCircle size={14} /> + Top-up Rs. 1,000
                  </button>
                )}
              </div>

              {/* Cash Option */}
              <div
                onClick={() => setPaymentMethod('CASH')}
                style={{
                  border: `2px solid ${paymentMethod === 'CASH' ? 'var(--primary)' : 'var(--border)'}`,
                  background: paymentMethod === 'CASH' ? '#eff6ff' : '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  boxShadow: paymentMethod === 'CASH' ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Banknote size={20} color="#16a34a" />
                  <span style={{ fontWeight: 800 }}>Cash on Pickup</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Pay exact amount at canteen counter
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Special Instructions */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>3. Special Kitchen Instructions (Optional)</h3>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="e.g. Less spicy, keep sambol separately, please pack carefully..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
            />
          </div>

          {/* Order Placement Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Amount to Pay</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>
                Rs. {subtotal}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '14px 32px', fontSize: '1.05rem', borderRadius: '10px', fontWeight: 800 }}
              disabled={submitting}
            >
              {submitting ? 'Placing Pre-Order...' : 'Confirm & Place Pre-Order'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutSlotBooking;
