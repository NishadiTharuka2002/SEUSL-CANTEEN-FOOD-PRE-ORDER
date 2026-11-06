import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Clock, 
  Wallet, 
  ChefHat, 
  Boxes, 
  BarChart3, 
  LogOut, 
  UserCircle,
  MessageSquare,
  Star
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-brand">
          <UtensilsCrossed size={28} color="#2563eb" />
          <span>SEUSL Canteen Pre-Order</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>

          <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>
            <UtensilsCrossed size={16} />
            <span>Food Menu</span>
          </Link>

          <Link to="/feedback" className={`nav-link ${isActive('/feedback') ? 'active' : ''}`}>
            <MessageSquare size={16} />
            <span>Feedbacks</span>
          </Link>

          {user && user.role === 'student' && (
            <>
              <Link to="/cart" className={`nav-link ${isActive('/cart') ? 'active' : ''}`}>
                <ShoppingCart size={18} />
                <span>Cart</span>
                {totalItemsCount > 0 && (
                  <span style={{
                    background: '#2563eb',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '2px 7px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              <Link to="/orders/track" className={`nav-link ${isActive('/orders/track') ? 'active' : ''}`}>
                <Clock size={18} />
                <span>Track Orders</span>
              </Link>

              <Link to="/wallet" className={`nav-link ${isActive('/wallet') ? 'active' : ''}`}>
                <Wallet size={18} />
                <span>Digital Wallet</span>
              </Link>
            </>
          )}

          {user && (user.role === 'staff' || user.role === 'kitchen' || user.role === 'admin') && (
            <Link to="/kitchen/queue" className={`nav-link ${isActive('/kitchen/queue') ? 'active' : ''}`}>
              <ChefHat size={18} />
              <span>Kitchen Queue</span>
            </Link>
          )}

          {user && (user.role === 'staff' || user.role === 'admin') && (
            <Link to="/inventory" className={`nav-link ${isActive('/inventory') ? 'active' : ''}`}>
              <Boxes size={18} />
              <span>Inventory & Menu</span>
            </Link>
          )}

          {user && user.role === 'admin' && (
            <Link to="/admin/analytics" className={`nav-link ${isActive('/admin/analytics') ? 'active' : ''}`}>
              <BarChart3 size={18} />
              <span>Analytics</span>
            </Link>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                <UserCircle size={20} color="#64748b" />
                <span style={{ fontWeight: 600 }}>{user?.name ? user.name.split(' ')[0] : 'Student'}</span>
                <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '0.7rem' }}>
                  {user.role}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
