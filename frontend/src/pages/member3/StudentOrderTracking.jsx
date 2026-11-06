/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 3: Status & Queue Management
 * DEVELOPER: A.M.S Rasanjalie (SEU/IS/22/ICT/079)
 * FILE: frontend/src/pages/member3/StudentOrderTracking.jsx
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api, { socket } from '../../services/api';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  PackageCheck, 
  ShoppingBag, 
  AlertCircle, 
  Ban,
  BellRing,
  Star
} from 'lucide-react';

const steps = [
  { id: 'Placed', label: 'Order Placed', icon: Clock },
  { id: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { id: 'Preparing', label: 'In Kitchen', icon: ChefHat },
  { id: 'Ready', label: 'Ready for Pickup', icon: BellRing },
  { id: 'Collected', label: 'Collected', icon: PackageCheck }
];

const StudentOrderTracking = () => {
  const [searchParams] = useSearchParams();
  const targetOrderId = searchParams.get('orderId');

  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [notification, setNotification] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/my-orders');
      setOrders(data);

      if (data.length > 0) {
        if (targetOrderId) {
          const matched = data.find((o) => o._id === targetOrderId);
          setActiveOrder(matched || data[0]);
        } else {
          setActiveOrder(data[0]);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Listen for real-time status update from backend via Socket.io
    const handleStatusUpdate = (eventData) => {
      setNotification(eventData.message);
      setOrders((prev) =>
        prev.map((ord) => (ord._id === eventData.orderId ? { ...ord, status: eventData.status } : ord))
      );
      setActiveOrder((prev) =>
        prev && prev._id === eventData.orderId ? { ...prev, status: eventData.status } : prev
      );
    };

    socket.on('order_status_updated', handleStatusUpdate);

    return () => {
      socket.off('order_status_updated', handleStatusUpdate);
    };
  }, [targetOrderId]);

  const handleCancelOrder = async () => {
    if (!activeOrder) return;
    try {
      const { data } = await api.patch(`/queue/${activeOrder._id}/cancel`, {
        cancellationReason: cancelReason
      });
      alert(data.message + (data.refundProcessed ? ` (Refund of Rs. ${data.refundAmount} added to wallet)` : ''));
      setCancelModalOpen(false);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling order');
    }
  };

  const getStepStatus = (stepId, currentStatus) => {
    if (currentStatus === 'Cancelled') return 'cancelled';
    const orderIndex = steps.findIndex((s) => s.id === currentStatus);
    const thisIndex = steps.findIndex((s) => s.id === stepId);

    if (thisIndex < orderIndex) return 'completed';
    if (thisIndex === orderIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)' }}>Live Order Tracking & Queue Progress</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
          Real-time kitchen preparation queue and pickup counter notification.
        </p>
      </div>

      {notification && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #10b981',
          color: '#065f46',
          padding: '14px 18px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          boxShadow: 'var(--shadow)'
        }}>
          <BellRing size={20} color="#10b981" />
          <span>{notification}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading order tracking status...</div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <ShoppingBag size={50} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h3>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
            You have not placed any pre-orders yet.
          </p>
          <Link to="/" className="btn btn-primary">
            Place Your First Order
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* Active Order Live Tracker */}
          {activeOrder && (
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Token / Order ID</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {activeOrder.orderNumber}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Scheduled Pickup: <strong style={{ color: 'var(--text-main)' }}>{activeOrder.pickupTime}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${activeOrder.status.toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    {activeOrder.status}
                  </span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Payment: <strong>{activeOrder.paymentMethod} ({activeOrder.paymentStatus})</strong>
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              {activeOrder.status === 'Cancelled' ? (
                <div style={{
                  margin: '30px 0',
                  padding: '20px',
                  background: '#fef2f2',
                  borderRadius: '10px',
                  color: '#dc2626',
                  textAlign: 'center'
                }}>
                  <Ban size={36} style={{ margin: '0 auto 8px' }} />
                  <h4 style={{ fontWeight: 700 }}>This Order Has Been Cancelled</h4>
                  <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                    Reason: {activeOrder.cancellationReason || 'User requested cancellation'}
                  </p>
                  {activeOrder.refundAmount > 0 && (
                    <div style={{ marginTop: '8px', fontWeight: 700, color: '#16a34a' }}>
                      Refund of Rs. {activeOrder.refundAmount} was credited to your digital wallet.
                    </div>
                  )}
                </div>
              ) : (
                <div className="stepper">
                  {steps.map((st) => {
                    const stepStatus = getStepStatus(st.id, activeOrder.status);
                    const IconComp = st.icon;

                    return (
                      <div key={st.id} className={`step-item ${stepStatus}`}>
                        <div className="step-circle">
                          <IconComp size={18} />
                        </div>
                        <span className="step-title">{st.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Live Status Message Box */}
              <div style={{
                background: activeOrder.status === 'Ready' ? '#dcfce7' : '#eff6ff',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ChefHat size={24} color={activeOrder.status === 'Ready' ? '#16a34a' : '#2563eb'} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    {activeOrder.status === 'Placed' && 'Your order has been queued. Waiting for kitchen confirmation.'}
                    {activeOrder.status === 'Confirmed' && 'Canteen has accepted your order and added it to prep queue.'}
                    {activeOrder.status === 'Preparing' && 'Kitchen staff is currently cooking your hot meal!'}
                    {activeOrder.status === 'Ready' && '🎉 Meal is PACKED & READY! Please proceed to the collection counter with your token.'}
                    {activeOrder.status === 'Collected' && 'Meal has been collected. Enjoy your food!'}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Real-time queue synchronized via WebSockets.
                  </p>
                </div>
              </div>

              {/* Items List */}
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Items in this Order</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                    <span>{it.quantity}x {it.name}</span>
                    <span style={{ fontWeight: 600 }}>Rs. {it.subtotal}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontWeight: 800, fontSize: '1.05rem' }}>
                  <span>Total Amount Paid</span>
                  <span style={{ color: 'var(--primary)' }}>Rs. {activeOrder.totalAmount}</span>
                </div>
              </div>

              {/* Actions: Cancel or Feedback */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                {['Placed', 'Confirmed'].includes(activeOrder.status) && (
                  <button onClick={() => setCancelModalOpen(true)} className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }}>
                    <Ban size={16} /> Cancel Order & Refund
                  </button>
                )}
                <Link to={`/feedback?orderId=${activeOrder.orderNumber || activeOrder._id}`} className="btn btn-secondary btn-sm" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={16} color="#d97706" /> Rate & Give Feedback
                </Link>
              </div>
            </div>
          )}

          {/* Past Orders History List Sidebar */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Your Recent Orders</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  onClick={() => setActiveOrder(ord)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${activeOrder?._id === ord._id ? 'var(--primary)' : 'var(--border)'}`,
                    background: activeOrder?._id === ord._id ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ord.orderNumber}</span>
                    <span className={`badge badge-${ord.status.toLowerCase()}`}>{ord.status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Slot: {ord.pickupTime}</span>
                    <span style={{ fontWeight: 600 }}>Rs. {ord.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>Confirm Order Cancellation</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Are you sure you want to cancel order <strong>#{activeOrder?.orderNumber}</strong>?
              If you paid with your digital wallet, the full amount will be immediately refunded to your wallet balance.
            </p>

            <div className="form-group">
              <label className="form-label">Reason for Cancellation</label>
              <select
                className="form-select"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Change of plans">Change of plans / Class schedule changed</option>
                <option value="Accidentally ordered wrong item">Accidentally ordered wrong item</option>
                <option value="Selected wrong pickup time">Selected wrong pickup time</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setCancelModalOpen(false)} className="btn btn-secondary">
                Keep Order
              </button>
              <button onClick={handleCancelOrder} className="btn btn-danger">
                Yes, Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOrderTracking;
