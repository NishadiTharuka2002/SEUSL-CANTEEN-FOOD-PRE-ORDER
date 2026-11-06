import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '60px' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Your role ({user.role}) does not have permission to access this section.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
