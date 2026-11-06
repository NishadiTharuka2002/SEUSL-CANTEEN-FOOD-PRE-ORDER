import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Utensils, 
  Clock, 
  Wallet, 
  ChefHat, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  Flame 
} from 'lucide-react';

const LandingHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f8fafc' }}>
      {/* ======================================================== */}
      {/* 1. HERO WALLPAPER SECTION WITH MAIN TOPICS               */}
      {/* ======================================================== */}
      <div style={{
        position: 'relative',
        minHeight: '85vh',
        background: `linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.88)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '60px 20px',
        boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.35)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          
          {/* University Identity Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '8px 20px',
            borderRadius: '40px',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.8px',
            marginBottom: '24px'
          }}>
            <GraduationCap size={20} color="#60a5fa" />
            <span>SOUTH EASTERN UNIVERSITY OF SRI LANKA • GROUP U</span>
          </div>

          {/* Main Topic */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '20px',
            textShadow: '0 4px 20px rgba(0,0,0,0.6)'
          }}>
            University Canteen Pre-Order & <br />
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Queue Management System
            </span>
          </h1>

          {/* Subtopic / Problem & Solution */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            opacity: 0.92,
            lineHeight: 1.6,
            maxWidth: '750px',
            margin: '0 auto 36px',
            color: '#e2e8f0'
          }}>
            Say goodbye to rush-hour cafeteria crowds! Pre-order your freshly cooked meals online, choose your pickup time slot, pay via your student digital wallet, and collect your food with zero queue waiting.
          </p>

          {/* Conditional Call to Action Buttons */}
          {user ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: '24px 32px',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Welcome back, <span style={{ color: '#60a5fa' }}>{user?.name || 'Student'}</span>! ({user?.role || 'student'})
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                Your account is ready. Explore today's canteen menu and place your order!
              </div>
              <button
                onClick={() => navigate('/menu')}
                className="btn btn-primary"
                style={{
                  padding: '16px 36px',
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)'
                }}
              >
                <Utensils size={22} />
                <span>Go to Food Menu & Place Order</span>
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  padding: '16px 28px',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)'
                }}
              >
                <Sparkles size={18} />
                <span>Register as Student (Free Rs. 1,500 Bonus)</span>
              </Link>
              <Link
                to="/menu"
                className="btn btn-secondary"
                style={{
                  padding: '16px 24px',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#0f172a'
                }}
              >
                <Utensils size={18} />
                <span>View Food Menu</span>
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary"
                style={{
                  padding: '16px 24px',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
              >
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. HOW IT WORKS / KEY VALUE HIGHLIGHTS                   */}
      {/* ======================================================== */}
      <div className="container" style={{ padding: '70px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', padding: '6px 14px', fontSize: '0.8rem' }}>
            SMART CANTEEN WORKFLOW
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '10px' }}>
            How the System Works in 4 Simple Steps
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Designed specifically for SEUSL university students and canteen staff
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <Utensils size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>1. Browse Menu</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Explore breakfast, lunch specials, snacks, and chilled beverages with real food pictures, prices and prep times.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <Clock size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>2. Pick Time Slot</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Select a 20-minute pickup slot. Capped capacities prevent crowd congestion at the cafeteria counter.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <Wallet size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>3. Digital Payment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Pay instantly using your student digital wallet. Zero transaction fees and instant automated refunds on cancellation.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#ede9fe',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <ChefHat size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>4. Live Queue Tracking</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Watch your order progress live via WebSockets. Get notified the exact moment your meal is packed and ready!
            </p>
          </div>

        </div>

        {/* Big Bottom Action Call */}
        <div style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: '20px',
          padding: '40px',
          color: '#ffffff',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Ready to order your delicious campus meal?</h3>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '6px' }}>
              Create your student account in 30 seconds and receive Rs. 1,500 initial demo wallet balance!
            </p>
          </div>

          <Link
            to={user ? "/menu" : "/register"}
            className="btn btn-secondary"
            style={{
              padding: '14px 28px',
              fontSize: '1rem',
              fontWeight: 800,
              background: '#ffffff',
              color: '#1e3a8a',
              borderRadius: '10px'
            }}
          >
            {user ? "View Menu Now" : "Register Now"}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LandingHome;
