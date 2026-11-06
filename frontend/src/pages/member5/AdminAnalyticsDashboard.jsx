/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 5: Analytics & Admin Dashboard
 * DEVELOPER: K.G.C.S Thilakarathna (SEU/IS/22/ICT/107)
 * FILE: frontend/src/pages/member5/AdminAnalyticsDashboard.jsx
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Star, 
  Clock, 
  Flame, 
  MessageSquare,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const AdminAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/analytics/dashboard');
      setAnalytics(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard analytics:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '1300px' }}>
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Canteen Management Intelligence & Reports</h2>
          <p style={{ opacity: 0.9, fontSize: '0.85rem', marginTop: '4px' }}>
            Daily revenue metrics, popular dish sales, and peak rush hour analytics.
          </p>
        </div>
        <Link to="/admin/feedback" className="btn btn-secondary btn-sm" style={{ background: '#ffffff', color: '#1e3a8a' }}>
          <MessageSquare size={16} /> View Student Reviews
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Compiling canteen metrics & sales data...</div>
      ) : !analytics ? (
        <div>No data available</div>
      ) : (
        <div>
          {/* Executive KPI Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Gross Revenue</span>
                <DollarSign size={20} color="#2563eb" />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '8px' }}>
                Rs. {analytics.summary.totalRevenue.toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                ↑ Pre-order collections
              </span>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Pre-Orders</span>
                <TrendingUp size={20} color="#0ea5e9" />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
                {analytics.summary.totalOrdersCount}
              </h3>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', marginTop: '4px' }}>
                <span style={{ color: 'var(--success)' }}>✓ {analytics.summary.completedOrdersCount} Collected</span>
                <span style={{ color: 'var(--danger)' }}>✗ {analytics.summary.cancelledOrdersCount} Cancelled</span>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Order Value</span>
                <BarChart3 size={20} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px' }}>
                Rs. {analytics.summary.averageOrderValue}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Per student basket
              </span>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Student Satisfaction</span>
                <Star size={20} color="#f59e0b" fill="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '8px' }}>
                {analytics.summary.averageRating} / 5.0
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Based on {analytics.summary.totalReviews} student reviews
              </span>
            </div>
          </div>

          {/* Section 2: Peak Hours & Popular Dishes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '28px' }}>
            {/* Peak Ordering Hours Analysis */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Clock size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Peak Ordering & Pickup Hours Analysis</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Identifies highest rush intervals to distribute canteen kitchen staff and avoid counter overcrowding.
              </p>

              {analytics.peakHours.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No peak hour traffic recorded yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {analytics.peakHours.map((slot, index) => {
                    const maxOrders = Math.max(...analytics.peakHours.map((p) => p.orderCount)) || 1;
                    const percentage = Math.round((slot.orderCount / maxOrders) * 100);

                    return (
                      <div key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600 }}>{slot._id}</span>
                          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            {slot.orderCount} orders (Rs. {slot.slotRevenue})
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: '100%',
                              background: index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#2563eb',
                              borderRadius: '5px',
                              transition: 'width 0.5s ease'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top-Selling Dishes Leaderboard */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Flame size={20} color="#ea580c" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Top 5 Popular Food Items</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Highest demanded meals based on student pre-order frequency.
              </p>

              {analytics.topSellingDishes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No food sales aggregated yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analytics.topSellingDishes.map((dish, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: i === 0 ? '#fef3c7' : '#e2e8f0',
                          color: i === 0 ? '#d97706' : '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.8rem'
                        }}>
                          {i + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{dish._id}</div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {dish.totalQuantity} portions sold
                          </span>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                        Rs. {dish.totalRevenue}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Category Distribution */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Category Sales Distribution</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {analytics.categoryDistribution.map((cat, idx) => (
                <div key={idx} style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cat._id}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                    Rs. {cat.revenue}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {cat.count} items ordered
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalyticsDashboard;
