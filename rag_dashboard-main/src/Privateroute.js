import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Auththorization';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/dashboard" />;
};

export default PrivateRoute;
