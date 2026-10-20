// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/**
 * Protect admin routes – only users with role "admin" can access.
 * If not authorized, redirect to home and show warning toast.
 */
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Not logged in – let Auth logic handle redirect elsewhere if needed
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  React.useEffect(() => {
    if (user && user.role !== 'ROLE_ADMIN') {
      toast.error('Admin access required');
    }
  }, [user]);

  if (user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
