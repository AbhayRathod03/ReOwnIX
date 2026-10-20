// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import toast from 'react-hot-toast';

// ProtectedRoute redirects unauthenticated users to login.
// If auth status is still loading, show a loading spinner.
// When redirecting, preserve original location in state for post‑login return.
const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to continue.');
    }
  }, [loading, user]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
