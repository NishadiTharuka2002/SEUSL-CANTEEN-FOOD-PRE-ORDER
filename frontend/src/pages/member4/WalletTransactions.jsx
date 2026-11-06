/**
 * ====================================================================
 * PROJECT: University Canteen Pre-order & Queue Management System
 * MODULE 4: Payment & Transaction Management
 * DEVELOPER: P.G.N.B Gamage (SEU/IS/22/ICT/101)
 * FILE: frontend/src/pages/member4/WalletTransactions.jsx
 * ====================================================================
 */

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCcw, 
  CreditCard, 
  Plus, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

const WalletTransactions = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topUpModal, setTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [submitting, setSubmitting] = useState(false);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, txnRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/wallet/transactions')
      ]);
      setWallet(walletRes.data);
      setTransactions(txnRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Wallet load error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { data } = await api.post('/wallet/topup', {
        amount: Number(topUpAmount),
        paymentMethodName: paymentMethod
      });
      alert(data.message);
      setTopUpModal(false);
      setSubmitting(false);
      fetchWalletData();
    } catch (err) {
      setSubmitting(false);
      alert(err.response?.data?.message || 'Top-up failed');
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)' }}>Student Digital Canteen Wallet</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
          Manage your cafeteria balance, instant top-ups, and transaction history.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>Loading wallet balance & transactions...</div>
      ) : (
        <div>
          {/* Top Row: Digital Card & Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* Visual Digital Wallet Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <span style={{ fontSize: '0.9rem', letterSpacing: '1px', opacity: 0.8 }}>SEUSL SMART WALLET</span>
                <span className="badge" style={{ background: '#10b981', color: '#ffffff' }}>Active</span>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Available Balance</span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '4px' }}>
                  Rs. {wallet?.balance?.toLocaleString() || '0.00'}
                </h2>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', opacity: 0.9 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>CARD HOLDER</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>STUDENT ID</div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.regNumber || 'SEUSL-STUDENT'}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Add Funds to Wallet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Top up your pre-order wallet instantly to pay for cafeteria meals without carrying cash.
              </p>

              <button
                onClick={() => setTopUpModal(true)}
                className="btn btn-primary"
                style={{ padding: '14px', fontSize: '0.95rem' }}
              >
                <Plus size={18} /> Instant Wallet Top-Up
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>Zero service fees on all university cafeteria transactions.</span>
              </div>
            </div>
          </div>

          {/* Transaction Ledger Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Transaction History & Ledger</h3>

            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No transactions recorded yet.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Date & Time</th>
                    <th>Ref ID</th>
                    <th>Amount</th>
                    <th>Balance After</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const isCredit = tx.type === 'TOP_UP' || tx.type === 'REFUND';

                    return (
                      <tr key={tx._id}>
                        <td>
                          <span
                            className="badge"
                            style={{
                              background: tx.type === 'TOP_UP' ? '#dcfce7' : tx.type === 'REFUND' ? '#e0f2fe' : '#fee2e2',
                              color: tx.type === 'TOP_UP' ? '#16a34a' : tx.type === 'REFUND' ? '#0284c7' : '#dc2626'
                            }}
                          >
                            {tx.type === 'TOP_UP' && <ArrowDownLeft size={12} />}
                            {tx.type === 'PAYMENT' && <ArrowUpRight size={12} />}
                            {tx.type === 'REFUND' && <RotateCcw size={12} />}
                            {tx.type}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{tx.description}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {tx.paymentGatewayReference}
                        </td>
                        <td style={{ fontWeight: 700, color: isCredit ? 'var(--success)' : 'var(--danger)' }}>
                          {isCredit ? '+' : '-'} Rs. {tx.amount}
                        </td>
                        <td style={{ fontWeight: 600 }}>Rs. {tx.balanceAfter}</td>
                        <td>
                          <span className="badge badge-ready">{tx.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Top-Up Modal */}
      {topUpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>Top-Up Student Wallet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Select a quick amount or enter a custom sum to add funds.
            </p>

            {/* Quick Amount Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {[200, 500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`btn btn-sm ${topUpAmount === amt ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTopUpAmount(amt)}
                >
                  Rs. {amt}
                </button>
              ))}
            </div>

            <form onSubmit={handleTopUpSubmit}>
              <div className="form-group">
                <label className="form-label">Top-Up Amount (LKR)</label>
                <input
                  type="number"
                  className="form-input"
                  min="50"
                  max="50000"
                  required
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Simulated Payment Gateway</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Commercial Bank IPG">Commercial Bank Online Banking</option>
                  <option value="BOC SmartPay">Bank of Ceylon SmartPay</option>
                  <option value="Visa / Mastercard">Visa / MasterCard Debit Card</option>
                  <option value="Dialog eZ Cash">Dialog eZ Cash / FriMi</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setTopUpModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Processing Payment...' : `Top-Up Rs. ${topUpAmount}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletTransactions;
