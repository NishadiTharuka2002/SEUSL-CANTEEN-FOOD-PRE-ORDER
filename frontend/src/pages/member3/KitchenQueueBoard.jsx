/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 3: Status & Queue Management
 * DEVELOPER: A.M.S Rasanjalie (SEU/IS/22/ICT/079)
 * FILE: frontend/src/pages/member3/KitchenQueueBoard.jsx
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import api, { socket } from '../../services/api';
import { ChefHat, Check, ArrowRight, Bell, RefreshCw } from 'lucide-react';

const columns = [
  { id: 'Placed', label: 'New Placed Orders', color: '#0284c7', bg: '#f0f9ff' },
  { id: 'Confirmed', label: 'Confirmed by Canteen', color: '#d97706', bg: '#fffbeb' },
  { id: 'Preparing', label: 'Currently Cooking', color: '#ea580c', bg: '#fff7ed' },
  { id: 'Ready', label: 'Ready for Collection', color: '#16a34a', bg: '#f0fdf4' }
];

const KitchenQueueBoard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState('');

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/queue');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Queue load error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();

    // Listen to real-time events for kitchen/staff
    socket.on('new_order_placed', (data) => {
      setNewOrderAlert(data.message);
      fetchQueue();
      setTimeout(() => setNewOrderAlert(''), 5000);
    });

    socket.on('queue_updated', () => {
      fetchQueue();
    });

    return () => {
      socket.off('new_order_placed');
      socket.off('queue_updated');
    };
  }, []);

  const handleAdvanceStatus = async (orderId, nextStatus) => {
    try {
      await api.patch(`/queue/${orderId}/status`, { status: nextStatus });
      fetchQueue();
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  const getNextStatus = (current) => {
    if (current === 'Placed') return 'Confirmed';
    if (current === 'Confirmed') return 'Preparing';
    if (current === 'Preparing') return 'Ready';
    if (current === 'Ready') return 'Collected';
    return null;
  };

  return (
    <div className="container" style={{ maxWidth: '1400px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Live Kitchen Preparation & Pickup Queue Board</h2>
          <p style={{ opacity: 0.9, fontSize: '0.85rem', marginTop: '4px' }}>
            Real-time Kanban board for canteen chefs and collection counter staff.
          </p>
        </div>
        <button onClick={fetchQueue} className="btn btn-secondary btn-sm" style={{ background: '#ffffff', color: '#1e3a8a' }}>
          <RefreshCw size={16} /> Refresh Queue
        </button>
      </div>

      {newOrderAlert && (
        <div style={{
          background: '#dbeafe',
          color: '#1e40af',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700
        }}>
          <Bell size={20} />
          <span>{newOrderAlert}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading real-time kitchen queue...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'start' }}>
          {columns.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.id);

            return (
              <div
                key={col.id}
                style={{
                  background: col.bg,
                  borderRadius: '12px',
                  border: `1px solid ${col.color}40`,
                  padding: '16px',
                  minHeight: '600px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: `2px solid ${col.color}` }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: col.color }}>{col.label}</h3>
                  <span style={{
                    background: col.color,
                    color: '#ffffff',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {colOrders.length}
                  </span>
                </div>

                {/* Order Cards */}
                {colOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No orders currently in this stage.
                  </div>
                ) : (
                  colOrders.map((ord) => {
                    const next = getNextStatus(ord.status);

                    return (
                      <div
                        key={ord._id}
                        className="card"
                        style={{ padding: '14px', background: '#ffffff', border: '1px solid var(--border)' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
                            {ord.orderNumber}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            {ord.pickupTime}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                          Student: {ord.user?.name} ({ord.user?.regNumber || 'N/A'})
                        </div>

                        {/* Order Items */}
                        <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', marginBottom: '10px', fontSize: '0.8rem' }}>
                          {ord.items.map((it, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{it.quantity}x {it.name}</span>
                            </div>
                          ))}
                        </div>

                        {/* Special Instructions callout */}
                        {ord.specialNotes && (
                          <div style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '6px 8px', borderRadius: '4px', marginBottom: '10px' }}>
                            ⚠️ Note: {ord.specialNotes}
                          </div>
                        )}

                        {/* Action to advance queue */}
                        {next && (
                          <button
                            onClick={() => handleAdvanceStatus(ord._id, next)}
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%', fontSize: '0.78rem' }}
                          >
                            <span>Advance to {next}</span>
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KitchenQueueBoard;
