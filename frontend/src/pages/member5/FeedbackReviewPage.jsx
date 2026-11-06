/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 5: Analytics & Admin Dashboard
 * DEVELOPER: K.G.C.S Thilakarathna (SEU/IS/22/ICT/107)
 * FILE: frontend/src/pages/member5/FeedbackReviewPage.jsx
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const FeedbackReviewPage = () => {
  const [searchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');

  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submission Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [serviceAspect, setServiceAspect] = useState('Food Quality');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/analytics/feedback');
      setFeedbackList(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { data } = await api.post('/analytics/feedback', {
        orderId: orderIdFromUrl || undefined,
        rating,
        comment,
        serviceAspect
      });
      setSuccessMsg(data.message);
      setComment('');
      setSubmitting(false);
      fetchFeedback();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setSubmitting(false);
      alert(err.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)' }}>Student Ratings & Feedback Portal</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
          Customer reviews on meal taste, service speed, and hygiene.
        </p>
      </div>

      {successMsg && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #10b981',
          color: '#065f46',
          padding: '14px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={20} color="#10b981" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Student Feedback Submission Form */}
      {user?.role === 'student' && (
        <div className="card" style={{ marginBottom: '28px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Rate Your Meal Experience</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Help cafeteria management improve meal taste, queue speed, and service quality.
          </p>

          <form onSubmit={handleSubmitFeedback}>
            {/* Star Rating Selector */}
            <div className="form-group">
              <label className="form-label">Star Rating (1 to 5 Stars)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Star
                      size={28}
                      color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                      fill={star <= rating ? '#f59e0b' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Service Aspect</label>
                <select
                  className="form-select"
                  value={serviceAspect}
                  onChange={(e) => setServiceAspect(e.target.value)}
                >
                  <option value="Food Quality">Food Quality & Taste</option>
                  <option value="Queue Wait Time">Queue Wait Time & Speed</option>
                  <option value="Staff Friendliness">Counter Staff Friendliness</option>
                  <option value="Packaging">Packaging & Hygiene</option>
                  <option value="General">General Campus Canteen Experience</option>
                </select>
              </div>

              {orderIdFromUrl && (
                <div className="form-group">
                  <label className="form-label">Attached Order</label>
                  <input
                    type="text"
                    className="form-input"
                    disabled
                    value={`Reviewing Order #${orderIdFromUrl}`}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Your Review & Comments</label>
              <textarea
                className="form-textarea"
                rows="3"
                required
                placeholder="Share your thoughts about food taste, temperature, and counter pickup experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Send size={16} />
              <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
          Recent Customer Reviews ({feedbackList.length})
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading reviews...</div>
        ) : feedbackList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No reviews published yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {feedbackList.map((item) => (
              <div
                key={item._id}
                style={{
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          color={i < item.rating ? '#f59e0b' : '#cbd5e1'}
                          fill={i < item.rating ? '#f59e0b' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>
                      {item.serviceAspect}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', margin: '8px 0' }}>
                  "{item.comment}"
                </p>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                  <span>Reviewed by <strong>{item.user?.name || 'Student'}</strong></span>
                  {item.user?.regNumber && <span>• {item.user.regNumber}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackReviewPage;
