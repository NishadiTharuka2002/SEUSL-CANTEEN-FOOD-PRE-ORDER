import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Landing Home Page
import LandingHome from './pages/LandingHome';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Member 1 (SEU/IS/22/ICT/097 - W.H.N Tharuka)
import MenuBrowsing from './pages/member1/MenuBrowsing';
import InventoryManagement from './pages/member1/InventoryManagement';

// Member 2 (SEU/IS/22/ICT/062 - W.G.G.U Weerasiri)
import CartView from './pages/member2/CartView';
import CheckoutSlotBooking from './pages/member2/CheckoutSlotBooking';

// Member 3 (SEU/IS/22/ICT/079 - A.M.S Rasanjalie)
import StudentOrderTracking from './pages/member3/StudentOrderTracking';
import KitchenQueueBoard from './pages/member3/KitchenQueueBoard';

// Member 4 (SEU/IS/22/ICT/101 - P.G.N.B Gamage)
import WalletTransactions from './pages/member4/WalletTransactions';

// Member 5 (SEU/IS/22/ICT/107 - K.G.C.S Thilakarathna)
import AdminAnalyticsDashboard from './pages/member5/AdminAnalyticsDashboard';
import FeedbackReviewPage from './pages/member5/FeedbackReviewPage';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        <Routes>
          {/* If logged in, Home '/' shows Menu directly; if visitor, shows Wallpaper Landing Page */}
          <Route path="/" element={user ? <MenuBrowsing /> : <LandingHome />} />

          {/* Dedicated Food Menu & Ordering Route */}
          <Route path="/menu" element={<MenuBrowsing />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Member 2: Shopping Cart & Pre-Order */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CartView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CheckoutSlotBooking />
              </ProtectedRoute>
            }
          />

          {/* Member 3: Real-Time Order Tracking & Kitchen Queue */}
          <Route
            path="/orders/track"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentOrderTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kitchen/queue"
            element={
              <ProtectedRoute allowedRoles={['staff', 'kitchen', 'admin']}>
                <KitchenQueueBoard />
              </ProtectedRoute>
            }
          />

          {/* Member 4: Digital Wallet & Payment Ledger */}
          <Route
            path="/wallet"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <WalletTransactions />
              </ProtectedRoute>
            }
          />

          {/* Member 1: Stock Inventory & Menu Admin */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <InventoryManagement />
              </ProtectedRoute>
            }
          />

          {/* Member 5: Analytics Dashboard & Feedback */}
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <AdminAnalyticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute allowedRoles={['student', 'staff', 'admin']}>
                <FeedbackReviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <FeedbackReviewPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
