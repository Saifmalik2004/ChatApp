// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const token = useSelector(state => state.user.token);

  if (!token) {
    return <Navigate to="/register" />;
  }

  return children;
};

export default ProtectedRoute;
